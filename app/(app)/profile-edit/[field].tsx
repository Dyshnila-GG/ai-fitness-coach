import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { useAuth } from '@/features/auth/AuthProvider';
import { STEP_CONFIG } from '@/features/onboarding/steps';
import { EquipmentStep } from '@/features/onboarding/steps/ChoiceSteps';
import { useProfile, useSaveProfile } from '@/features/profile/api';
import { draftFromBundle } from '@/features/profile/draft';
import type { ProfileField } from '@/features/profile/format';
import { toSavePayload } from '@/features/profile/schema';
import type { ProfileBundle, ProfileDraft } from '@/features/profile/types';
import { ONBOARDING_STEPS, needsEquipment } from '@/logic/onboarding';

function isField(value: unknown): value is ProfileField {
  return value !== 'disclaimer' && ONBOARDING_STEPS.includes(value as ProfileField);
}

export default function ProfileEditScreen() {
  const { field } = useLocalSearchParams<{ field: string }>();
  const { session } = useAuth();
  const { data } = useProfile(session?.user.id);

  if (!isField(field) || !data?.profile) return <Redirect href="/profile" />;
  return <EditForm field={field} bundle={{ ...data, profile: data.profile }} />;
}

type EditFormProps = {
  field: ProfileField;
  bundle: ProfileBundle & { profile: NonNullable<ProfileBundle['profile']> };
};

function EditForm({ field, bundle }: EditFormProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { session } = useAuth();
  const save = useSaveProfile(session?.user.id);
  const [draft, setDraft] = useState<ProfileDraft>(() => draftFromBundle(bundle));
  const [error, setError] = useState<string | null>(null);
  const update = (patch: Partial<ProfileDraft>) => setDraft((d) => ({ ...d, ...patch }));

  const { Component, isComplete } = STEP_CONFIG[field];
  // Changing locations to home/outdoor requires equipment on the same screen.
  const withEquipment = field === 'locations' && needsEquipment(draft.locations);
  const complete = isComplete(draft) && (!withEquipment || STEP_CONFIG.equipment.isComplete(draft));

  const submit = () => {
    const result = toSavePayload(draft);
    if (!result.success) {
      setError(t('onboarding.invalid'));
      return;
    }
    setError(null);
    save.mutate(result.data, {
      onSuccess: () => router.back(),
      onError: () => setError(t('profile.saveError')),
    });
  };

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
        <>
          {error ? <Text className="text-center text-sm text-danger">{error}</Text> : null}
          <Button
            testID="profile-save"
            title={t('common.save')}
            onPress={submit}
            disabled={!complete}
            loading={save.isPending}
          />
        </>
      }
    >
      <Text className="text-3xl font-bold text-foreground">{t(`onboarding.${field}.title`)}</Text>
      <Component draft={draft} update={update} />
      {withEquipment ? (
        <>
          <Text className="mt-4 text-xl font-bold text-foreground">
            {t('onboarding.equipment.title')}
          </Text>
          <EquipmentStep draft={draft} update={update} />
        </>
      ) : null}
    </Screen>
  );
}
