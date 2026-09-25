import { ActivityIndicator, Pressable, Text } from 'react-native';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  testID?: string;
};

const containerByVariant = {
  primary: 'bg-primary',
  secondary: 'border border-border bg-surface',
  ghost: 'bg-transparent',
} as const;

const textByVariant = {
  primary: 'text-background',
  secondary: 'text-foreground',
  ghost: 'text-muted',
} as const;

export function Button({ title, onPress, variant = 'primary', disabled, loading, testID }: Props) {
  const inactive = disabled || loading;
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      disabled={inactive}
      onPress={onPress}
      className={`h-14 items-center justify-center rounded-2xl px-6 ${containerByVariant[variant]} ${
        inactive ? 'opacity-40' : 'active:opacity-80'
      }`}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#0B0B0F' : '#F5F5F7'} />
      ) : (
        <Text className={`text-base font-semibold ${textByVariant[variant]}`}>{title}</Text>
      )}
    </Pressable>
  );
}
