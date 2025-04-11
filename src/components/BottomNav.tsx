
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Book, Cannabis, MapPin, Bell, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";

const BottomNav: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/journal", label: "Journal", icon: Book },
    { path: "/strains", label: "Strains", icon: Cannabis },
    { path: "/clubs", label: "Clubs", icon: MapPin },
    { path: "/legal", label: "Updates", icon: Bell },
    { path: user ? "/profile" : "/auth", label: user ? "Profile" : "Sign In", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50 shadow-lg">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center w-full h-full ${
              isActive(item.path) ? "text-primary" : "text-gray-400"
            }`}
            aria-label={item.label}
          >
            <item.icon size={22} className={isActive(item.path) ? "text-primary" : ""} />
            <span className="text-xs mt-1 truncate px-1 max-w-full">{item.label}</span>
          </Link>
        ))}
      </div>
      {/* Add a safe area for iOS devices */}
      <div className="h-safe-bottom bg-gray-900 border-t-0"></div>
    </div>
  );
};

export default BottomNav;
