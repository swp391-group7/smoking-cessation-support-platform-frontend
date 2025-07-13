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

export interface DailyCheckinDto {
    id: string;
    planId: string;
    planStepId: string; // định dạng YYYY-MM-DD
    status: string; // "COMPLETED", "MISSED"
    mood: string; // ISO timestamp
    cigarettesSmoked: number;
    note : string;
    logDate: string; // Ngày tạo bản ghi, định dạng YYYY-MM-DD
    }

export const getDailyCheckinsByPlanId = async (planId: string): Promise<DailyCheckinDto[]> => {
  const response = await api.get<DailyCheckinDto[]>(`/cessation-progress/plan/${planId}/all`);
  return response.data;
}