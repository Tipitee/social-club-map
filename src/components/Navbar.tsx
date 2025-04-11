
import React from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

const Navbar: React.FC = () => {
  const { t } = useTranslation();

  return (
    <nav className="bg-[#131922] border-b border-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/7bfa1a23-8c92-4adb-b85b-63bb2f75ff2c.png" 
                alt="SocialClub Map Logo"
                className="h-10 w-auto" 
              />
              <span className="font-bold text-xl text-white">SocialClub Map</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
