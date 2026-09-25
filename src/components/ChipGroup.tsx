import { Pressable, ScrollView, Text } from 'react-native';

type Props<T extends string> = {
  /** `null` value = "all" option. */
  options: readonly { value: T | null; label: string }[];
  value: T | null;
  onChange: (value: T | null) => void;
};

/** Horizontally scrolling single-select chips (filters). */
export function ChipGroup<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2"
      keyboardShouldPersistTaps="handled"
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value ?? 'all'}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            className={`rounded-full border px-4 py-2 active:opacity-80 ${
              selected ? 'border-primary bg-primary' : 'border-border bg-surface'
            }`}
          >
            <Text className={selected ? 'font-semibold text-background' : 'text-foreground'}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
