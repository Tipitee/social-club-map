
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en.json';
import deTranslation from './locales/de.json';

// Initialize theme from localStorage
const initTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme === 'light') {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  } else {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    localStorage.setItem('theme', 'dark');  // Default to dark if not set
  }
};

// Initialize theme
initTheme();

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
      // Return the key as fallback with proper capitalization and formatting
      const lastPart = key.split('.').pop() || key;
      // Convert camelCase to normal text with spaces and capitalize first letter
      return lastPart
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
        .trim();
    }
  });

export default i18n;
