import baseApi from '../BaseApi';

const api = baseApi;


export interface RegisterUserRequest {
  username:    string;
  password:    string;
  email:       string;
  fullName:    string;
  dob:         string;  // YYYY-MM-DD
  avatarPath?: string;
  sex?:        string;
  roleName:    string;  // ví dụ "coach", "admin", ...
}

export interface UserDto {
  id:          string;
  username:    string;
  password?:   string;     // server thường trả password đã mã hóa hoặc không trả
  providerId?: string | null;
  email:       string;
  fullName:    string;
  phoneNumber?:string | null;
  dob?:        string | null;
  sex?:        string | null;
  avatarPath?: string | null;
  preStatus?:  boolean | null;
  createdAt?:  string;     // timestamp ISO
  roleName:    string;
}

/**
 * Đăng ký user mới
 * POST /users/register
 * @param payload dữ liệu đăng ký
 * @returns thông tin user vừa tạo
 */
export async function registerUser(
  payload: RegisterUserRequest
): Promise<UserDto> {
  const { data } = await api.post<UserDto>(
    '/users/register',
    payload
  );
  return data;
}


// src/api/coachService.ts

export interface UpdateCoachRequest {
  userId:       string;
  bio:          string;
  qualification:string;
}

export interface CoachDto {
  userId:       string;
  bio:          string;
  qualification:string;
}

/**
 * Cập nhật thông tin Coach
 * PUT /coaches/{id}
 * @param id      UUID của coach
 * @param payload { userId, bio, qualification }
 * @returns       object CoachDto sau khi cập nhật
 */
export async function updateCoachById(
  id: string,
  payload: UpdateCoachRequest
): Promise<CoachDto> {
  const { data } = await api.put<CoachDto>(
    `/coaches/${id}`,
    payload
  );
  return data;
}
export interface CoachDto {
  userId:       string;
  bio:          string;
  qualification:string;
}

/**
 * Lấy danh sách tất cả Coach
 * GET /coaches/all
 */
export async function fetchAllCoaches(): Promise<CoachDto[]> {
  const { data } = await api.get<CoachDto[]>('/coaches/all');
  return data;
}