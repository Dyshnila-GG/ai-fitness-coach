// Exercise library domain (SPEC §6). Must match CHECK constraints in
// supabase/migrations/*_exercises.sql.

import type { LimitationZone } from './profile';

export const MUSCLES = [
  'chest',
  'back',
  'lower_back',
  'shoulders',
  'biceps',
  'triceps',
  'forearms',
  'quads',
  'hamstrings',
  'glutes',
  'calves',
  'core',
  'full_body',
] as const;
export type Muscle = (typeof MUSCLES)[number];

export const EXERCISE_EQUIPMENT = [
  'barbell',
  'dumbbell',
  'machine',
  'cable',
  'smith',
  'bodyweight',
  'kettlebell',
  'band',
] as const;
export type ExerciseEquipment = (typeof EXERCISE_EQUIPMENT)[number];

export const PATTERNS = [
  'push_h',
  'push_v',
  'pull_h',
  'pull_v',
  'squat',
  'hinge',
  'lunge',
  'isolation',
  'core',
  'cardio',
  'mobility',
] as const;
export type Pattern = (typeof PATTERNS)[number];

/** Replacement filter from SPEC §6: free weight / machine / bodyweight. */
export const EQUIPMENT_CATEGORIES = ['free_weight', 'machine', 'bodyweight'] as const;
export type EquipmentCategory = (typeof EQUIPMENT_CATEGORIES)[number];

const CATEGORY_BY_EQUIPMENT: Record<ExerciseEquipment, EquipmentCategory> = {
  barbell: 'free_weight',
  dumbbell: 'free_weight',
  kettlebell: 'free_weight',
  machine: 'machine',
  cable: 'machine',
  smith: 'machine',
  bodyweight: 'bodyweight',
  band: 'bodyweight',
};

export function equipmentCategory(equipment: ExerciseEquipment): EquipmentCategory {
  return CATEGORY_BY_EQUIPMENT[equipment];
}

export type Lang = 'ru' | 'en';

/** Row of public.exercises. */
export type Exercise = {
  id: string;
  name_ru: string;
  name_en: string;
  primary_muscles: Muscle[];
  secondary_muscles: Muscle[];
  equipment: ExerciseEquipment;
  pattern: Pattern;
  difficulty: 1 | 2 | 3;
  is_compound: boolean;
  is_unilateral: boolean;
  default_tempo: string | null;
  instructions_ru: string[];
  instructions_en: string[];
  mistakes_ru: string[];
  mistakes_en: string[];
  contraindications: LimitationZone[];
  /** Two frames (start / end of the movement) or empty. */
  media_urls: string[];
};

export function exerciseName(e: Exercise, lang: Lang): string {
  return lang === 'en' ? e.name_en : e.name_ru;
}

export function exerciseInstructions(e: Exercise, lang: Lang): string[] {
  return lang === 'en' ? e.instructions_en : e.instructions_ru;
}

export function exerciseMistakes(e: Exercise, lang: Lang): string[] {
  return lang === 'en' ? e.mistakes_en : e.mistakes_ru;
}

const normalize = (s: string) => s.toLocaleLowerCase('ru').replace(/ё/g, 'е').trim();

const muscleRank = (e: Exercise) => MUSCLES.indexOf(e.primary_muscles[0] ?? 'full_body');

/** Library order: by muscle group, compound before isolation, then by name. */
export function sortExercises(list: readonly Exercise[], lang: Lang): Exercise[] {
  return [...list].sort(
    (a, b) =>
      muscleRank(a) - muscleRank(b) ||
      Number(b.is_compound) - Number(a.is_compound) ||
      exerciseName(a, lang).localeCompare(exerciseName(b, lang), lang),
  );
}

export type ExerciseFilter = {
  query?: string;
  muscle?: Muscle | null;
  category?: EquipmentCategory | null;
};

/** Search by ru/en name (case- and ё-insensitive), filter by primary muscle and equipment. */
export function filterExercises(
  list: readonly Exercise[],
  { query = '', muscle = null, category = null }: ExerciseFilter,
  lang: Lang,
): Exercise[] {
  const q = normalize(query);
  return sortExercises(
    list.filter(
      (e) =>
        (!q || normalize(e.name_ru).includes(q) || normalize(e.name_en).includes(q)) &&
        (!muscle || e.primary_muscles.includes(muscle)) &&
        (!category || equipmentCategory(e.equipment) === category),
    ),
    lang,
  );
}

/** Primary muscles present in the list, in canonical order (for filter chips). */
export function availableMuscles(list: readonly Exercise[]): Muscle[] {
  const present = new Set(list.flatMap((e) => e.primary_muscles));
  return MUSCLES.filter((m) => present.has(m));
}

/**
 * Replacement candidates: curated alternatives first, then exercises with the same
 * movement pattern and a shared primary muscle. Optionally limited to one equipment category.
 */
export function findAlternatives(
  exercise: Exercise,
  list: readonly Exercise[],
  curatedIds: readonly string[],
  lang: Lang,
  category: EquipmentCategory | null = null,
): Exercise[] {
  const byId = new Map(list.map((e) => [e.id, e]));
  const curated = curatedIds
    .map((id) => byId.get(id))
    .filter((e): e is Exercise => !!e && e.id !== exercise.id);
  const curatedSet = new Set(curated.map((e) => e.id));
  const similar = list.filter(
    (e) =>
      e.id !== exercise.id &&
      !curatedSet.has(e.id) &&
      e.pattern === exercise.pattern &&
      e.primary_muscles.some((m) => exercise.primary_muscles.includes(m)),
  );
  const inCategory = (e: Exercise) => !category || equipmentCategory(e.equipment) === category;
  return [
    ...sortExercises(curated.filter(inCategory), lang),
    ...sortExercises(similar.filter(inCategory), lang),
  ];
}
