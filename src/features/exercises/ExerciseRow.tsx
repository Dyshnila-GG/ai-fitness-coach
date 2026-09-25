import { useTranslation } from 'react-i18next';
import { Image, Pressable, Text, View } from 'react-native';

import { exerciseName, type Exercise } from '@/logic/exercises';

import { useExerciseLang } from './useExerciseLang';

type Props = { exercise: Exercise; onPress: () => void };

export function ExerciseRow({ exercise, onPress }: Props) {
  const { t } = useTranslation();
  const lang = useExerciseLang();
  const thumb = exercise.media_urls[0];
  const muscles = exercise.primary_muscles.map((m) => t(`exercises.muscles.${m}`)).join(', ');

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="flex-row items-center gap-3 rounded-2xl border border-border bg-surface p-3 active:opacity-80"
    >
      {thumb ? (
        <Image source={{ uri: thumb }} className="h-14 w-14 rounded-xl bg-white" />
      ) : (
        <View className="h-14 w-14 items-center justify-center rounded-xl bg-border">
          <Text className="text-xl">🏋️</Text>
        </View>
      )}
      <View className="flex-1 gap-1">
        <Text className="text-base font-medium text-foreground">
          {exerciseName(exercise, lang)}
        </Text>
        <Text className="text-sm text-muted">
          {`${muscles} · ${t(`exercises.equipment.${exercise.equipment}`)}`}
        </Text>
      </View>
    </Pressable>
  );
}
