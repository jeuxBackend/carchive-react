// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyDCNd4pecsQQGTIFg-sRh-PynJtkr4Up6w",
  authDomain: "carchieve-6e28c.firebaseapp.com",
  projectId: "carchieve-6e28c",
  storageBucket: "carchieve-6e28c.firebasestorage.app",
  messagingSenderId: "776781154984",
  appId: "1:776781154984:web:f4af9ef9d1d557125d509d",
  measurementId: "G-XV2BEER44V"
};

const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

let activeClients = new Set();

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLIENT_CONNECTED') {
    activeClients.add(event.source.id);
    console.log('Client connected:', event.source.id);
  } else if (event.data && event.data.type === 'CLIENT_DISCONNECTED') {
    activeClients.delete(event.source.id);
    console.log('Client disconnected:', event.source.id);
  }
});

async function hasActiveClients() {
  try {
    const clients = await self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    });
    
    console.log('Found clients:', clients.length);
    
    // Check if any client is visible/focused
    for (const client of clients) {
      console.log('Client state:', {
        url: client.url,
        visibilityState: client.visibilityState,
        focused: client.focused
      });
    }
    
    const activeWindowClients = clients.filter(client => 
      client.visibilityState === 'visible'
    );
    
    return activeWindowClients.length > 0;
  } catch (error) {
    console.error('Error checking active clients:', error);
    return false;
  }
}

messaging.onBackgroundMessage(async (payload) => {
  console.log('[firebase-messaging-sw.js] Received background message', payload);
  
  const hasActive = await hasActiveClients();
  console.log('Has active clients:', hasActive);
  
  // Show notification regardless of app state for testing
  // You can modify this logic based on your needs
  const notificationTitle = payload.notification?.title || 'New Message';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new message',
    icon: '/logo192.png',
    badge: '/logo192.png',
    tag: 'notification-tag',
    requireInteraction: false,
    silent: false,
    data: payload.data || {},
    timestamp: Date.now(),
    actions: [
      {
        action: 'open',
        title: 'Open App'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };

  console.log('Showing notification with options:', notificationOptions);
  
  try {
    await self.registration.showNotification(notificationTitle, notificationOptions);
    console.log('Notification shown successfully');
  } catch (error) {
    console.error('Error showing notification:', error);
  }
});

self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click received.');
  
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin)) {
            client.focus();
            return;
          }
        }
        return clients.openWindow('/');
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
  self.skipWaiting();
});

self.addEventListener('clientdisconnect', (event) => {
  activeClients.delete(event.clientId);
});