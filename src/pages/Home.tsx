
import React from "react";
import { Book, Cannabis, Map, BookText, Newspaper, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { Capacitor } from "@capacitor/core";

const Home: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isIOS = Capacitor.getPlatform() === 'ios';
  const isNativePlatform = Capacitor.isNativePlatform();
  
  const sections = [
    {
      path: "/journal",
      icon: Book,
      title: t('navigation.journal'),
      description: t('journal.trackYourConsumption'),
      cardClass: "home-card-journal"
    },
    {
      path: "/strains",
      icon: Cannabis,
      title: t('navigation.strains'),
      description: t('strains.exploreDatabase'),
      cardClass: "home-card-strains"
    },
    {
      path: "/clubs",
      icon: Map,
      title: t('navigation.clubs'),
      description: t('clubs.findLocalClub'),
      cardClass: "home-card-clubs"
    },
    {
      path: "/guide",
      icon: BookText,
      title: t('navigation.guide'),
      description: t('guide.learnMore'),
      cardClass: "home-card-guide"
    },
    {
      path: "/news",
      icon: Newspaper,
      title: t('navigation.news'),
      description: t('news.stayInformed'),
      cardClass: "home-card-news"
    },
    {
      path: "/settings",
      icon: Settings,
      title: t('navigation.settings'),
      description: t('settings.preferences'),
      cardClass: "home-card-settings"
    }
  ];

  return (
    <div className="min-h-screen pb-20 bg-linen dark:bg-navy-dark">
      <div className={`container py-6 px-4 sm:px-[44px] ${isIOS && isNativePlatform ? 'pt-16' : ''}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map(section => (
            <Link 
              key={section.path} 
              to={section.path} 
              className="block hover:scale-[1.02] transition-transform duration-200"
            >
              <div className={`rounded-xl shadow-md hover:shadow-lg p-6 h-full bg-white dark:bg-navy-light ${section.cardClass}`}>
                <div className="flex justify-center items-center h-16 w-16 bg-linen/80 dark:bg-navy-400/80 rounded-full mb-4 mx-auto shadow-md">
                  <section.icon className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-navy-dark dark:text-white text-center mb-2">
                  {section.title}
                </h2>
                <p className="text-navy-DEFAULT/80 dark:text-gray-300 text-center">
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
