import { fireEvent, render, screen } from '@testing-library/react-native';

import '@/i18n';

import HomeScreen from '../../app/(app)/index';

jest.mock('expo-localization', () => ({
  getLocales: () => [{ languageCode: 'ru' }],
}));

const mockPush = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ push: mockPush }) }));

describe('HomeScreen', () => {
  it('renders translated title and subtitle (ru)', async () => {
    await render(<HomeScreen />);
    expect(screen.getByText('AI Fitness Coach')).toBeTruthy();
    expect(screen.getByText('Персональный AI-тренер')).toBeTruthy();
  });

  it('opens the profile', async () => {
    await render(<HomeScreen />);
    await fireEvent.press(screen.getByText('Профиль'));
    expect(mockPush).toHaveBeenCalledWith('/profile');
  });
});
