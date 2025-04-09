
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'de' : 'en');
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleLanguage} 
            className="rounded-full bg-gray-800 bg-opacity-50 hover:bg-gray-700"
            aria-label={`Switch to ${language === 'en' ? 'German' : 'English'}`}
          >
            <Globe className="h-5 w-5 text-gray-100" />
            <span className="sr-only">{language === 'en' ? 'DE' : 'EN'}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{language === 'en' ? 'Switch to German' : 'Auf Englisch umschalten'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default LanguageSwitcher;
