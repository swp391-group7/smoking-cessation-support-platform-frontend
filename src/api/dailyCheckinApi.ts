
import axios from 'axios';

//tạo instance của axios 
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  headers: {
    'Content-Type': 'application/json',
  },
});

// tự động gắn jwt lên header 
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export interface CreateDailyCheckinRequest {
  planId: string;
  planStepId: string;
  status: string;
  mood: string;
  cigarettesSmoked: number;
  note?: string;
}

export interface DailyCheckinDto {
    id: string;
    planId: string;
    planStepId: string; // định dạng YYYY-MM-DD
    status: string; // "COMPLETED", "MISSED"
    mood: string; // ISO timestamp
    cigarettesSmoked: number;
    note : string;
    }
    
// 1. Create a new check-in (POST /cessation-progress/create)
export const createDailyCheckin = async (
  payload: CreateDailyCheckinRequest
): Promise<DailyCheckinDto> => {
  const response = await api.post<DailyCheckinDto>('/cessation-progress/create', payload);
  return response.data;
};