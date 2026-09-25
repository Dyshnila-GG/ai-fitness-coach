import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import {
  isValidEmail,
  isValidPassword,
  MIN_PASSWORD_LENGTH,
  normalizeEmail,
} from '@/features/auth/email';
import { authErrorKey } from '@/features/auth/errors';
import { supabase } from '@/lib/supabase';

type Errors = { email?: string; password?: string; confirm?: string };

export default function SignUpScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const validate = (): Errors => {
    const next: Errors = {};
    if (!isValidEmail(email)) next.email = t('auth.invalidEmail');
    if (!isValidPassword(password)) {
      next.password = t('auth.signUp.passwordTooShort', { min: MIN_PASSWORD_LENGTH });
    }
    if (confirm !== password) next.confirm = t('auth.signUp.passwordMismatch');
    return next;
  };

  const submit = async () => {
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setLoading(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email: normalizeEmail(email),
      password,
    });
    setLoading(false);
    // Email confirmation is off: sign-up returns a session and the auth listener opens onboarding.
    if (signUpError) setErrors({ confirm: t(`auth.errors.${authErrorKey(signUpError)}`) });
  };

  const change = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setErrors({});
  };

  return (
    <Screen
      footer={
        <>
          <Button
            testID="sign-up-submit"
            title={t('auth.signUp.submit')}
            onPress={() => void submit()}
            loading={loading}
            disabled={email.trim() === '' || password === '' || confirm === ''}
          />
          <Button variant="ghost" title={t('auth.signUp.toSignIn')} onPress={router.back} />
        </>
      }
    >
      <Text className="mt-10 text-3xl font-bold text-foreground">{t('auth.signUp.title')}</Text>
      <Text className="text-base text-muted">
        {t('auth.signUp.subtitle', { min: MIN_PASSWORD_LENGTH })}
      </Text>
      <TextField
        label={t('auth.emailLabel')}
        placeholder={t('auth.emailPlaceholder')}
        value={email}
        onChangeText={change(setEmail)}
        error={errors.email}
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
        onChangeText={change(setPassword)}
        error={errors.password}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="new-password"
        autoCorrect={false}
        textContentType="newPassword"
        returnKeyType="next"
      />
      <TextField
        label={t('auth.signUp.confirmLabel')}
        value={confirm}
        onChangeText={change(setConfirm)}
        error={errors.confirm}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="new-password"
        autoCorrect={false}
        textContentType="newPassword"
        returnKeyType="go"
        onSubmitEditing={() => void submit()}
      />
    </Screen>
  );
}
