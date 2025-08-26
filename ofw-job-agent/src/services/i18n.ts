import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from '../assets/i18n/en.json';
import tl from '../assets/i18n/tl.json';

const resources = {
  en: { translation: en },
  tl: { translation: tl },
};

export function initializeI18n(): void {
  if (i18n.isInitialized) return;

  const locales = Localization.getLocales();
  const deviceLang = locales && locales.length > 0 ? locales[0].languageCode : 'en';

  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: deviceLang === 'tl' ? 'tl' : 'en',
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
    });
}

export default i18n;