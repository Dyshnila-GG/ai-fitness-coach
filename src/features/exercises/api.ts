import { useQuery } from '@tanstack/react-query';

import type { Exercise } from '@/logic/exercises';
import { supabase } from '@/lib/supabase';

/** Whole library (~64 rows) is loaded at once: small, shared, rarely changes. */
export type ExerciseLibrary = {
  exercises: Exercise[];
  /** Curated alternatives by exercise id. */
  alternatives: Record<string, string[]>;
};

export const exerciseLibraryQueryKey = ['exercise-library'] as const;

export async function fetchExerciseLibrary(): Promise<ExerciseLibrary> {
  const [exercises, alternatives] = await Promise.all([
    supabase.from('exercises').select('*'),
    supabase.from('exercise_alternatives').select('exercise_id, alternative_id'),
  ]);
  const error = exercises.error ?? alternatives.error;
  if (error) throw error;
  const byExercise: Record<string, string[]> = {};
  for (const row of (alternatives.data ?? []) as {
    exercise_id: string;
    alternative_id: string;
  }[]) {
    (byExercise[row.exercise_id] ??= []).push(row.alternative_id);
  }
  return { exercises: (exercises.data ?? []) as Exercise[], alternatives: byExercise };
}

export function useExerciseLibrary() {
  return useQuery({
    queryKey: exerciseLibraryQueryKey,
    queryFn: fetchExerciseLibrary,
    staleTime: 60 * 60 * 1000,
  });
}
