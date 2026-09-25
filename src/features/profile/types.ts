import type { Goal, GoalSelection } from '@/logic/goals';
import type {
  Cardio,
  Equipment,
  Girth,
  HeightUnit,
  Level,
  LimitationZone,
  Location,
  Sex,
  TrainingMode,
  WeightUnit,
} from '@/logic/profile';

/** Row of public.profiles (see supabase/migrations/*_profiles.sql). */
export type ProfileRow = {
  id: string;
  sex: Sex;
  birth_date: string;
  height_cm: number;
  height_unit: HeightUnit;
  weight_kg: number;
  weight_unit: WeightUnit;
  level: Level;
  locations: Location[];
  equipment: Equipment[];
  days_per_week: number;
  training_mode: TrainingMode;
  cardio: Cardio;
  disclaimer_accepted_at: string;
  onboarding_completed_at: string | null;
};

export type GoalRow = { goal: Goal; priority: 1 | 2 };

export type LimitationsRow = { zones: LimitationZone[]; note: string | null };

export type BodyMetricsRow = {
  measured_at: string;
  body_fat_pct: number | null;
  chest_cm: number | null;
  waist_cm: number | null;
  hips_cm: number | null;
  biceps_cm: number | null;
};

/** Calibration form state, shared by onboarding and profile editing. Canonical units: kg, cm. */
export type ProfileDraft = {
  disclaimerAccepted: boolean;
  sex: Sex | null;
  birthDate: string | null;
  heightCm: number | null;
  heightUnit: HeightUnit;
  weightKg: number | null;
  weightUnit: WeightUnit;
  level: Level | null;
  locations: Location[];
  equipment: Equipment[];
  daysPerWeek: number | null;
  trainingMode: TrainingMode | null;
  cardio: Cardio | null;
  goals: GoalSelection;
  limitationZones: LimitationZone[];
  limitationNote: string;
  bodyFatPct: number | null;
  girths: Record<Girth, number | null>;
};

export type ProfileBundle = {
  profile: ProfileRow | null;
  goals: GoalRow[];
  limitations: LimitationsRow | null;
  metrics: BodyMetricsRow | null;
};
