
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, Cannabis, MapPin, BookText, Newspaper } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Capacitor } from "@capacitor/core";
import { useIsMobile } from "@/hooks/use-mobile";

const BottomNav: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const isNativePlatform = Capacitor.isNativePlatform();
  const isIOS = Capacitor.getPlatform() === 'ios';
  const isMobile = useIsMobile();
  
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
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 shadow-lg">
      {/* Navigation items */}
      <div className="flex justify-around items-center h-14">
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
      
      {/* Make sure we have a real height for iOS safe area */}
      {isIOS && isNativePlatform && (
        <div className="h-safe-area-bottom bg-background"></div>
      )}
    </div>
  );
};

export default BottomNav;
