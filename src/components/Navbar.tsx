
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
import { useIsMobile } from "@/hooks/use-mobile";
import { Capacitor } from "@capacitor/core";

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isAdmin = user?.email === 'tomalours@gmail.com';
  const [darkLogo, setDarkLogo] = useState<string | null>(null);
  const [lightLogo, setLightLogo] = useState<string | null>(null);
  const [logoLoading, setLogoLoading] = useState(true);
  const isMobile = useIsMobile();
  const isNativePlatform = Capacitor.isNativePlatform();
  const isIOS = Capacitor.getPlatform() === 'ios';

  useEffect(() => {
    setMounted(true);
    
    const fetchLogos = async () => {
      setLogoLoading(true);
      try {
        const { data: darkData } = await supabase
          .storage
          .from('logoclub')
          .getPublicUrl('darklogo.png');
        
        const { data: lightData } = await supabase
          .storage
          .from('logoclub')
          .getPublicUrl('lightlogo.png');
        
        if (darkData) {
          console.log("Dark logo URL:", darkData.publicUrl);
          setDarkLogo(darkData.publicUrl);
        }
        if (lightData) {
          console.log("Light logo URL:", lightData.publicUrl);
          setLightLogo(lightData.publicUrl);
        }
      } catch (error) {
        console.error("Error fetching logos:", error);
      } finally {
        setLogoLoading(false);
      }
    };
    
    fetchLogos();
  }, []);

  const currentLogo = theme === 'dark' ? darkLogo : lightLogo;

  if (!mounted) {
    return (
      <div className="bg-background border-b border-border sticky top-0 z-50">
        <div className="h-safe-area-top w-full bg-background"></div>
        <div className="container flex items-center justify-between p-4">
          <div className="h-10 w-32 bg-muted rounded animate-pulse"></div>
          <div className="flex items-center gap-3"></div>
        </div>
      </div>
    );
  }

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      {/* iOS safe area spacer - ALWAYS VISIBLE regardless of platform */}
      <div className={`w-full ${isIOS && isNativePlatform ? 'h-[40px]' : 'h-0'} bg-background`}></div>
      
      {/* Main navbar content - positioned below the safe area */}
      <div className="container flex items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center font-bold text-xl">
          {logoLoading ? (
            <div className="h-8 w-28 bg-muted animate-pulse" />
          ) : currentLogo ? (
            <img 
              src={currentLogo} 
              alt="Logo" 
              className="navbar-logo max-h-8 w-auto"
              onError={(e) => {
                console.error("Logo loading error");
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="text-foreground font-bold text-lg">
              Cannabis Club
            </div>
          )}
        </Link>

        <div className="flex items-center gap-2">
          <Link to="/settings">
            <Button 
              variant="outline" 
              size={isMobile ? "sm" : "icon"}
              className="rounded-full bg-background border-border text-foreground hover:bg-muted"
            >
              <Settings className={isMobile ? "h-4 w-4" : "h-5 w-5"} />
            </Button>
          </Link>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full bg-background border-border">
                  <User className="h-5 w-5 text-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card border-border">
                <DropdownMenuItem className="text-card-foreground hover:bg-muted">
                  <Link to="/profile">{t('navigation.profile')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-card-foreground hover:bg-muted">
                  <Link to="/settings">{t('navigation.settings')}</Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem className="text-card-foreground hover:bg-muted">
                    <Link to="/admin-tools" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Admin Tools
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem 
                  onClick={() => signOut()} 
                  className="text-card-foreground hover:bg-muted"
                >
                  {t('auth.signOut')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button 
                variant="outline" 
                size={isMobile ? "sm" : "icon"}
                className="rounded-full bg-background border-border text-foreground hover:bg-muted"
              >
                <LogIn className={isMobile ? "h-4 w-4" : "h-5 w-5"} />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
