
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
      title: "Journal",
      description: "Track your consumption and experiences"
    },
    {
      path: "/strains",
      icon: Cannabis,
      title: "Strains",
      description: "Explore cannabis strains and their effects"
    },
    {
      path: "/clubs",
      icon: Map,
      title: "Clubs",
      description: "Find local cannabis clubs near you"
    },
    {
      path: "/legal",
      icon: Scale,
      title: "Legal Updates",
      description: "Stay informed about cannabis laws"
    },
    {
      path: "/guide",
      icon: BookOpen,
      title: "Cannabis Guide",
      description: "Learn more about cannabis usage"
    },
    {
      path: "/settings",
      icon: Settings,
      title: "Settings",
      description: "Manage your app preferences"
    }
  ];

  return (
    <div className="mb-20">
      <Navbar />
      <div className="container px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Cannabis Companion</h1>
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
