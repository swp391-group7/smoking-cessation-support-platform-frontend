
import baseApi from './BaseApi';
const api =baseApi;

export interface userOfCoachDto {
  id: string;
  username: string;
  password: string | null;
  email: string;
  providerId: string | null;
  fullName: string;
  phoneNumber: string | null;
  dob: string | null; // Có thể để dạng Date nếu bạn sẽ parse về Date sau
  sex: string | null;
  avtarPath: string | null;
  preStatus: string | null;
  createdAt: string; // hoặc Date nếu bạn xử lý parse
  roleName: string | null;
}
export async function fetchUsersOfCoach(coachId: string): Promise<userOfCoachDto[]> {
  const { data } = await api.get<userOfCoachDto[]>(`/membership-package/coach/${coachId}/users`);
  return data;
}


export interface MembershipPackageDto {
  id: string;
  userId: string;
  coachId: string;
  packageTypeId: string;
  packageTypeName: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  active: boolean;
}

// Gọi API để lấy các membership-package của user với một coach cụ thể
export async function fetchMembershipsOfUserWithCoach(
  coachId: string,
  userId: string
): Promise<MembershipPackageDto[]> {
  const { data } = await api.get<MembershipPackageDto[]>(
    `/membership-packages/coach/${coachId}/user/${userId}/memberships`
  );
  return data;
}
