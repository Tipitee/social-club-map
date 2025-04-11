
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Book, Cannabis, MapPin, Settings } from "lucide-react";
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
    { path: "/settings", label: t('app.navigation.settings'), icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1A3A47] border-t border-[#215366] z-50 shadow-lg">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center w-full h-full ${
              isActive(item.path) ? "text-[#AED3D9]" : "text-gray-400"
            }`}
            aria-label={item.label}
          >
            <item.icon size={22} className={isActive(item.path) ? "text-[#AED3D9]" : ""} />
            <span className="text-xs mt-1 truncate px-1 max-w-full">{item.label}</span>
          </Link>
        ))}
      </div>
      <div className="h-safe-bottom bg-[#1A3A47] border-t-0"></div>
    </div>
  );
};

export default BottomNav;
