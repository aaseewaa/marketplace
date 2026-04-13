import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { productsAPI, chatAPI } from '../services/api';
import './Chat.css';

const Chat = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const messagesEndRef = useRef(null);
  const lastMessageIdRef = useRef(0);

  useEffect(() => {
    fetchConversations();
    
    const unsubscribe = chatAPI.subscribeToMessages((newMessage) => {
      if (selectedUser && newMessage.from_user_id === selectedUser.user_id) {
        setMessages(prev => [...prev, newMessage]);
        lastMessageIdRef.current = newMessage.id;
        setTimeout(scrollToBottom, 100);
      }
      fetchConversations();
    });
    
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userId && !loading) {
      handleUserFromUrl();
    }
  }, [userId, conversations, loading]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!selectedUser) return;
    
    const interval = setInterval(async () => {
      try {
        const response = await chatAPI.getMessagesPolling(selectedUser.user_id, lastMessageIdRef.current);
        if (response.data && response.data.length > 0) {
          setMessages(prev => [...prev, ...response.data]);
          const maxId = Math.max(...response.data.map(m => m.id), lastMessageIdRef.current);
          lastMessageIdRef.current = maxId;
          setTimeout(scrollToBottom, 100);
          fetchConversations();
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [selectedUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const response = await productsAPI.getConversations();
      setConversations(response.data || []);
    } catch (error) {
      console.error('Ошибка загрузки диалогов:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (otherUserId) => {
    try {
      const response = await productsAPI.getMessages(otherUserId);
      setMessages(response.data || []);
      if (response.data && response.data.length > 0) {
        lastMessageIdRef.current = Math.max(...response.data.map(m => m.id));
      }
    } catch (error) {
      console.error('Ошибка загрузки сообщений:', error);
    }
  };

  const handleUserFromUrl = async () => {
    const existingConv = conversations.find(c => c.user_id === Number(userId));
    
    if (existingConv) {
      setSelectedUser(existingConv);
      await fetchMessages(userId);
    } else {
      setLoadingUser(true);
      try {
        const response = await productsAPI.getUserById(userId);
        const otherUser = response.data;
        
        const newConv = {
          user_id: otherUser.id,
          username: otherUser.username,
          last_message: null,
          last_message_time: null,
          unread: false
        };
        
        setSelectedUser(newConv);
        setMessages([]);
        setConversations(prev => [newConv, ...prev]);
      } catch (error) {
        console.error('Ошибка загрузки пользователя:', error);
        showError('Пользователь не найден');
        navigate('/chat');
      } finally {
        setLoadingUser(false);
      }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    setSending(true);
    try {
      await productsAPI.sendMessage(selectedUser.user_id, newMessage.trim());
      setNewMessage('');
      await fetchMessages(selectedUser.user_id);
      
      const updatedConv = {
        ...selectedUser,
        last_message: newMessage.trim(),
        last_message_time: new Date().toISOString()
      };
      setSelectedUser(updatedConv);
      
      setConversations(prev => {
        const filtered = prev.filter(c => c.user_id !== updatedConv.user_id);
        return [updatedConv, ...filtered];
      });
      
      success('Сообщение отправлено');
    } catch (error) {
      showError('Ошибка отправки сообщения');
    } finally {
      setSending(false);
    }
  };

  const handleSelectUser = async (conv) => {
    setSelectedUser(conv);
    navigate(`/chat/${conv.user_id}`);
    await fetchMessages(conv.user_id);
  };

  const formatTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading || loadingUser) {
    return (
      <div className="chat-page">
        <div className="container">
          <div className="loading-state">
            <div className="loader"></div>
            <p>Загрузка чата...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-page">
      <div className="container">
        <h1>Сообщения</h1>
        
        <div className="chat-container">
          <div className="chat-sidebar">
            <h3>Диалоги</h3>
            {conversations.length === 0 ? (
              <div className="no-conversations">
                <p>У вас пока нет диалогов</p>
                <p className="no-conversations-hint">
                  Напишите продавцу на странице товара, чтобы начать общение
                </p>
              </div>
            ) : (
              <div className="conversations-list">
                {conversations.map(conv => (
                  <div
                    key={conv.user_id}
                    className={`conversation-item ${selectedUser?.user_id === conv.user_id ? 'active' : ''}`}
                    onClick={() => handleSelectUser(conv)}
                  >
                    <div className="conversation-avatar">
                      {conv.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="conversation-info">
                      <div className="conversation-name">{conv.username}</div>
                      <div className="conversation-last-message">
                        {conv.last_message?.slice(0, 30) || 'Нет сообщений'}
                      </div>
                    </div>
                    {conv.unread && <div className="unread-badge"></div>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="chat-main">
            {selectedUser ? (
              <>
                <div className="chat-header">
                  <button 
                    onClick={() => navigate('/chat')} 
                    className="chat-back-btn"
                  >
                    ← Назад
                  </button>
                  <div className="chat-user-avatar">
                    {selectedUser.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="chat-user-info">
                    <h3>{selectedUser.username}</h3>
                  </div>
                </div>

                <div className="chat-messages">
                  {messages.length === 0 ? (
                    <div className="no-messages">
                      <p>Напишите первое сообщение</p>
                    </div>
                  ) : (
                    messages.map(msg => (
                      <div
                        key={msg.id}
                        className={`message ${msg.from_user_id === user?.id ? 'message-out' : 'message-in'}`}
                      >
                        <div className="message-bubble">
                          <p>{msg.message}</p>
                          <span className="message-time">{formatTime(msg.created_at)}</span>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="chat-input-form">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Введите сообщение..."
                    className="chat-input"
                  />
                  <button type="submit" disabled={sending} className="send-btn">
                    {sending ? '...' : 'Отправить'}
                  </button>
                </form>
              </>
            ) : (
              <div className="no-chat-selected">
                <p>Выберите диалог для начала общения</p>
                <button 
                  onClick={() => navigate('/')} 
                  className="button-primary"
                  style={{ marginTop: '16px' }}
                >
                  Перейти к покупкам
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;