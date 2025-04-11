
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en.json';
import deTranslation from './locales/de.json';

// Make sure any missing translations fallback to English
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      de: {
        translation: deTranslation
      }
    },
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    nsSeparator: false,
    keySeparator: false,
    parseMissingKeyHandler: (key) => {
      console.warn(`Missing translation key: ${key}`);
      // Return the key as fallback
      return key.split('.').pop() || key;
    }
  });

export default i18n;
