
import React from "react";
import Navbar from "@/components/Navbar";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";

const News: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-linen dark:bg-navy-dark pb-28">
      <Navbar />
      <div className="container px-4 py-6 max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-navy-dark dark:text-white">
          {t('navigation.news')}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-navy-DEFAULT bg-white dark:bg-navy-light shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-2 text-navy-dark dark:text-white">
                {t('news.germanLegalization')}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 font-medium">
                April 1, 2024
              </p>
              <p className="text-gray-800 dark:text-gray-200 mb-4">
                {t('news.germanLegalizationDesc')}
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-navy-DEFAULT bg-white dark:bg-navy-light shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-2 text-navy-dark dark:text-white">
                {t('news.medicalResearch')}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 font-medium">
                March 15, 2024
              </p>
              <p className="text-gray-800 dark:text-gray-200 mb-4">
                {t('news.medicalResearchDesc')}
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-navy-DEFAULT bg-white dark:bg-navy-light shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-2 text-navy-dark dark:text-white">
                {t('news.cannabisClubs')}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 font-medium">
                February 28, 2024
              </p>
              <p className="text-gray-800 dark:text-gray-200 mb-4">
                {t('news.cannabisClubsDesc')}
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-navy-DEFAULT bg-white dark:bg-navy-light shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-2 text-navy-dark dark:text-white">
                {t('news.newStrains')}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 font-medium">
                February 15, 2024
              </p>
              <p className="text-gray-800 dark:text-gray-200 mb-4">
                {t('news.newStrainsDesc')}
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-navy-DEFAULT bg-white dark:bg-navy-light shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-2 text-navy-dark dark:text-white">
                {t('news.internationalDevelopments')}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 font-medium">
                January 30, 2024
              </p>
              <p className="text-gray-800 dark:text-gray-200 mb-4">
                {t('news.internationalDevelopmentsDesc')}
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-navy-DEFAULT bg-white dark:bg-navy-light shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-2 text-navy-dark dark:text-white">
                {t('news.cannabisEducation')}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 font-medium">
                January 15, 2024
              </p>
              <p className="text-gray-800 dark:text-gray-200 mb-4">
                {t('news.cannabisEducationDesc')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default News;
