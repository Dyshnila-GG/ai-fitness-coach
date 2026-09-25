import { Redirect } from 'expo-router';

import { firstIncompleteStep } from '@/features/onboarding/steps';
import { useOnboardingHydrated, useOnboardingStore } from '@/features/onboarding/store';
import { getOnboardingSteps } from '@/logic/onboarding';

export default function OnboardingIndex() {
  const hydrated = useOnboardingHydrated();
  const draft = useOnboardingStore((s) => s.draft);
  if (!hydrated) return null;
  const step = firstIncompleteStep(getOnboardingSteps(draft.locations), draft);
  return <Redirect href={{ pathname: '/onboarding/[step]', params: { step } }} />;
}
