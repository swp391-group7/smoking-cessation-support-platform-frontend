import { useState, useEffect, useCallback, useRef } from 'react';
import { chatApi } from '../api/chatApi';
import type { Message, ChatRoom, ChatRoomMember } from '../api/typechat';

export const useChat = (roomId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load initial messages
  const loadMessages = useCallback(async () => {
    if (!roomId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await chatApi.getAllMessages(roomId);
      setMessages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  // Poll for new messages every 5 seconds
  const startPolling = useCallback(() => {
    if (!roomId || isPolling) return;

    setIsPolling(true);
    intervalRef.current = setInterval(async () => {
      try {
        const newMessages = await chatApi.getNewestMessages(roomId);
        setMessages(prev => {
          // Merge new messages with existing ones, avoiding duplicates
          const existingIds = new Set(prev.map(msg => msg.id));
          const uniqueNewMessages = newMessages.filter(msg => !existingIds.has(msg.id));
          return [...prev, ...uniqueNewMessages].sort((a, b) => 
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        });
      } catch (err) {
        console.error('Failed to poll messages:', err);
      }
    }, 5000);
  }, [roomId, isPolling]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPolling(false);
  }, []);

  // Send message
  const sendMessage = useCallback(async (content: string) => {
    if (!roomId || !content.trim()) return;

    try {
      const newMessage = await chatApi.sendMessage(roomId, { content });
      setMessages(prev => [...prev, newMessage]);
      return newMessage;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      throw err;
    }
  }, [roomId]);

  // Start polling when component mounts and room is available
  useEffect(() => {
    if (roomId) {
      loadMessages();
      startPolling();
    }

    return () => {
      stopPolling();
    };
  }, [roomId, loadMessages, startPolling, stopPolling]);

  return {
    messages,
    loading,
    error,
    isPolling,
    sendMessage,
    loadMessages,
    startPolling,
    stopPolling,
  };
};

export const useChatRooms = () => {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRooms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await chatApi.getChatRooms();
      setRooms(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load chat rooms');
    } finally {
      setLoading(false);
    }
  }, []);

  const createRoom = useCallback(async (name: string, type: string, sender: import('./typechat').User) => {
    try {
      const newRoom = await chatApi.createChatRoom({ name, type, sender });
      setRooms(prev => [...prev, newRoom]);
      return newRoom;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create chat room');
      throw err;
    }
  }, []);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  return {
    rooms,
    loading,
    error,
    loadRooms,
    createRoom,
  };
};

export const useChatMembers = (roomId: string | null) => {
  const [members, setMembers] = useState<ChatRoomMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMembers = useCallback(async () => {
    if (!roomId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await chatApi.getRoomMembers(roomId);
      setMembers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load members');
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  const addMember = useCallback(async (userId: string) => {
    if (!roomId) return;

    try {
      const newMember = await chatApi.addMemberToRoom(roomId, userId);
      setMembers(prev => [...prev, newMember]);
      return newMember;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add member');
      throw err;
    }
  }, [roomId]);

  const removeMember = useCallback(async (userId: string) => {
    if (!roomId) return;

    try {
      await chatApi.removeMemberFromRoom(roomId, userId);
      setMembers(prev => prev.filter(member => member.user.id !== userId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove member');
      throw err;
    }
  }, [roomId]);

  useEffect(() => {
    if (roomId) {
      loadMembers();
    }
  }, [roomId, loadMembers]);

  return {
    members,
    loading,
    error,
    loadMembers,
    addMember,
    removeMember,
  };
};