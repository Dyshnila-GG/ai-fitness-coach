import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { ChipGroup } from '@/components/ChipGroup';
import {
  EQUIPMENT_CATEGORIES,
  findAlternatives,
  type EquipmentCategory,
  type Exercise,
} from '@/logic/exercises';

import { ExerciseRow } from './ExerciseRow';
import { useExerciseLang } from './useExerciseLang';

type Props = {
  exercise: Exercise;
  library: readonly Exercise[];
  curatedIds: readonly string[];
  onSelect: (exercise: Exercise) => void;
};

/** Replacement list with the free weight / machine / bodyweight filter (SPEC §6). */
export function AlternativesList({ exercise, library, curatedIds, onSelect }: Props) {
  const { t } = useTranslation();
  const lang = useExerciseLang();
  const [category, setCategory] = useState<EquipmentCategory | null>(null);
  const items = findAlternatives(exercise, library, curatedIds, lang, category);

  return (
    <View className="gap-4">
      <ChipGroup
        options={[
          { value: null, label: t('exercises.anyEquipment') },
          ...EQUIPMENT_CATEGORIES.map((c) => ({ value: c, label: t(`exercises.categories.${c}`) })),
        ]}
        value={category}
        onChange={setCategory}
      />
      {items.length === 0 ? (
        <Text className="text-base text-muted">{t('exercises.noAlternatives')}</Text>
      ) : (
        items.map((e) => <ExerciseRow key={e.id} exercise={e} onPress={() => onSelect(e)} />)
      )}
    </View>
  );
}
