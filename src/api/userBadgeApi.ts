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

export interface UserBadge {
    id: string; // ID của bản ghi user-badge (assignment)
    userId: string;
    badgeId: string; // ID của loại badge được trao
    badgeName: string; // Tên của badge (có thể được trả về cùng)
    awardedDate: string;
    
}

/**
 * Lấy tất cả huy hiệu của một người dùng theo ID.
 * GET /user-badges/user/{userId}
 */
export async function getAllBadgesOfUser(userId: string): Promise<UserBadge[]> {
    const { data } = await userApi.get<UserBadge[]>(`/user-badges/user/${userId}`);
    return data;
}
