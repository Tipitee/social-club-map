
import React from "react";
import { Book, Cannabis, Map } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container px-4 py-6 mb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">{t('app.title')}</h1>
        <LanguageSwitcher />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/journal" className="block hover:scale-[1.02] transition-transform duration-200">
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 h-full">
            <div className="flex justify-center items-center h-20 w-20 bg-gray-700 rounded-full mb-4 mx-auto">
              <Book className="h-10 w-10 text-secondary" />
            </div>
            <h2 className="text-xl font-bold text-white text-center mb-2">{t('home.sections.journal.title')}</h2>
            <p className="text-gray-400 text-center">
              {t('home.sections.journal.description')}
            </p>
          </div>
        </Link>
        
        <Link to="/strains" className="block hover:scale-[1.02] transition-transform duration-200">
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 h-full">
            <div className="flex justify-center items-center h-20 w-20 bg-gray-700 rounded-full mb-4 mx-auto">
              <Cannabis className="h-10 w-10 text-secondary" />
            </div>
            <h2 className="text-xl font-bold text-white text-center mb-2">{t('home.sections.strains.title')}</h2>
            <p className="text-gray-400 text-center">
              {t('home.sections.strains.description')}
            </p>
          </div>
        </Link>
        
        <Link to="/clubs" className="block hover:scale-[1.02] transition-transform duration-200">
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 h-full">
            <div className="flex justify-center items-center h-20 w-20 bg-gray-700 rounded-full mb-4 mx-auto">
              <Map className="h-10 w-10 text-secondary" />
            </div>
            <h2 className="text-xl font-bold text-white text-center mb-2">{t('home.sections.clubs.title')}</h2>
            <p className="text-gray-400 text-center">
              {t('home.sections.clubs.description')}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
