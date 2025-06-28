import axios from 'axios';

// Create an axios instance for admin survey operations
export const adminSurveyApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

adminSurveyApi.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types for Survey Management
export interface CreateAnswerRequest {
  answerText: string;
  point: number;
}

export interface UpdateAnswerRequest {
  id: string;
  answerText: string;
  point: number;
}

export interface CreateQuestionRequest {
  content: string;
  answers: CreateAnswerRequest[];
}

export interface UpdateQuestionRequest {
  id: string;
  content: string;
  answers: (CreateAnswerRequest | UpdateAnswerRequest)[];
}

export interface CreateSurveyRequest {
  typeSurvey: string;
  questions: CreateQuestionRequest[];
}

export interface UpdateSurveyRequest {
  id: string;
  typeSurvey: string;
  questions: (CreateQuestionRequest | UpdateQuestionRequest)[];
}

export interface SurveyListItem {
  id: string;
  typeSurvey: string;
  createAt: string;
  questionCount: number;
}

export interface AnswerDTO {
  id: string;
  answerText: string;
  point: number;
  createAt: string;
}

export interface QuestionDTO {
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
  questions: QuestionDTO[];
}

// API Functions

/**
 * Get all surveys for admin management
 */
export async function getAllSurveys(): Promise<SurveyListItem[]> {
  const { data } = await adminSurveyApi.get<SurveyListItem[]>('/admin/surveys');
  return data;
}

/**
 * Get survey detail by ID
 */
export async function getSurveyDetail(surveyId: string): Promise<SurveyDetailDTO> {
  const { data } = await adminSurveyApi.get<SurveyDetailDTO>(`/admin/surveys/${surveyId}`);
  return data;
}

/**
 * Create a new survey
 */
export async function createSurvey(surveyData: CreateSurveyRequest): Promise<SurveyDetailDTO> {
  const { data } = await adminSurveyApi.post<SurveyDetailDTO>('/admin/surveys', surveyData);
  return data;
}

/**
 * Update an existing survey
 */
export async function updateSurvey(surveyData: UpdateSurveyRequest): Promise<SurveyDetailDTO> {
  const { data } = await adminSurveyApi.put<SurveyDetailDTO>(`/admin/surveys/${surveyData.id}`, surveyData);
  return data;
}

/**
 * Delete a survey
 */
export async function deleteSurvey(surveyId: string): Promise<void> {
  await adminSurveyApi.delete(`/admin/surveys/${surveyId}`);
}

/**
 * Delete a question from a survey
 */
export async function deleteQuestion(questionId: string): Promise<void> {
  await adminSurveyApi.delete(`/admin/questions/${questionId}`);
}

/**
 * Delete an answer from a question
 */
export async function deleteAnswer(answerId: string): Promise<void> {
  await adminSurveyApi.delete(`/admin/answers/${answerId}`);
}

export default adminSurveyApi;