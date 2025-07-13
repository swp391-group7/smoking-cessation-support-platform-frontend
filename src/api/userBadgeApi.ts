// src/api/userBadgeApi.ts

import axios from 'axios';
import { userApi } from '@/api/userApi';

const userBadgeApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

userBadgeApi.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface UserEarnedBadgeDetails {
    id: string; // ID của định nghĩa huy hiệu
    badgeName: string;
    badgeDescription: string;
    badgeImageUrl: string;
    createdAt: string; // Ngày tạo định nghĩa huy hiệu
}

// Interface cho đối tượng badge lồng bên trong khi trao huy hiệu
// (như được trả về từ POST /user-badges/assign)
export interface BadgeDefinitionForAssignment {
    id: string; // ID của định nghĩa huy hiệu
    badgeName: string;
    badgeDescription: string;
    badgeImageUrl: string;
    createdAt: string;
}

// Interface cho bản ghi việc trao huy hiệu cho người dùng
// (như được trả về từ POST /user-badges/assign)
export interface UserBadgeAssignment {
    id: string; // ID của bản ghi trao huy hiệu (assignment record)
    userId: string;
    badge: BadgeDefinitionForAssignment; // Định nghĩa huy hiệu được lồng vào
    achievedAt: string; // Ngày huy hiệu được trao cho người dùng
}

// Request DTO for assigning a badge to a user
export interface AssignBadgeRequest {
    userId: string;
    badgeId: string;
}

/**
 * Lấy tất cả huy hiệu của một người dùng nhận được dựa vào ID.
 * GET /user-badges/user/{userId}
 * Trả về danh sách các định nghĩa huy hiệu mà người dùng đã đạt được.
 */
export async function getAllBadgesOfUser(userId: string): Promise<UserEarnedBadgeDetails[]> {
    const { data } = await userApi.get<UserEarnedBadgeDetails[]>(`/user-badges/user/${userId}`);
    return data;
}

/**
 * Lấy tất cả huy hiệu của người dùng hiện tại nhận được.
 * GET /user-badges/user/current
 * Trả về danh sách các định nghĩa huy hiệu mà người dùng hiện tại đã đạt được.
 */
export async function getAllBadgesOfCurrentUser(): Promise<UserEarnedBadgeDetails[]> {
    const { data } = await userApi.get<UserEarnedBadgeDetails[]>(`/user-badges/user/current`);
    return data;
}

/**
 * Trao một huy hiệu cho một người dùng.
 * POST /user-badges/assign
 * Trả về bản ghi việc trao huy hiệu.
 */
export async function assignBadgeToUser(payload: AssignBadgeRequest): Promise<UserBadgeAssignment> {
    const { data } = await userApi.post<UserBadgeAssignment>(`/user-badges/assign`, payload);
    return data;
}

