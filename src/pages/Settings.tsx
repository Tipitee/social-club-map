
import React from "react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Settings as SettingsIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Settings: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#121212] text-white pb-24">
      <Navbar />
      <main className="container px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <SettingsIcon className="h-6 w-6 text-secondary" />
          <h1 className="text-2xl font-bold text-white">{t('settings.title')}</h1>
        </div>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="pb-2">
            <h2 className="text-lg font-semibold text-white">{t('settings.appearance')}</h2>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-200">{t('settings.language')}</span>
              <LanguageSwitcher />
            </div>
          </CardContent>
        </Card>

        <Separator className="my-6 bg-gray-800" />

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="pb-2">
            <h2 className="text-lg font-semibold text-white">{t('settings.about')}</h2>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">
              {t('settings.version')}: 1.0.0
            </p>
            <p className="text-gray-300 mt-2">
              © 2025 Green Cannabis Encyclopedia
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Settings;
