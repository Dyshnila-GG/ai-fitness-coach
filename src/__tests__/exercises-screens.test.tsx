import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import '@/i18n';

import { exerciseLibraryQueryKey } from '@/features/exercises/api';
import { library } from '@/features/exercises/__fixtures__/library';

import ExerciseCardScreen from '../../app/(app)/exercises/[id]/index';
import ReplaceExerciseScreen from '../../app/(app)/exercises/[id]/replace';
import ExerciseLibraryScreen from '../../app/(app)/exercises/index';

jest.mock('expo-localization', () => ({ getLocales: () => [{ languageCode: 'ru' }] }));

let mockId = 'barbell_bench_press';
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, back: jest.fn() }),
  useLocalSearchParams: () => ({ id: mockId }),
}));

const mockFrom = jest.fn();
jest.mock('@/lib/supabase', () => ({ supabase: { from: (t: string) => mockFrom(t) } }));

function renderScreen(ui: ReactNode, seeded = true) {
  const client = new QueryClient({
    defaultOptions: { queries: { staleTime: Infinity, gcTime: Infinity, retry: false } },
  });
  if (seeded) client.setQueryData(exerciseLibraryQueryKey, library);
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

const names = () =>
  ['Жим штанги лёжа', 'Жим в тренажёре', 'Отжимания', 'Присед со штангой'].filter(
    (n) => screen.queryByText(n) !== null,
  );

beforeEach(() => {
  jest.clearAllMocks();
  mockId = 'barbell_bench_press';
});

describe('ExerciseLibraryScreen', () => {
  it('lists exercises grouped by muscle', async () => {
    await renderScreen(<ExerciseLibraryScreen />);
    expect(names()).toEqual([
      'Жим штанги лёжа',
      'Жим в тренажёре',
      'Отжимания',
      'Присед со штангой',
    ]);
    expect(screen.getByText('Квадрицепс, Ягодицы · Штанга')).toBeOnTheScreen();
  });

  it('searches by name', async () => {
    await renderScreen(<ExerciseLibraryScreen />);
    await fireEvent.changeText(screen.getByLabelText('Поиск упражнения'), 'squat');
    expect(names()).toEqual(['Присед со штангой']);
    await fireEvent.changeText(screen.getByLabelText('Поиск упражнения'), 'xyz');
    expect(screen.getByText('Ничего не найдено')).toBeOnTheScreen();
  });

  it('filters by muscle and equipment', async () => {
    await renderScreen(<ExerciseLibraryScreen />);
    await fireEvent.press(screen.getByText('Грудь'));
    expect(names()).toEqual(['Жим штанги лёжа', 'Жим в тренажёре', 'Отжимания']);
    await fireEvent.press(screen.getByText('Тренажёр', { exact: true }));
    expect(names()).toEqual(['Жим в тренажёре']);
  });

  it('opens the exercise card', async () => {
    await renderScreen(<ExerciseLibraryScreen />);
    await fireEvent.press(screen.getByText('Отжимания'));
    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/exercises/[id]',
      params: { id: 'push_up' },
    });
  });

  it('shows an error with retry when loading fails', async () => {
    mockFrom.mockReturnValue({
      select: () => Promise.resolve({ data: null, error: new Error('x') }),
    });
    await renderScreen(<ExerciseLibraryScreen />, false);
    expect(
      await screen.findByText('Не удалось загрузить упражнения. Проверьте интернет.'),
    ).toBeOnTheScreen();
    expect(screen.getByText('Повторить')).toBeOnTheScreen();
  });
});

describe('ExerciseCardScreen', () => {
  it('shows details, steps, mistakes and contraindications', async () => {
    await renderScreen(<ExerciseCardScreen />);
    expect(screen.getByText('Жим штанги лёжа')).toBeOnTheScreen();
    expect(screen.getByText('Грудь')).toBeOnTheScreen();
    expect(screen.getByText('Трицепс')).toBeOnTheScreen();
    expect(screen.getByText('Базовое')).toBeOnTheScreen();
    expect(screen.getByText('Среднее')).toBeOnTheScreen();
    expect(screen.getByText('2-0-1-0')).toBeOnTheScreen();
    expect(screen.getByText('1. Лягте на скамью')).toBeOnTheScreen();
    expect(screen.getByText('• Отбив от груди')).toBeOnTheScreen();
    expect(screen.getByText('Плечи')).toBeOnTheScreen();
    expect(screen.getByTestId('exercise-media-frame-0')).toBeOnTheScreen();
  });

  it('shows a media placeholder when there are no frames', async () => {
    mockId = 'machine_chest_press';
    await renderScreen(<ExerciseCardScreen />);
    expect(screen.getByTestId('exercise-media-placeholder')).toBeOnTheScreen();
    expect(screen.queryByText('Осторожно при проблемах')).toBeNull();
  });

  it('opens replacement', async () => {
    await renderScreen(<ExerciseCardScreen />);
    await fireEvent.press(screen.getByText('Заменить'));
    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/exercises/[id]/replace',
      params: { id: 'barbell_bench_press' },
    });
  });

  it('handles an unknown id', async () => {
    mockId = 'nope';
    await renderScreen(<ExerciseCardScreen />);
    expect(screen.getByText('Упражнение не найдено')).toBeOnTheScreen();
  });
});

describe('ReplaceExerciseScreen', () => {
  it('lists curated first, then same pattern and muscle', async () => {
    await renderScreen(<ReplaceExerciseScreen />);
    expect(screen.getByText('Альтернативы для «Жим штанги лёжа»')).toBeOnTheScreen();
    // Render order: curated (push-up) before same pattern + muscle (machine press).
    expect(
      screen.getAllByText(/^(Отжимания|Жим в тренажёре)$/).map((n) => n.props.children),
    ).toEqual(['Отжимания', 'Жим в тренажёре']);
  });

  it('filters by equipment category', async () => {
    await renderScreen(<ReplaceExerciseScreen />);
    await fireEvent.press(screen.getByText('Свой вес'));
    expect(names()).toEqual(['Отжимания']);
    await fireEvent.press(screen.getByText('Свободный вес'));
    expect(screen.getByText('Нет альтернатив с таким инвентарём')).toBeOnTheScreen();
  });

  it('opens the selected alternative', async () => {
    await renderScreen(<ReplaceExerciseScreen />);
    await fireEvent.press(screen.getByText('Отжимания'));
    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/exercises/[id]',
      params: { id: 'push_up' },
    });
  });
});
