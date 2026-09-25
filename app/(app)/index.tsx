import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Button } from '@/components/Button';

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center gap-6 bg-background px-6">
      <View className="items-center">
        <Text className="text-2xl font-bold text-foreground">{t('home.title')}</Text>
        <Text className="mt-2 text-base text-muted">{t('home.subtitle')}</Text>
      </View>
      <Button
        variant="secondary"
        title={t('home.profile')}
        onPress={() => router.push('/profile')}
      />
    </View>
  );
}
