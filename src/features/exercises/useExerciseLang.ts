import { useTranslation } from 'react-i18next';

import type { Lang } from '@/logic/exercises';

/** Language of exercise content (names, steps) — follows the UI language. */
export function useExerciseLang(): Lang {
  const { i18n } = useTranslation();
  return i18n.language === 'en' ? 'en' : 'ru';
}
