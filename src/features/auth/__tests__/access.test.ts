import { resolveAccess } from '../access';

const base = {
  authLoading: false,
  hasSession: true,
  profileStatus: 'success' as const,
  onboardingCompleted: true,
};

describe('resolveAccess', () => {
  it('waits for auth', () => {
    expect(resolveAccess({ ...base, authLoading: true })).toBe('loading');
  });

  it('sends guests to sign in', () => {
    expect(resolveAccess({ ...base, hasSession: false, profileStatus: 'pending' })).toBe('auth');
  });

  it('waits for profile, reports errors', () => {
    expect(resolveAccess({ ...base, profileStatus: 'pending' })).toBe('loading');
    expect(resolveAccess({ ...base, profileStatus: 'error' })).toBe('error');
  });

  it('routes by onboarding completion', () => {
    expect(resolveAccess({ ...base, onboardingCompleted: false })).toBe('onboarding');
    expect(resolveAccess(base)).toBe('app');
  });
});
