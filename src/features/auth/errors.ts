import { isAuthApiError } from '@supabase/supabase-js';

export type AuthErrorKey = 'rateLimit' | 'invalidCode' | 'network' | 'unknown';

export function authErrorKey(error: unknown): AuthErrorKey {
  if (isAuthApiError(error)) {
    if (error.status === 429 || error.code?.startsWith('over_')) return 'rateLimit';
    if (error.code === 'otp_expired' || error.code === 'otp_disabled') return 'invalidCode';
    if (error.status === 403 || error.status === 401) return 'invalidCode';
    return 'unknown';
  }
  if (error instanceof Error && /network|fetch/i.test(error.message)) return 'network';
  return 'unknown';
}
