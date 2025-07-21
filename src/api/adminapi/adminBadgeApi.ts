// src/api/adminapi/adminBadgeApi.ts
// import axios from 'axios';
import baseApi from '../BaseApi';
const badgeApi =baseApi;

export interface BadgeRequest {
  badgeName: string;
  badgeDescription: string;
  badgeImageUrl: string;
  condition: string; // Điều kiện để nhận huy hiệu
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