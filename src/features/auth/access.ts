export type Access = 'loading' | 'auth' | 'onboarding' | 'app' | 'error';

type Input = {
  authLoading: boolean;
  hasSession: boolean;
  profileStatus: 'pending' | 'error' | 'success';
  onboardingCompleted: boolean;
};

/** Which part of the app the user may see. */
export function resolveAccess(input: Input): Access {
  if (input.authLoading) return 'loading';
  if (!input.hasSession) return 'auth';
  if (input.profileStatus === 'pending') return 'loading';
  if (input.profileStatus === 'error') return 'error';
  return input.onboardingCompleted ? 'app' : 'onboarding';
}
