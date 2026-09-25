export const MIN_AGE = 16;
export const MAX_AGE = 80;

/** Parses an ISO date (YYYY-MM-DD) as a calendar date, independent of time zone. */
function parseIsoDate(iso: string): { y: number; m: number; d: number } {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) throw new Error(`Invalid ISO date: ${iso}`);
  return { y, m, d };
}

export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Full years between birth date and today. */
export function ageOn(birthDate: string, today: Date): number {
  const b = parseIsoDate(birthDate);
  const ty = today.getFullYear();
  const tm = today.getMonth() + 1;
  const td = today.getDate();
  const hadBirthday = tm > b.m || (tm === b.m && td >= b.d);
  return ty - b.y - (hadBirthday ? 0 : 1);
}

export function isAllowedAge(age: number): boolean {
  return age >= MIN_AGE && age <= MAX_AGE;
}

/** Date range a birth date picker should allow for today. */
export function birthDateBounds(today: Date): { min: Date; max: Date } {
  const max = new Date(today.getFullYear() - MIN_AGE, today.getMonth(), today.getDate());
  const min = new Date(today.getFullYear() - MAX_AGE - 1, today.getMonth(), today.getDate() + 1);
  return { min, max };
}
