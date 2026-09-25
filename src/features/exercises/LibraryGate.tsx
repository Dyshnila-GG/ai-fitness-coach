import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Text, View } from 'react-native';

import { Button } from '@/components/Button';

import { useExerciseLibrary, type ExerciseLibrary } from './api';

type Props = { children: (library: ExerciseLibrary) => ReactNode };

/** Loading / error states around the exercise library. */
export function LibraryGate({ children }: Props) {
  const { t } = useTranslation();
  const { data, status, refetch } = useExerciseLibrary();

  if (data) return <>{children(data)}</>;
  if (status === 'error') {
    return (
      <View className="items-center gap-4 py-10">
        <Text className="text-center text-base text-muted">{t('exercises.loadError')}</Text>
        <Button variant="secondary" title={t('common.retry')} onPress={() => void refetch()} />
      </View>
    );
  }
  return (
    <View className="items-center py-10">
      <ActivityIndicator testID="exercises-loading" color="#4ADE80" />
    </View>
  );
}
