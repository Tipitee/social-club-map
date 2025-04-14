
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";
import { User } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Use effect to handle component mounting and prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with the same dimensions during SSR/mounting
    return (
      <div className="bg-white dark:bg-navy-dark border-b border-border sticky top-0 z-50">
        <div className="container flex items-center justify-between p-4">
          <div className="h-10 w-32"></div>
          <div className="flex items-center gap-3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-navy-dark border-b border-border sticky top-0 z-50">
      <div className="container flex items-center justify-between p-4">
        <Link to="/" className="flex items-center font-bold text-xl">
          {theme === 'dark' ? (
            <img 
              src="/lovable-uploads/27f327ef-1fe4-46e4-88ae-7e523c37dee6.png" 
              alt="Logo" 
              className="h-10 w-auto mr-2" 
            />
          ) : (
            <img 
              src="/lovable-uploads/8aadd7cd-2da7-4b51-833e-73194cbe47ee.png"
              alt="Logo" 
              className="h-10 w-auto mr-2" 
            />
          )}
        </Link>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full bg-white dark:bg-navy-light border-navy-DEFAULT dark:border-navy-light">
                  <User className="h-5 w-5 text-navy-dark dark:text-white" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white dark:bg-navy-light border-navy-DEFAULT dark:border-navy-light">
                <DropdownMenuLabel className="text-navy-dark dark:text-white">{t('navigation.profile')}</DropdownMenuLabel>
                <DropdownMenuItem className="text-navy-dark dark:text-white hover:bg-navy-DEFAULT/10 dark:hover:bg-white/10">
                  <Link to="/profile">{t('navigation.profile')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-navy-dark dark:text-white hover:bg-navy-DEFAULT/10 dark:hover:bg-white/10">
                  <Link to="/settings">{t('navigation.settings')}</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-navy-DEFAULT/20 dark:bg-white/20" />
                <DropdownMenuItem 
                  onClick={() => signOut()} 
                  className="text-navy-dark dark:text-white hover:bg-navy-DEFAULT/10 dark:hover:bg-white/10"
                >
                  {t('auth.signOut')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button variant="outline" className="rounded-full bg-white dark:bg-navy-light border-navy-DEFAULT dark:border-navy-light text-navy-dark dark:text-white hover:bg-navy-DEFAULT/10 dark:hover:bg-white/10">
                {t('auth.signIn')}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
