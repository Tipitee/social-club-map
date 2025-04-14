
import React, { useState } from 'react';
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
  const [isChanging, setIsChanging] = useState<boolean>(false);

  const changeLanguage = async (lng: 'en' | 'de') => {
    // Skip if the language is already selected or a change is in progress
    if (language === lng || isChanging) return;
    
    try {
      // Mark as changing to prevent multiple clicks
      setIsChanging(true);
      
      // Update context and localStorage
      setLanguage(lng);
      
      // Force reload of translations with a small delay to ensure context updates first
      setTimeout(() => {
        i18n.changeLanguage(lng).then(() => {
          console.log("Language changed to:", lng, "i18n language is now:", i18n.language);
          
          // Provide feedback to the user
          toast({
            title: lng === 'en' ? 'Language Changed' : 'Sprache geändert',
            description: lng === 'en' ? 'Language set to English' : 'Sprache auf Deutsch eingestellt',
            duration: 3000,
          });
        });
      }, 100);
      
    } catch (error) {
      console.error("Error changing language:", error);
      toast({
        title: "Error",
        description: "Failed to change language. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-white dark:bg-navy-light border-navy-DEFAULT dark:border-navy-light text-navy-dark dark:text-white hover:bg-gray-100 dark:hover:bg-navy-400 rounded-full"
          disabled={isChanging}
        >
          <Globe size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40 bg-white dark:bg-navy-400 border-gray-200 dark:border-navy-500 shadow-md">
        <DropdownMenuItem 
          className={`flex items-center justify-between ${language === 'en' 
            ? 'bg-primary/20 text-primary dark:bg-primary/40 dark:text-white' 
            : 'text-foreground dark:text-white hover:bg-accent/50 dark:hover:bg-navy-300'}`}
          onClick={() => changeLanguage('en')}
        >
          English
          {language === 'en' && <Check size={16} className="ml-2" />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          className={`flex items-center justify-between ${language === 'de' 
            ? 'bg-primary/20 text-primary dark:bg-primary/40 dark:text-white' 
            : 'text-foreground dark:text-white hover:bg-accent/50 dark:hover:bg-navy-300'}`}
          onClick={() => changeLanguage('de')}
        >
          Deutsch
          {language === 'de' && <Check size={16} className="ml-2" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
