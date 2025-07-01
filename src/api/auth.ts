import axios from 'axios';

//tạo instance của axios 
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  headers: {
    'Content-Type': 'application/json',
  },
});

// tự động gắn jwt lên header 
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// kiểu dư liệu truyền vào khi login.
interface LoginCredentials {
  username: string;
  password: string;
}

// kiểu dự liệu server trả về khi login thành công
interface LoginResponse {
  token: string;
  user: {
    id: string;
    full_name: string;
    avatarUrl?: string; // Có thể có hoặc không
    role: string;       // Bổ sung để kiểm tra quyền truy cập (admin, user...)
  };
}

export async function login(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", credentials);
  console.log("Login API response:", data);
  return data;
}

// signin 
interface SignUpCredentials {
  username: string;
  password: string;
  fullName: string;
  email: string;
}

interface SignUpResponse {
  token: string;
  user: {
    id: string;
    full_name: string;
  };
}

export async function register(
  credentials: SignUpCredentials
): Promise<SignUpResponse> {
  const { data } = await api.post<SignUpResponse>("/auth/signup", credentials);
  return data;
}