import '../global.css';
import '@/i18n';

import { QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router/stack';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { resolveAccess } from '@/features/auth/access';
import { AuthProvider, useAuth } from '@/features/auth/AuthProvider';
import { useProfile } from '@/features/profile/api';
import { queryClient } from '@/lib/query-client';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider value={DarkTheme}>
          <StatusBar style="light" />
          <RootNavigator />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

function RootNavigator() {
  const { session, isLoading } = useAuth();
  const profile = useProfile(session?.user.id);
  const access = resolveAccess({
    authLoading: isLoading,
    hasSession: !!session,
    profileStatus: profile.status,
    onboardingCompleted: !!profile.data?.profile?.onboarding_completed_at,
  });

  useEffect(() => {
    if (access !== 'loading') SplashScreen.hide();
  }, [access]);

  if (access === 'error') return <ProfileLoadError onRetry={() => void profile.refetch()} />;

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0B0B0F' } }}>
      <Stack.Protected guard={access === 'app'}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      <Stack.Protected guard={access === 'onboarding'}>
        <Stack.Screen name="onboarding" />
      </Stack.Protected>
      <Stack.Protected guard={access === 'auth' || access === 'loading'}>
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="sign-up" />
      </Stack.Protected>
    </Stack>
  );
}

function ProfileLoadError({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslation();
  return (
    <View className="flex-1 justify-center gap-4 bg-background px-6">
      <Text className="text-xl font-bold text-foreground">{t('access.errorTitle')}</Text>
      <Text className="text-base text-muted">{t('access.errorText')}</Text>
      <Button title={t('common.retry')} onPress={onRetry} />
    </View>
  );
}
