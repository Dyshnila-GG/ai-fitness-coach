import { Text, TextInput, View, type TextInputProps } from 'react-native';

type Props = TextInputProps & {
  label?: string;
  error?: string | null;
  suffix?: string;
};

export function TextField({ label, error, suffix, className, ...input }: Props) {
  return (
    <View className={`gap-2 ${className ?? ''}`}>
      {label ? <Text className="text-sm text-muted">{label}</Text> : null}
      <View
        className={`flex-row items-center rounded-2xl border bg-surface px-4 ${
          error ? 'border-danger' : 'border-border'
        }`}
      >
        <TextInput
          placeholderTextColor="#9A9AA8"
          className="h-14 flex-1 text-lg text-foreground"
          accessibilityLabel={label}
          {...input}
        />
        {suffix ? <Text className="ml-2 text-base text-muted">{suffix}</Text> : null}
      </View>
      {error ? <Text className="text-sm text-danger">{error}</Text> : null}
    </View>
  );
}
