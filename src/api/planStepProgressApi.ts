
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