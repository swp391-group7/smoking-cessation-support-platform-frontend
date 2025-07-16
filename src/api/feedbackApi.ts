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
 * Lấy thông tin user theo ID
 */
export async function fetchUserById(userId: string): Promise<User> {
  const { data } = await feedbackApi.get<User>(`/users/get/${userId}`);
  return data;
}

/**
 * Lấy thông tin coach theo ID
 */
export async function fetchCoachById(coachId: string): Promise<Coach> {
  const { data } = await feedbackApi.get<Coach>(`/coaches/${coachId}`);
  return data;
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
 * Lấy feedback chi tiết với thông tin user và coach
 */
export async function fetchFeedbackWithDetails(id: string): Promise<FeedbackWithDetails> {
  const feedback = await fetchFeedbackById(id);
  const feedbackWithDetails: FeedbackWithDetails = { ...feedback };

  try {
    // Lấy thông tin user
    const userInfo = await fetchUserById(feedback.userId);
    feedbackWithDetails.userInfo = userInfo;

    // Nếu là feedback cho coach, lấy thông tin coach từ membershipPkgId
    // Giả sử membershipPkgId chứa thông tin về coach hoặc có cách khác để lấy coachId
    if (feedback.targetType === 'COACH') {
      try {
        // Tạm thời sử dụng membershipPkgId làm coachId
        // Bạn có thể cần điều chỉnh logic này dựa trên cấu trúc dữ liệu thực tế
        const coachInfo = await fetchCoachById(feedback.membershipPkgId);
        feedbackWithDetails.coachInfo = coachInfo;
      } catch (error) {
        console.error('Error fetching coach info:', error);
      }
    }
  } catch (error) {
    console.error('Error fetching additional info:', error);
  }

  return feedbackWithDetails;
}

/**
 * Lấy feedbacks theo target type (SYSTEM hoặc COACH)
 */
export async function fetchFeedbacksByType(type: TargetType): Promise<Feedback[]> {
  const { data } = await feedbackApi.get<Feedback[]>(`/feedbacks/target/${type}`);
  return data;
}

/**
 * Lấy feedbacks cho một coach cụ thể
 */
export async function fetchFeedbacksByCoachId(coachId: string): Promise<Feedback[]> {
  const { data } = await feedbackApi.get<Feedback[]>(`/feedbacks/coach/${coachId}`);
  return data;
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