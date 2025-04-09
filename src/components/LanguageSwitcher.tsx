
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

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
            className={cn(
              "rounded-full transition-all duration-300",
              "bg-gray-800 hover:bg-gray-700",
              "backdrop-blur-sm bg-opacity-80",
              "ring-1 ring-white/10 hover:ring-white/20",
              "shadow-lg"
            )}
            aria-label={`Switch to ${language === 'en' ? 'German' : 'English'}`}
          >
            <Globe className="h-5 w-5 text-gray-100" />
            <span className={cn(
              "absolute right-1 bottom-1",
              "text-[10px] font-bold w-4 h-4",
              "flex items-center justify-center",
              "rounded-full bg-secondary text-white"
            )}>
              {language === 'en' ? 'DE' : 'EN'}
            </span>
            <span className="sr-only">{language === 'en' ? 'Switch to German' : 'Switch to English'}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="font-medium">
          <p>{language === 'en' ? 'Switch to German' : 'Auf Englisch umschalten'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default LanguageSwitcher;
