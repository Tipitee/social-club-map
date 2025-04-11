
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Settings as SettingsIcon, Globe, Info, Moon, Sun, MapPin } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Settings: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(document.documentElement.classList.contains('dark'));

  // Update user language preference when it changes
  useEffect(() => {
    async function updateUserLanguage() {
      if (!user) return;
      
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ language })
          .eq('id', user.id);
          
        if (error) {
          console.error('Error updating language preference:', error);
        }
      } catch (error) {
        console.error('Exception when updating language:', error);
      }
    }
    
    updateUserLanguage();
  }, [language, user]);

  // Handle theme toggle
  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      setIsDarkMode(false);
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
      localStorage.setItem('theme', 'dark');
    }
  };

  // Set theme on initial load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <Navbar />
      <ScrollArea className="h-[calc(100vh-180px)]">
        <main className="container px-4 py-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
              <SettingsIcon className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">{t('settings.title')}</h1>
          </div>

          <Card className="mb-8 hover:border-primary/50 transition-colors shadow-lg rounded-xl overflow-hidden">
            <CardHeader className="pb-2 border-b">
              <CardTitle className="text-xl font-semibold flex items-center gap-3">
                <Globe className="h-5 w-5 text-primary" />
                {t('settings.appearance')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex justify-between items-center py-3 px-2">
                <span className="text-lg">{t('settings.language')}</span>
                <LanguageSwitcher />
              </div>
              
              <div className="flex justify-between items-center py-3 px-2 border-t">
                <span className="text-lg">{t('settings.theme')}</span>
                <div className="flex items-center space-x-2">
                  {isDarkMode ? 
                    <Moon className="h-5 w-5 text-primary mr-2" /> : 
                    <Sun className="h-5 w-5 text-primary mr-2" />
                  }
                  <Switch 
                    checked={isDarkMode} 
                    onCheckedChange={toggleTheme} 
                    id="theme-mode"
                  />
                  <Label htmlFor="theme-mode" className="sr-only">
                    Toggle Theme
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-colors shadow-lg rounded-xl overflow-hidden">
            <CardHeader className="pb-2 border-b">
              <CardTitle className="text-xl font-semibold flex items-center gap-3">
                <Info className="h-5 w-5 text-primary" />
                {t('settings.about')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between py-2 px-2">
                <span>{t('settings.version')}</span>
                <span className="font-mono">1.0.0</span>
              </div>
              
              <div className="flex items-center mt-2 py-2 px-2">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-primary mr-2" />
                  <p>© 2025 SocialClub Map</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </ScrollArea>
    </div>
  );
};

export default Settings;
