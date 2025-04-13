
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
  if (lastPart === 'title' && key.includes('journal')) return 'Track Your Consumption';
  if (lastPart === 'title' && key.includes('legal')) return 'Updates';
  if (lastPart === 'subtitle') return '';
  if (lastPart === 'strainsExplorer') return 'Strains Explorer';
  
  // General formatting for other keys
  return lastPart
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
    .trim();
};

// Get stored language or default to English
const storedLanguage = localStorage.getItem('language') || 'en';

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
    lng: storedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    parseMissingKeyHandler: formatMissingKey,
    react: {
      useSuspense: false
    }
  });

// Make sure translations are applied immediately on init
document.addEventListener('DOMContentLoaded', () => {
  const storedLang = localStorage.getItem('language') || 'en';
  i18n.changeLanguage(storedLang);
});

// Debug language loading
console.log("i18n initialized with language:", i18n.language);
window.addEventListener('languageChanged', (e: any) => {
  console.log("Language changed event:", e.detail);
  // Force i18n to reload with the new language
  i18n.changeLanguage(e.detail.language);
});

export default i18n;
