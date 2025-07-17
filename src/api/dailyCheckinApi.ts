import baseApi from './BaseApi';

const api = baseApi;
export interface CreateDailyCheckinRequest {
  planId: string;
  planStepId: string;
  status: string;
  mood: string;
  cigarettesSmoked: number;
  note?: string;
}

export interface DailyCheckinDto {
    id: string;
    planId: string;
    planStepId: string; // định dạng YYYY-MM-DD
    status: string; // "COMPLETED", "MISSED"
    mood: string; // ISO timestamp
    cigarettesSmoked: number;
    note : string;
    }
    
    // --- Interface cho Badge ---
export interface BadgeDto {
  id: string;
  badgeName: string;
  badgeDescription: string;
  badgeImageUrl: string;
  condition: number;
}
export interface CreateCheckinResponse {
  progress: DailyCheckinDto;
  newBadges: BadgeDto[];
}

// --- Gọi API POST /cessation-progress/create ---
export const createDailyCheckin = async (
  payload: CreateDailyCheckinRequest
): Promise<CreateCheckinResponse> => {
  const response = await api.post<CreateCheckinResponse>(
    '/cessation-progress/create',
    payload
  );
  return response.data;
};

// --- User DTO coming back from /membership-packages/coach/{coachId}/users ---
export interface UserDto {
  id: string;
  username: string;
  password: string | null;
  email: string;
  providerId?: string;
  fullName: string;
  phoneNumber: string;
  dob: string;          // ISO date
  sex: string;
  avatarPath: string;
  preStatus: boolean;
  createdAt: string;    // ISO timestamp
  roleName: string;
}

// --- GET all users assigned to a coach ---
export const getUsersByCoach = async (
  coachId: string
): Promise<UserDto[]> => {
  const response = await api.get<UserDto[]>(
    `/membership-packages/coach/${coachId}/users`
  );
  return response.data;
};

export interface MembershipPackageDto {
  id: string;
  userId: string;
  packageTypeId: string;
  coachId: string;
  packageTypeName: string;
  startDate: string;    // ISO timestamp
  endDate: string;      // ISO timestamp
  createdAt: string;    // ISO timestamp
  active: boolean;
}

/**
 * Fetch all membership packages for a specific user under a specific coach
 * GET /membership-packages/coach/{coachId}/user/{userId}/memberships
 */
export const getUserMemberships = async (
  coachId: string,
  userId: string
): Promise<MembershipPackageDto[]> => {
  const response = await api.get<MembershipPackageDto[]>(
    `/membership-packages/coach/${coachId}/user/${userId}/memberships`
  );
  return response.data;
};