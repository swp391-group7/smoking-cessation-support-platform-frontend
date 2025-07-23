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





// --- Thêm 2 interface mới cho payment ---
export interface PaymentSummary {
  totalAmount: number;  // tổng số tiền (USD)
  totalCount:  number;  // tổng số giao dịch
}

export interface MonthlyPaymentStat {
  month:       number;       // 1 = Jan, …, 12 = Dec
  totalAmount: number | null; // nếu không có giao dịch thì null
  count:       number;       // số giao dịch trong tháng
}

// --- Thêm 2 hàm gọi API mới ---

/**
 * Lấy tổng số tiền và tổng số giao dịch
 * GET /api/payments/summary
 */
export const getPaymentSummary = async (): Promise<PaymentSummary> => {
  try {
    const { data } = await dashboardApi.get<PaymentSummary>('/api/payments/summary');
    return data;
  } catch (error: unknown) {
    console.error('Lỗi khi gọi API getPaymentSummary:', error);
    throw error;
  }
};

/**
 * Lấy thống kê tổng tiền và số giao dịch theo từng tháng trong năm
 * GET /api/payments/stats?year=2025
 */
export const getMonthlyPaymentStats = async (year: number): Promise<MonthlyPaymentStat[]> => {
  try {
    const response = await dashboardApi.get<MonthlyPaymentStat[]>('/api/payments/stats', {
      params: { year }
    });
    return response.data;
  } catch (error: unknown) {
    console.error('Lỗi khi gọi API getMonthlyPaymentStats:', error);
    throw error;
  }
};

// --- Interface cho quit‑plans counts ---
export interface QuitPlanCounts {
  active:    number;
  cancelled: number;
  completed: number;
}

// --- Hàm gọi API /quit-plans/counts ---
export const getQuitPlanCounts = async (): Promise<QuitPlanCounts> => {
  try {
    const { data } = await dashboardApi.get<QuitPlanCounts>('/quit-plans/counts');
    return data;
  } catch (error: unknown) {
    console.error('Lỗi khi gọi API getQuitPlanCounts:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || `Server lỗi ${error.response?.status}`);
    }
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Lỗi không xác định khi lấy thống kê quit plans');
  }
};
