import i18n from '@/i18n';

import { completeDraft } from '../__fixtures__/draft';
import { formatProfileValue } from '../format';

jest.mock('expo-localization', () => ({
  getLocales: () => [{ languageCode: 'ru' }],
}));

const t = i18n.t.bind(i18n);

describe('formatProfileValue', () => {
  it('formats units as chosen by the user', () => {
    const kg = completeDraft({ weightKg: 80, heightCm: 180.3 });
    expect(formatProfileValue('weight', kg, t, 'ru')).toBe('80 кг');
    expect(formatProfileValue('height', kg, t, 'ru')).toBe('180 см');

    const imperial = { ...kg, weightUnit: 'lb' as const, heightUnit: 'ft_in' as const };
    expect(formatProfileValue('weight', imperial, t, 'ru')).toBe('176.4 lb');
    expect(formatProfileValue('height', imperial, t, 'ru')).toBe('5′11″');
  });

  it('formats goals and optional fields', () => {
    const d = completeDraft({ goals: { primary: 'strength', secondary: 'mobility' } });
    expect(formatProfileValue('goals', d, t, 'ru')).toBe('Сила + Мобильность и здоровая спина');
    expect(formatProfileValue('limitations', d, t, 'ru')).toBe('Не указано');
    expect(
      formatProfileValue(
        'metrics',
        { ...d, bodyFatPct: 18, girths: { ...d.girths, waist: 72.5 } },
        t,
        'ru',
      ),
    ).toBe('% жира 18% · Талия 72.5 см');
  });
});
