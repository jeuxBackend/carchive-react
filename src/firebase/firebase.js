// firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDCNd4pecsQQGTIFg-sRh-PynJtkr4Up6w",
  authDomain: "carchieve-6e28c.firebaseapp.com",
  projectId: "carchieve-6e28c",
  storageBucket: "carchieve-6e28c.firebasestorage.app",
  messagingSenderId: "776781154984",
  appId: "1:776781154984:web:f4af9ef9d1d557125d509d",
  measurementId: "G-XV2BEER44V"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const messaging = getMessaging(app);

export const requestNotificationPermission = async () => {
  try {
    // Register service worker first
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('Service Worker registered:', registration);
      
      // Wait for service worker to be ready
      await navigator.serviceWorker.ready;
    }

    // Request notification permission
    const permission = await Notification.requestPermission();
    console.log('Notification permission:', permission);
    
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      
      try {
        const token = await getToken(messaging, {
          vapidKey: 'BPMaKz7FAPwVjJzq_T6INO_2_5VWtl4bJ7lXYN9K12Jp1Loss_EHHaSswwqnyY4rrjR5ivb4tlhzfwfhL1Kjby4'
        });
        
        if (token) {
          console.log('FCM Token:', token);
          return token;
        } else {
          console.log('No registration token available.');
          return null;
        }
      } catch (tokenError) {
        console.error('Error getting FCM token:', tokenError);
        return null;
      }
    } else {
      console.log('Unable to get permission to notify.');
      return null;
    }
  } catch (error) {
    console.error('Error getting notification permission:', error);
    return null;
  }
};

// Fixed: Return a Promise that resolves when a message is received
export const onMessageListener = () => {
  return new Promise((resolve) => {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Message received in foreground:', payload);
      resolve(payload);
      // Note: This will only resolve once. If you need to listen continuously,
      // you might want to modify this approach
    });
    
    // Store unsubscribe function if needed
    return unsubscribe;
  });
};

export { db, messaging, onMessage  };