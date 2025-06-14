// src/api/blogApi.ts

import api from './auth';

// Type dữ liệu BlogPost
export interface BlogPost {
  id: string;
  blogType: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  userId: string;
}

// Lấy toàn bộ blog
export async function getAllBlogs(): Promise<BlogPost[]> {
  const response = await api.get<BlogPost[]>("/blogs/display-all-blog");
  return response.data;
}

// Lấy blog theo ID
export async function getBlogById(id: string): Promise<BlogPost> {
  const response = await api.get<BlogPost>(`/blogs/${id}/search-blog-by-id`);
  return response.data;
}

// Tạo mới blog
export async function createBlog(data: Omit<BlogPost, 'id' | 'userId' | 'createdAt'>): Promise<BlogPost> {
  const response = await api.post<BlogPost>("/blogs/create-blog", data);
  return response.data;
}

// Cập nhật blog
export async function updateBlog(id: string, data: Partial<BlogPost>): Promise<BlogPost> {
  const response = await api.put<BlogPost>(`/blogs/${id}/edit-blog`, data);
  return response.data;
}

// Xoá blog
export async function deleteBlog(id: string): Promise<void> {
  await api.delete(`/blogs/${id}/delete-blog`);
}