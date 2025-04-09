
import React from "react";
import { Book, Cannabis, Map } from "lucide-react";
import { Link } from "react-router-dom";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";

const Home: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="container px-4 py-6 mb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">German Cannabis Explorer</h1>
        <LanguageSwitcher />
      </div>
      
      <div className="space-y-6">
        <Link to="/strains">
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300">
            <div className="flex justify-center items-center h-24 w-24 bg-gray-700 rounded-full mb-4 mx-auto">
              <Cannabis className="h-12 w-12 text-secondary" />
            </div>
            <h2 className="text-xl font-bold text-white text-center mb-2">{t("strains_nav")}</h2>
            <p className="text-gray-300 text-center">
              {t("exploreStrains")}
            </p>
          </div>
        </Link>
        
        <Link to="/clubs">
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300">
            <div className="flex justify-center items-center h-24 w-24 bg-gray-700 rounded-full mb-4 mx-auto">
              <Map className="h-12 w-12 text-secondary" />
            </div>
            <h2 className="text-xl font-bold text-white text-center mb-2">{t("clubs")}</h2>
            <p className="text-gray-300 text-center">
              {t("findClubs")}
            </p>
          </div>
        </Link>
        
        <Link to="/journal">
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300">
            <div className="flex justify-center items-center h-24 w-24 bg-gray-700 rounded-full mb-4 mx-auto">
              <Book className="h-12 w-12 text-secondary" />
            </div>
            <h2 className="text-xl font-bold text-white text-center mb-2">{t("journal")}</h2>
            <p className="text-gray-300 text-center">
              {t("keepJournal")}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
