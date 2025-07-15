import { useState, useEffect, useCallback } from 'react';
import { ChatApi } from '../api/chatApi';
import type { Message } from '../api/typechat';

export const useChat = (roomId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMessages = useCallback(async () => {
    if (!roomId) return;
    
    try {
      setLoading(true);
      setError(null);
      const newMessages = await ChatApi.getMessages(roomId);
      setMessages(newMessages);
    } catch (err) {
      setError('Failed to load messages');
      console.error('Error loading messages:', err);
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  const sendMessage = useCallback(async (content: string) => {
    if (!roomId) return;
    
    try {
      setError(null);
      const newMessage = await ChatApi.sendMessage(roomId, { content });
      setMessages(prev => [...prev, newMessage]);
    } catch (err) {
      setError('Failed to send message');
      console.error('Error sending message:', err);
    }
  }, [roomId]);

  // Auto-refresh messages every 5 seconds
  useEffect(() => {
    if (!roomId) return;

    loadMessages();
    const interval = setInterval(loadMessages, 5000);
    
    return () => clearInterval(interval);
  }, [roomId, loadMessages]);

  return {
    messages,
    loading,
    error,
    sendMessage,
    refreshMessages: loadMessages,
  };
};
