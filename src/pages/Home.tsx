
import React from "react";
import { Book, Cannabis, Map, BookOpen, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

const Home: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isDarkMode = document.documentElement.classList.contains('dark');

  const sections = [
    {
      path: "/journal",
      icon: Book,
      title: t('navigation.journal'),
      description: t('journal.trackConsumption'),
      colorDark: "from-teal-DEFAULT/40 to-teal-dark/30",
      colorLight: "from-teal-light/30 to-teal-DEFAULT/20"
    },
    {
      path: "/strains",
      icon: Cannabis,
      title: t('navigation.strains'),
      description: t('strains.explorer'),
      colorDark: "from-coral-light/40 to-coral-dark/30",
      colorLight: "from-coral-light/20 to-coral-DEFAULT/30"
    },
    {
      path: "/clubs",
      icon: Map,
      title: t('navigation.clubs'),
      description: t('clubs.findNearYou'),
      colorDark: "from-sand-light/40 to-sand-dark/30",
      colorLight: "from-sand-light/40 to-sand-dark/20"
    },
    {
      path: "/guide",
      icon: BookOpen,
      title: t('navigation.guide'),
      description: t('guide.learnMore'),
      colorDark: "from-coral-light/40 to-coral-dark/30",
      colorLight: "from-coral-light/20 to-coral-dark/20"
    },
    {
      path: "/settings",
      icon: Settings,
      title: t('navigation.settings'),
      description: t('settings.managePreferences'),
      colorDark: "from-sand-light/40 to-sand-dark/30",
      colorLight: "from-sand-light/30 to-sand-dark/20"
    }
  ];

  const getBgGradient = (index: number) => {
    const section = sections[index];
    return isDarkMode ? section.colorDark : section.colorLight;
  };

  const getCardBorderClass = () => isDarkMode 
    ? "border-navy/30" 
    : "border-sand-dark/30";
    
  const getTextClass = () => isDarkMode 
    ? "text-gray-100" 
    : "text-navy-dark";
  
  const getDescriptionClass = () => isDarkMode 
    ? "text-gray-300" 
    : "text-gray-600";
    
  const getIconBgClass = () => isDarkMode
    ? "bg-navy/40"
    : "bg-sand-light/70";
    
  const getBackgroundClass = () => isDarkMode
    ? "bg-gradient-to-b from-[#1a2433] to-[#222e40]"
    : "bg-gradient-to-b from-oldLace-DEFAULT to-cadetGray-100";

  return (
    <div className={`min-h-screen pb-20 ${getBackgroundClass()}`}>
      <Navbar />
      <div className="container px-4 py-6">
        <h1 className={`text-2xl font-bold ${getTextClass()} mb-6`}>{t('app.title')}</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, index) => (
            <Link 
              key={section.path}
              to={section.path} 
              className="block hover:scale-[1.02] transition-transform duration-200"
            >
              <div className={`bg-gradient-to-br ${getBgGradient(index)} backdrop-blur-sm border ${getCardBorderClass()} rounded-xl shadow-md hover:shadow-lg p-6 h-full`}>
                <div className={`flex justify-center items-center h-16 w-16 ${getIconBgClass()} rounded-full mb-4 mx-auto shadow-sm`}>
                  <section.icon className="h-8 w-8 text-teal-DEFAULT" />
                </div>
                <h2 className={`text-xl font-bold ${getTextClass()} text-center mb-2`}>{section.title}</h2>
                <p className={`${getDescriptionClass()} text-center`}>
                  {section.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
