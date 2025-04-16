import React from "react";
import Navbar from "@/components/Navbar";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/components/theme-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  
  const changeLanguage = (value: string) => {
    i18n.changeLanguage(value);
    localStorage.setItem('language', value);
  };

  const goBack = () => {
    navigate(-1);
  };
  
  return (
    <div className="min-h-screen bg-linen dark:bg-navy-dark pb-28">
      <Navbar />
      <div className="container px-4 py-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-navy-dark dark:text-white">
            {t('settings.settings')}
          </h1>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={goBack}
            className="rounded-full bg-white hover:bg-gray-100 dark:bg-navy-400 dark:hover:bg-navy-300 border-navy-DEFAULT dark:border-navy-500"
          >
            <X className="h-4 w-4 text-navy-dark dark:text-white" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto">
          <Card className="bg-white dark:bg-navy-light border-navy-DEFAULT dark:border-navy-light shadow-md">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6 text-navy-dark dark:text-white">
                {t('settings.appearance')}
              </h2>
              
              <div className="flex justify-between items-center mb-6">
                <Label htmlFor="dark-mode" className="text-navy-dark dark:text-gray-300 font-medium">
                  {t('settings.darkMode')}
                </Label>
                <Switch 
                  id="dark-mode" 
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  className="data-[state=checked]:bg-teal"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-navy-light border-navy-DEFAULT dark:border-navy-light shadow-md">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6 text-navy-dark dark:text-white">
                {t('settings.language')}
              </h2>
              
              <div className="mb-6">
                <Label htmlFor="language-select" className="block mb-2 text-navy-dark dark:text-gray-300 font-medium">
                  {t('language.select')}
                </Label>
                <Select value={i18n.language} onValueChange={changeLanguage}>
                  <SelectTrigger 
                    id="language-select" 
                    className="bg-white dark:bg-navy-400 border-navy-DEFAULT dark:border-navy-500 text-navy-dark dark:text-white"
                  >
                    <SelectValue placeholder={t('language.select')} />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-navy-400 border-navy-DEFAULT dark:border-navy-500">
                    <SelectItem value="en" className="text-navy-dark dark:text-white hover:bg-navy-DEFAULT/10 dark:hover:bg-teal/10 data-[state=checked]:bg-teal dark:data-[state=checked]:bg-teal">
                      {t('language.en')}
                    </SelectItem>
                    <SelectItem value="de" className="text-navy-dark dark:text-white hover:bg-navy-DEFAULT/10 dark:hover:bg-teal/10 data-[state=checked]:bg-teal dark:data-[state=checked]:bg-teal">
                      {t('language.de')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-navy-light border-navy-DEFAULT dark:border-navy-light shadow-md">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6 text-navy-dark dark:text-white">
                {t('settings.preferences')}
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label htmlFor="notifications" className="text-navy-dark dark:text-gray-300 font-medium">
                    {t('settings.enableNotifications')}
                  </Label>
                  <Switch id="notifications" className="data-[state=checked]:bg-teal" />
                </div>
                
                <div className="flex justify-between items-center">
                  <Label htmlFor="analytics" className="text-navy-dark dark:text-gray-300 font-medium">
                    {t('settings.shareAnalytics')}
                  </Label>
                  <Switch id="analytics" defaultChecked className="data-[state=checked]:bg-teal" />
                </div>
                
                <div className="flex justify-between items-center">
                  <Label htmlFor="newsletter" className="text-navy-dark dark:text-gray-300 font-medium">
                    {t('settings.subscribeNewsletter')}
                  </Label>
                  <Switch id="newsletter" className="data-[state=checked]:bg-teal" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              className="w-full md:w-auto bg-teal dark:bg-teal-dark hover:bg-teal-dark text-white border-transparent" 
            >
              {t('settings.savePreferences')}
            </Button>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Settings;
