
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, Cannabis, MapPin, BookText, Newspaper } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Capacitor } from "@capacitor/core";
import { useIsMobile } from "@/hooks/use-mobile";

const BottomNav: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const [isNativePlatform, setIsNativePlatform] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const isMobile = useIsMobile();
  
  // Update platform state on component mount
  useEffect(() => {
    setIsNativePlatform(Capacitor.isNativePlatform());
    setIsIOS(Capacitor.getPlatform() === 'ios');
  }, []);
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const navItems = [
    { path: "/", label: t('navigation.home'), icon: Home },
    { path: "/journal", label: t('navigation.journal'), icon: BookOpen },
    { path: "/strains", label: t('navigation.strains'), icon: Cannabis },
    { path: "/clubs", label: t('navigation.clubs'), icon: MapPin },
    { path: "/guide", label: t('navigation.guide'), icon: BookText },
    { path: "/news", label: t('navigation.news'), icon: Newspaper },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-border shadow-lg z-50 bg-background bottom-nav-container">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center w-full h-full ${
              isActive(item.path) ? "text-primary" : "text-muted-foreground"
            }`}
            aria-label={item.label}
          >
            <item.icon size={isMobile ? 18 : 20} className={isActive(item.path) ? "text-primary" : ""} />
            <span className="text-[10px] mt-1 truncate px-1 max-w-full">{item.label}</span>
          </Link>
        ))}
      </div>
      {isIOS && isNativePlatform && 
        <div className="ios-bottom-safe"></div>
      }
    </div>
  );
};

export default BottomNav;
