
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type Language = 'en' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Get language from localStorage or default to English
  const storedLanguage = (localStorage.getItem('language') as Language) || 'en';
  const [language, setLanguage] = useState<Language>(storedLanguage);
  const { i18n } = useTranslation();

  // Effect to sync the i18n instance with our context state
  useEffect(() => {
    const handleLanguageChange = async () => {
      if (i18n.language !== language) {
        console.log("Changing language to:", language);
        await i18n.changeLanguage(language);
      }
    };
    
    handleLanguageChange();
  }, [language, i18n]);

  // Effect to sync with localStorage changes (in case of multiple tabs)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'language' && e.newValue && e.newValue !== language) {
        setLanguage(e.newValue as Language);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [language]);

  // Force language refresh on mount to ensure translations are applied
  useEffect(() => {
    i18n.changeLanguage(language);
  }, []);

  const handleSetLanguage = (newLanguage: Language) => {
    console.log("Setting language in context:", newLanguage);
    localStorage.setItem('language', newLanguage);
    setLanguage(newLanguage);
    
    // Dispatch a custom event for debugging
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language: newLanguage } 
    }));
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
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
