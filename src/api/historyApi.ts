
import baseApi from './BaseApi';
const api =baseApi;

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