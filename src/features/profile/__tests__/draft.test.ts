import { draftFromBundle, emptyDraft } from '../draft';

describe('emptyDraft', () => {
  it('picks units from region', () => {
    expect(emptyDraft('US')).toMatchObject({ weightUnit: 'lb', heightUnit: 'ft_in' });
    expect(emptyDraft('RU')).toMatchObject({ weightUnit: 'kg', heightUnit: 'cm' });
  });
});

describe('draftFromBundle', () => {
  it('maps saved rows (numeric strings from Postgres) to a draft', () => {
    const draft = draftFromBundle({
      profile: {
        id: 'u1',
        sex: 'male',
        birth_date: '1990-01-01',
        height_cm: '180.3' as unknown as number,
        height_unit: 'ft_in',
        weight_kg: '81.65' as unknown as number,
        weight_unit: 'lb',
        level: 'advanced',
        locations: ['gym', 'home'],
        equipment: ['dumbbells'],
        days_per_week: 4,
        training_mode: 'hard',
        cardio: 'none',
        disclaimer_accepted_at: '2026-01-01T00:00:00Z',
        onboarding_completed_at: '2026-01-01T00:00:00Z',
      },
      goals: [
        { goal: 'strength', priority: 2 },
        { goal: 'muscle_gain', priority: 1 },
      ],
      limitations: { zones: ['knees'], note: null },
      metrics: {
        measured_at: '2026-01-01',
        body_fat_pct: null,
        chest_cm: null,
        waist_cm: 80,
        hips_cm: null,
        biceps_cm: null,
      },
    });
    expect(draft).toMatchObject({
      disclaimerAccepted: true,
      heightCm: 180.3,
      weightKg: 81.65,
      goals: { primary: 'muscle_gain', secondary: 'strength' },
      limitationNote: '',
      girths: { chest: null, waist: 80, hips: null, biceps: null },
    });
  });
});
