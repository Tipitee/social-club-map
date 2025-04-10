
import React from "react";
import { Book, Cannabis, Map, Scale, BookOpen, WifiOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Navbar from "@/components/Navbar";

const Home: React.FC = () => {
  const { t } = useTranslation();

  const sections = [
    {
      path: "/journal",
      icon: Book,
      title: "home.sections.journal.title",
      description: "home.sections.journal.description"
    },
    {
      path: "/strains",
      icon: Cannabis,
      title: "home.sections.strains.title",
      description: "home.sections.strains.description"
    },
    {
      path: "/clubs",
      icon: Map,
      title: "home.sections.clubs.title",
      description: "home.sections.clubs.description"
    },
    {
      path: "/legal",
      icon: Scale,
      title: "home.sections.legal.title",
      description: "home.sections.legal.description"
    },
    {
      path: "/guide",
      icon: BookOpen,
      title: "home.sections.guide.title",
      description: "home.sections.guide.description"
    },
    {
      path: "/profile/offline",
      icon: WifiOff,
      title: "home.sections.offline.title",
      description: "home.sections.offline.description"
    }
  ];

  return (
    <div className="mb-20">
      <Navbar />
      <div className="container px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">{t('app.title')}</h1>
          <LanguageSwitcher />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <Link 
              key={section.path}
              to={section.path} 
              className="block hover:scale-[1.02] transition-transform duration-200"
            >
              <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 h-full">
                <div className="flex justify-center items-center h-20 w-20 bg-gray-700 rounded-full mb-4 mx-auto">
                  <section.icon className="h-10 w-10 text-secondary" />
                </div>
                <h2 className="text-xl font-bold text-white text-center mb-2">{t(section.title)}</h2>
                <p className="text-gray-400 text-center">
                  {t(section.description)}
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
