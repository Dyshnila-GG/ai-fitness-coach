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
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!isValidEmail(email)) {
      setEmailError(t('auth.invalidEmail'));
      return;
    }
    setLoading(true);
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: normalizeEmail(email),
      password,
    });
    setLoading(false);
    // On success the auth listener switches the navigator to onboarding or home.
    if (signInError) setError(t(`auth.errors.${authErrorKey(signInError)}`));
  };

  return (
    <Screen
      footer={
        <>
          <Button
            testID="sign-in-submit"
            title={t('auth.signIn.submit')}
            onPress={() => void submit()}
            loading={loading}
            disabled={email.trim() === '' || password === ''}
          />
          <Button
            variant="ghost"
            title={t('auth.signIn.toSignUp')}
            onPress={() => router.push('/sign-up')}
          />
        </>
      }
    >
      <Text className="mt-10 text-3xl font-bold text-foreground">{t('auth.signIn.title')}</Text>
      <Text className="text-base text-muted">{t('auth.signIn.subtitle')}</Text>
      <TextField
        label={t('auth.emailLabel')}
        placeholder={t('auth.emailPlaceholder')}
        value={email}
        onChangeText={(value) => {
          setEmail(value);
          setEmailError(null);
          setError(null);
        }}
        error={emailError}
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        keyboardType="email-address"
        textContentType="emailAddress"
        returnKeyType="next"
      />
      <TextField
        label={t('auth.passwordLabel')}
        value={password}
        onChangeText={(value) => {
          setPassword(value);
          setError(null);
        }}
        error={error}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="current-password"
        autoCorrect={false}
        textContentType="password"
        returnKeyType="go"
        onSubmitEditing={() => void submit()}
      />
    </Screen>
  );
}
