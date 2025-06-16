import React, { createContext, useContext, useEffect, useState } from 'react';
import { requestNotificationPermission, onMessage, messaging } from '../firebase/firebase';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [fcmToken, setFcmToken] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isAppActive, setIsAppActive] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      setIsAppActive(isVisible);
      
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: isVisible ? 'CLIENT_CONNECTED' : 'CLIENT_DISCONNECTED',
          timestamp: Date.now()
        });
      }
    };

    const handleFocus = () => {
      setIsAppActive(true);
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'CLIENT_CONNECTED',
          timestamp: Date.now()
        });
      }
    };

    const handleBlur = () => {
      setIsAppActive(false);
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'CLIENT_DISCONNECTED',
          timestamp: Date.now()
        });
      }
    };

    const handleBeforeUnload = () => {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'CLIENT_DISCONNECTED',
          timestamp: Date.now()
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('beforeunload', handleBeforeUnload);

    handleVisibilityChange();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        const token = await requestNotificationPermission();
        if (token) {
          setFcmToken(token);
          console.log('FCM Token stored:', token);
          
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', (event) => {
              if (event.data && event.data.type === 'NOTIFICATION_RECEIVED') {
                console.log('Notification received via service worker:', event.data.payload);
              }
            });
          }
        }
      } catch (error) {
        console.error('Error initializing notifications:', error);
      }
    };

    initializeNotifications();
  }, []);

  useEffect(() => {
    let unsubscribe;

    const setupForegroundListener = async () => {
      try {
        unsubscribe = onMessage(messaging, (payload) => {
          console.log('Received foreground message:', payload);
          console.log('Current notification permission:', Notification.permission);
          console.log('Document visibility:', !document.hidden);
          console.log('Document has focus:', document.hasFocus());
          
          setNotification(payload);
          
          if (Notification.permission === 'granted' && payload.notification) {
            console.log('Attempting to show notification:', payload.notification);
            
            try {
              const notificationOptions = {
                body: payload.notification.body,
                icon: '/fav.png',
                badge: '/fav.png',
                image: payload.notification.image,
                tag: `notification-${Date.now()}`,
                requireInteraction: false,
                silent: false,
                data: payload.data || {},
                timestamp: Date.now(),
                renotify: true 
              };

              console.log('Creating notification with options:', notificationOptions);
              
              const notification = new Notification(
                payload.notification.title || 'New Notification',
                notificationOptions
              );

              notification.onshow = () => {
                console.log('Notification successfully shown');
              };

              notification.onerror = (error) => {
                console.error('Notification error:', error);
              };

              notification.onclick = function(event) {
                console.log('Notification clicked');
                event.preventDefault();
                window.focus();
                notification.close();
                
                if (payload.data && payload.data.url) {
                  window.location.href = payload.data.url;
                }
              };

            
              setTimeout(() => {
                notification.close();
              }, 8000);
              
            } catch (notificationError) {
              console.error('Error creating notification:', notificationError);
            }
          } else {
            console.log('Cannot show notification - Permission:', Notification.permission, 'Has notification data:', !!payload.notification);
          }
        });
        
        console.log('Foreground message listener set up successfully');
        
      } catch (err) {
        console.error('Failed to setup foreground listener:', err);
      }
    };

    setupForegroundListener();

    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        console.log('Unsubscribing from foreground messages');
        unsubscribe();
      }
    };
  }, []); 

  useEffect(() => {
    return () => {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'CLIENT_DISCONNECTED',
          timestamp: Date.now()
        });
      }
    };
  }, []);

  const value = {
    fcmToken,
    notification,
    setNotification,
    isAppActive
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};