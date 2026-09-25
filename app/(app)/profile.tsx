import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { useAuth } from '@/features/auth/AuthProvider';
import { useOnboardingStore } from '@/features/onboarding/store';
import { useProfile } from '@/features/profile/api';
import { draftFromBundle } from '@/features/profile/draft';
import { formatProfileValue, type ProfileField } from '@/features/profile/format';
import { getOnboardingSteps } from '@/logic/onboarding';
import { supabase } from '@/lib/supabase';

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const { data } = useProfile(session?.user.id);

  const signOut = async () => {
    await supabase.auth.signOut();
    useOnboardingStore.getState().reset();
    queryClient.clear();
  };

  if (!data?.profile) return null;
  const draft = draftFromBundle({ ...data, profile: data.profile });
  const fields = getOnboardingSteps(draft.locations).filter(
    (s): s is ProfileField => s !== 'disclaimer',
  );

  return (
    <Screen
      header={
        <View className="h-10 flex-row items-center">
          <Pressable accessibilityRole="button" onPress={router.back} hitSlop={12}>
            <Text className="text-base text-muted">{`‹ ${t('common.back')}`}</Text>
          </Pressable>
        </View>
      }
      footer={
        <Button variant="secondary" title={t('profile.signOut')} onPress={() => void signOut()} />
      }
    >
      <Text className="text-3xl font-bold text-foreground">{t('profile.title')}</Text>
      <Text className="text-base text-muted">{session?.user.email}</Text>
      <View className="overflow-hidden rounded-2xl border border-border bg-surface">
        {fields.map((field, i) => (
          <Pressable
            key={field}
            accessibilityRole="button"
            accessibilityHint={t('profile.edit')}
            onPress={() => router.push({ pathname: '/profile-edit/[field]', params: { field } })}
            className={`gap-1 px-4 py-3 active:opacity-70 ${i > 0 ? 'border-t border-border' : ''}`}
          >
            <Text className="text-sm text-muted">{t(`fields.${field}`)}</Text>
            <Text className="text-base text-foreground">
              {formatProfileValue(field, draft, t, i18n.language)}
            </Text>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}
