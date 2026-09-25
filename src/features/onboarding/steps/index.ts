import type { ComponentType } from 'react';

import type { ProfileDraft } from '@/features/profile/types';
import { ageOn, isAllowedAge } from '@/logic/age';
import { isValidGoalSelection } from '@/logic/goals';
import type { OnboardingStep } from '@/logic/onboarding';
import { BODY_FAT_PCT, GIRTHS_CM, HEIGHT_CM, WEIGHT_KG, type Girth } from '@/logic/profile';

import {
  CardioStep,
  DaysStep,
  DisclaimerStep,
  EquipmentStep,
  GoalsStep,
  LevelStep,
  LocationsStep,
  ModeStep,
  SexStep,
} from './ChoiceSteps';
import { BirthDateStep, HeightStep, LimitationsStep, MetricsStep, WeightStep } from './InputSteps';
import type { StepProps } from './types';

type StepConfig = {
  Component: ComponentType<StepProps>;
  /** Whether the answer lets the user continue. */
  isComplete: (draft: ProfileDraft) => boolean;
  /** Values reset when an optional step is skipped. */
  skipPatch?: Partial<ProfileDraft>;
};

const inRange = (value: number | null, range: { min: number; max: number }) =>
  value !== null && value >= range.min && value <= range.max;

const optionalInRange = (value: number | null, range: { min: number; max: number }) =>
  value === null || inRange(value, range);

export const STEP_CONFIG: Record<OnboardingStep, StepConfig> = {
  disclaimer: { Component: DisclaimerStep, isComplete: (d) => d.disclaimerAccepted },
  sex: { Component: SexStep, isComplete: (d) => d.sex !== null },
  birthDate: {
    Component: BirthDateStep,
    isComplete: (d) => d.birthDate !== null && isAllowedAge(ageOn(d.birthDate, new Date())),
  },
  height: { Component: HeightStep, isComplete: (d) => inRange(d.heightCm, HEIGHT_CM) },
  weight: { Component: WeightStep, isComplete: (d) => inRange(d.weightKg, WEIGHT_KG) },
  level: { Component: LevelStep, isComplete: (d) => d.level !== null },
  locations: { Component: LocationsStep, isComplete: (d) => d.locations.length > 0 },
  equipment: { Component: EquipmentStep, isComplete: (d) => d.equipment.length > 0 },
  days: { Component: DaysStep, isComplete: (d) => d.daysPerWeek !== null },
  mode: { Component: ModeStep, isComplete: (d) => d.trainingMode !== null },
  cardio: { Component: CardioStep, isComplete: (d) => d.cardio !== null },
  goals: { Component: GoalsStep, isComplete: (d) => isValidGoalSelection(d.goals) },
  limitations: {
    Component: LimitationsStep,
    isComplete: () => true,
    skipPatch: { limitationZones: [], limitationNote: '' },
  },
  metrics: {
    Component: MetricsStep,
    isComplete: (d) =>
      optionalInRange(d.bodyFatPct, BODY_FAT_PCT) &&
      (Object.keys(GIRTHS_CM) as Girth[]).every((g) => optionalInRange(d.girths[g], GIRTHS_CM[g])),
    skipPatch: {
      bodyFatPct: null,
      girths: { chest: null, waist: null, hips: null, biceps: null },
    },
  },
};

/** First step to show when (re)entering onboarding. */
export function firstIncompleteStep(steps: OnboardingStep[], draft: ProfileDraft): OnboardingStep {
  return steps.find((s) => !STEP_CONFIG[s].isComplete(draft)) ?? steps[steps.length - 1]!;
}
