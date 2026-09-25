import { z } from 'zod';

const emailSchema = z.email();

export function normalizeEmail(input: string): string {
  return input.trim().toLowerCase();
}

export function isValidEmail(input: string): boolean {
  return emailSchema.safeParse(normalizeEmail(input)).success;
}

/** Must match `minimum_password_length` in supabase/config.toml. */
export const MIN_PASSWORD_LENGTH = 6;

export function isValidPassword(input: string): boolean {
  return input.length >= MIN_PASSWORD_LENGTH;
}
