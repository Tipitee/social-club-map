
import React from "react";
import { Link } from "react-router-dom";
import { LogIn, LogOut, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useAuth } from "@/contexts/AuthContext";

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { user, signOut, isLoading } = useAuth();

  return (
    <nav className="bg-[#131922] border-b border-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
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

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-t-2 border-primary"></div>
            ) : user ? (
              <div className="flex items-center gap-2">
                <Link to="/profile">
                  <Button size="sm" variant="outline" className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                    <User size={16} className="mr-1" />
                    {t('profile')}
                  </Button>
                </Link>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={signOut} 
                  className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                >
                  <LogOut size={16} className="mr-1" />
                  {t('auth.signOut')}
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button size="sm" variant="outline" className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                  <LogIn size={16} className="mr-1" />
                  {t('auth.signIn')}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
