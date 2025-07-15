
// src/api/blogApi.ts
import axios from 'axios';

const coachApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

// Gắn JWT tự động, giống auth.ts
coachApi.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface CoachDto  {
    userId : string ;
    bio : string;
    qualification : string;
    avgRating : number;
}
export interface UpdateMemberShipPackageRequest {
  coachId: string;
}

export interface UserDto {
  id: string;
  username: string;
  password: string;
  email: string;
  providerId: string | null;
  fullName: string;
  phoneNumber: string;
  dob: string;          // ISO date, e.g. "2025-06-22"
  avtarPath: string;
  preStatus: string | null;
  createdAt: string;    // ISO timestamp
  roleName: string;
}

export async function fetchAllCoaches(): Promise<CoachDto[]> {
  const { data } = await coachApi.get<CoachDto[]>('/coaches/all');
  return data;
}

export async function assignCoach(coachId: string) {
  const { data } = await coachApi.put('/membership-packages/active/assign-coach', { coachId });
  return data;
}
export async function fetchUserById(userId: string): Promise<UserDto> {
  const { data } = await coachApi.get<UserDto>(`/users/get/${userId}`);
  return data;
}