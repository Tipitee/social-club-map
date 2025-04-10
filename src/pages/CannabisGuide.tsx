
import React from "react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gavel, Shield, Sprout, ScrollText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Navbar from "@/components/Navbar";

const CannabisGuide: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#121212] text-white pb-20">
      <Navbar />
      <main className="container px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{t('guide.title')}</h1>
        </div>

        <Tabs defaultValue="laws" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="laws" className="data-[state=active]:bg-emerald-700">
              <Gavel className="h-4 w-4 mr-2" />
              {t('guide.sections.laws')}
            </TabsTrigger>
            <TabsTrigger value="safeUse" className="data-[state=active]:bg-emerald-700">
              <Shield className="h-4 w-4 mr-2" />
              {t('guide.sections.safeUse')}
            </TabsTrigger>
            <TabsTrigger value="basics" className="data-[state=active]:bg-emerald-700">
              <Sprout className="h-4 w-4 mr-2" />
              {t('guide.sections.basics')}
            </TabsTrigger>
          </TabsList>
          
          {/* Laws & Regulations Content */}
          <TabsContent value="laws" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gavel className="h-5 w-5 mr-2 text-emerald-400" />
                  {t('guide.lawsContent.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="text-white">
                  <AccordionItem value="possession">
                    <AccordionTrigger className="text-gray-300 hover:text-white">
                      {t('guide.lawsContent.possession.title')}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400">
                      {t('guide.lawsContent.possession.content')}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="consumption">
                    <AccordionTrigger className="text-gray-300 hover:text-white">
                      {t('guide.lawsContent.consumption.title')}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400">
                      {t('guide.lawsContent.consumption.content')}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="driving">
                    <AccordionTrigger className="text-gray-300 hover:text-white">
                      {t('guide.lawsContent.driving.title')}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400">
                      {t('guide.lawsContent.driving.content')}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="clubs">
                    <AccordionTrigger className="text-gray-300 hover:text-white">
                      {t('guide.lawsContent.clubs.title')}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400">
                      {t('guide.lawsContent.clubs.content')}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Safe Use Content */}
          <TabsContent value="safeUse" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-emerald-400" />
                  {t('guide.safeUseContent.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="text-white">
                  <AccordionItem value="startLow">
                    <AccordionTrigger className="text-gray-300 hover:text-white">
                      {t('guide.safeUseContent.startLow.title')}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400">
                      {t('guide.safeUseContent.startLow.content')}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="knowSource">
                    <AccordionTrigger className="text-gray-300 hover:text-white">
                      {t('guide.safeUseContent.knowSource.title')}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400">
                      {t('guide.safeUseContent.knowSource.content')}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="mindset">
                    <AccordionTrigger className="text-gray-300 hover:text-white">
                      {t('guide.safeUseContent.mindset.title')}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400">
                      {t('guide.safeUseContent.mindset.content')}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="hydration">
                    <AccordionTrigger className="text-gray-300 hover:text-white">
                      {t('guide.safeUseContent.hydration.title')}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400">
                      {t('guide.safeUseContent.hydration.content')}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Basics Content */}
          <TabsContent value="basics" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sprout className="h-5 w-5 mr-2 text-emerald-400" />
                  {t('guide.basicsContent.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="text-white">
                  <AccordionItem value="compounds">
                    <AccordionTrigger className="text-gray-300 hover:text-white">
                      {t('guide.basicsContent.compounds.title')}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400">
                      {t('guide.basicsContent.compounds.content')}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="methods">
                    <AccordionTrigger className="text-gray-300 hover:text-white">
                      {t('guide.basicsContent.methods.title')}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400">
                      {t('guide.basicsContent.methods.content')}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="types">
                    <AccordionTrigger className="text-gray-300 hover:text-white">
                      {t('guide.basicsContent.types.title')}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400">
                      {t('guide.basicsContent.types.content')}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="tolerance">
                    <AccordionTrigger className="text-gray-300 hover:text-white">
                      {t('guide.basicsContent.tolerance.title')}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400">
                      {t('guide.basicsContent.tolerance.content')}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CannabisGuide;
