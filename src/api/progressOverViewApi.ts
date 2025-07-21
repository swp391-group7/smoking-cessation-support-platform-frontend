
import baseApi from './BaseApi';
const api =baseApi;


// types/QuitPlanDto.ts
export interface QuitPlanDto {
  id: string;
  userId: string;
  userSurveyId: string; // optional, if not applicable
  startDate: string; // định dạng YYYY-MM-DD
  method: string;
  targetDate: string;
  createAt: string;  // ISO timestamp
  status: string;
  updatedAt: string; // ISO timestamp
  currentZeroStreak: number;
  maxZeroStreak: number;
}
// Hàm gọi API lấy Quit Plan đang hoạt động của người dùng
export const getActiveQuitPlan = async (): Promise<QuitPlanDto> => {
  const response = await api.get<QuitPlanDto>(`/quit-plans/active`);
  return response.data;
};

// Hàm gọi API đếm số ngày có bản ghi progress duy nhất
export const countUniqueProgressDays = async (planId: string): Promise<number> => {
  const response = await api.get<number>(`/cessation-progress/statistics/unique-days/${planId}`);
  return response.data;
};

//  API: Tổng số điếu thuốc đã tránh
export const getAvoidedCigarettes = async (planId: string): Promise<number> => {
  const response = await api.get<number>(`/cessation-progress/statistics/avoided/${planId}`);
  return response.data;
};

//  API: Số tiền tiết kiệm được
export const getMoneySaved = async (planId: string): Promise<number> => {
  const response = await api.get<number>(`/cessation-progress/statistics/money-saved/${planId}`);
  return response.data;
};
export const getCurrentZeroStreak = async (): Promise<number> => {
  const response = await api.get<number>(`/quit-plans/active/current-zero-streak`);
  return response.data;
}; 