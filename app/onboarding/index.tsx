import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

import { Screen } from '@/components/Screen';

// Replaced by the step flow in the next commit.
export default function OnboardingIndex() {
  const { t } = useTranslation();
  return (
    <Screen>
      <Text className="text-2xl font-bold text-foreground">{t('onboarding.disclaimer.title')}</Text>
    </Screen>
  );
}
