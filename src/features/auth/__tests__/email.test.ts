import { AuthApiError } from '@supabase/supabase-js';

import { isValidEmail, isValidPassword, normalizeEmail } from '../email';
import { authErrorKey } from '../errors';

describe('email', () => {
  it('normalizes and validates', () => {
    expect(normalizeEmail('  User@Mail.COM ')).toBe('user@mail.com');
    expect(isValidEmail(' user@mail.com ')).toBe(true);
    expect(isValidEmail('user@')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });
});

describe('password', () => {
  it('requires at least 6 characters', () => {
    expect(isValidPassword('12345')).toBe(false);
    expect(isValidPassword('123456')).toBe(true);
  });
});

describe('authErrorKey', () => {
  it('maps rate limits', () => {
    expect(authErrorKey(new AuthApiError('x', 429, 'over_request_rate_limit'))).toBe('rateLimit');
  });

  it('maps credential and sign-up errors', () => {
    expect(authErrorKey(new AuthApiError('x', 400, 'invalid_credentials'))).toBe(
      'invalidCredentials',
    );
    expect(authErrorKey(new AuthApiError('x', 422, 'user_already_exists'))).toBe('userExists');
    expect(authErrorKey(new AuthApiError('x', 422, 'email_exists'))).toBe('userExists');
    expect(authErrorKey(new AuthApiError('x', 422, 'weak_password'))).toBe('weakPassword');
  });

  it('maps network and unknown errors', () => {
    expect(authErrorKey(new TypeError('Network request failed'))).toBe('network');
    expect(authErrorKey('boom')).toBe('unknown');
  });
});
