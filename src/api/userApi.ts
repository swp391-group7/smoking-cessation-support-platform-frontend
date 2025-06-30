// src/api/userApi.ts
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

export interface UserInfo {
  password: string,
  email: string,
  fullName: string,
  phoneNumber: string,
  dob: 2025-06-30,
  avtarPath: string,
  roleName: string
}

