// src/api/userPlanApi.ts
import axios from 'axios';

const userPlanApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

// Gắn JWT tự động cho mọi request
userPlanApi.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Mô tả UserPlan trả về từ server
 */
export interface UserPlan {
  id: string;
  userId: string;
  startDate: string;      // Ngày bắt đầu (ISO date, ví dụ "2025-06-26")
  method: string;         // Phương pháp (ví dụ "Cold Turkey" hoặc "Gradual Reduction")
  targetDate: string;     // Ngày mục tiêu (ISO date)
  createAt: string;       // Thời gian tạo (ISO datetime)
  status: string;         // Trạng thái kế hoạch
  updatedAt: string;      // Thời gian cập nhật (ISO datetime)
}

/**
 * Tạo ngay lập tức một Quit Plan (Cold Turkey)
 * POST /quit-plans/create-immediate-plan
 * @returns Promise<UserPlan> — thông tin kế hoạch vừa tạo
 */
export async function createImmediatePlan(): Promise<UserPlan> {
  const { data } = await userPlanApi.post<UserPlan>(
    '/quit-plans/create-immediate-plan'
  );
  return data;
}

/**
 * Tạo một Quit Plan ở dạng nháp (Gradual Reduction)
 * POST /quit-plans/create-draft-plan
 * @returns Promise<UserPlan> — thông tin kế hoạch vừa tạo
 */
export async function createDraftPlan(): Promise<UserPlan> {
  const { data } = await userPlanApi.post<UserPlan>(
    '/quit-plans/create-draft-plan'
  );
  return data;
}

export async function deleteDraftPlan(): Promise<void> {
  await userPlanApi.delete(`/quit-plans/delete-all-drafts`);
} 
