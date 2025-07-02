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

export const BlogType = {
  HEALTH: 'HEALTH',
  SMOKEQUIT: 'SMOKEQUIT',
  SMOKEHARM: 'SMOKEHARM'
} as const;

export type BlogType = typeof BlogType[keyof typeof BlogType];

export interface BlogPost {
  id: string;
  blog_type: BlogType;
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

export async function fetchAllBlogs(): Promise<BlogPost[]> {
  const { data } = await blogApi.get<BlogPost[]>('/blogs/display-all-blog');
  return data;
}

export async function fetchBlogsByType(type: BlogType): Promise<BlogPost[]> {
  const { data } = await blogApi.get<BlogPost[]>(`/blogs/type/${type}`);
  return data;
}

export async function fetchBlogById(id: string): Promise<BlogPost> {
  const { data } = await blogApi.get<BlogPost>(`/blogs/${id}/search-blog-by-id`);
  return data;
}

export async function createBlog(blog: {
  title: string;
  content: string;
  images: string;
  blogType: BlogType;
}): Promise<BlogPost> {
  const { data } = await blogApi.post<BlogPost>('/blogs/create-blog', blog);
  return data;
}

// Cập nhật blog theo ID
export async function updateBlog(id: string, blog: {
  title: string;
  content: string;
  images: string;
  blogType: BlogType;
}): Promise<BlogPost> {
  const { data } = await blogApi.put<BlogPost>(`/blogs/${id}/edit-blog`, blog);
  return data;
}

export async function deleteBlog(id: string): Promise<void> {
  await blogApi.delete(`/blogs/${id}/delete-blog`);
}