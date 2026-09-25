import type { Equipment, Location } from './profile';

export const ONBOARDING_STEPS = [
  'disclaimer',
  'sex',
  'birthDate',
  'height',
  'weight',
  'level',
  'locations',
  'equipment',
  'days',
  'mode',
  'cardio',
  'goals',
  'limitations',
  'metrics',
] as const;
export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

export const OPTIONAL_STEPS: readonly OnboardingStep[] = ['limitations', 'metrics'];

/** Equipment is asked only when training at home or outdoors. */
export function needsEquipment(locations: readonly Location[]): boolean {
  return locations.includes('home') || locations.includes('outdoor');
}

export function getOnboardingSteps(locations: readonly Location[]): OnboardingStep[] {
  return ONBOARDING_STEPS.filter((step) => step !== 'equipment' || needsEquipment(locations));
}

export function isOptionalStep(step: OnboardingStep): boolean {
  return OPTIONAL_STEPS.includes(step);
}

/** "none" is exclusive with any other equipment. */
export function toggleEquipment(current: readonly Equipment[], item: Equipment): Equipment[] {
  if (current.includes(item)) return current.filter((e) => e !== item);
  if (item === 'none') return ['none'];
  return [...current.filter((e) => e !== 'none'), item];
}

export function toggleInList<T>(current: readonly T[], item: T): T[] {
  return current.includes(item) ? current.filter((e) => e !== item) : [...current, item];
}
