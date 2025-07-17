import baseApi from './BaseApi';

const api = baseApi;
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