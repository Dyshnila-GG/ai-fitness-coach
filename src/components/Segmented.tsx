import { Pressable, Text, View } from 'react-native';

type Props<T extends string> = {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
};

export function Segmented<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <View className="flex-row rounded-xl border border-border bg-surface p-1">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            className={`flex-1 items-center rounded-lg py-2 ${selected ? 'bg-primary' : ''}`}
          >
            <Text className={selected ? 'font-semibold text-background' : 'text-muted'}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
