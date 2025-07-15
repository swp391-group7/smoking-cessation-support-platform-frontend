
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
    
    // --- Interface cho Badge ---
export interface BadgeDto {
  id: string;
  badgeName: string;
  badgeDescription: string;
  badgeImageUrl: string;
  condition: number;
}
export interface CreateCheckinResponse {
  progress: DailyCheckinDto;
  newBadges: BadgeDto[];
}

// --- Gọi API POST /cessation-progress/create ---
export const createDailyCheckin = async (
  payload: CreateDailyCheckinRequest
): Promise<CreateCheckinResponse> => {
  const response = await api.post<CreateCheckinResponse>(
    '/cessation-progress/create',
    payload
  );
  return response.data;
};