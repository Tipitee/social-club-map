
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Book, Cannabis, User, MapPin, Scale, BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";

const BottomNav: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const navItems = [
    { path: "/", label: t('app.navigation.home'), icon: Home },
    { path: "/journal", label: t('app.navigation.journal'), icon: Book },
    { path: "/strains", label: t('app.navigation.strains'), icon: Cannabis },
    { path: "/clubs", label: t('app.navigation.clubs'), icon: MapPin },
    { path: "/legal", label: t('app.navigation.legal'), icon: Scale },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center w-full h-full ${
              isActive(item.path) ? "text-secondary" : "text-gray-500"
            }`}
          >
            <item.icon size={24} className={isActive(item.path) ? "text-secondary" : ""} />
            <span className="text-xs mt-1 truncate px-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
