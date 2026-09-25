import { z } from 'zod';

const emailSchema = z.email();

export function normalizeEmail(input: string): string {
  return input.trim().toLowerCase();
}

export function isValidEmail(input: string): boolean {
  return emailSchema.safeParse(normalizeEmail(input)).success;
}

export const OTP_LENGTH = 6;
/** Supabase allows one OTP email per address every 60 s. */
export const RESEND_COOLDOWN_SEC = 60;
