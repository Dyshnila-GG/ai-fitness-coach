import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

export function BackHeader() {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <View className="h-10 flex-row items-center">
      <Pressable accessibilityRole="button" onPress={router.back} hitSlop={12}>
        <Text className="text-base text-muted">{`‹ ${t('common.back')}`}</Text>
      </Pressable>
    </View>
  );
}
