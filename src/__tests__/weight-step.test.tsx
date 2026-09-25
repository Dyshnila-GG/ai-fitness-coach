import { fireEvent, render, screen } from '@testing-library/react-native';
import { useState } from 'react';

import '@/i18n';

import { HeightStep, WeightStep } from '@/features/onboarding/steps/InputSteps';
import { emptyDraft } from '@/features/profile/draft';
import type { ProfileDraft } from '@/features/profile/types';

jest.mock('expo-localization', () => ({
  getLocales: () => [{ languageCode: 'ru' }],
}));

const onDraft = jest.fn<void, [ProfileDraft]>();
const latest = () => onDraft.mock.lastCall![0];

function Harness({ Step }: { Step: typeof WeightStep }) {
  const [draft, setDraft] = useState(emptyDraft('RU'));
  return (
    <Step
      draft={draft}
      update={(patch) => {
        const next = { ...draft, ...patch };
        onDraft(next);
        setDraft(next);
      }}
    />
  );
}

describe('WeightStep', () => {
  it('stores kg when entering pounds', async () => {
    await render(<Harness Step={WeightStep} />);
    await fireEvent.press(screen.getByText('lb'));
    await fireEvent.changeText(screen.getByLabelText('Вес'), '176,4');
    expect(latest().weightUnit).toBe('lb');
    expect(latest().weightKg).toBeCloseTo(80.01, 2);
    expect(screen.getByLabelText('Вес')).toHaveDisplayValue('176,4');
  });

  it('shows a range error', async () => {
    await render(<Harness Step={WeightStep} />);
    await fireEvent.changeText(screen.getByLabelText('Вес'), '10');
    expect(screen.getByText('Допустимо от 30 до 300')).toBeOnTheScreen();
  });
});

describe('HeightStep', () => {
  it('converts feet and inches to cm', async () => {
    await render(<Harness Step={HeightStep} />);
    await fireEvent.press(screen.getByText('фт/дюйм'));
    await fireEvent.changeText(screen.getByLabelText('Футы'), '5');
    await fireEvent.changeText(screen.getByLabelText('Дюймы'), '11');
    expect(latest().heightCm).toBeCloseTo(180.3, 1);
  });
});
