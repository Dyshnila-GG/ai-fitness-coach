import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

import { BackHeader } from '@/components/BackHeader';
import { Screen } from '@/components/Screen';
import { AlternativesList } from '@/features/exercises/AlternativesList';
import { LibraryGate } from '@/features/exercises/LibraryGate';
import { useExerciseLang } from '@/features/exercises/useExerciseLang';
import { exerciseName } from '@/logic/exercises';

export default function ReplaceExerciseScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const lang = useExerciseLang();
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <Screen header={<BackHeader />}>
      <Text className="text-3xl font-bold text-foreground">{t('exercises.replaceTitle')}</Text>
      <LibraryGate>
        {({ exercises, alternatives }) => {
          const exercise = exercises.find((e) => e.id === id);
          if (!exercise) {
            return <Text className="text-base text-muted">{t('exercises.notFound')}</Text>;
          }
          return (
            <>
              <Text className="text-base text-muted">
                {t('exercises.replaceSubtitle', { name: exerciseName(exercise, lang) })}
              </Text>
              <AlternativesList
                exercise={exercise}
                library={exercises}
                curatedIds={alternatives[exercise.id] ?? []}
                onSelect={(alt) =>
                  router.push({ pathname: '/exercises/[id]', params: { id: alt.id } })
                }
              />
            </>
          );
        }}
      </LibraryGate>
    </Screen>
  );
}
