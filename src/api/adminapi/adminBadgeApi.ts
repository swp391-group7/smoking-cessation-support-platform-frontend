// src/api/adminapi/adminBadgeApi.ts
import axios from 'axios';

const badgeApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

badgeApi.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface BadgeRequest {
  badgeName: string;
  badgeDescription: string;
  badgeImageUrl: string;
}

export interface BadgeDto extends BadgeRequest {
  id: string;
  createdAt?: string;
}

export const createBadge = async (data: BadgeRequest): Promise<BadgeDto> => {
  const res = await badgeApi.post('/badges/create-badge', data);
  return res.data;
};

export const getAllBadges = async (): Promise<BadgeDto[]> => {
  const res = await badgeApi.get('/badges/display-all');
  return res.data;
};

export const getBadgeById = async (id: string): Promise<BadgeDto> => {
  const res = await badgeApi.get(`/badges/${id}/display-badge`);
  return res.data;
};

export const deleteBadge = async (id: string): Promise<void> => {
  await badgeApi.delete(`/badges/${id}/delete-badge`);
};