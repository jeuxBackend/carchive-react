import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  where,
  doc,
  updateDoc,
  getDoc,
  getDocs,
  setDoc,
  arrayUnion,
  writeBatch
} from "firebase/firestore";

import { db } from "../firebase/firebase";

const fetchMessages = (chatId, callback, errorCallback) => {
  if (!chatId) {
    const error = "Chat ID is missing";
    console.error(error);
    if (errorCallback) errorCallback(error);
    return () => {};
  }

  const chatRef = collection(db, `UsersChatBox/${chatId}/chats`);
  const q = query(chatRef, orderBy("serverTime"));

  return onSnapshot(q, (snapshot) => {
    console.log("Messages snapshot updated");
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(messages);
  }, (error) => {
    console.error("Error fetching messages:", error);
    if (errorCallback) errorCallback(error);
  });
};

const sendMessage = async (chatId, receiverId, senderId, messageBody) => {
  try {
    if (!chatId || !receiverId || !messageBody.trim()) {
      console.error("Missing chatId, senderId, receiverId, or messageBody");
      return false;
    }

    // First check if this chat exists
    const chatBoxRef = doc(db, `UsersChatBox`, chatId);
    const chatBoxSnap = await getDoc(chatBoxRef);
    
    if (!chatBoxSnap.exists()) {
      // If the chat doesn't exist with this ID, we need to initialize it
      const newChatId = await initializeChat(senderId, receiverId, null, messageBody);
      if (newChatId) {
        chatId = newChatId;
      } else {
        throw new Error("Failed to initialize chat");
      }
    }

    const messagesRef = collection(db, `UsersChatBox/${chatId}/chats`);
    const unreadMessagesQuery = query(
      messagesRef,
      where("readStatus", "==", "unread"),
      where("receiverId", "==", senderId) 
    );

    const unreadMessagesSnapshot = await getDocs(unreadMessagesQuery);
    const batch = writeBatch(db); 

    unreadMessagesSnapshot.forEach((docSnap) => {
      batch.update(docSnap.ref, {
        readStatus: "read", 
      });
    });

    // Create a unique message ID
    const timestamp = Date.now().toString();
    const extraDigits = Math.floor(Math.random() * 900) + 100;
    const messageId = timestamp + extraDigits.toString();

    const messageRef = doc(db, `UsersChatBox/${chatId}/chats`, messageId);
    const updatedChatBoxRef = doc(db, `UsersChatBox/${chatId}`);

    await setDoc(messageRef, {
      messageBody,
      senderId,
      receiverId,
      massageFileUrl: '',
      messageFileExtension: '',
      messageId,
      readStatus: "unread",
      serverTime: serverTimestamp(),
    });

    await updateDoc(updatedChatBoxRef, {
      lastMessage: messageBody,
      lastMessageTime: serverTimestamp(),
    });

    await batch.commit();

    console.log("Message sent successfully and unread messages marked as read");
    return true;
  } catch (error) {
    console.error("Error sending message:", error);
    return false;
  }
};

const markMessagesAsRead = async (chatId, fetchChatBoxesCallback) => {
  if (!chatId) {
    console.error("Chat ID is missing");
    return;
  }
  
  const messagesRef = collection(db, `UsersChatBox/${chatId}/chats`);

  try {
    const q = query(messagesRef, where("readStatus", "!=", "read"));
    const snapshot = await getDocs(q);
    const batchPromises = [];

    snapshot.forEach((doc) => {
      const messageData = doc.data();

      if (messageData.senderId !== "0") {
        batchPromises.push(updateDoc(doc.ref, { readStatus: "read" }));
      }
    });

    await Promise.all(batchPromises);
    console.log("All unread messages marked as read.");

    if (fetchChatBoxesCallback) {
      fetchChatBoxesCallback();
    }
  } catch (error) {
    console.error("Error marking messages as read:", error);
  }
};

// Function to initialize a new chat
const initializeChat = async (senderId, receiverId, carId, initialMessage = "") => {
  try {
    senderId = senderId?.toString() || "";
    receiverId = receiverId?.toString() || "";
    carId = carId?.toString() || `default_${Date.now()}`;
    
    // Check if a chat with these users already exists (in any combination)
    const existingChatId = await findExistingChat(senderId, receiverId, carId);
    
    if (existingChatId) {
      console.log(`Chat already exists with ID: ${existingChatId}`);
      return existingChatId;
    }
    
    // If no existing chat, create a new one with standard format: senderId_receiverId_carId
    const chatId = `${senderId}_${receiverId}_${carId}`;
    
    // Create new chat document
    await setDoc(doc(db, "UsersChatBox", chatId), {
      senderId,
      receiverId,
      carId,
      lastMessage: initialMessage || "Chat started",
      lastMessageTime: serverTimestamp(),
      carName: "null"
    });
    
    console.log(`Chat initialized with ID: ${chatId}`);

    // If there's an initial message, add it to the chat
    if (initialMessage && initialMessage.trim() !== "") {
      const timestamp = Date.now().toString();
      const extraDigits = Math.floor(Math.random() * 900) + 100;
      const messageId = timestamp + extraDigits.toString();
      
      const messageRef = doc(db, `UsersChatBox/${chatId}/chats`, messageId);
      await setDoc(messageRef, {
        messageBody: initialMessage,
        senderId,
        receiverId,
        massageFileUrl: '',
        messageFileExtension: '',
        messageId,
        readStatus: "unread",
        serverTime: serverTimestamp(),
      });
    }
    
    return chatId;
  } catch (error) {
    console.error("Error initializing chat:", error);
    return null;
  }
};

// Function to find an existing chat between two users for a specific car
const findExistingChat = async (userId1, userId2, carId) => {
  // Check all possible combinations
  const possibleCombinations = [
    `${userId1}_${userId2}_${carId}`,
    `${userId2}_${userId1}_${carId}`,
    `${userId1}_${carId}_${userId2}`,
    `${userId2}_${carId}_${userId1}`,
    `${carId}_${userId1}_${userId2}`,
    `${carId}_${userId2}_${userId1}`
  ];
  
  for (const chatId of possibleCombinations) {
    const chatRef = doc(db, "UsersChatBox", chatId);
    const chatSnap = await getDoc(chatRef);
    
    if (chatSnap.exists()) {
      return chatId;
    }
  }
  
  return null; // No existing chat found
};

// Function to get the correct chat ID (simplified version of findExistingChat)
const getChatId = async (userId1, userId2, carId) => {
  return await findExistingChat(userId1, userId2, carId);
};

const convertTimestampToReadableTime = (timestamp) => {
  if (!timestamp) return "";
  
  // Handle string ISO dates from optimistic messages
  if (typeof timestamp === 'string') {
    const date = new Date(timestamp);
    return formatTimeFromDate(date);
  }
  
  // Handle Firestore timestamps
  if (timestamp.seconds) {
    const date = new Date(timestamp.seconds * 1000);
    return formatTimeFromDate(date);
  }
  
  return "Invalid time";
};

// Helper function for formatting time (referenced in convertTimestampToReadableTime)
const formatTimeFromDate = (date) => {
  if (!date || isNaN(date.getTime())) return "Invalid date";
  
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

const addUser = async ({
  fireId,
  userAppId,
  userEmail = null,
  userName,
  userPhone,
  profileImage,
  role = "Grage",
  status = "",
  inboxIds = []
}) => {
  try {
    const userRef = doc(db, "Users", userAppId);

    const userData = {
      fireId,
      inboxIds, 
      userAppId,
      userEmail,
      userName,
      userPhone,
      profileImage,
      role,
      status
    };

    await setDoc(userRef, userData);
    console.log(`User ${userAppId} added successfully.`);
  } catch (error) {
    console.error("Error adding user:", error);
  }
};

export {
  fetchMessages,
  sendMessage,
  markMessagesAsRead,

  convertTimestampToReadableTime,
  addUser,
  initializeChat,
  getChatId
};