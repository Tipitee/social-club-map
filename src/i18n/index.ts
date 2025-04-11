
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
  
  // General formatting for other keys
  return lastPart
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
    .trim();
};

// Add additional translations to German locale
const extendedDeTranslations = {
  ...deTranslation,
  journal: {
    ...(deTranslation as any).journal,
    trackConsumption: 'Konsum verfolgen',
    newEntry: 'Neuer Eintrag',
    dosage: 'Dosis',
    dosageAmount: 'Dosiermenge',
    effectiveness: 'Wirksamkeit',
    mood: 'Stimmung',
    activity: 'Aktivität',
    sideEffects: 'Nebenwirkungen',
    notes: 'Notizen',
    puffs: 'Züge',
    saveEntry: 'Eintrag speichern',
    activities: {
      relaxing: 'Entspannen',
      reading: 'Lesen',
      music: 'Musik hören',
      watching: 'Fernsehen',
      social: 'Geselligkeit'
    },
    sideEffects: {
      'dry-mouth': 'Mundtrockenheit',
      'dry-eyes': 'Trockene Augen',
      'headache': 'Kopfschmerzen',
      'paranoia': 'Paranoia',
      'dizziness': 'Schwindel',
      'anxiety': 'Angst'
    }
  },
  app: {
    ...(deTranslation as any).app,
    title: 'Cannabis Begleiter'
  },
  auth: {
    ...(deTranslation as any).auth,
    welcomeTo: 'Willkommen bei SocialClub Map',
    signInToTrack: 'Melden Sie sich an, um Ihren Konsum zu verfolgen und Ihre Vorlieben zu speichern',
    signInOrCreate: 'Anmelden / Konto erstellen'
  },
  strains: {
    ...(deTranslation as any).strains,
    explorer: 'Sortenexplorer'
  },
  clubs: {
    findNearYou: 'Finden Sie Cannabis-Clubs in Ihrer Nähe'
  },
  legal: {
    ...(deTranslation as any).legal,
    stayInformed: 'Bleiben Sie über Cannabis-Gesetze informiert'
  },
  guide: {
    learnMore: 'Erfahren Sie mehr über Cannabis-Nutzung'
  },
  settings: {
    ...(deTranslation as any).settings,
    managePreferences: 'Verwalten Sie Ihre App-Einstellungen'
  },
  profile: {
    ...(deTranslation as any).profile,
    usernameNeededForReviews: 'Benutzername wird benötigt, um Bewertungen abzugeben',
    createUsername: 'Benutzername erstellen',
    enterUsername: 'Benutzernamen eingeben',
    saveUsername: 'Benutzername speichern',
    usernameLabel: 'Benutzername',
    saving: 'Wird gespeichert...',
    profileUpdated: 'Profil aktualisiert',
    usernameUpdated: 'Benutzername wurde aktualisiert'
  },
  common: {
    cancel: 'Abbrechen',
    saving: 'Speichern...'
  }
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
        translation: extendedDeTranslations
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
