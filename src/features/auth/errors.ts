import { isAuthApiError } from '@supabase/supabase-js';

export type AuthErrorKey =
  'rateLimit' | 'invalidCredentials' | 'userExists' | 'weakPassword' | 'network' | 'unknown';

export function authErrorKey(error: unknown): AuthErrorKey {
  if (isAuthApiError(error)) {
    if (error.status === 429 || error.code?.startsWith('over_')) return 'rateLimit';
    if (error.code === 'invalid_credentials') return 'invalidCredentials';
    if (error.code === 'user_already_exists' || error.code === 'email_exists') return 'userExists';
    if (error.code === 'weak_password') return 'weakPassword';
    return 'unknown';
  }
  if (error instanceof Error && /network|fetch/i.test(error.message)) return 'network';
  return 'unknown';
}
