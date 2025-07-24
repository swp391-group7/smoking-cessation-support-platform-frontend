import baseApi from './BaseApi';

const feedbackApi = baseApi;

export interface CreateSystemFeedbackRequest {
  userId:         string;
  targetType:     'SYSTEM' | 'COACH';
  membershipPkgId: string;
  rating:         number;
  comment:        string;
}

/**
 * Gửi feedback của user cho hệ thống,
 * server trả về avg system rating (số).
 */
export async function createSystemFeedback(
  payload: CreateSystemFeedbackRequest
): Promise<number> {
  const { data } = await feedbackApi.post<number>(
    '/feedbacks/system',
    payload
  );
  return data;
}


export interface SystemFeedbackDto {
  id:             string;
  userId:         string;
  targetType:     'SYSTEM' | 'COACH';
  membershipPkgId: string;
  rating:         number;
  comment:        string;
  createdAt:      string;  // ISO timestamp
}

/**
 * Lấy feedback hệ thống theo userId
 * GET /feedbacks/system/{userId}
 */
export async function fetchSystemFeedbackByUser(
  userId: string
): Promise<SystemFeedbackDto> {
  const { data } = await feedbackApi.get<SystemFeedbackDto>(
    `/feedbacks/system/${userId}`
  );
  return data;
}

export interface UpdateSystemFeedbackRequest {
  rating:  number;
  comment: string;
}

/**
 * Cập nhật feedback hệ thống theo id
 * PATCH /feedbacks/system/{id}
 * Trả về object SystemFeedbackDto
 */
export async function updateSystemFeedbackById(
  id: string,
  payload: UpdateSystemFeedbackRequest
): Promise<SystemFeedbackDto> {
  const { data } = await feedbackApi.patch<SystemFeedbackDto>(
    `/feedbacks/system/${id}`,
    payload
  );
  return data;
}