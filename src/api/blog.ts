// src/api/blogApi.ts
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

export interface BlogPost {
  id: string;
  blog_type: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  userId: string;
}

/**
 * Lấy 8 bài post mới nhất
 */
export async function fetchEightBlogs(): Promise<BlogPost[]> {
  const { data } = await blogApi.get<BlogPost[]>('/blogs/display-8-blog');
  return data;
}
