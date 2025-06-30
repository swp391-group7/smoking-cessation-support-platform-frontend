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

export interface UserInfo  {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    dob: string;
    avatarPath: string;
    password?: string;
    roleName?: string;
}

export interface RegisterUserRequest extends Omit<UserInfo, 'id'> {}
export interface UpdateUserRequest extends Partial<UserInfo> {
  id: number;
}

/** Lấy thông tin người dùng hiện tại */
export async function getCurrentUser(): Promise<UserInfo> {
  const { data } = await userApi.get<UserInfo>('/users/get-current');
  return data;
}

/** Lấy thông tin người dùng theo ID */
export async function getUserById(userId: number): Promise<UserInfo> {
  const { data } = await userApi.get<UserInfo>(`/users/get/${userId}`);
  return data;
}

/** Lấy tất cả người dùng */
export async function getAllUsers(): Promise<UserInfo[]> {
  const { data } = await userApi.get<UserInfo[]>('/users/all');
  return data;
}

/** Lọc người dùng theo role */
export async function getUsersByRole(role: string): Promise<UserInfo[]> {
  const { data } = await userApi.get<UserInfo[]>(`/users/by-role`, {
    params: { roleName: role },
  });
  return data;
}

/** Đăng ký người dùng mới */
export async function registerUser(payload: RegisterUserRequest): Promise<UserInfo> {
  const { data } = await userApi.post<UserInfo>('/users/register', payload);
  return data;
}

/** Cập nhật thông tin người dùng */
export async function updateUser(payload: UserInfo): Promise<UserInfo> {
  const { data } = await userApi.put<UserInfo>('/users/update', payload);
  return data;
}

/** Xoá người dùng theo ID */
export async function deleteUser(userId: number): Promise<void> {
  await userApi.delete(`/users/delete`, {
    params: { userId }
  });
}

export default userApi;