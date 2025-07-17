
import baseApi from './BaseApi';

const blogApi = baseApi;

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
