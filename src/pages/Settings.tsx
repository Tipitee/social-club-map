
import React from "react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Settings as SettingsIcon, Globe, Info, Moon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const Settings: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#121212] text-white pb-24">
      <Navbar />
      <ScrollArea className="h-[calc(100vh-180px)]">
        <main className="container px-4 py-6">
          <div className="flex items-center gap-3 mb-6">
            <SettingsIcon className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-white">{t('settings.title')}</h1>
          </div>

          <Card className="bg-gray-900 border-gray-700 mb-6 hover:border-gray-600 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                {t('settings.appearance')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-200">{t('settings.language')}</span>
                <LanguageSwitcher />
              </div>
              {/* Theme toggle could be added here */}
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-200">{t('settings.theme')}</span>
                <div className="flex items-center space-x-2">
                  <Moon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-400">{t('settings.comingSoon')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator className="my-6 bg-gray-800" />

          <Card className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                {t('settings.about')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                {t('settings.version')}: 1.0.0
              </p>
              <p className="text-gray-300 mt-2">
                © 2025 SocialClub Map
              </p>
            </CardContent>
          </Card>
        </main>
      </ScrollArea>
    </div>
  );
};

export default Settings;
