import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useTheme } from "../../Contexts/ThemeContext";
import { CiSearch } from "react-icons/ci";
import { LuSend } from "react-icons/lu";

import ham from "../../assets/hamburger.png";
import hamLight from "../../assets/hamLight.png";
import { FiX } from 'react-icons/fi';
import {
  convertTimestampToReadableTime,
  fetchChatBoxes,
  sendMessage,
  fetchMessages,
  markMessagesAsRead
} from '../../utils/ChatUtils';
import { useGlobalContext } from '../../Contexts/GlobalContext';

const Chat = () => {
  const { theme } = useTheme();
  const { currentUserId } = useGlobalContext();

  const [selectedUser, setSelectedUser] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chatBoxes, setChatBoxes] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [activeChatId, setActiveChatId] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const messagesEndRef = useRef(null);

  // Function to refresh chat boxes without affecting the message view
  const refreshChatBoxes = useCallback(() => {
    fetchChatBoxes(currentUserId, (data) => {
      // Update chat boxes but maintain the current selection
      setChatBoxes(data);
      setIsLoading(false);
    }, (error) => {
      setError("Failed to load chats: " + error.message);
      setIsLoading(false);
    });
  }, [currentUserId]);

  // Fetch chat boxes
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const unsubscribe = fetchChatBoxes(currentUserId, (data) => {
      setChatBoxes(data);
      setIsLoading(false);
    }, (error) => {
      setError("Failed to load chats: " + error.message);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [currentUserId]);

  // Find chat ID when a user is selected
  useEffect(() => {
    if (selectedUser?.userAppId) {
      const chatBox = chatBoxes.find(box => box.user.userAppId === selectedUser.userAppId);
      if (chatBox) {
        setActiveChatId(chatBox.id || `${currentUserId}_${selectedUser.userAppId}`);
      } else {
        // Handle case when chat box is not found
        setActiveChatId(`${currentUserId}_${selectedUser.userAppId}`);
      }
    }
  }, [selectedUser, chatBoxes, currentUserId]);

  // Fetch messages when active chat changes
  useEffect(() => {
    let unsubscribe = () => { };

    if (activeChatId) {
      setIsLoading(true);
      setError(null);

      // Mark messages as read when opening a chat
      markMessagesAsRead(activeChatId, () => {
        // Only update unread count in the chat boxes, not the entire chat boxes
        setChatBoxes(prevChatBoxes => {
          return prevChatBoxes.map(box => {
            if (box.id === activeChatId ||
              (box.user.userAppId === selectedUser.userAppId &&
                `${currentUserId}_${selectedUser.userAppId}` === activeChatId)) {
              return { ...box, unreadCount: 0 };
            }
            return box;
          });
        });
      });

      // Fetch messages for the active chat
      unsubscribe = fetchMessages(activeChatId, (fetchedMessages) => {
        setMessages(fetchedMessages);
        setIsLoading(false);
      }, (error) => {
        setError("Failed to load messages: " + error.message);
        setIsLoading(false);
      });
    } else {
      setMessages([]);
    }

    return () => unsubscribe();
  }, [activeChatId, currentUserId, selectedUser.userAppId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeChatId || !selectedUser?.userAppId) return;

    try {
      sendMessage(
        activeChatId.toString(),
        selectedUser?.userAppId?.toString(),
        currentUserId.toString(),
        messageInput
      );

      // Add optimistic message to UI immediately
      const optimisticMessage = {
        id: Date.now().toString(),
        messageBody: messageInput,
        senderId: currentUserId.toString(),
        receiverId: selectedUser?.userAppId?.toString(),
        serverTime: new Date().toISOString(),
        isOptimistic: true // flag to identify optimistic messages
      };

      setMessages(prev => [...prev, optimisticMessage]);

      // Clear input field after sending
      setMessageInput("");
    } catch (error) {
      setError("Failed to send message: " + error.message);
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

  // Function to handle selecting a user from the chat list
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setIsSidebarOpen(false);
    setError(null);

    // Find the chat to check unread messages
    const chatBox = chatBoxes.find(box => box.user.userAppId === user.userAppId);
    if (chatBox && chatBox.unreadCount > 0) {
      // Update only the unread count locally
      setChatBoxes(prevChatBoxes => {
        return prevChatBoxes.map(box => {
          if (box.user.userAppId === user.userAppId) {
            return { ...box, unreadCount: 0 };
          }
          return box;
        });
      });

      // Mark messages as read in the backend
      const chatId = chatBox.id || `${currentUserId}_${user.userAppId}`;
      markMessagesAsRead(chatId);
    }
  };

  // Filter chat boxes by search query
  const filteredChatBoxes = chatBoxes.filter(data =>
    data?.user?.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    data?.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`${theme === "dark" ? "bg-[#1B1C1E] text-white" : "bg-white text-black"} transition-all `}>

      <div className="flex h-[86vh] w-full relative gap-6">

        {/* Sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

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
            {isLoading && chatBoxes.length === 0 ? (
              <div className="flex justify-center items-center h-32">
                <p className="text-gray-500">Loading chats...</p>
              </div>
            ) : error && chatBoxes.length === 0 ? (
              <div className="flex justify-center items-center h-32">
                <p className="text-red-500">{error}</p>
              </div>
            ) : filteredChatBoxes.length === 0 ? (
              <div className="flex justify-center items-center h-32">
                <p className="text-gray-500">No chats found</p>
              </div>
            ) : (
              filteredChatBoxes.map((data) => (
                <div key={data?.user?.userAppId || data?.id}>
                  <div
                    className={`flex items-center rounded-t p-3 cursor-pointer border-b border-dashed ${theme === "dark" ? "border-[#464749]" : "border-[#e8e8e8]"} ${selectedUser.userAppId === data?.user?.userAppId ? (theme === "dark" ? "bg-gray-700 " : "bg-gray-300 ") : ""}`}
                    onClick={() => handleSelectUser(data?.user)}
                  >
                    <img src={data?.user?.profileImage} alt={data?.user?.userName} className="w-10 h-10 rounded-full" />
                    <div className="ml-3 w-full">
                      <div className='flex items-center justify-between w-full'>
                        <h3 className="font-semibold">{data?.user?.userName}</h3>
                        <p className={`text-[0.8rem] ${theme === "dark" ? "text-[#adadae]" : "text-[#767778]"}`}>{convertTimestampToReadableTime(data?.lastMessageTime)}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"} truncate max-w-[70%]`}>
                          {data?.lastMessage?.length > 30
                            ? `${data.lastMessage.slice(0, 50)}...`
                            : data?.lastMessage}

                        </p>

                        {data?.unreadCount > 0 && (
                          <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2">
                            {data.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className={`flex flex-col flex-1 h-[82vh] sm:h-[86vh] rounded-xl ${theme === "dark" ? "bg-[#1B1C1E] text-white border border-white/30" : "bg-white text-black border border-[#ECECEC]"}`}>
          {/* Header */}
          <div className={`flex items-center rounded-t-xl p-4 ${theme === "dark" ? "bg-[#323335]" : "bg-gray-100"} shadow-md relative`}>
            <button
              className="lg:hidden rounded-full mr-3"
              onClick={() => setIsSidebarOpen(true)}
            >
              <img src={theme === "dark" ? ham : hamLight} alt="" className='w-[24px]' />
            </button>

            {selectedUser?.profileImage ? (
              <img src={selectedUser.profileImage} alt={selectedUser.userName} className="w-10 h-10 rounded-full" />
            ) : (
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${theme === "dark" ? "bg-gray-600" : "bg-gray-300"}`}>
                {selectedUser?.userName?.charAt(0) || "?"}
              </div>
            )}
            <div className="ml-3">
              <h3 className="font-semibold">{selectedUser?.userName || "Select a chat"}</h3>
              <p className="text-sm">{selectedUser?.email || ""}</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            {!selectedUser?.userAppId ? (
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

          {/* Input Field */}
          <div className="p-4 relative w-full">
            <input
              type="text"
              placeholder={selectedUser?.userAppId ? "Type Message" : "Select a chat to start messaging"}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!selectedUser?.userAppId}
              className={`w-full p-3 pl-4 pr-10 rounded-3xl border ${theme === "dark" ? "bg-[#1B1C1E] text-white border-gray-500" : "bg-gray-100 text-black border-gray-300"} focus:outline-none ${!selectedUser?.userAppId ? 'cursor-not-allowed' : ''}`}
            />
            <button
              onClick={handleSendMessage}
              disabled={!messageInput.trim() || !selectedUser?.userAppId}
              className="absolute right-10 top-1/2 transform -translate-y-1/2 text-xl cursor-pointer"
            >
              <LuSend
                className={`${!messageInput.trim() || !selectedUser?.userAppId ? 'opacity-50' : 'opacity-100'}`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;