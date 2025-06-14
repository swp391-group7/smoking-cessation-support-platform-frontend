// src/api/quitPlanApi.ts

import api from './auth';

// Type dữ liệu QuitPlan
export interface QuitPlan {
  id: string;
  startDate: string;
  targetDate: string;
  method: string;
  status: string;
  smokeSurveyId: string;
  userId: string;
  coachId: string;
  createAt: string;
}

// Lấy tất cả kế hoạch cai thuốc
export async function getAllPlans(): Promise<QuitPlan[]> {
  const response = await api.get<QuitPlan[]>("/quit-plans/display-all-plans");
  return response.data;
}

// Lấy kế hoạch theo ID
export async function getPlanById(id: string): Promise<QuitPlan> {
  const response = await api.get<QuitPlan>(`/quit-plans/${id}/search-plan-by-id`);
  return response.data;
}

// Tìm kiếm kế hoạch
export async function searchPlans(method?: string, status?: string): Promise<QuitPlan[]> {
  const params: Record<string, string> = {};
  if (method) params.method = method;
  if (status) params.status = status;

  const response = await api.get<QuitPlan[]>("/quit-plans/search", { params });
  return response.data;
}

// Tạo mới kế hoạch
export async function createPlan(data: Omit<QuitPlan, 'id' | 'userId' | 'coachId' | 'createAt' | 'smokeSurveyId'>): Promise<QuitPlan> {
  const response = await api.post<QuitPlan>("/quit-plans/create-plan", data);
  return response.data;
}

// Cập nhật kế hoạch
export async function updatePlan(id: string, data: Partial<QuitPlan>): Promise<QuitPlan> {
  const response = await api.put<QuitPlan>(`/quit-plans/${id}/edit-plan`, data);
  return response.data;
}

// Xoá kế hoạch
export async function deletePlan(id: string): Promise<void> {
  await api.delete(`/quit-plans/${id}/delete-plan`);
}