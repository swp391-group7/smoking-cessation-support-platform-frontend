// src/api/usersurveyApi.ts
import axios from 'axios';

// Tạo instance axios giống blogApi, gắn JWT tự động
export const usersurveyApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

usersurveyApi.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// DTO trả về từ backend
export interface AnswerDTO {
  id: string;
  answerText: string;
  point: number;
  createAt: string;
}

export interface QuestionWithAnswersDTO {
  id: string;
  content: string;
  createAt: string;
  answers: AnswerDTO[];
}

export interface SurveyDetailDTO {
  id: string;
  userId: string;
  typeSurvey: string;
  createAt: string;
  questions: QuestionWithAnswersDTO[];
}

/**
 * Lấy chi tiết survey (câu hỏi + đáp án) theo surveyId
 */
export async function getSurveyDetailById(
  surveyId: string
): Promise<SurveyDetailDTO> {
  const { data } = await usersurveyApi.get<SurveyDetailDTO>(
    `/surveys/${surveyId}/detail`
  );
  return data;
}

export default usersurveyApi;
