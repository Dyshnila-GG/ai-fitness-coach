import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { OTP_LENGTH, RESEND_COOLDOWN_SEC } from '@/features/auth/email';
import { authErrorKey } from '@/features/auth/errors';
import { supabase } from '@/lib/supabase';

export default function VerifyScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { email = '' } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SEC);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const verify = async (token: string) => {
    setLoading(true);
    setError(null);
    const { error: verifyError } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
    setLoading(false);
    // On success the auth listener switches the navigator to onboarding or home.
    if (verifyError) setError(t(`auth.errors.${authErrorKey(verifyError)}`));
  };

  const resend = async () => {
    setError(null);
    setInfo(null);
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    if (otpError) {
      setError(t(`auth.errors.${authErrorKey(otpError)}`));
      return;
    }
    setInfo(t('auth.verify.resent'));
    setCooldown(RESEND_COOLDOWN_SEC);
  };

  const onChangeCode = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, OTP_LENGTH);
    setCode(digits);
    setError(null);
    if (digits.length === OTP_LENGTH && !loading) void verify(digits);
  };

  return (
    <Screen
      footer={
        <>
          <Button
            testID="verify-submit"
            title={t('auth.verify.submit')}
            onPress={() => void verify(code)}
            loading={loading}
            disabled={code.length !== OTP_LENGTH}
          />
          <Button
            variant="secondary"
            title={
              cooldown > 0
                ? t('auth.verify.resendIn', { seconds: cooldown })
                : t('auth.verify.resend')
            }
            onPress={() => void resend()}
            disabled={cooldown > 0}
          />
          <Button variant="ghost" title={t('auth.verify.changeEmail')} onPress={router.back} />
        </>
      }
    >
      <Text className="mt-10 text-3xl font-bold text-foreground">{t('auth.verify.title')}</Text>
      <Text className="text-base text-muted">{t('auth.verify.subtitle', { email })}</Text>
      <TextField
        label={t('auth.verify.codeLabel')}
        value={code}
        onChangeText={onChangeCode}
        error={error}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        maxLength={OTP_LENGTH}
        autoFocus
      />
      {info ? <Text className="text-sm text-primary">{info}</Text> : null}
    </Screen>
  );
}
