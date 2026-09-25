import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  children: ReactNode;
  /** Pinned to the bottom, outside the scroll area (primary actions). */
  footer?: ReactNode;
  header?: ReactNode;
};

export function Screen({ children, footer, header }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {header ? <View className="px-6 pt-2">{header}</View> : null}
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 py-6 gap-4"
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
        {footer ? <View className="gap-3 px-6 pb-4">{footer}</View> : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
