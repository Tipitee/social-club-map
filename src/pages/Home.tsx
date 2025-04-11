
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

  const sections = [
    {
      path: "/journal",
      icon: Book,
      title: "Journal",
      description: "Track your consumption and experiences",
      color: "from-emerald-600/20 to-emerald-900/30"
    },
    {
      path: "/strains",
      icon: Cannabis,
      title: "Strains",
      description: "Explore cannabis strains and their effects",
      color: "from-purple-600/20 to-purple-900/30"
    },
    {
      path: "/clubs",
      icon: Map,
      title: "Clubs",
      description: "Find local cannabis clubs near you",
      color: "from-blue-600/20 to-blue-900/30"
    },
    {
      path: "/legal",
      icon: Bell,
      title: "Updates",
      description: "Stay informed about cannabis laws",
      color: "from-amber-600/20 to-amber-900/30"
    },
    {
      path: "/guide",
      icon: BookOpen,
      title: "Guide",
      description: "Learn more about cannabis usage",
      color: "from-red-600/20 to-red-900/30"
    },
    {
      path: "/settings",
      icon: Settings,
      title: "Settings",
      description: "Manage your app preferences",
      color: "from-gray-600/20 to-gray-700/30"
    }
  ];

  return (
    <div className="mb-20">
      <Navbar />
      <div className="container px-4 py-6">
        {!user && (
          <div className="mb-8 p-6 bg-gray-800/60 border border-gray-700 rounded-xl text-center">
            <User className="mx-auto h-12 w-12 text-primary mb-3" />
            <h2 className="text-xl font-bold mb-2">Welcome to SocialClub Map</h2>
            <p className="text-gray-300 mb-4">Sign in to track your consumption and save your preferences</p>
            <Button 
              asChild
              className="bg-primary hover:bg-primary/90 px-6 py-5 text-lg"
            >
              <Link to="/auth">Sign In / Create Account</Link>
            </Button>
          </div>
        )}
        
        <h1 className="text-2xl font-bold text-white mb-6">Cannabis Companion</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <Link 
              key={section.path}
              to={section.path} 
              className="block hover:scale-[1.02] transition-transform duration-200"
            >
              <div className={`bg-gradient-to-br ${section.color} border border-gray-700/50 rounded-xl shadow-lg p-6 h-full`}>
                <div className="flex justify-center items-center h-16 w-16 bg-gray-800/50 rounded-full mb-4 mx-auto">
                  <section.icon className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-white text-center mb-2">{section.title}</h2>
                <p className="text-gray-300 text-center">
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
