import {
  availableMuscles,
  equipmentCategory,
  filterExercises,
  findAlternatives,
  sortExercises,
  type Exercise,
} from '../exercises';

const make = (over: Partial<Exercise> & Pick<Exercise, 'id'>): Exercise => ({
  name_ru: over.id,
  name_en: over.id,
  primary_muscles: ['chest'],
  secondary_muscles: [],
  equipment: 'barbell',
  pattern: 'push_h',
  difficulty: 1,
  is_compound: true,
  is_unilateral: false,
  default_tempo: '2-0-1-0',
  instructions_ru: ['a', 'b', 'c'],
  instructions_en: ['a', 'b', 'c'],
  mistakes_ru: [],
  mistakes_en: [],
  contraindications: [],
  media_urls: [],
  ...over,
});

const bench = make({ id: 'bench', name_ru: 'Жим штанги лёжа', name_en: 'Bench press' });
const dbPress = make({
  id: 'db_press',
  name_ru: 'Жим гантелей',
  name_en: 'Dumbbell press',
  equipment: 'dumbbell',
});
const machinePress = make({
  id: 'machine_press',
  name_ru: 'Жим в тренажёре',
  name_en: 'Machine press',
  equipment: 'machine',
});
const pushUp = make({
  id: 'push_up',
  name_ru: 'Отжимания',
  name_en: 'Push-up',
  equipment: 'bodyweight',
});
const fly = make({
  id: 'fly',
  name_ru: 'Бабочка',
  name_en: 'Pec deck',
  equipment: 'machine',
  pattern: 'isolation',
  is_compound: false,
});
const curl = make({
  id: 'curl',
  name_ru: 'Подъём на бицепс',
  name_en: 'Curl',
  primary_muscles: ['biceps'],
  pattern: 'isolation',
  is_compound: false,
});
const squat = make({
  id: 'squat',
  name_ru: 'Присед',
  name_en: 'Squat',
  primary_muscles: ['quads', 'glutes'],
  pattern: 'squat',
});
const all = [curl, squat, fly, pushUp, machinePress, dbPress, bench];

describe('equipmentCategory', () => {
  it('groups equipment into free weight / machine / bodyweight', () => {
    expect(equipmentCategory('barbell')).toBe('free_weight');
    expect(equipmentCategory('dumbbell')).toBe('free_weight');
    expect(equipmentCategory('kettlebell')).toBe('free_weight');
    expect(equipmentCategory('machine')).toBe('machine');
    expect(equipmentCategory('cable')).toBe('machine');
    expect(equipmentCategory('smith')).toBe('machine');
    expect(equipmentCategory('bodyweight')).toBe('bodyweight');
    expect(equipmentCategory('band')).toBe('bodyweight');
  });
});

describe('sortExercises', () => {
  it('orders by muscle group, compound first, then name', () => {
    expect(sortExercises(all, 'en').map((e) => e.id)).toEqual([
      'bench',
      'db_press',
      'machine_press',
      'push_up',
      'fly',
      'curl',
      'squat',
    ]);
  });
});

describe('filterExercises', () => {
  it('returns everything for an empty filter', () => {
    expect(filterExercises(all, {}, 'ru')).toHaveLength(all.length);
  });

  it('searches ru and en names, case- and ё-insensitive', () => {
    expect(filterExercises(all, { query: 'ЛЕЖА' }, 'ru').map((e) => e.id)).toEqual(['bench']);
    expect(filterExercises(all, { query: 'push' }, 'ru').map((e) => e.id)).toEqual(['push_up']);
    expect(filterExercises(all, { query: '  жим ' }, 'ru').map((e) => e.id)).toEqual([
      'machine_press',
      'db_press',
      'bench',
      'push_up',
    ]);
  });

  it('filters by primary muscle and equipment category', () => {
    expect(filterExercises(all, { muscle: 'glutes' }, 'en').map((e) => e.id)).toEqual(['squat']);
    expect(
      filterExercises(all, { muscle: 'chest', category: 'machine' }, 'en').map((e) => e.id),
    ).toEqual(['machine_press', 'fly']);
  });
});

describe('availableMuscles', () => {
  it('lists primary muscles in canonical order', () => {
    expect(availableMuscles(all)).toEqual(['chest', 'biceps', 'quads', 'glutes']);
  });
});

describe('findAlternatives', () => {
  it('puts curated alternatives first, then same pattern and muscle', () => {
    expect(findAlternatives(bench, all, ['push_up'], 'en').map((e) => e.id)).toEqual([
      'push_up',
      'db_press',
      'machine_press',
    ]);
  });

  it('excludes the exercise itself, unknown ids and duplicates', () => {
    expect(
      findAlternatives(bench, all, ['bench', 'missing', 'db_press'], 'en').map((e) => e.id),
    ).toEqual(['db_press', 'machine_press', 'push_up']);
  });

  it('keeps curated alternatives with another pattern', () => {
    expect(findAlternatives(fly, all, ['machine_press'], 'en').map((e) => e.id)).toEqual([
      'machine_press',
    ]);
  });

  it('filters by equipment category', () => {
    expect(findAlternatives(bench, all, [], 'en', 'bodyweight').map((e) => e.id)).toEqual([
      'push_up',
    ]);
    expect(findAlternatives(bench, all, [], 'en', 'free_weight').map((e) => e.id)).toEqual([
      'db_press',
    ]);
  });

  it('returns nothing when there is no match', () => {
    expect(findAlternatives(curl, all, [], 'en')).toEqual([]);
  });
});
