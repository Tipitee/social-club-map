
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <nav className="bg-[#131922] border-b border-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/7bfa1a23-8c92-4adb-b85b-63bb2f75ff2c.png" 
              alt="SocialClub Map Logo"
              className="h-10 w-auto" 
            />
            <span className="font-bold text-xl text-white">SocialClub Map</span>
          </Link>
          
          {user && (
            <Link to="/profile" className="ml-auto">
              <div className="h-9 w-9 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-primary font-medium">
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
