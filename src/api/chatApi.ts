// api/chatApi.ts
// api/chatApi.ts
import type {
    ChatRoom,
    Message,
    ChatRoomMember,
    CreateChatRoomRequest,
    SendMessageRequest,
    ApiError
} from '../api/typechat';

const BASE_URL = 'http://localhost:8080';

class ChatApi {
  private async request<T>(
    url: string, 
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const token = localStorage.getItem('authToken');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      };

      const response = await fetch(`${BASE_URL}${url}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(`API Error: ${errorData.error} (${errorData.status})`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Chat Room APIs
  async getChatRooms(): Promise<ChatRoom[]> {
    return this.request<ChatRoom[]>('/chatrooms');
  }

  async createChatRoom(data: CreateChatRoomRequest): Promise<ChatRoom> {
    return this.request<ChatRoom>('/chatrooms', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getChatRoomById(id: string): Promise<ChatRoom> {
    return this.request<ChatRoom>(`/chatrooms/${id}`);
  }

  // Chat Room Member APIs
  async addMemberToRoom(roomId: string, userId: string): Promise<ChatRoomMember> {
    return this.request<ChatRoomMember>(`/chatroom-members/add?roomId=${roomId}&userId=${userId}`, {
      method: 'POST',
    });
  }

  async getRoomMembers(roomId: string): Promise<ChatRoomMember[]> {
    return this.request<ChatRoomMember[]>(`/chatroom-members/room/${roomId}`);
  }

  async removeMemberFromRoom(roomId: string, userId: string): Promise<void> {
    return this.request<void>(`/chatroom-members/remove?roomId=${roomId}&userId=${userId}`, {
      method: 'DELETE',
    });
  }

  // Message APIs
  async sendMessage(roomId: string, data: SendMessageRequest): Promise<Message> {
    return this.request<Message>(`/messages/sendMessage/${roomId}/send`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getNewestMessages(roomId: string): Promise<Message[]> {
    return this.request<Message[]>(`/messages/room/${roomId}/newest`);
  }

  async getAllMessages(roomId: string): Promise<Message[]> {
    return this.request<Message[]>(`/messages/room/${roomId}/getMessages`);
  }
}

export const chatApi = new ChatApi();
