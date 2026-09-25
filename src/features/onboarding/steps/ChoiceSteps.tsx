import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { OptionCard } from '@/components/OptionCard';
import { GOALS, toggleGoal } from '@/logic/goals';
import { toggleEquipment, toggleInList } from '@/logic/onboarding';
import {
  CARDIO_OPTIONS,
  DAYS_PER_WEEK,
  EQUIPMENT,
  LEVELS,
  LOCATIONS,
  SEXES,
  TRAINING_MODES,
} from '@/logic/profile';

import type { StepProps } from './types';

export function DisclaimerStep({ draft, update }: StepProps) {
  const { t } = useTranslation();
  return (
    <>
      <Text className="text-base leading-6 text-foreground">{t('onboarding.disclaimer.text')}</Text>
      <OptionCard
        multi
        label={t('onboarding.disclaimer.accept')}
        selected={draft.disclaimerAccepted}
        onPress={() => update({ disclaimerAccepted: !draft.disclaimerAccepted })}
      />
    </>
  );
}

export function SexStep({ draft, update }: StepProps) {
  const { t } = useTranslation();
  return SEXES.map((sex) => (
    <OptionCard
      key={sex}
      label={t(`options.sex.${sex}`)}
      selected={draft.sex === sex}
      onPress={() => update({ sex })}
    />
  ));
}

export function LevelStep({ draft, update }: StepProps) {
  const { t } = useTranslation();
  return LEVELS.map((level) => (
    <OptionCard
      key={level}
      label={t(`options.level.${level}`)}
      description={t(`options.level.${level}Hint`)}
      selected={draft.level === level}
      onPress={() => update({ level })}
    />
  ));
}

export function LocationsStep({ draft, update }: StepProps) {
  const { t } = useTranslation();
  return LOCATIONS.map((location) => (
    <OptionCard
      key={location}
      multi
      label={t(`options.locations.${location}`)}
      selected={draft.locations.includes(location)}
      onPress={() => update({ locations: toggleInList(draft.locations, location) })}
    />
  ));
}

export function EquipmentStep({ draft, update }: StepProps) {
  const { t } = useTranslation();
  return EQUIPMENT.map((item) => (
    <OptionCard
      key={item}
      multi
      label={t(`options.equipment.${item}`)}
      selected={draft.equipment.includes(item)}
      onPress={() => update({ equipment: toggleEquipment(draft.equipment, item) })}
    />
  ));
}

const DAY_OPTIONS = Array.from(
  { length: DAYS_PER_WEEK.max - DAYS_PER_WEEK.min + 1 },
  (_, i) => DAYS_PER_WEEK.min + i,
);

export function DaysStep({ draft, update }: StepProps) {
  const { t } = useTranslation();
  return (
    <>
      <View className="flex-row gap-2">
        {DAY_OPTIONS.map((days) => {
          const selected = draft.daysPerWeek === days;
          return (
            <Pressable
              key={days}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={String(days)}
              onPress={() => update({ daysPerWeek: days })}
              className={`h-16 flex-1 items-center justify-center rounded-2xl border ${
                selected ? 'border-primary bg-primary' : 'border-border bg-surface'
              }`}
            >
              <Text
                className={`text-2xl font-bold ${selected ? 'text-background' : 'text-foreground'}`}
              >
                {days}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Text className="text-center text-muted">{t('onboarding.days.unit')}</Text>
    </>
  );
}

export function ModeStep({ draft, update }: StepProps) {
  const { t } = useTranslation();
  return TRAINING_MODES.map((mode) => (
    <OptionCard
      key={mode}
      label={t(`options.mode.${mode}`)}
      description={t(`options.mode.${mode}Hint`)}
      selected={draft.trainingMode === mode}
      onPress={() => update({ trainingMode: mode })}
    />
  ));
}

export function CardioStep({ draft, update }: StepProps) {
  const { t } = useTranslation();
  return CARDIO_OPTIONS.map((cardio) => (
    <OptionCard
      key={cardio}
      label={t(`options.cardio.${cardio}`)}
      selected={draft.cardio === cardio}
      onPress={() => update({ cardio })}
    />
  ));
}

export function GoalsStep({ draft, update }: StepProps) {
  const { t } = useTranslation();
  const badgeFor = (goal: (typeof GOALS)[number]) => {
    if (draft.goals.primary === goal) return t('onboarding.goals.primary');
    if (draft.goals.secondary === goal) return t('onboarding.goals.secondary');
    return undefined;
  };
  return GOALS.map((goal) => (
    <OptionCard
      key={goal}
      multi
      label={t(`options.goals.${goal}`)}
      selected={draft.goals.primary === goal || draft.goals.secondary === goal}
      badge={badgeFor(goal)}
      onPress={() => update({ goals: toggleGoal(draft.goals, goal) })}
    />
  ));
}
