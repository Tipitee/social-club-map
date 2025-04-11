
import React from "react";
import { Book, Cannabis, Map, Scale, BookOpen, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";

const Home: React.FC = () => {
  const { t } = useTranslation();

  const sections = [
    {
      path: "/journal",
      icon: Book,
      title: t('home.sections.journal.title'),
      description: t('home.sections.journal.description')
    },
    {
      path: "/strains",
      icon: Cannabis,
      title: t('home.sections.strains.title'),
      description: t('home.sections.strains.description')
    },
    {
      path: "/clubs",
      icon: Map,
      title: t('home.sections.clubs.title'),
      description: t('home.sections.clubs.description')
    },
    {
      path: "/legal",
      icon: Scale,
      title: t('home.sections.legal.title'),
      description: t('home.sections.legal.description')
    },
    {
      path: "/guide",
      icon: BookOpen,
      title: t('home.sections.guide.title'),
      description: t('home.sections.guide.description')
    },
    {
      path: "/settings",
      icon: Settings,
      title: t('home.sections.settings.title'),
      description: t('home.sections.settings.description')
    }
  ];

  return (
    <div className="mb-20">
      <Navbar />
      <div className="container px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">{t('app.title')}</h1>
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
                <h2 className="text-xl font-bold text-white text-center mb-2">{section.title}</h2>
                <p className="text-gray-400 text-center">
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
