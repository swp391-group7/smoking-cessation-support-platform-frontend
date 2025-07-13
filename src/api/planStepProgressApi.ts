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

export interface QuitPlanStepDto {
    id: string;
    quitPlanId: string;
    stepNumber: number;
    stepStartDate: string; // định dạng YYYY-MM-DD
    stepEndDate: string; // định dạng YYYY-MM-DD
    targetCigarettesPerDay: number;
    stepDescription: string;
    status: string; // "ACTIVE", "COMPLETED", "SKIPPED"
    createAt: string; // ISO timestamp
}
export const getPlanSteps = async (planId: string): Promise<QuitPlanStepDto[]> => {
  const response = await api.get<QuitPlanStepDto[]>(`/quit-plan_step/${planId}/all`);
  return response.data;
}