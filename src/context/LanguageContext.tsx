
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'de';

type TranslationsType = {
  [key in Language]: {
    [key: string]: string;
  };
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  translations: TranslationsType;
}

const translations: TranslationsType = {
  en: {
    // Navigation
    "home": "Home",
    "journal": "Journal",
    "strains": "Strains",
    "profile": "Profile",
    "clubs": "Clubs",
    
    // Strain Explorer
    "strainExplorer": "Strain Explorer",
    "showFilters": "Show Filters",
    "hideFilters": "Hide Filters",
    "filter": "Filter",
    "showing": "Showing",
    "of": "of",
    "strains": "strains",
    "strain": "strain",
    "page": "Page",
    "noStrainsFound": "No strains found",
    "tryAdjusting": "Try adjusting your filters to see more results.",
    "errorLoadingStrains": "Error Loading Strains",
    "retry": "Retry",
    "loadMore": "Load More Strains",
    
    // Filters
    "filterStrains": "Filter Strains",
    "search": "Search strains...",
    "type": "Type",
    "all": "All",
    "indica": "Indica",
    "sativa": "Sativa",
    "hybrid": "Hybrid",
    "thcLevel": "THC Level (%)",
    "dominantEffect": "Dominant Effect",
    "allEffects": "All Effects",
    "terpene": "Terpene",
    "allTerpenes": "All Terpenes",
    "sortBy": "Sort By",
    "name": "Name",
    "thcHighToLow": "THC (High to Low)",
    "thcLowToHigh": "THC (Low to High)",
    
    // Strain Detail
    "strainDetails": "Strain Details",
    "labDataPending": "Lab data pending",
    "dominantTerpene": "Dominant Terpene",
    "terpeneDataUnavailable": "Terpene data unavailable",
    "noEffectsData": "No effects data available",
    "description": "Description",
    "effects": "Effects",
    "backToAllStrains": "Back to All Strains",
    
    // Cards
    "thc": "THC",
    
    // Errors
    "error": "Error",
    "loading": "Loading...",
  },
  de: {
    // Navigation
    "home": "Startseite",
    "journal": "Tagebuch",
    "strains": "Sorten",
    "profile": "Profil",
    "clubs": "Clubs",
    
    // Strain Explorer
    "strainExplorer": "Sorten-Explorer",
    "showFilters": "Filter anzeigen",
    "hideFilters": "Filter ausblenden",
    "filter": "Filter",
    "showing": "Anzeigen",
    "of": "von",
    "strains": "Sorten",
    "strain": "Sorte",
    "page": "Seite",
    "noStrainsFound": "Keine Sorten gefunden",
    "tryAdjusting": "Versuchen Sie, Ihre Filter anzupassen, um mehr Ergebnisse zu sehen.",
    "errorLoadingStrains": "Fehler beim Laden der Sorten",
    "retry": "Wiederholen",
    "loadMore": "Mehr Sorten laden",
    
    // Filters
    "filterStrains": "Sorten filtern",
    "search": "Sorten suchen...",
    "type": "Typ",
    "all": "Alle",
    "indica": "Indica",
    "sativa": "Sativa",
    "hybrid": "Hybrid",
    "thcLevel": "THC-Gehalt (%)",
    "dominantEffect": "Dominante Wirkung",
    "allEffects": "Alle Wirkungen",
    "terpene": "Terpen",
    "allTerpenes": "Alle Terpene",
    "sortBy": "Sortieren nach",
    "name": "Name",
    "thcHighToLow": "THC (Hoch zu Niedrig)",
    "thcLowToHigh": "THC (Niedrig zu Hoch)",
    
    // Strain Detail
    "strainDetails": "Sorten-Details",
    "labDataPending": "Labordaten ausstehend",
    "dominantTerpene": "Dominantes Terpen",
    "terpeneDataUnavailable": "Terpen-Daten nicht verfügbar",
    "noEffectsData": "Keine Wirkungsdaten verfügbar",
    "description": "Beschreibung",
    "effects": "Wirkungen",
    "backToAllStrains": "Zurück zu allen Sorten",
    
    // Cards
    "thc": "THC",
    
    // Errors
    "error": "Fehler",
    "loading": "Wird geladen...",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Get user's browser language preference or use English as default
  const getBrowserLanguage = (): Language => {
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'de' ? 'de' : 'en';
  };

  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage as Language) || getBrowserLanguage();
  });

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const value = {
    language,
    setLanguage,
    t,
    translations
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
