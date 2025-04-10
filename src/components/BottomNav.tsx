
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Book, Cannabis, User, MapPin } from "lucide-react";

const BottomNav: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/journal", label: "Journal", icon: Book },
    { path: "/strains", label: "Strains", icon: Cannabis },
    { path: "/clubs", label: "Clubs", icon: MapPin },
    { path: "/profile", label: "Profile", icon: User },
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
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
