import { useLocalSearchParams, useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { BackHeader } from '@/components/BackHeader';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { ExerciseMedia } from '@/features/exercises/ExerciseMedia';
import { LibraryGate } from '@/features/exercises/LibraryGate';
import { useExerciseLang } from '@/features/exercises/useExerciseLang';
import {
  exerciseInstructions,
  exerciseMistakes,
  exerciseName,
  type Exercise,
  type Muscle,
} from '@/logic/exercises';

export default function ExerciseCardScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <Screen header={<BackHeader />}>
      <LibraryGate>
        {({ exercises }) => {
          const exercise = exercises.find((e) => e.id === id);
          if (!exercise) {
            return <Text className="text-base text-muted">{t('exercises.notFound')}</Text>;
          }
          return (
            <>
              <ExerciseCard exercise={exercise} />
              <Button
                variant="secondary"
                title={t('exercises.replace')}
                onPress={() =>
                  router.push({ pathname: '/exercises/[id]/replace', params: { id: exercise.id } })
                }
              />
            </>
          );
        }}
      </LibraryGate>
    </Screen>
  );
}

function ExerciseCard({ exercise: e }: { exercise: Exercise }) {
  const { t } = useTranslation();
  const lang = useExerciseLang();
  const muscles = (list: readonly Muscle[]) =>
    list.map((m) => t(`exercises.muscles.${m}`)).join(', ');
  const facts: [string, string][] = [
    [t('exercises.primaryMuscles'), muscles(e.primary_muscles)],
    ...(e.secondary_muscles.length
      ? [[t('exercises.secondaryMuscles'), muscles(e.secondary_muscles)] as [string, string]]
      : []),
    [t('exercises.equipmentLabel'), t(`exercises.equipment.${e.equipment}`)],
    [t('exercises.type'), t(e.is_compound ? 'exercises.compound' : 'exercises.isolation')],
    [t('exercises.difficulty'), t(`exercises.difficultyLevels.${e.difficulty}`)],
    ...(e.default_tempo ? [[t('exercises.tempo'), e.default_tempo] as [string, string]] : []),
  ];
  const mistakes = exerciseMistakes(e, lang);

  return (
    <>
      <ExerciseMedia key={e.id} urls={e.media_urls} />
      <Text className="text-3xl font-bold text-foreground">{exerciseName(e, lang)}</Text>
      {e.is_unilateral ? (
        <Text className="text-sm text-muted">{t('exercises.unilateral')}</Text>
      ) : null}

      <View className="overflow-hidden rounded-2xl border border-border bg-surface">
        {facts.map(([label, value], i) => (
          <View
            key={label}
            className={`flex-row justify-between gap-4 px-4 py-3 ${i > 0 ? 'border-t border-border' : ''}`}
          >
            <Text className="text-sm text-muted">{label}</Text>
            <Text className="flex-1 text-right text-sm text-foreground">{value}</Text>
          </View>
        ))}
      </View>

      <Section title={t('exercises.howTo')}>
        {exerciseInstructions(e, lang).map((step, i) => (
          <Text key={i} className="text-base text-foreground">{`${i + 1}. ${step}`}</Text>
        ))}
      </Section>

      {mistakes.length ? (
        <Section title={t('exercises.mistakes')}>
          {mistakes.map((m, i) => (
            <Text key={i} className="text-base text-foreground">{`• ${m}`}</Text>
          ))}
        </Section>
      ) : null}

      {e.contraindications.length ? (
        <Section title={t('exercises.contraindications')}>
          <Text className="text-base text-danger">
            {e.contraindications.map((z) => t(`options.zones.${z}`)).join(', ')}
          </Text>
        </Section>
      ) : null}
    </>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View className="gap-2">
      <Text className="text-lg font-semibold text-foreground">{title}</Text>
      {children}
    </View>
  );
}
