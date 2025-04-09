
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Book, Cannabis, User } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const BottomNav: React.FC = () => {
  const location = useLocation();
  const { t } = useLanguage();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: "/", label: t("home"), icon: Home },
    { path: "/journal", label: t("journal"), icon: Book },
    { path: "/strains", label: t("strains"), icon: Cannabis },
    { path: "/profile", label: t("profile"), icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
              isActive(item.path) ? "text-secondary" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            <item.icon size={24} className={isActive(item.path) ? "text-secondary" : ""} />
            <span className="text-xs mt-1 font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
