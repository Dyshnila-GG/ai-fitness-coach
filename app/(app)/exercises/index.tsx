import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

import { BackHeader } from '@/components/BackHeader';
import { ChipGroup } from '@/components/ChipGroup';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { ExerciseRow } from '@/features/exercises/ExerciseRow';
import { LibraryGate } from '@/features/exercises/LibraryGate';
import { useExerciseLang } from '@/features/exercises/useExerciseLang';
import {
  EQUIPMENT_CATEGORIES,
  availableMuscles,
  filterExercises,
  type EquipmentCategory,
  type Muscle,
} from '@/logic/exercises';

export default function ExerciseLibraryScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const lang = useExerciseLang();
  const [query, setQuery] = useState('');
  const [muscle, setMuscle] = useState<Muscle | null>(null);
  const [category, setCategory] = useState<EquipmentCategory | null>(null);

  return (
    <Screen header={<BackHeader />}>
      <Text className="text-3xl font-bold text-foreground">{t('exercises.title')}</Text>
      <TextField
        value={query}
        onChangeText={setQuery}
        placeholder={t('exercises.search')}
        accessibilityLabel={t('exercises.search')}
        autoCorrect={false}
        returnKeyType="search"
      />
      <LibraryGate>
        {({ exercises }) => {
          const items = filterExercises(exercises, { query, muscle, category }, lang);
          return (
            <>
              <ChipGroup
                options={[
                  { value: null, label: t('exercises.allMuscles') },
                  ...availableMuscles(exercises).map((m) => ({
                    value: m,
                    label: t(`exercises.muscles.${m}`),
                  })),
                ]}
                value={muscle}
                onChange={setMuscle}
              />
              <ChipGroup
                options={[
                  { value: null, label: t('exercises.anyEquipment') },
                  ...EQUIPMENT_CATEGORIES.map((c) => ({
                    value: c,
                    label: t(`exercises.categories.${c}`),
                  })),
                ]}
                value={category}
                onChange={setCategory}
              />
              {items.length === 0 ? (
                <Text className="text-base text-muted">{t('exercises.empty')}</Text>
              ) : (
                items.map((e) => (
                  <ExerciseRow
                    key={e.id}
                    exercise={e}
                    onPress={() =>
                      router.push({ pathname: '/exercises/[id]', params: { id: e.id } })
                    }
                  />
                ))
              )}
            </>
          );
        }}
      </LibraryGate>
    </Screen>
  );
}
