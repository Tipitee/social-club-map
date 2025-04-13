import React from "react";
import Navbar from "@/components/Navbar";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/components/theme-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  const changeLanguage = (value: string) => {
    i18n.changeLanguage(value);
    localStorage.setItem('language', value);
    toast({
      title: t('settings.languageChanged'),
      description: value === 'en' ? 'Language set to English' : 'Sprache auf Deutsch eingestellt',
    });
  };
  
  return (
    <div className="min-h-screen bg-linen dark:bg-navy-dark pb-28">
      <Navbar />
      <div className="container px-4 py-6 max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-navy-dark dark:text-white">
          {t('settings.title')}
        </h1>
        
        <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto">
          <Card className="dark:bg-navy-light border-navy-DEFAULT light:bg-sand-light light:border-sand-DEFAULT">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6 text-navy-dark dark:text-white">
                {t('settings.appearance')}
              </h2>
              
              <div className="flex justify-between items-center mb-6">
                <Label htmlFor="dark-mode" className="text-gray-700 dark:text-gray-300">
                  {t('settings.darkMode')}
                </Label>
                <Switch 
                  id="dark-mode" 
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="dark:bg-navy-light border-navy-DEFAULT light:bg-sand-light light:border-sand-DEFAULT">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6 text-navy-dark dark:text-white">
                {t('settings.language')}
              </h2>
              
              <div className="mb-6">
                <Label htmlFor="language-select" className="block mb-2 text-gray-700 dark:text-gray-300">
                  {t('language.select')}
                </Label>
                <Select value={i18n.language} onValueChange={changeLanguage}>
                  <SelectTrigger id="language-select">
                    <SelectValue placeholder={t('language.select')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">{t('language.en')}</SelectItem>
                    <SelectItem value="de">{t('language.de')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          <Card className="dark:bg-navy-light border-navy-DEFAULT light:bg-sand-light light:border-sand-DEFAULT">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6 text-navy-dark dark:text-white">
                {t('settings.preferences')}
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label htmlFor="notifications" className="text-gray-700 dark:text-gray-300">
                    {t('settings.enableNotifications')}
                  </Label>
                  <Switch id="notifications" />
                </div>
                
                <div className="flex justify-between items-center">
                  <Label htmlFor="analytics" className="text-gray-700 dark:text-gray-300">
                    {t('settings.shareAnalytics')}
                  </Label>
                  <Switch id="analytics" defaultChecked />
                </div>
                
                <div className="flex justify-between items-center">
                  <Label htmlFor="newsletter" className="text-gray-700 dark:text-gray-300">
                    {t('settings.subscribeNewsletter')}
                  </Label>
                  <Switch id="newsletter" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-4 text-center">
            <Button variant="outline" className="w-full md:w-auto">
              {t('settings.savePreferences')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
