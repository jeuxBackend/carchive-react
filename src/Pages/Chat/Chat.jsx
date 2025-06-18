import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useTheme } from "../../Contexts/ThemeContext";
import { CiClock2, CiSearch } from "react-icons/ci";
import { LuSend } from "react-icons/lu";
import { MessageCircle, Car, Home } from 'lucide-react';

import ham from "../../assets/hamburger.png";
import hamLight from "../../assets/hamLight.png";
import { FiX } from 'react-icons/fi';
import {
  convertTimestampToReadableTime,
  sendMessage,
  fetchMessages,
  markMessagesAsRead,
  initializeChat,
  getChatId
} from '../../utils/ChatUtils';
import { useGlobalContext } from '../../Contexts/GlobalContext';
import { getDrivers, getGaragesList, sendChatNotification } from '../../API/portalServices';
import CarsModal from './CarsModal';
import { useTranslation } from 'react-i18next';

const Chat = () => {
  const { theme } = useTheme();
  const { currentUserId, currentUserCompanyName } = useGlobalContext();

  const [selectedChat, setSelectedChat] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userNotificationId, setUserNotificationId] = useState(null)
  const [users, setUsers] = useState([]);
  const [garages, setGarages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [activeChatId, setActiveChatId] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [activeTab, setActiveTab] = useState("drivers");
  const messagesEndRef = useRef(null);
  const { t } = useTranslation();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [driversResponse, garagesResponse] = await Promise.all([
        getDrivers(),
        getGaragesList()
      ]);

      setUsers(driversResponse?.data?.data || []);
      setGarages(garagesResponse?.data?.data || []);
      console.log("Garages:", garagesResponse?.data?.data);
    } catch (error) {
      setError("Failed to load data: " + error.message);
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (selectedChat?.id) {
      const setupChatId = async () => {
        try {

          if (selectedChat.isGarage) {

            const existingChatId = await getChatId(
              currentUserId.toString(),
              selectedChat.id.toString(),
              null,
              true
            );

            if (existingChatId) {
              setActiveChatId(existingChatId);
            } else {

              setActiveChatId(`${currentUserId}_${selectedChat.id}`);
            }
          } else {

            const carId = selectedChat.carId || selectedChat.id;

            const existingChatId = await getChatId(
              currentUserId.toString(),
              selectedChat.id.toString(),
              carId.toString()
            );

            if (existingChatId) {
              setActiveChatId(existingChatId);
            } else {
              setActiveChatId(`${currentUserId}_${carId}_${selectedChat.id}`);
            }
          }
        } catch (err) {
          console.error("Error setting up chat ID:", err);

          if (selectedChat.isGarage) {
            setActiveChatId(`${currentUserId}_${selectedChat.id}`);
          } else {
            const carId = selectedChat.carId || selectedChat.id;
            setActiveChatId(`${currentUserId}_${carId}_${selectedChat.id}`);
          }
        }
      };

      setupChatId();
    }
  }, [selectedChat, currentUserId]);

  useEffect(() => {
    let unsubscribe = () => { };

    if (activeChatId) {
      setIsLoading(true);
      setError(null);


      markMessagesAsRead(activeChatId);


      unsubscribe = fetchMessages(
        activeChatId,
        (fetchedMessages) => {
          setMessages(fetchedMessages);
          setIsLoading(false);
        },
        (error) => {
          setError("Failed to load messages: " + error.message);
          setIsLoading(false);
        }
      );
    } else {
      setMessages([]);
    }

    return () => unsubscribe();
  }, [activeChatId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedChat?.id || sendingMessage) return;

    try {
      setSendingMessage(true);
      console.log(selectedChat)


      const optimisticMessage = {
        id: Date.now().toString(),
        messageBody: messageInput,
        senderId: currentUserId.toString(),
        receiverId: selectedChat.id.toString(),
        carId: selectedChat.isGarage ? null : (selectedChat.carId || selectedChat.id),
        serverTime: new Date().toISOString(),
        isOptimistic: true
      };


      setMessages(prev => [...prev, optimisticMessage]);
      const inputCopy = messageInput;
      setMessageInput("");


      const success = await sendMessage(
        activeChatId,
        selectedChat.id.toString(),
        currentUserId.toString(),
        inputCopy,
        selectedChat.isGarage
      );

      const response = await sendChatNotification({user_id: userNotificationId, title:`New Message From ${currentUserCompanyName}`, body:messageInput })
      if (!success) {
        setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
        setError("Failed to send message. Please try again.");
        setMessageInput(inputCopy);
      }
    } catch (error) {
      setError("Failed to send message: " + error.message);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageTime = (serverTime) => {
    if (!serverTime) return "";
    return convertTimestampToReadableTime(serverTime);
  };

  const handleSelectUser = async (user) => {
    setSelectedUserId(user.driverId);
    setUserNotificationId(user.id)
    setIsSidebarOpen(false);
    setError(null);
    setIsModalOpen(true);
  };

  const handleSelectCar = async (car) => {
    try {
      setIsLoading(true);


      const actualChatId = await initializeChat(
        currentUserId?.toString(),
        selectedUserId.toString(),
        car?.carId?.toString(),
        "Hello, I'd like to chat about this car."
      );

      setSelectedChat({
        id: selectedUserId,
        carId: car.carId,
        name: car.make,
        image: car.image,
        model: car.model,
        make: car.make,
        isCar: true
      });

      if (actualChatId) {
        setActiveChatId(actualChatId);
      }

      setIsSidebarOpen(false);
      setIsModalOpen(false);
      setError(null);
    } catch (error) {
      console.error("Error selecting car:", error);
      setError("Failed to initialize chat");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectGarage = async (garage) => {
    try {
      setIsLoading(true);

      const actualChatId = await initializeChat(
        currentUserId?.toString(),
        garage.garageUserId.toString(),
        null,
        "Hello, I'd like to chat with your garage.",
        true
      );
      setUserNotificationId(garage.garageUserId)
      

      setSelectedChat({
        id: garage.garageUserId,
        name: garage.garageName,
        image: garage.image,
        isGarage: true
      });

      if (actualChatId) {
        setActiveChatId(actualChatId);
      }

      setIsSidebarOpen(false);
      setError(null);
    } catch (error) {
      console.error("Error selecting garage:", error);
      setError("Failed to initialize chat");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users?.filter(user =>
    user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGarages = Object.values(garages || {})?.filter(garage =>
  garage?.garageName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  garage?.numberPlate?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  garage?.carVin?.toLowerCase().includes(searchQuery.toLowerCase())
);



  return (
    <>
      <CarsModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        id={selectedUserId}
        onSelectCar={handleSelectCar}
      />
      <div className={`${theme === "dark" ? "bg-[#1B1C1E] text-white" : "bg-white text-black"} transition-all `}>

        <div className="flex h-[86vh] w-full relative gap-6">

          {/* Dark overlay for mobile when sidebar is open */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black opacity-50 z-20 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            ></div>
          )}

          {/* Users Sidebar */}
          <div className={`absolute lg:relative z-30 flex-col lg:w-[40%] h-[82vh] sm:h-[88vh] lg:h-full ${theme === "dark" ? "bg-[#323335]" : "bg-white border border-[#dfdfdf]"} rounded-xl p-3 transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-[150%]"}`}>

            <button
              className="lg:hidden p-2 bg-gray-300 rounded-full mb-2 self-end"
              onClick={() => setIsSidebarOpen(false)}
            >
              <FiX size={24} />
            </button>

            {/* Tab Selector */}
            <div className="flex mb-4 border-b">
              <button
                onClick={() => setActiveTab("drivers")}
                className={`flex-1 py-2 ${activeTab === "drivers" ?
                  theme === "dark" ? "border-b-2 border-blue-400 text-blue-400" : "border-b-2 border-blue-500 text-blue-500" :
                  ""}`}
              >
                {t("drivers")}
              </button>
              <button
                onClick={() => setActiveTab("garages")}
                className={`flex-1 py-2 ${activeTab === "garages" ?
                  theme === "dark" ? "border-b-2 border-blue-400 text-blue-400" : "border-b-2 border-blue-500 text-blue-500" :
                  ""}`}
              >
                {t("garages")}
              </button>
            </div>

            <div className="relative w-full my-3">
              <input
                type="text"
                placeholder={`Search for ${activeTab === "drivers" ? "a user" : "a garage"}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full p-3 pl-4 pr-10 rounded-3xl ${theme === "dark" ? "bg-[#292A2C] text-white border border-white/30 " : "bg-white text-black border-gray-300"} focus:outline-none shadow`}
              />
              <CiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl cursor-pointer" />
            </div>

            <div className="space-y-2 overflow-y-auto max-h-[calc(100%-80px)]">
              {isLoading && (activeTab === "drivers" ? users.length === 0 : garages.length === 0) ? (
                <div className="flex justify-center items-center h-32">
                  <p className="text-gray-500">Loading {activeTab}...</p>
                </div>
              ) : error && (activeTab === "drivers" ? users.length === 0 : garages.length === 0) ? (
                <div className="flex justify-center items-center h-32">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : activeTab === "drivers" ? (
                filteredUsers.length === 0 ? (
                  <div className="flex justify-center items-center h-32">
                    <p className="text-gray-500">{t("No drivers found")}</p>
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <div key={user.id || user.driverId}>
                      <div
                        className={`flex items-center p-3 cursor-pointer border-b border-dashed 
                        ${theme === "dark" ? "border-[#464749]" : "border-[#e8e8e8]"} 
                        ${selectedChat.id === user.driverId && selectedChat.isDriver ?
                            (theme === "dark" ? "bg-gray-700 " : "bg-gray-300 ") : ""}`}
                      >
                        <img
                          src={user.image}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                          onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                        />
                        <div className="ml-3 flex-grow">
                          <div className='flex items-center justify-between w-full'>
                            <h3 className="font-semibold">{user.name} {user.lastName}</h3>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"} truncate max-w-[70%]`}>
                              {user.email}
                            </p>
                          </div>
                        </div>

                        {/* Chat with user button */}
                        <div
                          onClick={() => handleSelectUser(user)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer
                          ${theme === "dark" ? "bg-[#479cff] text-white"
                              : "bg-[#479cff] text-white"} transition-colors`}
                        >
                          <MessageCircle size={18} />
                          <span>{t("chat")}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )
              ) : (
                // Garages Tab Content
                filteredGarages.length === 0 ? (
                  <div className="flex justify-center items-center h-32">
                    <p className="text-gray-500">{t("No garages found")}</p>
                  </div>
                ) : (
                  filteredGarages.map((garage) => (
                    <div key={garage.garageId}>
                      <div
                        className={`flex items-center p-3 cursor-pointer border-b border-dashed 
                        ${theme === "dark" ? "border-[#464749]" : "border-[#e8e8e8]"} 
                        ${selectedChat.id === garage.garageUserId && selectedChat.isGarage ?
                            (theme === "dark" ? "bg-gray-700 " : "bg-gray-300 ") : ""}`}
                      >
                        <img
                          src={garage.image}
                          alt={garage.garageName}
                          className="w-10 h-10 rounded-full object-cover"
                          onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                        />
                        <div className="ml-3 flex-grow">
                          <div className='flex items-center justify-between w-full'>
                            <h3 className="font-semibold">{garage.garageName}</h3>
                          </div>
                          <div className="">
                            <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"} truncate max-w-[70%]`}>
                             {t("Vin Number")}: {garage.carVin || "No VIN"}
                            </p>
                            <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"} truncate max-w-[70%]`}>
                            {t("number_plate")}:  {garage.numberPlate || "No Number Plate"}
                            </p>
                          </div>
                        </div>

                        {/* Chat with garage button */}
                        <div
                          onClick={() => handleSelectGarage(garage)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer
                          ${theme === "dark" ? "bg-[#479cff] text-white"
                              : "bg-[#479cff] text-white"} transition-colors`}
                        >
                          <MessageCircle size={18} />
                          <span>{t("chat")}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          </div>

          {/* Chat Content Area */}
          <div className={`flex flex-col flex-1 h-[82vh] sm:h-[86vh] rounded-xl ${theme === "dark" ? "bg-[#1B1C1E] text-white border border-white/30" : "bg-white text-black border border-[#ECECEC]"}`}>
            {/* Chat Header */}
            <div className={`flex items-center rounded-t-xl p-4 ${theme === "dark" ? "bg-[#323335]" : "bg-gray-100"} shadow-md relative`}>
              <button
                className="lg:hidden rounded-full mr-3"
                onClick={() => setIsSidebarOpen(true)}
              >
                <img src={theme === "dark" ? ham : hamLight} alt="" className='w-[24px]' />
              </button>

              {selectedChat?.image ? (
                <img
                  src={selectedChat.image}
                  alt={selectedChat.name}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                />
              ) : (
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${theme === "dark" ? "bg-gray-600" : "bg-gray-300"}`}>
                  {selectedChat?.name?.charAt(0) || "?"}
                </div>
              )}
              <div className="ml-3 flex-grow">
                <div className="flex items-center">
                  <h3 className="font-semibold">
                    {selectedChat?.name || selectedChat?.make || t("Select a chat")}
                    {selectedChat?.lastName ? ` ${selectedChat.lastName}` : ''}
                  </h3>
                  {selectedChat?.isCar && (
                    <Car size={16} className="ml-2 text-blue-500" />
                  )}
                  {selectedChat?.isGarage && (
                    <Home size={16} className="ml-2 text-green-500" />
                  )}
                </div>
                {selectedChat?.isCar ? (
                  <p className="text-sm">
                    {selectedChat?.make ? `${selectedChat.make} · ` : ''}
                    {selectedChat?.model || ""}
                  </p>
                ) : selectedChat?.isGarage ? (
                  <p className="text-sm">Garage</p>
                ) : (
                  <p className="text-sm">{selectedChat?.email || ""}</p>
                )}
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto">
              {!selectedChat?.id ? (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">{t("Select a conversation to start chatting")}</p>
                </div>
              ) : isLoading && messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">Loading messages...</p>
                </div>
              ) : error ? (
                <div className="h-full flex items-center justify-center">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">{t("No messages yet. Start a conversation!")}</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.senderId === currentUserId.toString() ? "justify-end" : "justify-start"} mb-2`}>
                    <div className={`p-3 max-w-[70%] break-words rounded-lg ${msg.senderId === currentUserId.toString()
                      ? (theme === "dark" ? "bg-[#464749] text-white" : "bg-[#f0f7ff] text-black")
                      : (theme === "dark" ? "bg-[#323335] text-white" : "bg-[#f5f5f5] text-black")
                      }`}>
                      <p>{msg.messageBody}</p>
                      <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"} flex justify-between items-center mt-1`}>
                        <span>{formatMessageTime(msg.serverTime)}</span>
                        {msg.isOptimistic && (
                          <span className="ml-2"><CiClock2 />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 relative w-full">
              <input
                type="text"
                placeholder={selectedChat?.id ? t("Type Message") : t("Select a chat to start messaging")}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={!selectedChat?.id}
                className={`w-full p-3 pl-4 pr-10 rounded-3xl border ${theme === "dark" ? "bg-[#1B1C1E] text-white border-gray-500" : "bg-gray-100 text-black border-gray-300"} focus:outline-none ${!selectedChat?.id ? 'cursor-not-allowed' : ''}`}
              />
              <button
                onClick={handleSendMessage}
                disabled={!messageInput.trim() || !selectedChat?.id || sendingMessage}
                className="absolute right-10 top-1/2 transform -translate-y-1/2 text-xl cursor-pointer"
              >
                <LuSend
                  className={`${!messageInput.trim() || !selectedChat?.id || sendingMessage ? 'opacity-50' : 'opacity-100'}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;