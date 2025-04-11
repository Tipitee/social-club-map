
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
      colorDark: "from-teal-light/30 to-teal-dark/40",
      colorLight: "from-teal-light/20 to-teal-dark/10"
    },
    {
      path: "/strains",
      icon: Cannabis,
      title: t('navigation.strains'),
      description: t('strains.explorer'),
      colorDark: "from-coral-light/30 to-coral-dark/40",
      colorLight: "from-coral-light/10 to-coral-DEFAULT/20"
    },
    {
      path: "/clubs",
      icon: Map,
      title: t('navigation.clubs'),
      description: t('clubs.findNearYou'),
      colorDark: "from-sand-light/30 to-sand-dark/40",
      colorLight: "from-sand-light/30 to-sand-dark/10"
    },
    {
      path: "/legal",
      icon: Bell,
      title: t('navigation.updates'),
      description: t('legal.stayInformed'),
      colorDark: "from-navy-light/40 to-navy-dark/50",
      colorLight: "from-navy-light/10 to-navy-DEFAULT/10"
    },
    {
      path: "/guide",
      icon: BookOpen,
      title: t('navigation.guide'),
      description: t('guide.learnMore'),
      colorDark: "from-coral-light/30 to-coral-dark/40",
      colorLight: "from-coral-light/10 to-coral-dark/10"
    },
    {
      path: "/settings",
      icon: Settings,
      title: t('navigation.settings'),
      description: t('settings.managePreferences'),
      colorDark: "from-sand-light/30 to-sand-dark/40",
      colorLight: "from-sand-light/10 to-sand-dark/10"
    }
  ];

  const getBgGradient = (index: number) => {
    const section = sections[index];
    return isDarkMode ? section.colorDark : section.colorLight;
  };

  const getCardBorderClass = () => isDarkMode 
    ? "border-navy-light/30" 
    : "border-sand-dark/20";
    
  const getTextClass = () => isDarkMode 
    ? "text-white" 
    : "text-navy-dark";
  
  const getDescriptionClass = () => isDarkMode 
    ? "text-gray-300" 
    : "text-gray-600";
    
  const getIconBgClass = () => isDarkMode
    ? "bg-navy-light/30"
    : "bg-sand-light/50";

  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      <div className="container px-4 py-6">
        {!user && (
          <div className={`mb-8 p-6 ${isDarkMode ? 'bg-navy-light/40 border-navy-light/30' : 'bg-sand-light/70 border-sand-dark/20'} rounded-xl text-center border shadow-lg`}>
            <User className={`mx-auto h-12 w-12 text-teal-DEFAULT mb-3`} />
            <h2 className={`text-xl font-bold mb-2 ${getTextClass()}`}>{t('auth.welcomeTo')}</h2>
            <p className={`${getDescriptionClass()} mb-4`}>{t('auth.signInToTrack')}</p>
            <Button 
              asChild
              className="bg-teal-DEFAULT hover:bg-teal-dark px-6 py-5 text-lg text-white shadow-md transition-all hover:shadow-lg"
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
              <div className={`bg-gradient-to-br ${getBgGradient(index)} border ${getCardBorderClass()} rounded-xl shadow-md hover:shadow-lg p-6 h-full`}>
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
