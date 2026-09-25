import { render, screen } from '@testing-library/react-native';

import HomeScreen from '../../app/index';

describe('HomeScreen', () => {
  it('renders app title', async () => {
    await render(<HomeScreen />);
    expect(screen.getByText('AI Fitness Coach')).toBeTruthy();
  });
});
