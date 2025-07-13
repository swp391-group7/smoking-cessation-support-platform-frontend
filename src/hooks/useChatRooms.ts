import { useState, useEffect } from 'react';
import { ChatApi } from '../api/chatApi';
import type { ChatRoom } from '../api/typechat';

export const useChatRooms = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadChatRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const rooms = await ChatApi.getChatRooms();
      setChatRooms(rooms);
    } catch (err) {
      setError('Failed to load chat rooms');
      console.error('Error loading chat rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChatRooms();
  }, []);

  return {
    chatRooms,
    loading,
    error,
    refreshChatRooms: loadChatRooms,
  };
};