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

const fetchMessages = (chatId, callback) => {
  if (!chatId) {
    console.error("Chat ID is missing");
    return;
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
  });
};

const sendMessage = async (chatId, receiverId, senderId, messageBody) => {
  try {
    if (!chatId || !receiverId || !messageBody.trim()) {
      console.error("Missing chatId, senderId, receiverId, or messageBody");
      return;
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

    const messageRef = doc(db, `UsersChatBox/${chatId}/chats`, messageId);
    const chatBoxRef = doc(db, `UsersChatBox/${chatId}`);

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


    await updateDoc(chatBoxRef, {
      lastMessage: messageBody,
      lastMessageTime: serverTimestamp(),
    });


    await batch.commit();

    console.log("Message sent successfully and unread messages marked as read");
  } catch (error) {
    console.error("Error sending message:", error);
  }
};



const markMessagesAsRead = async (chatId, fetchChatBoxesCallback) => {
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
    const chatId = `${senderId}_${receiverId}`;
    const chatId2 = `${receiverId}_${senderId}`;
    const chatRef = doc(db, "UsersChatBox", chatId2);

    const chatSnap = await getDoc(chatRef);
    if (chatSnap.exists()) {
      console.log(`Chat between ${senderId} and ${receiverId} already exists.`);
      return; 
    }

 
    await setDoc(chatRef, {
      senderId,
      receiverId,
      lastMessage: initialMessage || "Chat started",
      lastMessageTime: serverTimestamp()
    });

    console.log(`Chat initialized between ${senderId} and ${receiverId}`);

   
    const senderRef = doc(db, "Users", senderId.toString());
    const senderSnap = await getDoc(senderRef);

    if (senderSnap.exists()) {
      const data = senderSnap.data();

      if (Array.isArray(data.inboxIds)) {
        await updateDoc(senderRef, {
          inboxIds: arrayUnion(chatId2)
        });
      } else {
        await updateDoc(senderRef, {
          inboxIds: [chatId2]
        });
      }
    } else {
      await setDoc(senderRef, {
        inboxIds: [chatId2]
      }, { merge: true });
    }

  } catch (error) {
    console.error("Error initializing chat:", error);
  }
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
  initializeChat
};

// fetchUserById("0", (user) => {
//   if (user) {
//     console.log("Fetched User:", user);
//   } else {
//     console.log("User not found or error occurred");
//   }
// });

// fetchUsersRealtime((users) => {
//     console.log(users);
//   });

//   fetchChatBoxes("0", (chatBoxes) => {
//     console.log(chatBoxes);
//   });

// markMessagesAsRead("chat123");

// sendMessage("0_17", "17", "Hello, how are you?");

// fetchMessages("0_17", (messages) => {
//     console.log(messages);
//   });
