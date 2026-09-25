import { fireEvent, render, screen } from '@testing-library/react-native';

import '@/i18n';

import SignInScreen from '../../app/sign-in';
import SignUpScreen from '../../app/sign-up';

jest.mock('expo-localization', () => ({
  getLocales: () => [{ languageCode: 'ru' }],
}));

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, back: jest.fn() }),
}));

const mockSignInWithPassword = jest.fn();
const mockSignUp = jest.fn();
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: (...args: unknown[]) => mockSignInWithPassword(...args),
      signUp: (...args: unknown[]) => mockSignUp(...args),
    },
  },
}));

const { AuthApiError } = jest.requireActual('@supabase/supabase-js');

beforeEach(() => jest.clearAllMocks());

describe('SignInScreen', () => {
  it('rejects invalid email without calling the API', async () => {
    await render(<SignInScreen />);
    await fireEvent.changeText(screen.getByLabelText('Email'), 'nope');
    await fireEvent.changeText(screen.getByLabelText('Пароль'), 'secret1');
    await fireEvent.press(screen.getByTestId('sign-in-submit'));
    expect(screen.getByText('Проверьте email')).toBeOnTheScreen();
    expect(mockSignInWithPassword).not.toHaveBeenCalled();
  });

  it('signs in with normalized email and password', async () => {
    mockSignInWithPassword.mockResolvedValue({ error: null });
    await render(<SignInScreen />);
    await fireEvent.changeText(screen.getByLabelText('Email'), ' User@Mail.com ');
    await fireEvent.changeText(screen.getByLabelText('Пароль'), 'secret1');
    await fireEvent.press(screen.getByTestId('sign-in-submit'));
    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: 'user@mail.com',
      password: 'secret1',
    });
  });

  it('shows an error for wrong credentials', async () => {
    mockSignInWithPassword.mockResolvedValue({
      error: new AuthApiError('bad', 400, 'invalid_credentials'),
    });
    await render(<SignInScreen />);
    await fireEvent.changeText(screen.getByLabelText('Email'), 'user@mail.com');
    await fireEvent.changeText(screen.getByLabelText('Пароль'), 'wrong1');
    await fireEvent.press(screen.getByTestId('sign-in-submit'));
    expect(screen.getByText('Неверный email или пароль')).toBeOnTheScreen();
  });

  it('opens sign up', async () => {
    await render(<SignInScreen />);
    await fireEvent.press(screen.getByText('Нет аккаунта? Регистрация'));
    expect(mockPush).toHaveBeenCalledWith('/sign-up');
  });
});

describe('SignUpScreen', () => {
  const fill = async (email: string, password: string, confirm: string) => {
    await fireEvent.changeText(screen.getByLabelText('Email'), email);
    await fireEvent.changeText(screen.getByLabelText('Пароль'), password);
    await fireEvent.changeText(screen.getByLabelText('Повторите пароль'), confirm);
    await fireEvent.press(screen.getByTestId('sign-up-submit'));
  };

  it('validates password length and match without calling the API', async () => {
    await render(<SignUpScreen />);
    await fill('user@mail.com', '123', '124');
    expect(screen.getByText('Минимум 6 символов')).toBeOnTheScreen();
    expect(screen.getByText('Пароли не совпадают')).toBeOnTheScreen();
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it('creates an account', async () => {
    mockSignUp.mockResolvedValue({ error: null });
    await render(<SignUpScreen />);
    await fill(' User@Mail.com ', 'secret1', 'secret1');
    expect(mockSignUp).toHaveBeenCalledWith({ email: 'user@mail.com', password: 'secret1' });
  });

  it('reports an existing account', async () => {
    mockSignUp.mockResolvedValue({ error: new AuthApiError('x', 422, 'user_already_exists') });
    await render(<SignUpScreen />);
    await fill('user@mail.com', 'secret1', 'secret1');
    expect(screen.getByText('Аккаунт с таким email уже есть — войдите')).toBeOnTheScreen();
  });
});
