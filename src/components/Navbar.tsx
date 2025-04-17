
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";
import { User, LogIn, Settings, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isAdmin = user?.email === 'tomalours@gmail.com';
  const [darkLogo, setDarkLogo] = useState<string | null>(null);
  const [lightLogo, setLightLogo] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    
    // Fetch logos from Supabase storage
    const fetchLogos = async () => {
      try {
        const { data: darkData } = await supabase
          .storage
          .from('logoclub')
          .getPublicUrl('darklogo.png');
        
        const { data: lightData } = await supabase
          .storage
          .from('logoclub')
          .getPublicUrl('lightlogo.png');
        
        if (darkData) setDarkLogo(darkData.publicUrl);
        if (lightData) setLightLogo(lightData.publicUrl);
      } catch (error) {
        console.error("Error fetching logos:", error);
      }
    };
    
    fetchLogos();
  }, []);

  const currentLogo = theme === 'dark' ? darkLogo : lightLogo;

  if (!mounted) {
    return (
      <div className="bg-linen dark:bg-navy-dark border-b border-border sticky top-0 z-50">
        <div className="container flex items-center justify-between p-4">
          <div className="h-10 w-32"></div>
          <div className="flex items-center gap-3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-linen dark:bg-navy-dark border-b border-border sticky top-0 z-50">
      <div className="container flex items-center justify-between p-4">
        <Link to="/" className="flex items-center font-bold text-xl">
          {currentLogo ? (
            <img 
              src={currentLogo} 
              alt="Logo" 
              className="h-10"
            />
          ) : (
            <div className="h-10 w-32 bg-gray-200 dark:bg-navy-400 rounded animate-pulse"></div>
          )}
        </Link>

        <div className="flex items-center gap-2">
          <Link to="/settings">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full bg-white dark:bg-navy-light border-navy-DEFAULT dark:border-navy-light text-navy-dark dark:text-white hover:bg-gray-100 dark:hover:bg-navy-400"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full bg-white dark:bg-navy-light border-navy-DEFAULT dark:border-navy-light">
                  <User className="h-5 w-5 text-navy-dark dark:text-white" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white dark:bg-navy-400 border-navy-DEFAULT dark:border-navy-500">
                <DropdownMenuItem className="text-navy-dark dark:text-white hover:bg-navy-DEFAULT/10 dark:hover:bg-navy-300">
                  <Link to="/profile">{t('navigation.profile')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-navy-dark dark:text-white hover:bg-navy-DEFAULT/10 dark:hover:bg-navy-300">
                  <Link to="/settings">{t('navigation.settings')}</Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem className="text-navy-dark dark:text-white hover:bg-navy-DEFAULT/10 dark:hover:bg-navy-300">
                    <Link to="/admin-tools" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Admin Tools
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-navy-DEFAULT/20 dark:bg-white/20" />
                <DropdownMenuItem 
                  onClick={() => signOut()} 
                  className="text-navy-dark dark:text-white hover:bg-navy-DEFAULT/10 dark:hover:bg-navy-300"
                >
                  {t('auth.signOut')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="icon" className="rounded-full bg-white dark:bg-navy-light border-navy-DEFAULT dark:border-navy-light text-navy-dark dark:text-white hover:bg-gray-100 dark:hover:bg-navy-400">
                <LogIn className="h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
