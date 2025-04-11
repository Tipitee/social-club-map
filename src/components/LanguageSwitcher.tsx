
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  const changeLanguage = (lng: 'en' | 'de') => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 transition-colors"
        >
          <Globe size={16} className="mr-2" />
          {language === 'en' ? 'EN' : 'DE'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40 bg-gray-800 border-gray-700">
        <DropdownMenuItem 
          className={`${language === 'en' ? 'bg-gray-700' : ''} text-white hover:bg-gray-700`}
          onClick={() => changeLanguage('en')}
        >
          {t('language.english')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          className={`${language === 'de' ? 'bg-gray-700' : ''} text-white hover:bg-gray-700`}
          onClick={() => changeLanguage('de')}
        >
          {t('language.german')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
