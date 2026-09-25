import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

export default function HomeScreen() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <Text className="text-2xl font-bold text-foreground">{t('home.title')}</Text>
      <Text className="mt-2 text-base text-muted">{t('home.subtitle')}</Text>
    </View>
  );
}
