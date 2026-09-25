import { getLocales } from 'expo-localization';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en.json';
import ru from './ru.json';

export const resources = {
  ru: { translation: ru },
  en: { translation: en },
} as const;

export type Language = keyof typeof resources;

export const DEFAULT_LANGUAGE: Language = 'ru';

export function detectLanguage(): Language {
  const code = getLocales()[0]?.languageCode;
  return code === 'en' ? 'en' : DEFAULT_LANGUAGE;
}

const i18n = createInstance();

void i18n.use(initReactI18next).init({
  resources,
  lng: detectLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: { escapeValue: false },
  showSupportNotice: false,
});

export default i18n;
