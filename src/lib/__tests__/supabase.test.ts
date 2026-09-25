const ENV_KEYS = ['EXPO_PUBLIC_SUPABASE_URL', 'EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY'] as const;

describe('supabase client', () => {
  const saved = { ...process.env };

  afterEach(() => {
    process.env = { ...saved };
    jest.resetModules();
  });

  it('throws when env is missing', () => {
    ENV_KEYS.forEach((key) => delete process.env[key]);
    expect(() => require('../supabase')).toThrow(/EXPO_PUBLIC_SUPABASE_URL/);
  });

  it('creates client when env is set', () => {
    process.env.EXPO_PUBLIC_SUPABASE_URL = 'http://127.0.0.1:54321';
    process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_test';
    const { supabase } = require('../supabase');
    expect(typeof supabase.from).toBe('function');
  });
});
