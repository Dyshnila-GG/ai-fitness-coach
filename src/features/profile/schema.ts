import { z } from 'zod';

import { ageOn, isAllowedAge } from '@/logic/age';
import { GOALS } from '@/logic/goals';
import { needsEquipment } from '@/logic/onboarding';
import {
  BODY_FAT_PCT,
  CARDIO_OPTIONS,
  DAYS_PER_WEEK,
  EQUIPMENT,
  GIRTHS_CM,
  HEIGHT_CM,
  HEIGHT_UNITS,
  LEVELS,
  LIMITATION_NOTE_MAX,
  LIMITATION_ZONES,
  LOCATIONS,
  SEXES,
  TRAINING_MODES,
  WEIGHT_KG,
  WEIGHT_UNITS,
} from '@/logic/profile';

import type { ProfileDraft } from './types';

const round = (decimals: number) => (v: number) => Number(v.toFixed(decimals));
const range = (r: { min: number; max: number }) => z.number().min(r.min).max(r.max);
const optionalRange = (r: { min: number; max: number }) => range(r).nullable();

/** Payload of the save_onboarding RPC (snake_case, canonical units). */
export const savePayloadSchema = z
  .object({
    disclaimer_accepted: z.literal(true),
    sex: z.enum(SEXES),
    birth_date: z.iso.date(),
    height_cm: range(HEIGHT_CM).transform(round(1)),
    height_unit: z.enum(HEIGHT_UNITS),
    weight_kg: range(WEIGHT_KG).transform(round(2)),
    weight_unit: z.enum(WEIGHT_UNITS),
    level: z.enum(LEVELS),
    locations: z.array(z.enum(LOCATIONS)).min(1),
    equipment: z.array(z.enum(EQUIPMENT)),
    days_per_week: z.number().int().min(DAYS_PER_WEEK.min).max(DAYS_PER_WEEK.max),
    training_mode: z.enum(TRAINING_MODES),
    cardio: z.enum(CARDIO_OPTIONS),
    goals: z.object({ primary: z.enum(GOALS), secondary: z.enum(GOALS).nullable() }),
    limitations: z.object({
      zones: z.array(z.enum(LIMITATION_ZONES)),
      note: z.string().trim().max(LIMITATION_NOTE_MAX),
    }),
    metrics: z.object({
      body_fat_pct: optionalRange(BODY_FAT_PCT),
      chest_cm: optionalRange(GIRTHS_CM.chest),
      waist_cm: optionalRange(GIRTHS_CM.waist),
      hips_cm: optionalRange(GIRTHS_CM.hips),
      biceps_cm: optionalRange(GIRTHS_CM.biceps),
    }),
  })
  .superRefine((p, ctx) => {
    if (!isAllowedAge(ageOn(p.birth_date, new Date()))) {
      ctx.addIssue({ code: 'custom', path: ['birth_date'], message: 'age' });
    }
    if (needsEquipment(p.locations) && p.equipment.length === 0) {
      ctx.addIssue({ code: 'custom', path: ['equipment'], message: 'required' });
    }
    if (p.equipment.includes('none') && p.equipment.length > 1) {
      ctx.addIssue({ code: 'custom', path: ['equipment'], message: 'none_exclusive' });
    }
    if (p.goals.primary === p.goals.secondary) {
      ctx.addIssue({ code: 'custom', path: ['goals'], message: 'duplicate' });
    }
  });

export type SavePayload = z.output<typeof savePayloadSchema>;

export function toSavePayload(draft: ProfileDraft) {
  return savePayloadSchema.safeParse({
    disclaimer_accepted: draft.disclaimerAccepted,
    sex: draft.sex,
    birth_date: draft.birthDate,
    height_cm: draft.heightCm,
    height_unit: draft.heightUnit,
    weight_kg: draft.weightKg,
    weight_unit: draft.weightUnit,
    level: draft.level,
    locations: draft.locations,
    // Equipment is irrelevant for gym-only training.
    equipment: needsEquipment(draft.locations) ? draft.equipment : [],
    days_per_week: draft.daysPerWeek,
    training_mode: draft.trainingMode,
    cardio: draft.cardio,
    goals: draft.goals,
    limitations: { zones: draft.limitationZones, note: draft.limitationNote },
    metrics: {
      body_fat_pct: draft.bodyFatPct,
      chest_cm: draft.girths.chest,
      waist_cm: draft.girths.waist,
      hips_cm: draft.girths.hips,
      biceps_cm: draft.girths.biceps,
    },
  });
}
