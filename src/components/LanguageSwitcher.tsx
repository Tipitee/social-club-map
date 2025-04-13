
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const isDarkMode = document.documentElement.classList.contains('dark');

  const changeLanguage = (lng: 'en' | 'de') => {
    try {
      i18n.changeLanguage(lng);
      setLanguage(lng);
      
      // Provide feedback to the user
      toast({
        title: t('settings.languageChanged'),
        description: lng === 'en' ? 'Language set to English' : 'Sprache auf Deutsch eingestellt',
        duration: 3000,
      });
      
      // Force a page refresh to ensure all components are updated with the new language
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } catch (error) {
      console.error("Error changing language:", error);
      toast({
        title: "Error",
        description: "Failed to change language. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getDropdownStyles = () => {
    return isDarkMode 
      ? "bg-gray-800 border-gray-700" 
      : "bg-white border-gray-200";
  };
  
  const getButtonStyles = () => {
    return isDarkMode
      ? "bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
      : "bg-white border-gray-200 text-gray-800 hover:bg-gray-100";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`${getButtonStyles()} transition-colors flex items-center gap-2`}
        >
          <Globe size={16} />
          {language === 'en' ? 'EN' : 'DE'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={`w-40 ${getDropdownStyles()}`}>
        <DropdownMenuItem 
          className={`flex items-center justify-between ${language === 'en' ? 'bg-primary/20 text-primary' : 'text-foreground hover:bg-accent/50'}`}
          onClick={() => changeLanguage('en')}
        >
          {t('language.english')}
          {language === 'en' && <Check size={16} className="ml-2" />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          className={`flex items-center justify-between ${language === 'de' ? 'bg-primary/20 text-primary' : 'text-foreground hover:bg-accent/50'}`}
          onClick={() => changeLanguage('de')}
        >
          {t('language.german')}
          {language === 'de' && <Check size={16} className="ml-2" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
