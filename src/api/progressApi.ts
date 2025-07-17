

import { userApi } from './userApi'; 
import type { UserInfo } from './userApi'; 
import type { UserPlan } from './userPlanApi'; 

// Interface cho đối tượng Role lồng bên trong User
export interface RoleDTO {
    id: string;
    role: string; 
}

// Interface cho đối tượng User lồng bên trong Log
export interface UserInLogDTO extends Omit<UserInfo, 'roleName'> {
    role: RoleDTO; 
    username: string; 
    password?: string; 
    providerId?: string; 
    preStatus?: boolean; 
}

// Interface cho đối tượng Plan lồng bên trong Log
export interface PlanInLogDTO extends Omit<UserPlan, 'userId'> {
    id: string;
    user: UserInLogDTO; 
}

// Interface cho một Log tiến trình cai thuốc
export interface QuitProgressLog {
    id: string;
    plan: PlanInLogDTO; 
    user: UserInLogDTO; 
    logDate: string; 
    cigarettesSmoked: number; 
    note: string; 
    mood: string;
    status: string; 
}

// Request DTO for creating a new log
export interface CreateProgressLogRequest {
    logDate: string;
    cigarettesSmoked: number;
    note: string;
    mood: string;
    status: string;
}

/**
 * Tạo một log tiến trình cai thuốc mới.
 * POST /logs/create-log
 */
export async function createProgressLog(payload: CreateProgressLogRequest): Promise<QuitProgressLog> {
    const { data } = await userApi.post<QuitProgressLog>('/logs/create-log', payload);
    return data;
}

/**
 * Lấy tất cả các log tiến trình cai thuốc của một người dùng theo ID.
 * GET /logs/user/{userId}/display-logs-by-user
 */
export async function getProgressLogsByUser(userId: string): Promise<QuitProgressLog[]> {
    const { data } = await userApi.get<QuitProgressLog[]>(`/logs/user/${userId}/display-logs-by-user`);
    return data;
}

/**
 * Lấy log tiến trình cai thuốc của một người dùng theo ID và ngày cụ thể.
 * GET /logs/user/{userId}/date/{date}/display-log-by-user-and-date
 * @param date Định dạng ngày: YYYY-MM-DD
 */
export async function getProgressLogByUserAndDate(userId: string, date: string): Promise<QuitProgressLog | null> {
    const { data } = await userApi.get<QuitProgressLog | null>(`/logs/user/${userId}/date/${date}/display-log-by-user-and-date`);
    return data;
}

/**
 * Lấy tất cả các log tiến trình cai thuốc (của tất cả người dùng).
 * GET /logs/display-all-logs
 */
export async function getAllProgressLogs(): Promise<QuitProgressLog[]> {
    const { data } = await userApi.get<QuitProgressLog[]>(`/logs/display-all-logs`);
    return data;
}

/**
 * Xóa một log tiến trình cai thuốc theo ID.
 * DELETE /logs/{id}/delete-log-by-id
 */
export async function deleteProgressLog(logId: string): Promise<void> {
    await userApi.delete(`/logs/${logId}/delete-log-by-id`);
}

export default userApi;
