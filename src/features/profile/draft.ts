import { defaultUnits } from '@/logic/units';

import type { ProfileBundle, ProfileDraft } from './types';

export function emptyDraft(regionCode: string | null | undefined): ProfileDraft {
  const units = defaultUnits(regionCode);
  return {
    disclaimerAccepted: false,
    sex: null,
    birthDate: null,
    heightCm: null,
    heightUnit: units.height,
    weightKg: null,
    weightUnit: units.weight,
    level: null,
    locations: [],
    equipment: [],
    daysPerWeek: null,
    trainingMode: null,
    cardio: null,
    goals: { primary: null, secondary: null },
    limitationZones: [],
    limitationNote: '',
    bodyFatPct: null,
    girths: { chest: null, waist: null, hips: null, biceps: null },
  };
}

/** Builds an editable draft from the saved profile. */
export function draftFromBundle(
  bundle: ProfileBundle & { profile: NonNullable<ProfileBundle['profile']> },
): ProfileDraft {
  const { profile, goals, limitations, metrics } = bundle;
  const num = (v: number | string | null | undefined) =>
    v === null || v === undefined ? null : Number(v);
  return {
    disclaimerAccepted: true,
    sex: profile.sex,
    birthDate: profile.birth_date,
    heightCm: num(profile.height_cm),
    heightUnit: profile.height_unit,
    weightKg: num(profile.weight_kg),
    weightUnit: profile.weight_unit,
    level: profile.level,
    locations: profile.locations,
    equipment: profile.equipment,
    daysPerWeek: profile.days_per_week,
    trainingMode: profile.training_mode,
    cardio: profile.cardio,
    goals: {
      primary: goals.find((g) => g.priority === 1)?.goal ?? null,
      secondary: goals.find((g) => g.priority === 2)?.goal ?? null,
    },
    limitationZones: limitations?.zones ?? [],
    limitationNote: limitations?.note ?? '',
    bodyFatPct: num(metrics?.body_fat_pct),
    girths: {
      chest: num(metrics?.chest_cm),
      waist: num(metrics?.waist_cm),
      hips: num(metrics?.hips_cm),
      biceps: num(metrics?.biceps_cm),
    },
  };
}
