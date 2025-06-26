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
 * Mô tả PlanStep trả về từ server
 */
export interface PlanStep {
  id: string;
  planId: string;
  stepNumber: number;
  title: string;
  description: string;
  startDate: string;      // ISO date
  endDate: string;        // ISO date
  targetCigarettes: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Dữ liệu để update step
 */
export interface UpdateStepData {
  stepStartDate: string;           // ISO date, ví dụ "2025-06-26"
  stepEndDate: string;             // ISO date
  targetCigarettesPerDay: number;  // số điếu/ngày
  stepDescription: string;
  status: string;
  // không cần gửi stepNumber ở body nếu đã có trong đường dẫn URL
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

/**
 * Xóa tất cả draft plans
 * DELETE /quit-plans/delete-all-drafts
 */
export async function deleteDraftPlan(): Promise<void> {
  await userPlanApi.delete(`/quit-plans/delete-all-drafts`);
}

/**
 * Tạo step mặc định cho plan
 * POST /quit-plan-step/{planId}/create-default
 * @param planId - ID của plan
 * @returns Promise<PlanStep> — thông tin step vừa tạo
 */
export async function createDefaultStep(planId: string): Promise<PlanStep> {
  const { data } = await userPlanApi.post<PlanStep>(
    `/quit-plan_step/${planId}/create-default`
  );
  return data;
}

/**
 * Xóa tất cả draft steps của plan
 * DELETE /quit-plan-step/{planId}/delete-drafts
 * @param planId - ID của plan
 */
export async function deleteDraftSteps(planId: string): Promise<void> {
  await userPlanApi.delete(`/quit-plan_step/${planId}/delete-drafts`);
}

/**
 * Xóa step theo số thứ tự
 * DELETE /quit-plan-step/{planId}/delete-by-number/{stepNumber}
 * @param planId - ID của plan
 * @param stepNumber - Số thứ tự của step
 */
export async function deleteStepByNumber(planId: string, stepNumber: number): Promise<void> {
  await userPlanApi.delete(`/quit-plan_step/${planId}/delete-by-number/${stepNumber}`);
}

/**
 * Cập nhật step theo số thứ tự
 * PUT /quit-plan-step/{planId}/update-by-number/{stepNumber}
 * @param planId - ID của plan
 * @param stepNumber - Số thứ tự của step
 * @param stepData - Dữ liệu step cần cập nhật
 * @returns Promise<PlanStep> — thông tin step đã cập nhật
 */
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