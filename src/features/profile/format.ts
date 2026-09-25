import type { TFunction } from 'i18next';

import { ageOn } from '@/logic/age';
import type { OnboardingStep } from '@/logic/onboarding';
import { GIRTHS_CM, type Girth } from '@/logic/profile';
import { cmToFtIn, kgToLb } from '@/logic/units';

import type { ProfileDraft } from './types';

export type ProfileField = Exclude<OnboardingStep, 'disclaimer'>;

const trim = (n: number) => String(Number(n.toFixed(1)));

/** Human-readable value of a profile field for the profile screen. */
export function formatProfileValue(
  field: ProfileField,
  d: ProfileDraft,
  t: TFunction,
  locale: string,
): string {
  const notSet = t('common.notSet');
  switch (field) {
    case 'sex':
      return d.sex ? t(`options.sex.${d.sex}`) : notSet;
    case 'birthDate': {
      if (!d.birthDate) return notSet;
      const [y, m, day] = d.birthDate.split('-').map(Number);
      const date = new Date(y ?? 2000, (m ?? 1) - 1, day ?? 1).toLocaleDateString(locale);
      return `${date} · ${t('onboarding.birthDate.age', { age: ageOn(d.birthDate, new Date()) })}`;
    }
    case 'height': {
      if (d.heightCm === null) return notSet;
      if (d.heightUnit === 'cm') return `${Math.round(d.heightCm)} ${t('units.cm')}`;
      const { ft, in: inches } = cmToFtIn(d.heightCm);
      return `${ft}′${inches}″`;
    }
    case 'weight':
      if (d.weightKg === null) return notSet;
      return d.weightUnit === 'kg'
        ? `${trim(d.weightKg)} ${t('units.kg')}`
        : `${trim(kgToLb(d.weightKg))} ${t('units.lb')}`;
    case 'level':
      return d.level ? t(`options.level.${d.level}`) : notSet;
    case 'locations':
      return d.locations.map((l) => t(`options.locations.${l}`)).join(', ') || notSet;
    case 'equipment':
      return d.equipment.map((e) => t(`options.equipment.${e}`)).join(', ') || notSet;
    case 'days':
      return d.daysPerWeek === null ? notSet : String(d.daysPerWeek);
    case 'mode':
      return d.trainingMode ? t(`options.mode.${d.trainingMode}`) : notSet;
    case 'cardio':
      return d.cardio ? t(`options.cardio.${d.cardio}`) : notSet;
    case 'goals':
      return (
        [d.goals.primary, d.goals.secondary]
          .filter((g) => g !== null)
          .map((g) => t(`options.goals.${g}`))
          .join(' + ') || notSet
      );
    case 'limitations': {
      const parts = d.limitationZones.map((z) => t(`options.zones.${z}`));
      if (d.limitationNote.trim()) parts.push(d.limitationNote.trim());
      return parts.join(', ') || notSet;
    }
    case 'metrics': {
      const parts: string[] = [];
      if (d.bodyFatPct !== null) parts.push(`${t('fields.bodyFat')} ${trim(d.bodyFatPct)}%`);
      for (const g of Object.keys(GIRTHS_CM) as Girth[]) {
        const v = d.girths[g];
        if (v !== null) parts.push(`${t(`fields.${g}`)} ${trim(v)} ${t('units.cm')}`);
      }
      return parts.join(' · ') || notSet;
    }
  }
}
