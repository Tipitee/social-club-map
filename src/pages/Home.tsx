
import React from "react";
import { Book, Cannabis, Map, Settings, BookText, Newspaper } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

const Home: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

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
      cardClass: "home-card-settings" // Swapped with settings (used to be guide)
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
      description: t('settings.managePreferences'),
      cardClass: "home-card-guide" // Swapped with guide (used to be settings)
    }
  ];

  return (
    <div className="min-h-screen pb-20 bg-background">
      <Navbar />
      <div className="container px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <Link 
              key={section.path}
              to={section.path} 
              className="block hover:scale-[1.02] transition-transform duration-200"
            >
              <div className={`rounded-xl shadow-md hover:shadow-lg p-6 h-full ${section.cardClass}`}>
                <div className="flex justify-center items-center h-16 w-16 bg-card/80 rounded-full mb-4 mx-auto shadow-md">
                  <section.icon className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground text-center mb-2">{section.title}</h2>
                <p className="text-muted-foreground text-center">
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
