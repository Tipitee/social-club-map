
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, Cannabis, MapPin, Bell, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";

const BottomNav: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const { user } = useAuth();
  const isDarkMode = document.documentElement.classList.contains('dark');
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const navItems = [
    { path: "/", label: t('navigation.home'), icon: Home },
    { path: "/journal", label: t('navigation.journal'), icon: BookOpen },
    { path: "/strains", label: t('navigation.strains'), icon: Cannabis },
    { path: "/clubs", label: t('navigation.clubs'), icon: MapPin },
    { path: "/legal", label: t('navigation.updates'), icon: Bell },
    { path: user ? "/profile" : "/auth", label: user ? t('navigation.profile') : t('navigation.signIn'), icon: User },
  ];

  const getNavBackgroundClass = () => isDarkMode 
    ? "bg-gray-900 border-gray-800" 
    : "bg-white border-cadetGray-200";

  const getInactiveTextClass = () => isDarkMode 
    ? "text-gray-400" 
    : "text-gray-500";

  return (
    <div className={`fixed bottom-0 left-0 right-0 ${getNavBackgroundClass()} border-t z-50 shadow-lg`}>
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center w-full h-full ${
              isActive(item.path) ? "text-primary" : getInactiveTextClass()
            }`}
            aria-label={item.label}
          >
            <item.icon size={20} className={isActive(item.path) ? "text-primary" : ""} />
            <span className="text-[10px] mt-1 truncate px-1 max-w-full">{item.label}</span>
          </Link>
        ))}
      </div>
      {/* Add a safe area for iOS devices */}
      <div className={`h-safe-bottom ${isDarkMode ? 'bg-gray-900' : 'bg-white'} border-t-0`}></div>
    </div>
  );
};

export default BottomNav;
