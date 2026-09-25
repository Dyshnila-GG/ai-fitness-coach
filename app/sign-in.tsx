import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { isValidEmail, normalizeEmail } from '@/features/auth/email';
import { authErrorKey } from '@/features/auth/errors';
import { supabase } from '@/lib/supabase';

export default function SignInScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!isValidEmail(email)) {
      setError(t('auth.signIn.invalidEmail'));
      return;
    }
    const normalized = normalizeEmail(email);
    setLoading(true);
    setError(null);
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: normalized,
      options: { shouldCreateUser: true },
    });
    setLoading(false);
    if (otpError) {
      setError(t(`auth.errors.${authErrorKey(otpError)}`));
      return;
    }
    router.push({ pathname: '/verify', params: { email: normalized } });
  };

  return (
    <Screen
      footer={
        <Button
          testID="sign-in-submit"
          title={t('auth.signIn.submit')}
          onPress={() => void submit()}
          loading={loading}
          disabled={email.trim() === ''}
        />
      }
    >
      <Text className="mt-10 text-3xl font-bold text-foreground">{t('auth.signIn.title')}</Text>
      <Text className="text-base text-muted">{t('auth.signIn.subtitle')}</Text>
      <TextField
        label={t('auth.signIn.emailLabel')}
        placeholder={t('auth.signIn.emailPlaceholder')}
        value={email}
        onChangeText={(value) => {
          setEmail(value);
          setError(null);
        }}
        error={error}
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        keyboardType="email-address"
        textContentType="emailAddress"
        returnKeyType="send"
        onSubmitEditing={() => void submit()}
      />
    </Screen>
  );
}
