import { Pressable, Text, View } from 'react-native';

type Props = {
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
  /** Shown instead of the default check mark, e.g. "Основная". */
  badge?: string;
  multi?: boolean;
};

export function OptionCard({ label, description, selected, onPress, badge, multi }: Props) {
  return (
    <Pressable
      accessibilityRole={multi ? 'checkbox' : 'radio'}
      accessibilityState={multi ? { checked: selected } : { selected }}
      onPress={onPress}
      className={`flex-row items-center rounded-2xl border px-4 py-4 active:opacity-80 ${
        selected ? 'border-primary bg-surface' : 'border-border bg-surface'
      }`}
    >
      <View className="flex-1 gap-1">
        <Text className="text-base font-medium text-foreground">{label}</Text>
        {description ? <Text className="text-sm text-muted">{description}</Text> : null}
      </View>
      {badge ? (
        <Text className="ml-3 text-xs font-semibold uppercase text-primary">{badge}</Text>
      ) : (
        <View
          className={`ml-3 h-6 w-6 items-center justify-center border-2 ${
            multi ? 'rounded-md' : 'rounded-full'
          } ${selected ? 'border-primary bg-primary' : 'border-border'}`}
        >
          {selected ? <Text className="text-xs font-bold text-background">✓</Text> : null}
        </View>
      )}
    </Pressable>
  );
}
