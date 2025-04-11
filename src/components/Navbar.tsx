
import React from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

const Navbar: React.FC = () => {
  const { t } = useTranslation();

  return (
    <nav className="bg-[#1A3A47] border-b border-[#215366] shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 relative">
                <img 
                  src="/lovable-uploads/370eda35-13fb-4fc5-b7be-245abab0040d.png" 
                  alt="SocialClub Map Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-bold text-xl text-white">SocialClub Map</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
