import api from './auth';
import type { UserSurvey } from './usersurvey';

// Tạo survey mới
export async function createSurvey(data: Omit<UserSurvey, 'user_id' | 'create_at'>): Promise<UserSurvey> {
  const response = await api.post<UserSurvey>("/surveys/create-survey", data);
  return response.data;
}

// Lấy survey
export async function getSurvey(): Promise<UserSurvey> {
  const response = await api.get<UserSurvey>("/surveys/get-survey");
  return response.data;
}

// Cập nhật survey
export async function updateSurvey(data: Partial<UserSurvey>): Promise<UserSurvey> {
  const response = await api.put<UserSurvey>("/surveys/update-survey", data);
  return response.data;
}

// Xoá survey
export async function deleteSurvey(): Promise<void> {
  await api.delete("/surveys/delete-survey");
}