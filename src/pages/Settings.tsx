
import React from "react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Settings as SettingsIcon, Globe, Info, Moon, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const Settings: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#121212] text-white pb-24">
      <Navbar />
      <ScrollArea className="h-[calc(100vh-180px)]">
        <main className="container px-4 py-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-full bg-[#348080]/10 border border-[#348080]/20">
              <SettingsIcon className="h-7 w-7 text-[#348080]" />
            </div>
            <h1 className="text-3xl font-bold text-white">{t('settings.title')}</h1>
          </div>

          <Card className="bg-gray-900 border-gray-700 mb-8 hover:border-gray-600 transition-colors shadow-lg rounded-xl overflow-hidden">
            <CardHeader className="pb-2 border-b border-gray-800">
              <CardTitle className="text-xl font-semibold text-white flex items-center gap-3">
                <Globe className="h-5 w-5 text-[#348080]" />
                {t('settings.appearance')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex justify-between items-center py-3 px-2">
                <span className="text-lg text-gray-200">{t('settings.language')}</span>
                <LanguageSwitcher />
              </div>
              
              <div className="flex justify-between items-center py-3 px-2">
                <span className="text-lg text-gray-200">{t('settings.theme')}</span>
                <div className="flex items-center space-x-2">
                  <Moon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm bg-gray-800 px-2 py-1 rounded-md text-gray-300">{t('settings.comingSoon')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-colors shadow-lg rounded-xl overflow-hidden">
            <CardHeader className="pb-2 border-b border-gray-800">
              <CardTitle className="text-xl font-semibold text-white flex items-center gap-3">
                <Info className="h-5 w-5 text-[#348080]" />
                {t('settings.about')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between py-2 px-2">
                <span className="text-gray-300">{t('settings.version')}</span>
                <span className="font-mono text-gray-300">1.0.0</span>
              </div>
              
              <div className="flex items-center mt-2 py-2 px-2">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-[#348080] mr-2" />
                  <p className="text-gray-300">© 2025 SocialClub Map</p>
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
