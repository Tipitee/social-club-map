
import React, { useState, useEffect } from "react";
import { Book, Cannabis, Map, BookText, Newspaper, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { Capacitor } from "@capacitor/core";

const Home: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isIOS, setIsIOS] = useState(false);
  const [isNativePlatform, setIsNativePlatform] = useState(false);
  
  // Check platform on component mount
  useEffect(() => {
    setIsIOS(Capacitor.getPlatform() === 'ios');
    setIsNativePlatform(Capacitor.isNativePlatform());
  }, []);

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

  // Calculate top padding based on platform - increased for iOS
  const getTopPadding = () => {
    if (isIOS && isNativePlatform) {
      return 'pt-[env(safe-area-inset-top)]'; // Use direct env value
    }
    return 'pt-16'; // Standard padding for other platforms
  };

  return (
    <div className="min-h-dvh pb-20 bg-background">
      <div className={`container py-6 px-4 sm:px-6 ${getTopPadding()}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map(section => (
            <Link 
              key={section.path} 
              to={section.path} 
              className="block hover:scale-[1.02] transition-transform duration-200"
            >
              <div className={`rounded-xl shadow-md hover:shadow-lg p-5 bg-card ${section.cardClass}`}>
                <div className="flex justify-center items-center h-12 w-12 bg-accent/20 dark:bg-accent/10 rounded-full mb-3 mx-auto shadow-sm">
                  <section.icon className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-lg font-bold text-card-foreground text-center mb-2">
                  {section.title}
                </h2>
                <p className="text-sm text-card-foreground/80 text-center">
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
