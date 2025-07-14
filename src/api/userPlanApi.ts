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

export interface UserPlan {
  id: string;
  userId: string;
  startDate: string;
  method: string;
  targetDate: string;
  createAt: string;
  status: string;
  updatedAt: string;
}

export interface PlanStep {
  id: string;
  planId: string;
  stepNumber: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  targetCigarettes: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateStepData {
  stepStartDate: string;
  stepEndDate: string;
  targetCigarettesPerDay: number;
  stepDescription: string;
  status: string;
}

export interface UpdateLatestDraftPlanData {
  targetDate: string;
}

export async function updateLatestDraftPlan(planData: UpdateLatestDraftPlanData): Promise<UserPlan> {
  const { data } = await userPlanApi.put<UserPlan>(
    '/quit-plans/update-latest-draft',
    planData
  );
  return data;
}

export async function createImmediatePlan(): Promise<UserPlan> {
  const { data } = await userPlanApi.post<UserPlan>(
    '/quit-plans/create-immediate-plan'
  );
  return data;
}

export async function createDraftPlan(): Promise<UserPlan> {
  const { data } = await userPlanApi.post<UserPlan>(
    '/quit-plans/create-draft-plan'
  );
  return data;
}

export async function deleteDraftPlan(): Promise<void> {
  await userPlanApi.delete(`/quit-plans/delete-all-drafts`);
}

export async function createDefaultStep(planId: string): Promise<PlanStep> {
  const { data } = await userPlanApi.post<PlanStep>(
    `/quit-plan_step/${planId}/create-default`
  );
  return data;
}

export async function deleteDraftSteps(planId: string): Promise<void> {
  await userPlanApi.delete(`/quit-plan_step/${planId}/delete-drafts`);
}

export async function deleteStepByNumber(planId: string, stepNumber: number): Promise<void> {
  await userPlanApi.delete(`/quit-plan_step/${planId}/delete-by-number/${stepNumber}`);
}

export async function updateStepByNumber(
  planId: string,
  stepNumber: number,
  stepData: UpdateStepData
): Promise<PlanStep> {
  const { data } = await userPlanApi.put<PlanStep>(
    `/quit-plan_step/${planId}/update-by-number/${stepNumber}`,
    stepData
  );
  return data;
}

/**
 * Lấy danh sách tất cả kế hoạch của người dùng
 */
export async function getUserPlans(): Promise<UserPlan[]> {
  // gọi đúng endpoint /quit-plans/active
  const { data } = await userPlanApi.get<UserPlan[]>('/quit-plans/active');
  return data;
}

/** Lấy kế hoạch cai thuốc đang hoạt động của một người dùng theo ID */
export async function getActivePlanOfAnUser(userId: string): Promise<UserPlan | null> {
    const { data } = await userPlanApi.get<UserPlan | null>(
        `/quit-plans/active-plan-of-an-user/${userId}`
    );
    return data;
}