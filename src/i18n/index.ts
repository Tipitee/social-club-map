
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

// Define the base structure for the German translations with proper type handling
const extendedDeTranslations = {
  ...deTranslation,
  settings: {
    ...(deTranslation as any).settings || {},
    languageChanged: 'Sprache geändert',
  },
  journal: {
    ...(deTranslation as any).journal || {},
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
    filters: 'Filter',
    search: 'Suchen',
    filterByTime: 'Filtern nach Zeit',
    thisMonth: 'Dieser Monat',
    lastWeek: 'Letzte Woche',
    noEntries: 'Keine Einträge',
    noEntriesFound: 'Keine Einträge gefunden',
    adjustFilters: 'Passen Sie die Filter an',
    startTracking: 'Beginnen Sie mit der Verfolgung Ihres Konsums',
    addNew: 'Neuen Eintrag hinzufügen',
    addFirst: 'Ersten Eintrag hinzufügen',
    entry: 'Eintrag',
    entries: 'Einträge',
    ratingBadge: 'Bewertung: {rating}',
    sideEffectsOptions: {
      'dry-mouth': 'Mundtrockenheit',
      'dry-eyes': 'Trockene Augen',
      'headache': 'Kopfschmerzen',
      'paranoia': 'Paranoia',
      'dizziness': 'Schwindel',
      'anxiety': 'Angst'
    }
  },
  language: {
    ...(deTranslation as any).language || {},
    english: 'Englisch',
    german: 'Deutsch'
  },
  app: {
    ...(deTranslation as any).app || {},
    title: 'Cannabis Begleiter'
  },
  auth: {
    ...(deTranslation as any).auth || {},
    welcomeTo: 'Willkommen bei SocialClub Map',
    signInToTrack: 'Melden Sie sich an, um Ihren Konsum zu verfolgen und Ihre Vorlieben zu speichern',
    signInOrCreate: 'Anmelden / Konto erstellen',
    signIn: 'Anmelden'
  },
  strains: {
    ...(deTranslation as any).strains || {},
    explorer: 'Sortenexplorer',
    strainsExplorer: 'Sortenexplorer',
    exploreDatabase: 'Durchsuchen Sie die Datenbank'
  },
  clubs: {
    ...(deTranslation as any).clubs || {},
    findNearYou: 'Finden Sie Cannabis-Clubs in Ihrer Nähe'
  },
  legal: {
    ...(deTranslation as any).legal || {},
    stayInformed: 'Bleiben Sie über Cannabis-Gesetze informiert',
    title: 'Aktualisierungen'
  },
  guide: {
    ...(deTranslation as any).guide || {},
    learnMore: 'Erfahren Sie mehr über Cannabis-Nutzung'
  },
  news: {
    ...(deTranslation as any).news || {},
    stayInformed: 'Bleiben Sie über rechtliche Updates informiert'
  },
  profile: {
    ...(deTranslation as any).profile || {},
    usernameNeededForReviews: 'Benutzername wird benötigt, um Bewertungen abzugeben',
    createUsername: 'Benutzername erstellen',
    enterUsername: 'Benutzernamen eingeben',
    saveUsername: 'Benutzername speichern',
    usernameLabel: 'Benutzername wählen',
    saving: 'Wird gespeichert...',
    profileUpdated: 'Profil aktualisiert',
    usernameUpdated: 'Benutzername wurde aktualisiert',
    myProfile: 'Mein Profil',
    editProfile: 'Profil bearbeiten',
    saveProfile: 'Profil speichern',
    changeAvatar: 'Avatar ändern',
    cancel: 'Abbrechen',
    accountActions: 'Kontoaktionen',
    signOut: 'Abmelden'
  },
  common: {
    ...(deTranslation as any).common || {},
    cancel: 'Abbrechen',
    saving: 'Speichern...',
    clear: 'Löschen'
  },
  navigation: {
    ...(deTranslation as any).navigation || {},
    home: 'Home',
    journal: 'Journal',
    strains: 'Sorten',
    clubs: 'Clubs',
    guide: 'Ratgeber',
    updates: 'Updates',
    profile: 'Profil',
    settings: 'Einstellungen',
    signIn: 'Anmelden',
    news: 'Neuigkeiten'
  }
};

// Define extended English translations by explicitly adding the language key
const extendedEnTranslations = {
  ...enTranslation,
  settings: {
    ...(enTranslation as any).settings || {},
    languageChanged: 'Language changed',
  },
  language: {
    // Explicitly define the language property for English to fix the TypeScript error
    english: 'English',
    german: 'German'
  }
};

// Configure i18next with better fallbacks
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: extendedEnTranslations
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
    parseMissingKeyHandler: formatMissingKey,
    react: {
      useSuspense: false
    }
  });

// Debug language loading
console.log("i18n initialized with language:", i18n.language);
window.addEventListener('languageChanged', (e) => {
  console.log("Language changed event:", e);
});

export default i18n;
