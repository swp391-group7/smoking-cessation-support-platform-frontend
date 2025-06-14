// src/api/logApi.ts

import api from './auth';

// Type dữ liệu LogEntry (tiến trình cai thuốc)
export interface LogEntry {
  id: string;
  logDate: string;
  cigarettesSmoked: number;
  mood: string;
  note: string;
  status: string;
  // có thể thêm plan, user nếu bạn cần mapping đầy đủ
}

// Lấy toàn bộ log
export async function getAllLogs(): Promise<LogEntry[]> {
  const response = await api.get<LogEntry[]>("/logs/display-all-logs");
  return response.data;
}

// Lấy log theo userId
export async function getLogsByUser(userId: string): Promise<LogEntry[]> {
  const response = await api.get<LogEntry[]>(`/logs/user/${userId}/display-logs-by-user`);
  return response.data;
}

// Lấy log theo userId + date
export async function getLogByUserAndDate(userId: string, date: string): Promise<LogEntry> {
  const response = await api.get<LogEntry>(`/logs/user/${userId}/date/${date}/display-log-by-user-and-date`);
  return response.data;
}

// Tạo mới log
export async function createLog(data: Omit<LogEntry, 'id'>): Promise<LogEntry> {
  const response = await api.post<LogEntry>("/logs/create-log", data);
  return response.data;
}

// Xoá log theo id
export async function deleteLogById(id: string): Promise<void> {
  await api.delete(`/logs/${id}/delete-log-by-id`);
}