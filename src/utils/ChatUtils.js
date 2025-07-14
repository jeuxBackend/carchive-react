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

import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "firebase/storage";

import { db } from "../firebase/firebase";
import { storage } from "../firebase/firebase";


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

const sendMessage = async (
  chatId, 
  receiverId, 
  senderId, 
  messageBody, 
  isGarageChat = false,
  file = null
) => {
  try {
    if (!chatId || !receiverId || (!messageBody.trim() && !file)) {
      console.error("Missing chatId, receiverId, or messageBody/file");
      return false;
    }

    const chatBoxRef = doc(db, `UsersChatBox`, chatId);
    const chatBoxSnap = await getDoc(chatBoxRef);
    
    if (!chatBoxSnap.exists()) {
      const newChatId = await initializeChat(
        senderId, 
        receiverId, 
        isGarageChat ? null : 'default', 
        messageBody,
        isGarageChat
      );
      
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

    const timestamp = Date.now().toString();
    const extraDigits = Math.floor(Math.random() * 900) + 100;
    const messageId = timestamp + extraDigits.toString();

 
    let fileUrl = '';
    let fileExtension = '';
    
    if (file) {
      try {
        // Get file extension
        const fileName = file.name;
        fileExtension = fileName.split('.').pop() || '';
        
        // Create storage reference
        const storageRef = ref(storage, `UserChatFiles/${chatId}/${messageId}`);
        
        // Upload file
        const snapshot = await uploadBytes(storageRef, file);
        
        // Get download URL
        fileUrl = await getDownloadURL(snapshot.ref);
        
        console.log("File uploaded successfully:", fileUrl);
      } catch (uploadError) {
        console.error("Error uploading file:", uploadError);
        throw new Error("Failed to upload file");
      }
    }

    const messageRef = doc(db, `UsersChatBox/${chatId}/chats`, messageId);
    const updatedChatBoxRef = doc(db, `UsersChatBox/${chatId}`);

    const messageData = {
      messageBody: messageBody || '',
      senderId,
      receiverId,
      massageFileUrl: fileUrl, // Note: keeping your original typo "massageFileUrl"
      messageFileExtension: fileExtension,
      messageId,
      readStatus: "unread",
      serverTime: serverTimestamp(),
    };
 
    if (!isGarageChat && chatBoxSnap.exists() && chatBoxSnap.data().carId) {
      messageData.carId = chatBoxSnap.data().carId;
    }
    
    await setDoc(messageRef, messageData);

    // Update last message text for chat list
    const lastMessageText = messageBody.trim() || (file ? 'File' : 'Message');
    
    await updateDoc(updatedChatBoxRef, {
      lastMessage: lastMessageText,
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

const updateUserInboxIds = async (userId, chatId) => {
  try {
    if (!userId || !chatId) {
      console.error("Missing userId or chatId for updating inboxIds");
      return false;
    }
    
    const userRef = doc(db, "Users", userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      console.error(`User document not found for ID: ${userId}`);
      return false;
    }
    

    await updateDoc(userRef, {
      inboxIds: arrayUnion(chatId)
    });
    
    console.log(`Added chatId ${chatId} to inboxIds for user ${userId}`);
    return true;
  } catch (error) {
    console.error(`Error updating inboxIds for user ${userId}:`, error);
    return false;
  }
};


const initializeChat = async (senderId, receiverId, carId, initialMessage = "", isGarageChat = false) => {
  try {
    senderId = senderId?.toString() || "";
    receiverId = receiverId?.toString() || "";
    
    let chatId;
    
    if (isGarageChat) {

      const existingChatId = await findExistingChat(senderId, receiverId, null, true);
      
      if (existingChatId) {
        console.log(`Garage chat already exists with ID: ${existingChatId}`);
        return existingChatId;
      }
   
      chatId = `${receiverId}_${senderId}`;
    } else {

      carId = carId?.toString() || `default_${Date.now()}`;

      const existingChatId = await findExistingChat(senderId, receiverId, carId);
      
      if (existingChatId) {
        console.log(`Car chat already exists with ID: ${existingChatId}`);
        return existingChatId;
      }

      chatId = `${receiverId}_${carId}_${senderId}`;
    }

    const chatData = {
      senderId,
      receiverId,
      lastMessage: initialMessage || "Chat started",
      lastMessageTime: serverTimestamp(),
    };

    if (!isGarageChat && carId) {
      chatData.carId = carId;
      chatData.carName = "null";
    }

    await setDoc(doc(db, "UsersChatBox", chatId), chatData);
    
    console.log(`Chat initialized with ID: ${chatId}`);

    if (initialMessage && initialMessage.trim() !== "") {
      const timestamp = Date.now().toString();
      const extraDigits = Math.floor(Math.random() * 900) + 100;
      const messageId = timestamp + extraDigits.toString();
      
      const messageData = {
        messageBody: initialMessage,
        senderId,
        receiverId,
        massageFileUrl: '',
        messageFileExtension: '',
        messageId,
        readStatus: "unread",
        serverTime: serverTimestamp(),
      };

      if (!isGarageChat && carId) {
        messageData.carId = carId;
      }
      
      const messageRef = doc(db, `UsersChatBox/${chatId}/chats`, messageId);
      await setDoc(messageRef, messageData);
    }

    await Promise.all([
      updateUserInboxIds(senderId, chatId),
      updateUserInboxIds(receiverId, chatId)
    ]);
    
    return chatId;
  } catch (error) {
    console.error("Error initializing chat:", error);
    return null;
  }
};

const findExistingChat = async (userId1, userId2, carId, isGarageChat = false) => {
  try {
    let possibleCombinations = [];
    
    if (isGarageChat) {

      possibleCombinations = [
        `${userId1}_${userId2}`,
        `${userId2}_${userId1}`
      ];
    } else {
  
      possibleCombinations = [
        `${userId1}_${userId2}_${carId}`,
        `${userId2}_${userId1}_${carId}`,
        `${userId1}_${carId}_${userId2}`,
        `${userId2}_${carId}_${userId1}`,
        `${carId}_${userId1}_${userId2}`,
        `${carId}_${userId2}_${userId1}`
      ];
    }
    
    for (const chatId of possibleCombinations) {
      const chatRef = doc(db, "UsersChatBox", chatId);
      const chatSnap = await getDoc(chatRef);
      
      if (chatSnap.exists()) {
        return chatId;
      }
    }
    
    return null; 
  } catch (error) {
    console.error("Error finding existing chat:", error);
    return null;
  }
};

const getChatId = async (userId1, userId2, carId, isGarageChat = false) => {
  return await findExistingChat(userId1, userId2, carId, isGarageChat);
};

const convertTimestampToReadableTime = (timestamp) => {
  if (!timestamp) return "";

  if (typeof timestamp === 'string') {
    const date = new Date(timestamp);
    return formatTimeFromDate(date);
  }

  if (timestamp.seconds) {
    const date = new Date(timestamp.seconds * 1000);
    return formatTimeFromDate(date);
  }
  
  return "Invalid time";
};


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
  getChatId,
  updateUserInboxIds
};