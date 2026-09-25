// Goals and their default training parameters (SPEC §5).

export const GOALS = [
  'muscle_gain',
  'strength',
  'fat_loss',
  'recomposition',
  'endurance',
  'general_fitness',
  'mobility',
] as const;
export type Goal = (typeof GOALS)[number];

type Range = { min: number; max: number };

export type GoalDefaults = {
  reps: Range;
  /** Mobility work may be done for time instead of reps. */
  timeBased: boolean;
  sets: Range;
  restSec: Range;
  rir: Range;
  /** Eccentric-pause-concentric-pause, seconds; X = explosive; "slow" = slow controlled. */
  tempo: string;
};

export const GOAL_DEFAULTS: Record<Goal, GoalDefaults> = {
  muscle_gain: {
    reps: { min: 6, max: 12 },
    timeBased: false,
    sets: { min: 3, max: 4 },
    restSec: { min: 90, max: 120 },
    rir: { min: 1, max: 2 },
    tempo: '3-0-1-0',
  },
  strength: {
    reps: { min: 3, max: 6 },
    timeBased: false,
    sets: { min: 4, max: 5 },
    restSec: { min: 150, max: 240 },
    rir: { min: 1, max: 3 },
    tempo: '2-1-X-0',
  },
  fat_loss: {
    reps: { min: 10, max: 15 },
    timeBased: false,
    sets: { min: 3, max: 3 },
    restSec: { min: 45, max: 75 },
    rir: { min: 1, max: 2 },
    tempo: '2-0-1-0',
  },
  recomposition: {
    reps: { min: 6, max: 12 },
    timeBased: false,
    sets: { min: 3, max: 4 },
    restSec: { min: 90, max: 90 },
    rir: { min: 1, max: 2 },
    tempo: '3-0-1-0',
  },
  endurance: {
    reps: { min: 15, max: 20 },
    timeBased: false,
    sets: { min: 2, max: 3 },
    restSec: { min: 30, max: 60 },
    rir: { min: 2, max: 3 },
    tempo: '2-0-1-0',
  },
  general_fitness: {
    reps: { min: 8, max: 12 },
    timeBased: false,
    sets: { min: 3, max: 3 },
    restSec: { min: 60, max: 90 },
    rir: { min: 2, max: 2 },
    tempo: '2-0-1-0',
  },
  mobility: {
    reps: { min: 10, max: 15 },
    timeBased: true,
    sets: { min: 2, max: 3 },
    restSec: { min: 30, max: 60 },
    rir: { min: 3, max: 3 },
    tempo: 'slow',
  },
};

export type GoalSelection = { primary: Goal | null; secondary: Goal | null };

/** 1 primary goal + up to 1 additional, distinct. */
export function isValidGoalSelection(selection: GoalSelection): boolean {
  return selection.primary !== null && selection.primary !== selection.secondary;
}

/**
 * Tap on a goal chip: first tap sets the primary goal, second distinct goal becomes
 * additional, tapping a selected goal removes it (additional is promoted if primary removed).
 */
export function toggleGoal(selection: GoalSelection, goal: Goal): GoalSelection {
  if (selection.primary === goal) return { primary: selection.secondary, secondary: null };
  if (selection.secondary === goal) return { primary: selection.primary, secondary: null };
  if (selection.primary === null) return { primary: goal, secondary: null };
  return { primary: selection.primary, secondary: goal };
}
