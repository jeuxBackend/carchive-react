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
      return;
    }

    // First check if this chat exists
    const chatBoxRef = doc(db, `UsersChatBox`, chatId);
    const chatBoxSnap = await getDoc(chatBoxRef);
    
    if (!chatBoxSnap.exists()) {
      // If the chat doesn't exist with this ID, check the reverse order
      const reverseChatId = `${receiverId}_${senderId}`;
      const reverseChatRef = doc(db, `UsersChatBox`, reverseChatId);
      const reverseChatSnap = await getDoc(reverseChatRef);
      
      if (reverseChatSnap.exists()) {
        // Use the reverse chat ID if it exists
        chatId = reverseChatId;
      } else {
        // Initialize a new chat if neither exists
        const newChatId = await initializeChat(senderId, receiverId, messageBody);
        if (newChatId) {
          chatId = newChatId;
        } else {
          throw new Error("Failed to initialize chat");
        }
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

const fetchChatBoxes = (userId, callback) => {
  const chatBoxRef = collection(db, "UsersChatBox");

  const senderQuery = query(chatBoxRef, where("senderId", "==", userId.toString()));
  const receiverQuery = query(chatBoxRef, where("receiverId", "==", userId.toString()));

  const processSnapshot = async (snapshot) => {
    const chatBoxes = await Promise.all(
      snapshot.docs.map(async (docSnap) => {
        const chatId = docSnap.id;
        const chatData = docSnap.data();

        const messagesRef = collection(db, `UsersChatBox/${chatId}/chats`);
        const unreadQuery = query(
          messagesRef,
          where("readStatus", "==", "unread"),
          where("receiverId", "==", userId.toString())
        );
        const unreadSnapshot = await getDocs(unreadQuery);
        const unreadCount = unreadSnapshot.size;

        const otherUserId = chatData.senderId === userId.toString()
          ? chatData.receiverId
          : chatData.senderId;

        const userRef = doc(db, "Users", otherUserId);
        const userSnap = await getDoc(userRef);
        const userInfo = userSnap.exists() ? userSnap.data() : null;

        return {
          id: chatId,
          unreadCount,
          user: userInfo,
          ...chatData,
        };
      })
    );
    return chatBoxes;
  };

  let allChats = [];

  const unsubscribeSender = onSnapshot(senderQuery, async (senderSnapshot) => {
    const senderChats = await processSnapshot(senderSnapshot);
    allChats = [...senderChats];

    callback(allChats);
  });

  const unsubscribeReceiver = onSnapshot(receiverQuery, async (receiverSnapshot) => {
    const receiverChats = await processSnapshot(receiverSnapshot);

    const combined = [...allChats, ...receiverChats];
    const unique = Array.from(new Map(combined.map(chat => [chat.id, chat])).values());

    callback(unique);
  });

  return () => {
    unsubscribeSender();
    unsubscribeReceiver();
  };
};

const fetchUsersRealtime = (callback) => {
  const usersRef = collection(db, "Users");

  return onSnapshot(usersRef, (snapshot) => {
    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(users);
  });
};

const fetchUserById = async (userId, callback) => {
  const userRef = doc(db, "Users", userId);

  try {
    const snapshot = await getDoc(userRef);
    if (snapshot.exists()) {
      const userData = snapshot.data();
      console.log(userData);

      if (callback) callback(userData);
      return userData;
    } else {
      console.log("User not found");
      if (callback) callback(null);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    if (callback) callback(null);
  }
};

const convertTimestampToReadableTime = (timestamp) => {
  if (!timestamp || typeof timestamp.seconds !== "number") {
    console.error("Invalid timestamp:", timestamp);
    return "Invalid time";
  }

  const date = new Date(timestamp.seconds * 1000);
  const now = new Date();

  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = (((hours + 11) % 12) + 1).toString().padStart(2, "0");

  const messageDate = date.toDateString();
  const todayDate = now.toDateString();
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  if (messageDate === todayDate) {
    return `${formattedHours}:${minutes} ${ampm}`;
  } else if (messageDate === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString("en-GB");
  }
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

const initializeChat = async (senderId, receiverId, initialMessage = "") => {
  try {
    // Check both possible chat ID formats
    const chatId1 = `${senderId}_${receiverId}`;
    const chatId2 = `${receiverId}_${senderId}`;
    
    // Check if either chat exists
    const chatRef1 = doc(db, "UsersChatBox", chatId1);
    const chatRef2 = doc(db, "UsersChatBox", chatId2);
    
    const chatSnap1 = await getDoc(chatRef1);
    const chatSnap2 = await getDoc(chatRef2);
    
    // If either chat exists, return the existing chatId
    if (chatSnap1.exists()) {
      console.log(`Chat already exists with ID: ${chatId1}`);
      return chatId1;
    } else if (chatSnap2.exists()) {
      console.log(`Chat already exists with ID: ${chatId2}`);
      return chatId2;
    }
    
    // Create new chat with consistent ID format (always senderId_receiverId)
    const newChatId = chatId1;
    const chatRef = doc(db, "UsersChatBox", newChatId);
    
    await setDoc(chatRef, {
      senderId,
      receiverId,
      lastMessage: initialMessage || "Chat started",
      lastMessageTime: serverTimestamp()
    });
    
    console.log(`Chat initialized between ${senderId} and ${receiverId} with ID: ${newChatId}`);
    
    // Update sender's inbox
    const senderRef = doc(db, "Users", senderId.toString());
    const senderSnap = await getDoc(senderRef);
    
    if (senderSnap.exists()) {
      const data = senderSnap.data();
      
      if (Array.isArray(data.inboxIds)) {
        await updateDoc(senderRef, {
          inboxIds: arrayUnion(newChatId)
        });
      } else {
        await updateDoc(senderRef, {
          inboxIds: [newChatId]
        });
      }
    } else {
      await setDoc(senderRef, {
        inboxIds: [newChatId]
      }, { merge: true });
    }
    
    return newChatId;
  } catch (error) {
    console.error("Error initializing chat:", error);
    return null;
  }
};

// Function to get the correct chat ID
const getChatId = async (userId1, userId2) => {
  const chatId1 = `${userId1}_${userId2}`;
  const chatId2 = `${userId2}_${userId1}`;
  
  const chatRef1 = doc(db, "UsersChatBox", chatId1);
  const chatRef2 = doc(db, "UsersChatBox", chatId2);
  
  const chatSnap1 = await getDoc(chatRef1);
  const chatSnap2 = await getDoc(chatRef2);
  
  if (chatSnap1.exists()) {
    return chatId1;
  } else if (chatSnap2.exists()) {
    return chatId2;
  }
  
  return null;
};

export {
  fetchMessages,
  sendMessage,
  markMessagesAsRead,
  fetchChatBoxes,  
  fetchUsersRealtime,
  fetchUserById,
  convertTimestampToReadableTime,
  addUser,
  initializeChat,
  getChatId
};