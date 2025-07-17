
import baseApi from './BaseApi';
const userPlanApi =baseApi;


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
export async function createDefaultStep1(planId: string): Promise<GeneratedStep> {
  const { data } = await userPlanApi.post<GeneratedStep>(
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
// --- add these interfaces at the top of the file ---
export interface GeneratedStep {
  id: string;
  quitPlanId: string;
  stepNumber: number;
  stepStartDate: string;
  stepEndDate: string;
  targetCigarettesPerDay: number;
  stepDescription: string;
  status: string;
  createAt: string;
}

export interface GeneratedPlan {
  id: string;
  userId: string;
  userSurveyId: string; // ID của survey đã dùng để tạo plan
  startDate: string;
  targetDate: string;
  method: string;
  status: string;
  currentZeroStreak: number;
  maxZeroStreak: number;
  createAt: string;
  steps: GeneratedStep[];
}

// --- add this function alongside your other exports ---
/**
 * Generate a sample (draft) quit plan + steps for the current member
 */
export async function generateSamplePlan(): Promise<GeneratedPlan> {
  const { data } = await userPlanApi.post<GeneratedPlan>(
    '/quit-plans/generate-from-survey'
  );
  return data;
}


export interface QuitPlanDto {
  id: string;
  userId: string;
  userSurveyId: string;
  startDate: string;           // e.g. "2025-07-17"
  method: string;              // e.g. "GRADUAL" | "IMMEDIATE"
  targetDate: string;          // e.g. "2025-07-17"
  createAt: string;            // ISO timestamp
  status: string;              // e.g. "draft" | "active" | "completed"
  updatedAt: string;           // ISO timestamp
  currentZeroStreak: number;
  maxZeroStreak: number;
}

/**
 * Fetch all quit‑plans for a given user
 * GET /quit-plans/users/{userId}/plans
 */
export const getPlansByUser = async (
  userId: string
): Promise<QuitPlanDto[]> => {
  const response = await userPlanApi.get<QuitPlanDto[]>(
    `/quit-plans/users/${userId}/plans`
  );
  return response.data;
};