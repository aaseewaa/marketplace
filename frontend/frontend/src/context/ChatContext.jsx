import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { productsAPI, chatAPI } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { success, error: showError } = useToast();
  const [conversations, setConversations] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [newMessageNotification, setNewMessageNotification] = useState(null);
  const pollingInterval = useRef(null);
  const playNotificationSound = () => {
    const audio = new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3');
    audio.play().catch(e => console.log('Audio play failed:', e));
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchConversations();
      startPolling();
    }
    return () => stopPolling();
  }, [isAuthenticated, user]);

  const fetchConversations = async () => {
    try {
      const response = await productsAPI.getConversations();
      setConversations(response.data || []);
      const unread = response.data?.filter(c => c.unread).length || 0;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Ошибка загрузки диалогов:', error);
    }
  };

  const startPolling = () => {
    if (pollingInterval.current) clearInterval(pollingInterval.current);
    pollingInterval.current = setInterval(async () => {
      try {
        const response = await productsAPI.getConversations();
        const newConversations = response.data || [];
        
        const oldUnreadCount = unreadCount;
        const newUnreadCount = newConversations.filter(c => c.unread).length;
        
        if (newUnreadCount > oldUnreadCount) {
          const newConv = newConversations.find(c => {
            const oldConv = conversations.find(oc => oc.user_id === c.user_id);
            return oldConv && oldConv.unread !== c.unread && c.unread === true;
          });
          
          if (newConv) {
            setNewMessageNotification({
              from: newConv.username,
              message: newConv.last_message
            });
            
            if (playNotificationSound.current) {
              playNotificationSound.current.play().catch(e => console.log('Audio play failed:', e));
            }
            
            success(`Новое сообщение от ${newConv.username}`);
          }
        }
        
        setConversations(newConversations);
        setUnreadCount(newUnreadCount);
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 3000);
  };

  const stopPolling = () => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
      pollingInterval.current = null;
    }
  };

  const clearNotification = () => {
    setNewMessageNotification(null);
  };

  return (
    <ChatContext.Provider value={{
      conversations,
      unreadCount,
      newMessageNotification,
      clearNotification,
      fetchConversations,
      unreadCount
    }}>
      <audio ref={playNotificationSound} src="/notification.mp3" preload="auto" />
      {children}
    </ChatContext.Provider>
  );
};