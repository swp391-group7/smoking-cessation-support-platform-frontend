
import baseApi from './BaseApi';
const api =baseApi;

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

export interface CessationProgressDto {
  id: string;
  planId: string;
  planStepId: string;
  status: 'COMPLETED' | 'MISSED' | string;
  mood: string;
  cigarettesSmoked: number;
  note: string;
  logDate: string;   // ISO date, e.g. "2025-07-17"
}

/**
 * Fetch all cessation‑progress records for a given plan‑step
 * GET /cessation-progress/by-step-id/{planStepId}
 */
export const getProgressByStepId = async (
  planStepId: string
): Promise<CessationProgressDto[]> => {
  const response = await api.get<CessationProgressDto[]>(
    `/cessation-progress/by-step-id/${planStepId}`
  );
  return response.data;
};