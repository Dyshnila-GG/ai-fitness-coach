import { fetchExerciseLibrary } from '../api';

const mockResults: Record<string, { data: unknown; error: unknown }> = {};
jest.mock('@/lib/supabase', () => ({
  supabase: { from: (table: string) => ({ select: () => Promise.resolve(mockResults[table]) }) },
}));

describe('fetchExerciseLibrary', () => {
  it('groups curated alternatives by exercise', async () => {
    mockResults.exercises = { data: [{ id: 'a' }, { id: 'b' }, { id: 'c' }], error: null };
    mockResults.exercise_alternatives = {
      data: [
        { exercise_id: 'a', alternative_id: 'b' },
        { exercise_id: 'a', alternative_id: 'c' },
        { exercise_id: 'b', alternative_id: 'a' },
      ],
      error: null,
    };
    const lib = await fetchExerciseLibrary();
    expect(lib.exercises.map((e) => e.id)).toEqual(['a', 'b', 'c']);
    expect(lib.alternatives).toEqual({ a: ['b', 'c'], b: ['a'] });
  });

  it('throws on a query error', async () => {
    mockResults.exercises = { data: null, error: new Error('boom') };
    mockResults.exercise_alternatives = { data: [], error: null };
    await expect(fetchExerciseLibrary()).rejects.toThrow('boom');
  });
});
