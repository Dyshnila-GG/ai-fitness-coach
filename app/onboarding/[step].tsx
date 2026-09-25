import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { useAuth } from '@/features/auth/AuthProvider';
import { STEP_CONFIG } from '@/features/onboarding/steps';
import { useOnboardingStore } from '@/features/onboarding/store';
import { useSaveProfile } from '@/features/profile/api';
import { toSavePayload } from '@/features/profile/schema';
import {
  ONBOARDING_STEPS,
  getOnboardingSteps,
  isOptionalStep,
  type OnboardingStep,
} from '@/logic/onboarding';

function isStep(value: unknown): value is OnboardingStep {
  return ONBOARDING_STEPS.includes(value as OnboardingStep);
}

export default function OnboardingStepScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { step } = useLocalSearchParams<{ step: string }>();
  const { session } = useAuth();
  const draft = useOnboardingStore((s) => s.draft);
  const update = useOnboardingStore((s) => s.update);
  const reset = useOnboardingStore((s) => s.reset);
  const save = useSaveProfile(session?.user.id);
  const [error, setError] = useState<string | null>(null);

  const steps = getOnboardingSteps(draft.locations);
  if (!isStep(step) || !steps.includes(step)) return <Redirect href="/onboarding" />;

  const index = steps.indexOf(step);
  const isLast = index === steps.length - 1;
  const config = STEP_CONFIG[step];
  const optional = isOptionalStep(step);

  const goTo = (target: OnboardingStep) =>
    router.push({ pathname: '/onboarding/[step]', params: { step: target } });

  const back = () => {
    const prev = steps[index - 1];
    if (!prev) return;
    if (router.canGoBack()) router.back();
    else router.replace({ pathname: '/onboarding/[step]', params: { step: prev } });
  };

  const finish = (patch: Partial<typeof draft> = {}) => {
    const result = toSavePayload({ ...draft, ...patch });
    if (!result.success) {
      setError(t('onboarding.invalid'));
      return;
    }
    setError(null);
    // On success the profile query refreshes and the navigator switches to the app.
    save.mutate(result.data, {
      onSuccess: reset,
      onError: () => setError(t('onboarding.saveError')),
    });
  };

  const next = (patch: Partial<typeof draft> = {}) => {
    if (Object.keys(patch).length > 0) update(patch);
    const target = steps[index + 1];
    if (isLast || !target) finish(patch);
    else goTo(target);
  };

  return (
    <Screen
      header={
        <View className="gap-3">
          <View className="h-10 flex-row items-center justify-between">
            {index > 0 ? (
              <Pressable accessibilityRole="button" onPress={back} hitSlop={12}>
                <Text className="text-base text-muted">{`‹ ${t('common.back')}`}</Text>
              </Pressable>
            ) : (
              <View />
            )}
            <Text className="text-sm text-muted">
              {t('onboarding.progress', { current: index + 1, total: steps.length })}
            </Text>
          </View>
          <ProgressBar progress={(index + 1) / steps.length} />
        </View>
      }
      footer={
        <>
          {error ? <Text className="text-center text-sm text-danger">{error}</Text> : null}
          <Button
            testID="onboarding-next"
            title={isLast ? t('onboarding.finish') : t('common.next')}
            onPress={() => next()}
            disabled={!config.isComplete(draft)}
            loading={save.isPending}
          />
          {optional ? (
            <Button
              variant="ghost"
              title={t('common.skip')}
              onPress={() => next(config.skipPatch)}
              disabled={save.isPending}
            />
          ) : null}
        </>
      }
    >
      <Text className="text-3xl font-bold text-foreground">{t(`onboarding.${step}.title`)}</Text>
      <StepSubtitle step={step} />
      <config.Component draft={draft} update={update} />
    </Screen>
  );
}

const SUBTITLES: Partial<Record<OnboardingStep, true>> = {
  birthDate: true,
  locations: true,
  equipment: true,
  goals: true,
  limitations: true,
  metrics: true,
};

function StepSubtitle({ step }: { step: OnboardingStep }) {
  const { t } = useTranslation();
  if (!SUBTITLES[step]) return null;
  return (
    <Text className="text-base text-muted">{t(`onboarding.${step as 'birthDate'}.subtitle`)}</Text>
  );
}
