// types/chat.ts
export interface Role {
  id: string;
  role: string;
}

export interface User {
  id: string;
  role: Role;
  username: string;
  password: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  dob: string;
  avtarPath: string;
  providerId: string;
  createdAt: string;
  preStatus: boolean;
}

export interface ChatRoom {
  id: string;
  name: string;
  type: string;
  createAt: string;
}

export interface Message {
  id: string;
  chatRoomId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export interface ChatRoomMember {
  id: string;
  chatRoom: ChatRoom;
  user: User;
  joinedAt: string;
}

export interface CreateChatRoomRequest {
  sender: User;
  name: string;
  type: string;
}

export interface SendMessageRequest {
  content: string;
}

export type UserRole = 'admin' | 'coach' | 'user';

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  path: string;
}