export type Stage = {
  id: string;
  title: string;
  description: string;
  start: Date | null;
  end: Date | null;
};

export type PlanForm = {
  reason: string;
  overallStart: Date | null;
  overallEnd: Date | null;
};

export type PlanType = "FAST" | "OPTIONAL";