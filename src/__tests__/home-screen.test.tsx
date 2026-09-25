import { render, screen } from '@testing-library/react-native';

import '@/i18n';

import HomeScreen from '../../app/index';

jest.mock('expo-localization', () => ({
  getLocales: () => [{ languageCode: 'ru' }],
}));

describe('HomeScreen', () => {
  it('renders translated title and subtitle (ru)', async () => {
    await render(<HomeScreen />);
    expect(screen.getByText('AI Fitness Coach')).toBeTruthy();
    expect(screen.getByText('Персональный AI-тренер')).toBeTruthy();
  });
});
