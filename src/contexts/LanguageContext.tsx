
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

// Define language types
type Language = 'en' | 'de';

// Define context type
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
}

// Create context with default values instead of undefined
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
});

// Language provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  
  // Get language from localStorage or default to English
  const getInitialLanguage = (): Language => {
    try {
      const storedLanguage = localStorage.getItem('language') as Language;
      return storedLanguage || 'en';
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return 'en';
    }
  };
  
  // State to track current language
  const [language, setLanguage] = useState<Language>(getInitialLanguage());

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
    try {
      localStorage.setItem('language', newLanguage);
      setLanguage(newLanguage);
      
      // Dispatch a custom event for debugging
      window.dispatchEvent(new CustomEvent('languageChanged', { 
        detail: { language: newLanguage } 
      }));
    } catch (error) {
      console.error('Error setting language:', error);
      setLanguage(newLanguage); // Still update the state even if localStorage fails
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  return context;
};
