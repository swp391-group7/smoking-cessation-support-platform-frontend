// plantype.ts

/**
 * Stage: represents a single phase in the quitting plan.
 * - id: unique identifier for the stage
 * - title: descriptive title shown to the user
 * - description: details of goals/activities for this stage
 * - start: planned start date of this stage (nullable until set)
 * - end: planned end date of this stage (nullable until set)
 * - targetCigarettes?: optional daily cigarette target for this stage
 */
export type Stage = {
  id: string;
  title: string;
  description: string;
  start: Date | null;
  end: Date | null;
  targetCigarettes?: number;
};

/**
 * PlanForm: shape of the overall plan form data
 * - reason: user's motivation or reason for quitting (e.g. health concerns)
 * - overallStart: the date the user begins the quitting plan
 * - overallEnd: the target date for complete cessation
 */
export type PlanForm = {
  reason: string;
  overallStart: Date | null;
  overallEnd: Date | null;
};

/**
 * PlanType: two supported quitting strategies
 * - 'Cold Turkey': stop smoking immediately from Day 1
 * - 'Gradual Reduction': slowly reduce cigarette intake over stages
 */
export type PlanType = 'Cold Turkey' | 'Gradual Reduction';

// Usage:
// - Stage[] is used to render and manage each phase's dates and targets.
// - PlanForm holds the top-level data from the main form (reason & dates).
// - PlanType determines which UI/logic path to follow in PlanForm.tsx.
