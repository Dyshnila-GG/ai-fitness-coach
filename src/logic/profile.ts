// Calibration domain values (SPEC §4–5). Must match CHECK constraints in
// supabase/migrations/*_profiles.sql.

export const SEXES = ['male', 'female'] as const;
export type Sex = (typeof SEXES)[number];

export const LEVELS = ['beginner', 'intermediate', 'advanced'] as const;
export type Level = (typeof LEVELS)[number];

export const LOCATIONS = ['gym', 'home', 'outdoor'] as const;
export type Location = (typeof LOCATIONS)[number];

export const EQUIPMENT = [
  'dumbbells',
  'barbell',
  'kettlebells',
  'pull_up_bar',
  'dip_bars',
  'bands',
  'bench',
  'none',
] as const;
export type Equipment = (typeof EQUIPMENT)[number];

export const TRAINING_MODES = ['light', 'hard', 'mixed'] as const;
export type TrainingMode = (typeof TRAINING_MODES)[number];

export const CARDIO_OPTIONS = ['warmup', 'end', 'none'] as const;
export type Cardio = (typeof CARDIO_OPTIONS)[number];

export const LIMITATION_ZONES = [
  'neck',
  'shoulders',
  'elbows',
  'wrists',
  'lower_back',
  'knees',
  'ankles',
] as const;
export type LimitationZone = (typeof LIMITATION_ZONES)[number];

export const WEIGHT_UNITS = ['kg', 'lb'] as const;
export type WeightUnit = (typeof WEIGHT_UNITS)[number];

export const HEIGHT_UNITS = ['cm', 'ft_in'] as const;
export type HeightUnit = (typeof HEIGHT_UNITS)[number];

export const DAYS_PER_WEEK = { min: 2, max: 6 } as const;
export const HEIGHT_CM = { min: 100, max: 250 } as const;
export const WEIGHT_KG = { min: 30, max: 300 } as const;
export const BODY_FAT_PCT = { min: 3, max: 60 } as const;
export const GIRTHS_CM = {
  chest: { min: 50, max: 200 },
  waist: { min: 40, max: 200 },
  hips: { min: 50, max: 200 },
  biceps: { min: 15, max: 70 },
} as const;
export type Girth = keyof typeof GIRTHS_CM;
export const LIMITATION_NOTE_MAX = 500;
