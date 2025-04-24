import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useTheme } from "../../Contexts/ThemeContext";
import { CiSearch } from "react-icons/ci";
import { LuSend } from "react-icons/lu";
import { MessageCircle, Car } from 'lucide-react';

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
import { getDrivers } from '../../API/portalServices';
import CarsModal from './CarsModal';

const Chat = () => {
  const { theme } = useTheme();
  const { currentUserId } = useGlobalContext();

  const [selectedChat, setSelectedChat] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [activeChatId, setActiveChatId] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchDriverData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getDrivers();
      setUsers(response?.data?.data || []);
    } catch (error) {
      setError("Failed to load users: " + error.message);
      console.error("Error fetching drivers data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchDriverData();
  }, [fetchDriverData]);

  useEffect(() => {
    if (selectedChat?.id) {
      const setupChatId = async () => {
        try {
          // Format for chat ID is senderId_carId_receiverId
          const carId = selectedChat.carId || selectedChat.id;
          
          // Check if a chat already exists with this combination
          const existingChatId = await getChatId(
            currentUserId.toString(), 
            selectedChat.id.toString(),
            carId.toString()
          );
          
          if (existingChatId) {
            setActiveChatId(existingChatId);
          } else {
            // If no existing chat, format according to the expected pattern
            setActiveChatId(`${currentUserId}_${carId}_${selectedChat.id}`);
          }
        } catch (err) {
          console.error("Error setting up chat ID:", err);
          // Fallback format
          const carId = selectedChat.carId || selectedChat.id;
          setActiveChatId(`${currentUserId}_${carId}_${selectedChat.id}`);
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

      // Mark any unread messages as read when opening the chat
      markMessagesAsRead(activeChatId);

      // Subscribe to real-time message updates
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
      
      // Create an optimistic message for immediate UI update
      const optimisticMessage = {
        id: Date.now().toString(),
        messageBody: messageInput,
        senderId: currentUserId.toString(),
        receiverId: selectedChat.id.toString(),
        carId: selectedChat.carId || selectedChat.id,
        serverTime: new Date().toISOString(),
        isOptimistic: true 
      };
      
      // Add optimistic message to UI
      setMessages(prev => [...prev, optimisticMessage]);
      const inputCopy = messageInput;
      setMessageInput("");
      
      // Actually send the message
      const success = await sendMessage(
        activeChatId,
        selectedChat.id.toString(),
        currentUserId.toString(),
        inputCopy
      );
      
      if (!success) {
        // Remove the optimistic message if sending failed
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
    setIsSidebarOpen(false);
    setError(null);
    setIsModalOpen(true);
  };
  
  const handleSelectCar = async (car) => {
    try {
      setIsLoading(true);
      
      // Initialize chat with proper IDs
      const actualChatId = await initializeChat(
        currentUserId?.toString(), 
        selectedUserId.toString(),
        car?.carId?.toString(), 
        "Hello, I'd like to chat about this car."
      );
      
      setSelectedChat({
        id: selectedUserId,  // Set the user ID as the primary ID
        carId: car.carId,    // Store car ID separately
        name: car.name,
        image: car.image,
        model: car.model,
        make: car.make,
        isCar: true
      });
      
      // If we have a valid chatId returned, use it directly
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

  const filteredUsers = users.filter(user =>
    user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
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

          <div className="relative w-full my-3">
            <input
              type="text"
              placeholder="Search for a user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full p-3 pl-4 pr-10 rounded-3xl ${theme === "dark" ? "bg-[#292A2C] text-white border border-white/30 " : "bg-white text-black border-gray-300"} focus:outline-none shadow`}
            />
            <CiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl cursor-pointer" />
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[calc(100%-80px)]">
            {isLoading && users.length === 0 ? (
              <div className="flex justify-center items-center h-32">
                <p className="text-gray-500">Loading users...</p>
              </div>
            ) : error && users.length === 0 ? (
              <div className="flex justify-center items-center h-32">
                <p className="text-red-500">{error}</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex justify-center items-center h-32">
                <p className="text-gray-500">No users found</p>
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
                      <span>Chat</span>
                    </div>
                  </div>
                </div>
              ))
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
                  {selectedChat?.make ? selectedChat.make : "Select a chat"}
                  {selectedChat?.lastName ? ` ${selectedChat.lastName}` : ''}
                </h3>
                {selectedChat?.isCar && (
                  <Car size={16} className="ml-2 text-blue-500" />
                )}
              </div>
              {selectedChat?.isCar ? (
                <p className="text-sm">
                  {selectedChat?.make ? `${selectedChat.make} · ` : ''}
                  {selectedChat?.model || ""}
                </p>
              ) : (
                <p className="text-sm">{selectedChat?.email || ""}</p>
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto">
            {!selectedChat?.id ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">Select a conversation to start chatting</p>
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
                <p className="text-gray-500">No messages yet. Start a conversation!</p>
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
                        <span className="ml-2">Sending...</span>
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
              placeholder={selectedChat?.id ? "Type Message" : "Select a chat to start messaging"}
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