// src/api/feedbackApi.ts
import axios from 'axios';

const feedbackApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

// Gắn JWT tự động
feedbackApi.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const TargetType = {
  SYSTEM: 'SYSTEM',
  COACH: 'COACH',
} as const;

export type TargetType = typeof TargetType[keyof typeof TargetType];

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  dob: string;
  sex: string | null;
  avtarPath: string | null;
  createdAt: string;
  roleName: string;
}

export interface Coach {
  userId: string;
  bio: string;
  qualification: string;
  avgRating: number;
}

export interface Feedback {
  id: string;
  userId: string;
  targetType: TargetType;
  membershipPkgId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface FeedbackWithDetails extends Feedback {
  userInfo?: User;
  coachInfo?: Coach;
}

export interface FeedbackStats {
  coachAvgRating: number;
  systemAvgRating: number;
  totalFeedbacks: number;
  coachFeedbacks: number;
  systemFeedbacks: number;
}

/**
 * Lấy tất cả feedbacks (dành cho admin)
 */
export async function fetchAllFeedbacks(): Promise<Feedback[]> {
  const { data } = await feedbackApi.get<Feedback[]>('/feedbacks');
  return data;
}

/**
 * Lấy feedback theo ID
 */
export async function fetchFeedbackById(id: string): Promise<Feedback> {
  const { data } = await feedbackApi.get<Feedback>(`/feedbacks/${id}`);
  return data;
}

/**
 * Lấy thông tin user theo ID
 */
export async function fetchUserById(userId: string): Promise<User> {
  const { data } = await feedbackApi.get<User>(`/users/get/${userId}`);
  return data;
}

/**
 * Lấy feedback chi tiết với thông tin user
 */
export async function fetchFeedbackWithDetails(id: string): Promise<FeedbackWithDetails> {
  const feedback = await fetchFeedbackById(id);
  const feedbackWithDetails: FeedbackWithDetails = { ...feedback };

  try {
    // Lấy thông tin user
    const userInfo = await fetchUserById(feedback.userId);
    feedbackWithDetails.userInfo = userInfo;
  } catch (error) {
    console.error('Error fetching user info:', error);
  }

  return feedbackWithDetails;
}

/**
 * Lấy điểm trung bình của system
 */
export async function fetchSystemAvgRating(): Promise<number> {
  const { data } = await feedbackApi.get<number>('/feedbacks/system/avg-rating');
  return data;
}

/**
 * Tính toán thống kê feedback
 */
export async function fetchFeedbackStats(): Promise<FeedbackStats> {
  try {
    const [allFeedbacks, systemAvgRating] = await Promise.all([
      fetchAllFeedbacks(),
      fetchSystemAvgRating()
    ]);

    const coachFeedbacks = allFeedbacks.filter(f => f.targetType === 'COACH');
    const systemFeedbacks = allFeedbacks.filter(f => f.targetType === 'SYSTEM');
    
    const coachAvgRating = coachFeedbacks.length > 0 
      ? coachFeedbacks.reduce((sum, f) => sum + f.rating, 0) / coachFeedbacks.length 
      : 0;

    return {
      coachAvgRating: parseFloat(coachAvgRating.toFixed(2)),
      systemAvgRating: systemAvgRating || 0,
      totalFeedbacks: allFeedbacks.length,
      coachFeedbacks: coachFeedbacks.length,
      systemFeedbacks: systemFeedbacks.length,
    };
  } catch (error) {
    console.error('Error fetching feedback stats:', error);
    return {
      coachAvgRating: 0,
      systemAvgRating: 0,
      totalFeedbacks: 0,
      coachFeedbacks: 0,
      systemFeedbacks: 0,
    };
  }
}