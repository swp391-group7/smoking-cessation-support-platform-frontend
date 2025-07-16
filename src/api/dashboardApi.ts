// src/api/dashboardApi.ts
import axios from 'axios';

export const dashboardApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
    headers: { 'Content-Type': 'application/json' },
});

// Gắn JWT tự động cho mọi request
dashboardApi.interceptors.request.use(config => {
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
 */
export const getMonthlyUserStatistics = async (year: number): Promise<MonthlyUserStatistic[]> => {
  try {
    const response = await dashboardApi.get<MonthlyUserStatistic[]>(`/api/statistics/users/monthly/${year}`);
    return response.data; 
  } catch (error: any) {
    console.error("Lỗi khi gọi API getMonthlyUserStatistics:", error);
    if (error.response) {
      throw new Error(error.response.data.message || `Lỗi từ server: ${error.response.status}`);
    } else if (error.request) {
      throw new Error("Không nhận được phản hồi từ server.");
    } else {
      throw new Error(`Lỗi khi thiết lập yêu cầu: ${error.message}`);
    }
  }
};

/**
 * Lấy thống kê người dùng theo giới tính.
 * @returns Mảng các đối tượng thống kê giới tính.
 */
export const getGenderStatistics = async (): Promise<GenderStatistic[]> => {
  try {
    const response = await dashboardApi.get<GenderStatistic[]>('/api/statistics/users/gender');
    return response.data;
  } catch (error: any) {
    console.error("Lỗi khi gọi API getGenderStatistics:", error);
    if (error.response) {
      throw new Error(error.response.data.message || `Lỗi từ server: ${error.response.status}`);
    } else if (error.request) {
      throw new Error("Không nhận được phản hồi từ server.");
    } else {
      throw new Error(`Lỗi khi thiết lập yêu cầu: ${error.message}`);
    }
  }
};

/**
 * Lấy thống kê người dùng theo nhóm tuổi.
 * @returns Mảng các đối tượng thống kê nhóm tuổi.
 */
export const getAgeGroupStatistics = async (): Promise<AgeGroupStatistic[]> => {
  try {
    const response = await dashboardApi.get<AgeGroupStatistic[]>('/api/statistics/users/age-groups');
    return response.data;
  } catch (error: any) {
    console.error("Lỗi khi gọi API getAgeGroupStatistics:", error);
    if (error.response) {
      throw new Error(error.response.data.message || `Lỗi từ server: ${error.response.status}`);
    } else if (error.request) {
      throw new Error("Không nhận được phản hồi từ server.");
    } else {
      throw new Error(`Lỗi khi thiết lập yêu cầu: ${error.message}`);
    }
  }
};