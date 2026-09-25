import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import '@/i18n';

import { useOnboardingStore } from '@/features/onboarding/store';
import { completeDraft } from '@/features/profile/__fixtures__/draft';
import { emptyDraft } from '@/features/profile/draft';

import OnboardingStepScreen from '../../app/onboarding/[step]';

jest.mock('expo-localization', () => ({
  getLocales: () => [{ languageCode: 'ru', regionCode: 'RU' }],
}));

let mockStep = 'sex';
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, back: jest.fn(), canGoBack: () => true, replace: jest.fn() }),
  useLocalSearchParams: () => ({ step: mockStep }),
  Redirect: () => null,
}));

jest.mock('@/features/auth/AuthProvider', () => ({
  useAuth: () => ({ session: { user: { id: 'u1' } }, isLoading: false }),
}));

const mockRpc = jest.fn();
jest.mock('@/lib/supabase', () => ({
  supabase: { rpc: (...args: unknown[]) => mockRpc(...args) },
}));

function Wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

beforeEach(() => {
  jest.clearAllMocks();
  useOnboardingStore.setState({ draft: emptyDraft('RU') });
});

describe('OnboardingStepScreen', () => {
  it('enables Next only after answering and goes to the next step', async () => {
    mockStep = 'sex';
    await render(<OnboardingStepScreen />, { wrapper: Wrapper });
    expect(screen.getByText('Шаг 2 из 13')).toBeOnTheScreen();
    expect(screen.getByTestId('onboarding-next')).toBeDisabled();

    await fireEvent.press(screen.getByText('Женский'));
    expect(useOnboardingStore.getState().draft.sex).toBe('female');
    expect(screen.getByTestId('onboarding-next')).toBeEnabled();

    await fireEvent.press(screen.getByTestId('onboarding-next'));
    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/onboarding/[step]',
      params: { step: 'birthDate' },
    });
  });

  it('shows the equipment step only for home/outdoor', async () => {
    mockStep = 'locations';
    await render(<OnboardingStepScreen />, { wrapper: Wrapper });
    await fireEvent.press(screen.getByText('Дом'));
    expect(screen.getByText('Шаг 7 из 14')).toBeOnTheScreen();
    await fireEvent.press(screen.getByTestId('onboarding-next'));
    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/onboarding/[step]',
      params: { step: 'equipment' },
    });
  });

  it('saves the profile on the last step and clears the draft', async () => {
    mockStep = 'metrics';
    mockRpc.mockResolvedValue({ error: null });
    useOnboardingStore.setState({ draft: completeDraft() });
    await render(<OnboardingStepScreen />, { wrapper: Wrapper });

    await fireEvent.changeText(screen.getByLabelText('Талия'), '72,5');
    await fireEvent.press(screen.getByTestId('onboarding-next'));

    expect(mockRpc).toHaveBeenCalledWith(
      'save_onboarding',
      expect.objectContaining({
        payload: expect.objectContaining({
          sex: 'female',
          metrics: expect.objectContaining({ waist_cm: 72.5 }),
        }),
      }),
    );
    expect(await screen.findByTestId('onboarding-next')).toBeOnTheScreen();
    expect(useOnboardingStore.getState().draft.sex).toBeNull();
  });

  it('skip on an optional step clears its answers', async () => {
    mockStep = 'limitations';
    useOnboardingStore.setState({
      draft: completeDraft({ limitationZones: ['knees'], limitationNote: 'x' }),
    });
    await render(<OnboardingStepScreen />, { wrapper: Wrapper });
    await fireEvent.press(screen.getByText('Пропустить'));
    expect(useOnboardingStore.getState().draft.limitationZones).toEqual([]);
    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/onboarding/[step]',
      params: { step: 'metrics' },
    });
  });

  it('shows an error when saving fails', async () => {
    mockStep = 'metrics';
    mockRpc.mockResolvedValue({ error: new Error('offline') });
    useOnboardingStore.setState({ draft: completeDraft() });
    await render(<OnboardingStepScreen />, { wrapper: Wrapper });
    await fireEvent.press(screen.getByTestId('onboarding-next'));
    expect(
      await screen.findByText('Не удалось сохранить. Проверьте интернет и попробуйте снова.'),
    ).toBeOnTheScreen();
    expect(useOnboardingStore.getState().draft.sex).toBe('female');
  });
});
