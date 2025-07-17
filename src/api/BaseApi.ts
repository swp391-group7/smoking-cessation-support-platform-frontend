// src/api/baseApi.ts
import axios from 'axios';

export const baseApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor request
baseApi.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor response
baseApi.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      // Hiển thị thông báo trước khi logout
     

      // Xóa token và redirect
      localStorage.removeItem('token');
      window.location.href = '/login';
       
    }
    return Promise.reject(err);
  }
);

export default baseApi;
