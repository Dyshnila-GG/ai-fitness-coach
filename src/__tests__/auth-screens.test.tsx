import { fireEvent, render, screen } from '@testing-library/react-native';

import '@/i18n';

import SignInScreen from '../../app/sign-in';
import VerifyScreen from '../../app/verify';

jest.mock('expo-localization', () => ({
  getLocales: () => [{ languageCode: 'ru' }],
}));

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, back: jest.fn() }),
  useLocalSearchParams: () => ({ email: 'user@mail.com' }),
}));

const mockSignInWithOtp = jest.fn();
const mockVerifyOtp = jest.fn();
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithOtp: (...args: unknown[]) => mockSignInWithOtp(...args),
      verifyOtp: (...args: unknown[]) => mockVerifyOtp(...args),
    },
  },
}));

beforeEach(() => jest.clearAllMocks());

describe('SignInScreen', () => {
  it('rejects invalid email without calling the API', async () => {
    await render(<SignInScreen />);
    await fireEvent.changeText(screen.getByLabelText('Email'), 'nope');
    await fireEvent.press(screen.getByTestId('sign-in-submit'));
    expect(screen.getByText('Проверьте email')).toBeOnTheScreen();
    expect(mockSignInWithOtp).not.toHaveBeenCalled();
  });

  it('sends a code and opens verification', async () => {
    mockSignInWithOtp.mockResolvedValue({ error: null });
    await render(<SignInScreen />);
    await fireEvent.changeText(screen.getByLabelText('Email'), ' User@Mail.com ');
    await fireEvent.press(screen.getByTestId('sign-in-submit'));
    expect(mockSignInWithOtp).toHaveBeenCalledWith({
      email: 'user@mail.com',
      options: { shouldCreateUser: true },
    });
    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/verify',
      params: { email: 'user@mail.com' },
    });
  });
});

describe('VerifyScreen', () => {
  it('verifies automatically when 6 digits are entered', async () => {
    mockVerifyOtp.mockResolvedValue({ error: null });
    await render(<VerifyScreen />);
    await fireEvent.changeText(screen.getByLabelText('Код из письма'), '12 34 56');
    expect(mockVerifyOtp).toHaveBeenCalledWith({
      email: 'user@mail.com',
      token: '123456',
      type: 'email',
    });
  });

  it('shows an error for an invalid code', async () => {
    const { AuthApiError } = jest.requireActual('@supabase/supabase-js');
    mockVerifyOtp.mockResolvedValue({ error: new AuthApiError('bad', 403, 'otp_expired') });
    await render(<VerifyScreen />);
    await fireEvent.changeText(screen.getByLabelText('Код из письма'), '000000');
    expect(screen.getByText('Неверный или просроченный код')).toBeOnTheScreen();
  });

  it('disables resend during cooldown', async () => {
    await render(<VerifyScreen />);
    expect(screen.getByText('Повторно через 60 с')).toBeOnTheScreen();
  });
});
