// src/api/progressApi.ts

import axios from 'axios';
const userPlanApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

// Gắn JWT tự động cho mọi request
userPlanApi.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface ProgressNotification {
  /** Unique identifier of the notification */
  id: string;
  /** Identifier of the related plan */
  planId: string;
  /** The notification message content */
  message: string;
  /** Channel through which the notification was sent */
  channel: string;
  /** Type/category of the notification */
  type: string;
  /** ISO‑formatted timestamp when the notification was sent */
  sentAt: string; 
  /** User ID of the sender */
  senderId: string;
  /** User ID of the recipient */
  recipientId: string;
  /** Whether the notification has been read */
  isRead: boolean;
}
export interface CreateNotificationRequest {
  /** Nội dung tin nhắn */
  message: string;
  /** Kênh gửi (vd. "push", "email", …) */
  channel: string;
  /** Loại notification (vd. "chat", "remind", …) */
  type: string;
}


export async function fetchProgressNotifications(type: string): Promise<ProgressNotification[]> {
  const { data } = await userPlanApi.get<ProgressNotification[]>(
    `/progress-notifications/type/${type}`
  );
  return data;
}
/**
 * Lấy tất cả các remind mà coach đã gửi
 * @param coachId UUID của coach
 */
export async function fetchCoachReminds(coachId: string): Promise<ProgressNotification[]> {
  const { data } = await userPlanApi.get<ProgressNotification[]>(
    `/progress-notifications/coach/${coachId}/reminds`
  );
  return data;
}


/**
 * User chat: user gửi chat trong context của 1 plan
 * POST /progress-notifications/{planId}/user-chat
 */
export async function postUserChat(
  planId: string,
  body: CreateNotificationRequest
): Promise<ProgressNotification> {
  const { data } = await userPlanApi.post<ProgressNotification>(
    `/progress-notifications/${planId}/user-chat`,
    body
  );
  return data;
}

/**
 * Coach notify: coach gửi remind hoặc chat cho user
 * POST /progress-notifications/{planId}/coach-notify
 */
export async function postCoachNotify(
  planId: string,
  body: CreateNotificationRequest
): Promise<ProgressNotification> {
  const { data } = await userPlanApi.post<ProgressNotification>(
    `/progress-notifications/${planId}/coach-notify`,
    body
  );
  return data;
}