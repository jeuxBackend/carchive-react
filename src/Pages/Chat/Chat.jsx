import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useTheme } from "../../Contexts/ThemeContext";
import { CiClock2, CiSearch } from "react-icons/ci";
import { LuSend } from "react-icons/lu";
import { MessageCircle, Car, Home } from 'lucide-react';
import { FiDownload, FiFile, FiImage, FiVideo } from 'react-icons/fi';
import { Paperclip, X, Image } from 'lucide-react';
import {
  FileText,
  Download,
  ImageIcon,
  FileSpreadsheet,
  Clock,
  Eye,
  Play,
  Video,
  File as FileIcon
} from 'lucide-react';

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
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

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
    if ((!messageInput.trim() && !selectedFile) || !selectedChat?.id || sendingMessage) return;

    try {
      setSendingMessage(true);
      console.log(selectedChat);

      const optimisticMessage = {
        id: Date.now().toString(),
        messageBody: messageInput,
        senderId: currentUserId.toString(),
        receiverId: selectedChat.id.toString(),
        carId: selectedChat.isGarage ? null : (selectedChat.carId || selectedChat.id),
        serverTime: new Date().toISOString(),
        isOptimistic: true,
        // Add file info for optimistic UI
        massageFileUrl: filePreview,
        messageFileExtension: selectedFile ? selectedFile.name.split('.').pop() : ''
      };

      setMessages(prev => [...prev, optimisticMessage]);
      const inputCopy = messageInput;
      const fileCopy = selectedFile;

      // Clear inputs immediately for better UX
      setMessageInput("");
      setSelectedFile(null);
      setFilePreview(null);

      const success = await sendMessage(
        activeChatId,
        selectedChat.id.toString(),
        currentUserId.toString(),
        inputCopy,
        selectedChat.isGarage,
        fileCopy // Pass the file to sendMessage
      );

      const response = await sendChatNotification({
        user_id: userNotificationId,
        title: `New Message From ${currentUserCompanyName}`,
        body: inputCopy || 'File'
      });

      if (!success) {
        setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
        setError("Failed to send message. Please try again.");
        setMessageInput(inputCopy);
        setSelectedFile(fileCopy);
        setFilePreview(fileCopy ? URL.createObjectURL(fileCopy) : null);
      }
    } catch (error) {
      setError("Failed to send message: " + error.message);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected file:", file); // Debug log

      // Increase file size limit for videos (50MB)
      const maxSize = file.type.startsWith('video/') ? 50 * 1024 * 1024 : 10 * 1024 * 1024;

      if (file.size > maxSize) {
        const limitText = file.type.startsWith('video/') ? "50MB" : "10MB";
        setError(`File size must be less than ${limitText}`);
        return;
      }

      setSelectedFile(file);

      // Create preview for images and videos
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setFilePreview(e.target.result);
        reader.readAsDataURL(file);
      } else if (file.type.startsWith('video/')) {
        // For videos, create a blob URL for preview
        const videoUrl = URL.createObjectURL(file);
        setFilePreview(videoUrl);
      } else {
        setFilePreview(null);
      }
    }
  };

  const clearSelectedFile = () => {
    if (filePreview && selectedFile?.type.startsWith('video/')) {
      URL.revokeObjectURL(filePreview);
    }

    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageTime = (serverTime) => {
    const date = new Date(serverTime?.seconds * 1000);
    return date?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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

  console.log("messages", messages);

  const handleSelectGarage = async (garage) => {
    try {
      setIsLoading(true);
      console.log("Selected Garage:", garage);
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



  const getFileType = (extension) => {
    if (!extension) return 'unknown';
    const ext = extension.toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'].includes(ext)) return 'image';
    if (['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'].includes(ext)) return 'video';
    if (['.pdf', '.doc', '.docx', '.txt', '.xlsx', '.ppt'].includes(ext)) return 'document';
    return 'file';
  };

  const getFileIcon = (extension) => {
    if (!extension) return null;

    // Normalize extension: remove dot if present and convert to lowercase
    const ext = extension.toLowerCase().replace(/^\./, '');

    switch (ext) {
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'webp':
        return <ImageIcon className="w-3 h-3" />;
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'wmv':
      case 'flv':
      case 'webm':
        return <Video className="w-3 h-3" />;
      case 'xlsx':
      case 'xls':
      case 'csv':
        return <FileSpreadsheet className="w-3 h-3" />;
      case 'pdf':
      case 'doc':
      case 'docx':
      case 'txt':
        return <FileText className="w-3 h-3" />;
      default:
        return <FileIcon className="w-3 h-3" />;
    }
  };

  const renderFileContent = (msg, theme) => {
    if (!msg.massageFileUrl || !msg.messageFileExtension) return null;

    // Normalize extension: remove dot if present and convert to lowercase
    const extension = msg.messageFileExtension.toLowerCase().replace(/^\./, '');

    // Image files
    if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(extension)) {
      return (
        <div className="mt-2">
          <div className="relative group">
            <img
              src={msg.massageFileUrl}
              alt="Shared image"
              className="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              style={{ maxHeight: '300px' }}
              onClick={() => setSelectedImage(msg.massageFileUrl)}
            />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setSelectedImage(msg.massageFileUrl)}
                className="bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Video files
    if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(extension)) {
      return (
        <div className="mt-2">
          <div className="relative group">
            <video
              src={msg.massageFileUrl}
              className="max-w-full h-auto rounded-lg"
              style={{ maxHeight: '300px' }}
              controls
              preload="metadata"
            />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => window.open(msg.massageFileUrl, '_blank')}
                className="bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70"
              >
                <Play className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Excel files
    if (['xlsx', 'xls', 'csv'].includes(extension)) {
      return (
        <div className="mt-2">
          <div className={`border rounded-lg p-3 ${theme === "dark" ? "border-gray-600" : "border-gray-300"}`}>
            <div className="flex items-center space-x-2">
              <FileSpreadsheet className="w-8 h-8 text-green-600" />
              <div className="flex-1">
                <p className="font-medium">Spreadsheet File</p>
                <p className="text-sm opacity-75">{extension.toUpperCase()} document</p>
              </div>
              <button
                onClick={() => window.open(msg.massageFileUrl, '_blank')}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      );
    }

    // PDF files
    if (extension === 'pdf') {
      return (
        <div className="mt-2">
          <div className={`border rounded-lg p-3 ${theme === "dark" ? "border-gray-600" : "border-gray-300"}`}>
            <div className="flex items-center space-x-2">
              <FileText className="w-8 h-8 text-red-600" />
              <div className="flex-1">
                <p className="font-medium">PDF Document</p>
                <p className="text-sm opacity-75">Portable Document Format</p>
              </div>
              <button
                onClick={() => window.open(msg.massageFileUrl, '_blank')}
                className="flex items-center space-x-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Other files
    return (
      <div className="mt-2">
        <div className={`border rounded-lg p-3 ${theme === "dark" ? "border-gray-600" : "border-gray-300"}`}>
          <div className="flex items-center space-x-2">
            <FileIcon className="w-8 h-8 text-gray-600" />
            <div className="flex-1">
              <p className="font-medium">File Attachment</p>
              <p className="text-sm opacity-75">{extension.toUpperCase()} file</p>
            </div>
            <button
              onClick={() => window.open(msg.massageFileUrl, '_blank')}
              className="flex items-center space-x-1 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const FilePreview = ({ file, preview, onClear, theme }) => {
    if (!file) return null;

    return (
      <div className={`mx-4 mb-2 p-3 rounded-lg ${theme === "dark" ? "bg-[#323335]" : "bg-gray-100"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {file.type.startsWith('image/') && preview ? (
              <img src={preview} alt="Preview" className="w-10 h-10 rounded object-cover" />
            ) : file.type.startsWith('video/') && preview ? (
              <video
                src={preview}
                className="w-10 h-10 rounded object-cover"
                muted
                preload="metadata"
              />
            ) : (
              <div className={`w-10 h-10 rounded flex items-center justify-center ${theme === "dark" ? "bg-gray-600" : "bg-gray-300"}`}>
                {getFileIcon(file.name.split('.').pop())}
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-sm">{file.name}</span>
              <span className="text-xs text-gray-500">
                {(file.size / 1024 / 1024).toFixed(1)} MB
              </span>
            </div>
          </div>
          <button
            onClick={onClear}
            className="text-red-500 hover:text-red-700"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    );
  };



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
          <div className={`absolute lg:relative z-30 flex-col w-full xs:w-[85%] sm:w-[75%] md:w-[65%] lg:w-[40%] 
  h-[82vh] sm:h-[85vh] md:h-[88vh] lg:h-full 
  ${theme === "dark" ? "bg-[#323335]" : "bg-white border border-[#dfdfdf]"} 
  rounded-xl p-2 xs:p-3 sm:p-4 lg:p-3 
  transition-transform duration-300 ease-in-out lg:translate-x-0 
  ${isSidebarOpen ? "translate-x-0" : "-translate-x-[150%]"}`}>

            {/* Close Button */}
            <button
              className="lg:hidden p-1.5 xs:p-2 bg-gray-300 hover:bg-gray-400 rounded-full mb-2 xs:mb-3 self-end transition-colors"
              onClick={() => setIsSidebarOpen(false)}
            >
              <FiX size={20} className="xs:w-6 xs:h-6" />
            </button>

            {/* Tab Selector */}
            <div className="flex mb-3 xs:mb-4 border-b">
              <button
                onClick={() => setActiveTab("drivers")}
                className={`flex-1 py-2 xs:py-2.5 sm:py-3 text-sm xs:text-base font-medium transition-colors
        ${activeTab === "drivers" ?
                    theme === "dark" ? "border-b-2 border-blue-400 text-blue-400" : "border-b-2 border-blue-500 text-blue-500" :
                    theme === "dark" ? "text-gray-300 hover:text-blue-400" : "text-gray-600 hover:text-blue-500"}`}
              >
                {t("drivers")}
              </button>
              <button
                onClick={() => setActiveTab("garages")}
                className={`flex-1 py-2 xs:py-2.5 sm:py-3 text-sm xs:text-base font-medium transition-colors
        ${activeTab === "garages" ?
                    theme === "dark" ? "border-b-2 border-blue-400 text-blue-400" : "border-b-2 border-blue-500 text-blue-500" :
                    theme === "dark" ? "text-gray-300 hover:text-blue-400" : "text-gray-600 hover:text-blue-500"}`}
              >
                {t("garages")}
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full mb-3 xs:mb-4">
              <input
                type="text"
                placeholder={`Search for ${activeTab === "drivers" ? "a user" : "a garage"}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full p-2.5 xs:p-3 sm:p-3.5 pl-3 xs:pl-4 pr-9 xs:pr-10 rounded-2xl xs:rounded-3xl text-sm xs:text-base
        ${theme === "dark" ? "bg-[#292A2C] text-white border border-white/30 placeholder-gray-400" : "bg-white text-black border-gray-300 placeholder-gray-500"} 
        focus:outline-none focus:ring-2 focus:ring-blue-500 shadow transition-all`}
              />
              <CiSearch className="absolute right-2.5 xs:right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg xs:text-xl cursor-pointer" />
            </div>

            {/* Content Area */}
            <div className="space-y-1.5 xs:space-y-2 overflow-y-auto flex-1 max-h-[calc(100%-120px)] xs:max-h-[calc(100%-130px)] sm:max-h-[calc(100%-140px)]">
              {isLoading && (activeTab === "drivers" ? users.length === 0 : garages.length === 0) ? (
                <div className="flex justify-center items-center h-24 xs:h-32">
                  <p className="text-gray-500 text-sm xs:text-base">Loading {activeTab}...</p>
                </div>
              ) : error && (activeTab === "drivers" ? users.length === 0 : garages.length === 0) ? (
                <div className="flex justify-center items-center h-24 xs:h-32">
                  <p className="text-red-500 text-sm xs:text-base text-center px-4">{error}</p>
                </div>
              ) : activeTab === "drivers" ? (
                filteredUsers.length === 0 ? (
                  <div className="flex justify-center items-center h-24 xs:h-32">
                    <p className="text-gray-500 text-sm xs:text-base">{t("No drivers found")}</p>
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <div key={user.id || user.driverId}>
                      <div
                        className={`flex items-center p-2 xs:p-3 cursor-pointer border-b border-dashed rounded-lg hover:bg-opacity-50 transition-all
              ${theme === "dark" ? "border-[#464749] hover:bg-gray-600" : "border-[#e8e8e8] hover:bg-gray-100"} 
              ${selectedChat.id === user.driverId && selectedChat.isDriver ?
                            (theme === "dark" ? "bg-gray-700" : "bg-gray-300") : ""}`}
                      >
                        {/* User Avatar */}
                        <img
                          src={user.image}
                          alt={user.name}
                          className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"

                        />

                        {/* User Info */}
                        <div className="ml-2 xs:ml-3 flex-grow min-w-0">
                          <div className='flex items-center justify-between w-full'>
                            <h3 className="font-semibold text-sm xs:text-base truncate pr-2">
                              {user.name} {user.lastName}
                            </h3>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className={`text-xs xs:text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"} truncate max-w-[60%] xs:max-w-[70%]`}>
                              {user.email}
                            </p>
                          </div>
                        </div>

                        <div
                          onClick={() => handleSelectUser(user)}
                          className={`flex items-center gap-1 xs:gap-2 px-2 xs:px-3 py-1.5 xs:py-2 rounded-lg cursor-pointer flex-shrink-0
                ${theme === "dark" ? "bg-[#479cff] hover:bg-[#3a8ae6] text-white" : "bg-[#479cff] hover:bg-[#3a8ae6] text-white"} 
                transition-colors`}
                        >
                          <MessageCircle size={14} className="xs:w-[18px] xs:h-[18px]" />
                          <span className="text-xs xs:text-sm font-medium">{t("chat")}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )
              ) : (

                filteredGarages.length === 0 ? (
                  <div className="flex justify-center items-center h-24 xs:h-32">
                    <p className="text-gray-500 text-sm xs:text-base">{t("No garages found")}</p>
                  </div>
                ) : (
                  filteredGarages.map((garage) => (
                    <div key={garage.garageId}>
                      <div
                        className={`flex items-center p-2 xs:p-3 cursor-pointer border-b border-dashed rounded-lg hover:bg-opacity-50 transition-all
              ${theme === "dark" ? "border-[#464749] hover:bg-gray-600" : "border-[#e8e8e8] hover:bg-gray-100"} 
              ${selectedChat.id === garage.garageUserId && selectedChat.isGarage ?
                            (theme === "dark" ? "bg-gray-700" : "bg-gray-300") : ""}`}
                      >
                        {/* Garage Avatar */}
                        <img
                          src={garage.image}
                          alt={garage.garageName}
                          className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"

                        />

                        {/* Garage Info */}
                        <div className="ml-2 xs:ml-3 flex-grow min-w-0">
                          <div className='flex items-center justify-between w-full'>
                            <h3 className="font-semibold text-sm xs:text-base truncate pr-2">
                              {garage.garageName}
                            </h3>
                          </div>
                          <div className="space-y-0.5 xs:space-y-1">
                            <p className={`text-xs xs:text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"} truncate`}>
                              {t("Vin Number")}: {garage.carVin || "No VIN"}
                            </p>
                            <p className={`text-xs xs:text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"} truncate`}>
                              {t("number_plate")}: {garage.numberPlate || "No Number Plate"}
                            </p>
                          </div>
                        </div>

                        {/* Chat Button */}
                        <div
                          onClick={() => handleSelectGarage(garage)}
                          className={`flex items-center gap-1 xs:gap-2 px-2 xs:px-3 py-1.5 xs:py-2 rounded-lg cursor-pointer flex-shrink-0
                ${theme === "dark" ? "bg-[#479cff] hover:bg-[#3a8ae6] text-white" : "bg-[#479cff] hover:bg-[#3a8ae6] text-white"} 
                transition-colors`}
                        >
                          <MessageCircle size={14} className="xs:w-[18px] xs:h-[18px]" />
                          <span className="text-xs xs:text-sm font-medium">{t("chat")}</span>
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
            {/* Chat Header - same as before */}
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
              {messages.map((msg) => {
                const hasFile = msg.massageFileUrl && msg.messageFileExtension;
                const hasText = msg.messageBody && msg.messageBody.trim() !== '';

                return (
                  <div key={msg.id} className={`flex ${msg.senderId === currentUserId.toString() ? "justify-end" : "justify-start"} mb-4`}>
                    <div className={`p-3 max-w-[70%] break-words rounded-lg ${msg.senderId === currentUserId.toString()
                      ? (theme === "dark" ? "bg-[#464749] text-white" : "bg-[#f0f7ff] text-black")
                      : (theme === "dark" ? "bg-[#323335] text-white" : "bg-[#f5f5f5] text-black")
                      }`}>

                      {/* Text Message */}
                      {hasText && <p className="mb-1">{msg.messageBody}</p>}

                      {/* File Content */}
                      {hasFile && renderFileContent(msg, theme)}

                      {/* Message Footer */}
                      <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"} flex justify-between items-center mt-2`}>
                        <div className="flex items-center space-x-2">
                          <span>{formatMessageTime(msg.serverTime)}</span>
                          {hasFile && (
                            <div className="flex items-center space-x-1">
                              {getFileIcon(msg.messageFileExtension)}
                              <span className="text-xs opacity-75">
                                {msg.messageFileExtension.toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        {msg.isOptimistic && (
                          <span className="ml-2">
                            <Clock className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Image Modal */}
            {selectedImage && (
              <div
                className="fixed inset-0 bg-black/60 bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
                onClick={() => setSelectedImage(null)}
              >
                <div className="relative max-w-4xl max-h-full">
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <img
                    src={selectedImage}
                    alt="Full size image"
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                </div>
              </div>
            )}

            {/* File Preview */}
            <FilePreview
              file={selectedFile}
              preview={filePreview}
              onClear={clearSelectedFile}
              theme={theme}
            />

            {/* Message Input */}
            <div className="p-4 relative w-full">
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={!selectedChat?.id}
                  className={`p-2 rounded-full ${!selectedChat?.id ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
                >
                  <Paperclip size={20} />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder={selectedChat?.id ? t("Type Message") : t("Select a chat to start messaging")}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={!selectedChat?.id}
                    className={`w-full p-3 pl-4 pr-12 rounded-3xl border ${theme === "dark" ? "bg-[#1B1C1E] text-white border-gray-500" : "bg-gray-100 text-black border-gray-300"} focus:outline-none ${!selectedChat?.id ? 'cursor-not-allowed' : ''}`}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={(!messageInput.trim() && !selectedFile) || !selectedChat?.id || sendingMessage}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl cursor-pointer"
                  >
                    <LuSend
                      className={`${(!messageInput.trim() && !selectedFile) || !selectedChat?.id || sendingMessage ? 'opacity-50' : 'opacity-100'}`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;