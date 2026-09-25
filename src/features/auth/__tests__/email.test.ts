import { AuthApiError } from '@supabase/supabase-js';

import { isValidEmail, normalizeEmail } from '../email';
import { authErrorKey } from '../errors';

describe('email', () => {
  it('normalizes and validates', () => {
    expect(normalizeEmail('  User@Mail.COM ')).toBe('user@mail.com');
    expect(isValidEmail(' user@mail.com ')).toBe(true);
    expect(isValidEmail('user@')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });
});

describe('authErrorKey', () => {
  it('maps rate limits', () => {
    expect(authErrorKey(new AuthApiError('x', 429, 'over_email_send_rate_limit'))).toBe(
      'rateLimit',
    );
  });

  it('maps invalid codes', () => {
    expect(authErrorKey(new AuthApiError('x', 403, 'otp_expired'))).toBe('invalidCode');
  });

  it('maps network and unknown errors', () => {
    expect(authErrorKey(new TypeError('Network request failed'))).toBe('network');
    expect(authErrorKey('boom')).toBe('unknown');
  });
});
