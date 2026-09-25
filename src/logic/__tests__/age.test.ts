import { MAX_AGE, MIN_AGE, ageOn, birthDateBounds, isAllowedAge, toIsoDate } from '../age';

const today = new Date(2026, 8, 25); // 2026-09-25

describe('ageOn', () => {
  it('counts full years', () => {
    expect(ageOn('1990-09-25', today)).toBe(36);
    expect(ageOn('1990-09-26', today)).toBe(35);
    expect(ageOn('1990-01-01', today)).toBe(36);
  });

  it('handles leap day birthdays', () => {
    expect(ageOn('2008-02-29', new Date(2026, 1, 28))).toBe(17);
    expect(ageOn('2008-02-29', new Date(2026, 2, 1))).toBe(18);
  });

  it('throws on invalid date', () => {
    expect(() => ageOn('bad', today)).toThrow();
  });
});

describe('isAllowedAge', () => {
  it('allows 16..80 inclusive', () => {
    expect(isAllowedAge(MIN_AGE - 1)).toBe(false);
    expect(isAllowedAge(MIN_AGE)).toBe(true);
    expect(isAllowedAge(MAX_AGE)).toBe(true);
    expect(isAllowedAge(MAX_AGE + 1)).toBe(false);
  });
});

describe('birthDateBounds', () => {
  it('bounds produce allowed ages at the edges', () => {
    const { min, max } = birthDateBounds(today);
    expect(ageOn(toIsoDate(max), today)).toBe(MIN_AGE);
    expect(ageOn(toIsoDate(min), today)).toBe(MAX_AGE);
    const beforeMin = new Date(min.getFullYear(), min.getMonth(), min.getDate() - 1);
    expect(isAllowedAge(ageOn(toIsoDate(beforeMin), today))).toBe(false);
  });
});

describe('toIsoDate', () => {
  it('formats local calendar date', () => {
    expect(toIsoDate(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
});
