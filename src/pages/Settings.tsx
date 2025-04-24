
import React from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/components/theme-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { Capacitor } from "@capacitor/core";

const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const isIOS = Capacitor.getPlatform() === 'ios';
  const isNativePlatform = Capacitor.isNativePlatform();
  
  const changeLanguage = (value: string) => {
    i18n.changeLanguage(value);
    localStorage.setItem('language', value);
  };

  const goBack = () => {
    navigate(-1);
  };
  
  return (
    <div className="page-container">
      {isIOS && isNativePlatform && <div className="ios-status-bar" />}
      
      <div className={`page-content ${isIOS && isNativePlatform ? 'ios-safe-top' : 'pt-16'}`}>
        <div className="settings-header">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {t('settings.settings')}
          </h1>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={goBack}
            className="rounded-full hover:bg-accent/20"
            aria-label={t('common.close')}
          >
            <X className="h-4 w-4 text-foreground" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto">
          <Card className="card-rounded">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6 text-foreground">
                {t('settings.appearance')}
              </h2>
              
              <div className="flex justify-between items-center mb-6">
                <Label htmlFor="dark-mode" className="text-foreground font-medium">
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
          
          <Card className="card-rounded">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6 text-foreground">
                {t('settings.language')}
              </h2>
              
              <div className="mb-6">
                <Label htmlFor="language-select" className="block mb-2 text-foreground font-medium">
                  {t('language.select')}
                </Label>
                <Select value={i18n.language} onValueChange={changeLanguage}>
                  <SelectTrigger 
                    id="language-select" 
                    className="bg-card border-border text-foreground rounded-md"
                  >
                    <SelectValue placeholder={t('language.select')} />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border rounded-md">
                    <SelectItem value="en" className="text-foreground hover:bg-accent/20 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground">
                      {t('language.en')}
                    </SelectItem>
                    <SelectItem value="de" className="text-foreground hover:bg-accent/20 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground">
                      {t('language.de')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-rounded">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6 text-foreground">
                {t('settings.preferences')}
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label htmlFor="notifications" className="text-foreground font-medium">
                    {t('settings.enableNotifications')}
                  </Label>
                  <Switch id="notifications" className="data-[state=checked]:bg-primary" />
                </div>
                
                <div className="flex justify-between items-center">
                  <Label htmlFor="analytics" className="text-foreground font-medium">
                    {t('settings.shareAnalytics')}
                  </Label>
                  <Switch id="analytics" defaultChecked className="data-[state=checked]:bg-primary" />
                </div>
                
                <div className="flex justify-between items-center">
                  <Label htmlFor="newsletter" className="text-foreground font-medium">
                    {t('settings.subscribeNewsletter')}
                  </Label>
                  <Switch id="newsletter" className="data-[state=checked]:bg-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground border-transparent rounded-md" 
            >
              {t('settings.savePreferences')}
            </Button>
          </div>
        </div>
      </div>
      
      {isIOS && isNativePlatform && <div className="ios-bottom-safe" />}
    </div>
  );
};

export default Settings;
