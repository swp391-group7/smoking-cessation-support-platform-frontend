// File: src/services/chatApi.ts
// File: src/services/chatApi.ts
import type { Message, ChatRoom, ChatRoomMember, SendMessageRequest, CreateChatRoomRequest } from '../api/typechat';

const API_BASE_URL = 'http://localhost:8080';

export class ChatApi {
  // Message endpoints
  static async sendMessage(roomId: string, request: SendMessageRequest): Promise<Message> {
    const response = await fetch(`${API_BASE_URL}/messages/sendMessage/${roomId}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send message');
    }
    
    return response.json();
  }

  static async getNewestMessages(roomId: string): Promise<Message[]> {
    const response = await fetch(`${API_BASE_URL}/messages/room/${roomId}/newest`, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get newest messages');
    }
    
    return response.json();
  }

  static async getMessages(roomId: string): Promise<Message[]> {
    const response = await fetch(`${API_BASE_URL}/messages/room/${roomId}/getMessages`, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get messages');
    }
    
    return response.json();
  }

  // Chat room endpoints
  static async getChatRooms(): Promise<ChatRoom[]> {
    const response = await fetch(`${API_BASE_URL}/chatrooms`, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get chat rooms');
    }
    
    return response.json();
  }

  static async createChatRoom(request: CreateChatRoomRequest): Promise<ChatRoom> {
    const response = await fetch(`${API_BASE_URL}/chatrooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create chat room');
    }
    
    return response.json();
  }

  static async getChatRoom(id: string): Promise<ChatRoom> {
    const response = await fetch(`${API_BASE_URL}/chatrooms/${id}`, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get chat room');
    }
    
    return response.json();
  }

  // Chat room member endpoints
  static async addMember(roomId: string, userId: string): Promise<ChatRoomMember> {
    const response = await fetch(`${API_BASE_URL}/chatroom-members/add?roomId=${roomId}&userId=${userId}`, {
      method: 'POST',
      headers: {
        'Accept': '*/*',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to add member');
    }
    
    return response.json();
  }

  static async getRoomMembers(roomId: string): Promise<ChatRoomMember[]> {
    const response = await fetch(`${API_BASE_URL}/chatroom-members/room/${roomId}`, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get room members');
    }
    
    return response.json();
  }

  static async removeMember(roomId: string, userId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/chatroom-members/remove?roomId=${roomId}&userId=${userId}`, {
      method: 'DELETE',
      headers: {
        'Accept': '*/*',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to remove member');
    }
  }
}
