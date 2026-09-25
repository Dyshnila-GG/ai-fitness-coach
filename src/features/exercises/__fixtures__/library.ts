import type { Exercise } from '@/logic/exercises';

import type { ExerciseLibrary } from '../api';

const base: Omit<Exercise, 'id' | 'name_ru' | 'name_en'> = {
  primary_muscles: ['chest'],
  secondary_muscles: ['triceps'],
  equipment: 'barbell',
  pattern: 'push_h',
  difficulty: 2,
  is_compound: true,
  is_unilateral: false,
  default_tempo: '2-0-1-0',
  instructions_ru: ['Лягте на скамью', 'Опустите штангу', 'Выжмите вверх'],
  instructions_en: ['Lie on the bench', 'Lower the bar', 'Press up'],
  mistakes_ru: ['Отбив от груди'],
  mistakes_en: ['Bouncing off the chest'],
  contraindications: ['shoulders'],
  media_urls: ['https://example.com/0.jpg', 'https://example.com/1.jpg'],
};

export const bench: Exercise = {
  ...base,
  id: 'barbell_bench_press',
  name_ru: 'Жим штанги лёжа',
  name_en: 'Barbell bench press',
};
export const machinePress: Exercise = {
  ...base,
  id: 'machine_chest_press',
  name_ru: 'Жим в тренажёре',
  name_en: 'Machine chest press',
  equipment: 'machine',
  contraindications: [],
  media_urls: [],
};
export const pushUp: Exercise = {
  ...base,
  id: 'push_up',
  name_ru: 'Отжимания',
  name_en: 'Push-up',
  equipment: 'bodyweight',
};
export const squat: Exercise = {
  ...base,
  id: 'back_squat',
  name_ru: 'Присед со штангой',
  name_en: 'Barbell back squat',
  primary_muscles: ['quads', 'glutes'],
  secondary_muscles: [],
  pattern: 'squat',
  contraindications: ['knees'],
};

export const library: ExerciseLibrary = {
  exercises: [squat, pushUp, machinePress, bench],
  alternatives: { barbell_bench_press: ['push_up'], push_up: ['barbell_bench_press'] },
};
