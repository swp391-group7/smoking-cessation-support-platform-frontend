import axios from 'axios';

// Create an axios instance similar to blogApi, with automatic JWT attachment
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

// DTO returned from backend for answers
export interface AnswerDTO {
  id: string;
  answerText: string;
  point: number;
  createAt: string;
}

// DTO returned from backend for questions with answers
export interface QuestionWithAnswersDTO {
  id: string;
  content: string;
  createAt: string;
  answers: AnswerDTO[];
}

// DTO returned from backend for survey details
export interface SurveyDetailDTO {
  id: string;
  userId: string;
  typeSurvey: string;
  createAt: string;
  questions: QuestionWithAnswersDTO[];
}

// Request DTO for creating a new survey (matches API schema)
export interface CreateSurveyRequest {
  smokeDuration: string;
  cigarettesPerDay: number;
  priceEach: number;
  triedToQuit: boolean;
  healthStatus: string;
  a1: string; // Answer text for question 1
  a2: string; // Answer text for question 2
  a3: string; // Answer text for question 3
  a4: string; // Answer text for question 4
  a5: string; // Answer text for question 5
  a6: string; // Answer text for question 6
  a7: string; // Answer text for question 7
  a8: string; // Answer text for question 8
  dependencyLevel: number;
  note: string;
}
export interface GetSurveyRequest {
  smokeDuration: string;
  cigarettesPerDay: number;
  priceEach: number;
  triedToQuit: boolean;
  healthStatus: string;
  a1: string; // Answer text for question 1
  a2: string; // Answer text for question 2
  a3: string; // Answer text for question 3
  a4: string; // Answer text for question 4
  a5: string; // Answer text for question 5
  a6: string; // Answer text for question 6
  a7: string; // Answer text for question 7
  a8: string; // Answer text for question 8
  dependencyLevel: number;
  note: string;
}



export async function getSurveyByUserId(): Promise<GetSurveyRequest> {
  const { data } = await usersurveyApi.get<GetSurveyRequest>(
    `/user-surveys/get-first-survey`
  );
  return data;
}

export interface UserSurveyDto {
  id: string;
  userId: string;
  smokeDuration: string;
  cigarettesPerDay: number;
  priceEach: number;
  triedToQuit: boolean;
  healthStatus: string;
  a1: string;
  a2: string;
  a3: string;
  a4: string;
  a5: string;
  a6: string;
  a7: string;
  a8: string;
  dependencyLevel: number;
  note: string;
  createAt: string; // ISO 8601 format
}

/** Lấy tất cả khảo sát của một người dùng theo ID */
export async function getAllSurveysOfUser(userId: string): Promise<UserSurveyDto[]> {
    const { data } = await usersurveyApi.get<UserSurveyDto[]>(
        `/user-surveys/get-all-surveys-of-user/${userId}`
    );
    return data;
}

/**
 * Fetches survey details (questions + answers) by surveyId.
 */
export async function getSurveyDetailById(
  surveyId: string
): Promise<SurveyDetailDTO> {
  const { data } = await usersurveyApi.get<SurveyDetailDTO>(
    `/surveys/${surveyId}/detail`
  );
  return data;
}

/**
 * Creates a new smoke survey.
 * @param surveyData The data for the new survey.
 */
export async function createSurvey(
  surveyData: CreateSurveyRequest
): Promise<CreateSurveyRequest> { // Changed from 'any' to 'SurveyDetailDTO'
  const { data } = await usersurveyApi.post<CreateSurveyRequest>(
    '/user-surveys/create-survey',
    surveyData
  );
  return data;
}

export default usersurveyApi;
