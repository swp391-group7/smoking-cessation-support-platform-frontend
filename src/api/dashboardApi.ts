// src/api/dashboardApi.ts
import axios from 'axios';

export const userApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
    headers: { 'Content-Type': 'application/json' },
});

// Gắn JWT tự động cho mọi request
userApi.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface MonthlyUserStatistic {
  month: number;
  count: number;
}

export interface GenderStatistic {
  gender: string;
  count: number;
}

export interface AgeGroupStatistic {
  ageGroup: string;
  count: number;
}

/**
 * Lấy thống kê người dùng hàng tháng theo năm.
 * @param year Năm cần lấy thống kê.
 * @returns Mảng các đối tượng thống kê hàng tháng.
 */
export const getMonthlyUserStatistics = async (year: number): Promise<MonthlyUserStatistic[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/statistics/users/monthly/${year}`);
    if (!response.ok) {
      // Xử lý lỗi HTTP (ví dụ: 404 Not Found, 500 Internal Server Error)
      const errorData = await response.json();
      throw new Error(errorData.message || `Lỗi khi lấy thống kê hàng tháng: ${response.statusText}`);
    }
    const data: MonthlyUserStatistic[] = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi gọi API getMonthlyUserStatistics:", error);
    throw error; // Ném lỗi để component gọi có thể xử lý
  }
};

/**
 * Lấy thống kê người dùng theo giới tính.
 * @returns Mảng các đối tượng thống kê giới tính.
 */
export const getGenderStatistics = async (): Promise<GenderStatistic[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/statistics/users/gender`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Lỗi khi lấy thống kê giới tính: ${response.statusText}`);
    }
    const data: GenderStatistic[] = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi gọi API getGenderStatistics:", error);
    throw error;
  }
};

/**
 * Lấy thống kê người dùng theo nhóm tuổi.
 * @returns Mảng các đối tượng thống kê nhóm tuổi.
 */
export const getAgeGroupStatistics = async (): Promise<AgeGroupStatistic[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/statistics/users/age-groups`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Lỗi khi lấy thống kê nhóm tuổi: ${response.statusText}`);
    }
    const data: AgeGroupStatistic[] = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi gọi API getAgeGroupStatistics:", error);
    throw error;
  }
};