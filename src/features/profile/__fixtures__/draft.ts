import { emptyDraft } from '../draft';
import type { ProfileDraft } from '../types';

export function completeDraft(patch: Partial<ProfileDraft> = {}): ProfileDraft {
  return {
    ...emptyDraft('RU'),
    disclaimerAccepted: true,
    sex: 'female',
    birthDate: '1995-06-15',
    heightCm: 168,
    weightKg: 61.234,
    level: 'intermediate',
    locations: ['gym'],
    equipment: [],
    daysPerWeek: 3,
    trainingMode: 'light',
    cardio: 'end',
    goals: { primary: 'fat_loss', secondary: null },
    ...patch,
  };
}
