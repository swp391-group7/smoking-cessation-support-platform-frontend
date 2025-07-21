
import baseApi from './BaseApi';
const api =baseApi;
// trả về số progress đã có trong hôm nay 
export async function fetchTodayProgressCount(): Promise<number> {
  const { data } = await api.get<number>('/cessation-progress/statistics/progress/today');
  return data;
}

// trả về số điếu thuốc hút hôm nay 
export async function fetchWeeklyProgressCount(): Promise<number> {
  const { data } = await api.get<number>('/cessation-progress/statistics/today');
  return data;
}