
import baseApi from './BaseApi';
const api =baseApi;

export async function fetchTodayProgressCount(): Promise<number> {
  const { data } = await api.get<number>('/cessation-progress/statistics/progress/today');
  return data;
}

export async function fetchWeeklyProgressCount(): Promise<number> {
  const { data } = await api.get<number>('/cessation-progress/statistics/today');
  return data;
}