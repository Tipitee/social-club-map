
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

// Make strings more user-friendly when missing translations
const formatMissingKey = (key: string): string => {
  if (!key) return '';
  
  // Extract the last part after the dot
  const lastPart = key.split('.').pop() || key;
  
  // Handle specific known keys with special formatting
  if (lastPart === 'thcLevel') return 'THC Level';
  if (lastPart === 'dominantTerpene') return 'Dominant Terpene';
  if (lastPart === 'backToAllStrains') return 'Back to Strains';
  if (lastPart === 'title' && key.includes('review')) return 'Rating';
  if (lastPart === 'averageRating') return 'Average Rating';
  if (lastPart === 'addReview') return 'Add Review';
  
  // General formatting for other keys
  return lastPart
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
    .trim();
};

// Configure i18next with better fallbacks
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
    parseMissingKeyHandler: formatMissingKey
  });

export default i18n;
