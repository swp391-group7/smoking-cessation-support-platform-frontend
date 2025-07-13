import axios from 'axios';

const blogApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

// Gắn JWT tự động, giống auth.ts
blogApi.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface BadgeDto {
  id: string;
  badgeName: string;
  badgeDescription: string;
  badgeImageUrl: string;
  condition: number; // Điều kiện để nhận huy hiệu
  createdAt: string; // Ngày tạo huy hiệu
}
export async function fetchAllBadges(): Promise<BadgeDto[]> {
  const { data } = await blogApi.get<BadgeDto[]>('/badges/display-all');
  return data;
}
