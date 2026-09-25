import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import '@/i18n';

import { profileQueryKey } from '@/features/profile/api';
import type { ProfileBundle } from '@/features/profile/types';

import ProfileEditScreen from '../../app/(app)/profile-edit/[field]';
import ProfileScreen from '../../app/(app)/profile';

jest.mock('expo-localization', () => ({
  getLocales: () => [{ languageCode: 'ru', regionCode: 'RU' }],
}));

let mockField = 'days';
const mockPush = jest.fn();
const mockBack = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, back: mockBack }),
  useLocalSearchParams: () => ({ field: mockField }),
  Redirect: () => null,
}));

jest.mock('@/features/auth/AuthProvider', () => ({
  useAuth: () => ({ session: { user: { id: 'u1', email: 'me@mail.com' } }, isLoading: false }),
}));

const mockRpc = jest.fn();
const mockSignOut = jest.fn();
jest.mock('@/lib/supabase', () => ({
  supabase: {
    rpc: (...args: unknown[]) => mockRpc(...args),
    auth: { signOut: () => mockSignOut() },
    // Refetch after save returns the cached bundle.
    from: () => {
      throw new Error('not used');
    },
  },
}));

const bundle: ProfileBundle = {
  profile: {
    id: 'u1',
    sex: 'male',
    birth_date: '1990-01-01',
    height_cm: 180,
    height_unit: 'cm',
    weight_kg: 80,
    weight_unit: 'kg',
    level: 'beginner',
    locations: ['gym'],
    equipment: [],
    days_per_week: 3,
    training_mode: 'light',
    cardio: 'warmup',
    is_premium: false,
    disclaimer_accepted_at: '2026-01-01T00:00:00Z',
    onboarding_completed_at: '2026-01-01T00:00:00Z',
  },
  goals: [{ goal: 'muscle_gain', priority: 1 }],
  limitations: { zones: [], note: null },
  metrics: null,
};

function renderWithBundle(ui: ReactNode) {
  const client = new QueryClient({
    defaultOptions: { queries: { staleTime: Infinity, retry: false }, mutations: { retry: false } },
  });
  client.setQueryData(profileQueryKey('u1'), bundle);
  jest.spyOn(client, 'invalidateQueries').mockResolvedValue();
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

beforeEach(() => jest.clearAllMocks());

describe('ProfileScreen', () => {
  it('shows saved values and hides equipment for gym-only', async () => {
    await renderWithBundle(<ProfileScreen />);
    expect(screen.getByText('me@mail.com')).toBeOnTheScreen();
    expect(screen.getByText('Набор мышечной массы')).toBeOnTheScreen();
    expect(screen.getByText('80 кг')).toBeOnTheScreen();
    expect(screen.queryByText('Инвентарь')).not.toBeOnTheScreen();
  });

  it('opens a field editor', async () => {
    await renderWithBundle(<ProfileScreen />);
    await fireEvent.press(screen.getByText('Дней в неделю'));
    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/profile-edit/[field]',
      params: { field: 'days' },
    });
  });

  it('signs out', async () => {
    mockSignOut.mockResolvedValue({ error: null });
    await renderWithBundle(<ProfileScreen />);
    await fireEvent.press(screen.getByText('Выйти из аккаунта'));
    expect(mockSignOut).toHaveBeenCalled();
  });
});

describe('ProfileEditScreen', () => {
  it('saves an edited field with the full profile', async () => {
    mockField = 'days';
    mockRpc.mockResolvedValue({ error: null });
    await renderWithBundle(<ProfileEditScreen />);
    await fireEvent.press(screen.getByLabelText('5'));
    await fireEvent.press(screen.getByTestId('profile-save'));
    expect(mockRpc).toHaveBeenCalledWith('save_onboarding', {
      payload: expect.objectContaining({ days_per_week: 5, sex: 'male', weight_kg: 80 }),
    });
    expect(mockBack).toHaveBeenCalled();
  });

  it('asks for equipment when switching to home training', async () => {
    mockField = 'locations';
    await renderWithBundle(<ProfileEditScreen />);
    await fireEvent.press(screen.getByText('Дом'));
    expect(screen.getByText('Какой инвентарь есть?')).toBeOnTheScreen();
    expect(screen.getByTestId('profile-save')).toBeDisabled();
    await fireEvent.press(screen.getByText('Гантели'));
    expect(screen.getByTestId('profile-save')).toBeEnabled();
  });
});
