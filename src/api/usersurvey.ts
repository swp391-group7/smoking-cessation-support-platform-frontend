export interface UserSurvey {
  user_id: string;
  smoke_duration: string;
  cigarettes_per_day: number;
  price_each: number;
  tried_to_quit: boolean;
  reasons_cant_quit: string;
  health_status: string;
  dependency_level: number;
  note: string;
  create_at?: string; // optional, vì có thể server tự tạo
}

