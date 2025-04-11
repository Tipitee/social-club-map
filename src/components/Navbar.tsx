
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Cannabis, MapPin, Book, BookOpen, Scale, Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const navItems = [
    { path: "/strains", icon: Cannabis, label: t('app.navigation.strains') },
    { path: "/clubs", icon: MapPin, label: t('app.navigation.clubs') },
    { path: "/journal", icon: Book, label: t('app.navigation.journal') },
    { path: "/legal", icon: Scale, label: t('app.navigation.legal') },
    { path: "/guide", icon: BookOpen, label: t('app.navigation.guide') },
  ];

  return (
    <nav className="bg-[#131922] border-b border-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Cannabis className="h-6 w-6 text-[#4CAF50]" />
              <span className="font-bold text-xl text-white">GCE</span>
            </Link>
          </div>
          
          <div className="flex items-center">
            <LanguageSwitcher />
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center ml-2">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-400"
              aria-expanded="false"
            >
              <span className="sr-only">{t('app.navigation.mobileMenu')}</span>
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive(item.path)
                    ? "bg-primary text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#131922] absolute w-full z-50 border-b border-gray-800">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive(item.path)
                  ? "bg-primary text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-1.5">
                <item.icon size={18} />
                <span>{item.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
