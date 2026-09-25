import { act, fireEvent, render, screen } from '@testing-library/react-native';

import '@/i18n';

import { ExerciseMedia, MEDIA_FRAME_MS } from '../ExerciseMedia';

jest.mock('expo-localization', () => ({ getLocales: () => [{ languageCode: 'ru' }] }));

const urls = ['https://example.com/0.jpg', 'https://example.com/1.jpg'];
const opacity = (i: number) => {
  const style = screen.getByTestId(`exercise-media-frame-${i}`, { includeHiddenElements: true })
    .props.style as { opacity: number };
  return style.opacity;
};

describe('ExerciseMedia', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('alternates start and end frames', async () => {
    await render(<ExerciseMedia urls={urls} />);
    expect([opacity(0), opacity(1)]).toEqual([1, 0]);
    await act(() => jest.advanceTimersByTime(MEDIA_FRAME_MS));
    expect([opacity(0), opacity(1)]).toEqual([0, 1]);
    await act(() => jest.advanceTimersByTime(MEDIA_FRAME_MS));
    expect([opacity(0), opacity(1)]).toEqual([1, 0]);
  });

  it('shows a placeholder without media', async () => {
    await render(<ExerciseMedia urls={[]} />);
    expect(screen.getByTestId('exercise-media-placeholder')).toBeOnTheScreen();
    expect(screen.getByText('Анимации пока нет')).toBeOnTheScreen();
  });

  it('falls back to the placeholder when an image fails to load', async () => {
    await render(<ExerciseMedia urls={urls} />);
    await fireEvent(screen.getByTestId('exercise-media-frame-0'), 'error');
    expect(screen.getByTestId('exercise-media-placeholder')).toBeOnTheScreen();
  });
});
