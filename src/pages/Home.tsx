
import React from "react";
import { Book, Cannabis, Map, Bell, BookOpen, Settings, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

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
      colorDark: "from-emerald-600/20 to-emerald-900/30",
      colorLight: "from-airForceBlue-100/20 to-airForceBlue-300/30"
    },
    {
      path: "/strains",
      icon: Cannabis,
      title: t('navigation.strains'),
      description: t('strains.explorer'),
      colorDark: "from-purple-600/20 to-purple-900/30",
      colorLight: "from-cadetGray-300/30 to-cadetGray-500/30"
    },
    {
      path: "/clubs",
      icon: Map,
      title: t('navigation.clubs'),
      description: t('clubs.findNearYou'),
      colorDark: "from-blue-600/20 to-blue-900/30",
      colorLight: "from-ashGray-300/30 to-ashGray-500/30"
    },
    {
      path: "/legal",
      icon: Bell,
      title: t('navigation.updates'),
      description: t('legal.stayInformed'),
      colorDark: "from-amber-600/20 to-amber-900/30",
      colorLight: "from-oldLace-300/40 to-oldLace-400/40"
    },
    {
      path: "/guide",
      icon: BookOpen,
      title: t('navigation.guide'),
      description: t('guide.learnMore'),
      colorDark: "from-red-600/20 to-red-900/30",
      colorLight: "from-linen-300/40 to-linen-400/40"
    },
    {
      path: "/settings",
      icon: Settings,
      title: t('navigation.settings'),
      description: t('settings.managePreferences'),
      colorDark: "from-gray-600/20 to-gray-700/30",
      colorLight: "from-cadetGray-100/30 to-cadetGray-200/30"
    }
  ];

  const getBgGradient = (index: number) => {
    const section = sections[index];
    return isDarkMode ? section.colorDark : section.colorLight;
  };

  const getCardBorderClass = () => isDarkMode 
    ? "border-gray-700/50" 
    : "border-cadetGray-300/50";
    
  const getTextClass = () => isDarkMode 
    ? "text-white" 
    : "text-gray-800";
  
  const getDescriptionClass = () => isDarkMode 
    ? "text-gray-300" 
    : "text-gray-600";
    
  const getIconBgClass = () => isDarkMode
    ? "bg-gray-800/50"
    : "bg-white/70";

  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      <div className="container px-4 py-6">
        {!user && (
          <div className={`mb-8 p-6 ${isDarkMode ? 'bg-gray-800/60 border-gray-700' : 'bg-oldLace-500 border-cadetGray-300/50'} rounded-xl text-center border`}>
            <User className={`mx-auto h-12 w-12 text-primary mb-3`} />
            <h2 className={`text-xl font-bold mb-2 ${getTextClass()}`}>{t('auth.welcomeTo')}</h2>
            <p className={`${getDescriptionClass()} mb-4`}>{t('auth.signInToTrack')}</p>
            <Button 
              asChild
              className="bg-primary hover:bg-primary/90 px-6 py-5 text-lg text-white"
            >
              <Link to="/auth">{t('auth.signInOrCreate')}</Link>
            </Button>
          </div>
        )}
        
        <h1 className={`text-2xl font-bold ${getTextClass()} mb-6`}>{t('app.title')}</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, index) => (
            <Link 
              key={section.path}
              to={section.path} 
              className="block hover:scale-[1.02] transition-transform duration-200"
            >
              <div className={`bg-gradient-to-br ${getBgGradient(index)} border ${getCardBorderClass()} rounded-xl shadow-lg p-6 h-full`}>
                <div className={`flex justify-center items-center h-16 w-16 ${getIconBgClass()} rounded-full mb-4 mx-auto`}>
                  <section.icon className="h-8 w-8 text-primary" />
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
