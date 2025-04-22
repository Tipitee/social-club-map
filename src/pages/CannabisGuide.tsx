import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, BookOpen, Leaf, Pill, Info } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import { Capacitor } from "@capacitor/core";

const CannabisGuide: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("basics");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const isIOS = Capacitor.getPlatform() === 'ios';
  const isNativePlatform = Capacitor.isNativePlatform();

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const isSectionExpanded = (sectionId: string) => {
    return expandedSections[sectionId] || false;
  };

  const guideContent = {
    basics: [
      {
        id: "what-is-cannabis",
        title: t('guide.whatIsCannabis'),
        content: (
          <div className="space-y-4">
            <p>{t('guide.cannabisDescription')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-white/80 dark:bg-navy-light/80 backdrop-blur-sm">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Leaf className="h-4 w-4 mr-2 text-primary" />
                    {t('guide.cannabisTypes')}
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>{t('guide.sativaType')}</li>
                    <li>{t('guide.indicaType')}</li>
                    <li>{t('guide.hybridType')}</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="bg-white/80 dark:bg-navy-light/80 backdrop-blur-sm">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Pill className="h-4 w-4 mr-2 text-primary" />
                    {t('guide.keyCompounds')}
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>THC - {t('guide.thcDescription')}</li>
                    <li>CBD - {t('guide.cbdDescription')}</li>
                    <li>{t('guide.terpenes')} - {t('guide.terpenesDescription')}</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      },
      {
        id: "consumption-methods",
        title: t('guide.consumptionMethods'),
        content: (
          <div className="space-y-4">
            <p>{t('guide.consumptionIntro')}</p>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="smoking" className="border-border">
                <AccordionTrigger className="text-foreground hover:text-primary">
                  {t('guide.smoking')}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">{t('guide.smokingDescription')}</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>{t('guide.joints')}</li>
                    <li>{t('guide.pipes')}</li>
                    <li>{t('guide.bongs')}</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="vaporizing" className="border-border">
                <AccordionTrigger className="text-foreground hover:text-primary">
                  {t('guide.vaporizing')}
                </AccordionTrigger>
                <AccordionContent>
                  <p>{t('guide.vaporizingDescription')}</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="edibles" className="border-border">
                <AccordionTrigger className="text-foreground hover:text-primary">
                  {t('guide.edibles')}
                </AccordionTrigger>
                <AccordionContent>
                  <p>{t('guide.ediblesDescription')}</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="tinctures" className="border-border">
                <AccordionTrigger className="text-foreground hover:text-primary">
                  {t('guide.tinctures')}
                </AccordionTrigger>
                <AccordionContent>
                  <p>{t('guide.tincturesDescription')}</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )
      },
      {
        id: "effects",
        title: t('guide.effects'),
        content: (
          <div className="space-y-4">
            <p>{t('guide.effectsIntro')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-white/80 dark:bg-navy-light/80 backdrop-blur-sm">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">{t('guide.shortTermEffects')}</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>{t('guide.euphoria')}</li>
                    <li>{t('guide.relaxation')}</li>
                    <li>{t('guide.alteredPerception')}</li>
                    <li>{t('guide.increasedAppetite')}</li>
                    <li>{t('guide.drymouth')}</li>
                    <li>{t('guide.redEyes')}</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="bg-white/80 dark:bg-navy-light/80 backdrop-blur-sm">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">{t('guide.potentialBenefits')}</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>{t('guide.painRelief')}</li>
                    <li>{t('guide.reducedAnxiety')}</li>
                    <li>{t('guide.improvedSleep')}</li>
                    <li>{t('guide.nauseaRelief')}</li>
                    <li>{t('guide.muscleRelaxation')}</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      }
    ],
    legal: [
      {
        id: "german-law",
        title: t('guide.germanLaw'),
        content: (
          <div className="space-y-4">
            <p>{t('guide.germanLawIntro')}</p>
            <Card className="bg-white/80 dark:bg-navy-light/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2 flex items-center">
                  <Info className="h-4 w-4 mr-2 text-primary" />
                  {t('guide.keyPoints')}
                </h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>{t('guide.personalPossession')}</li>
                  <li>{t('guide.homeCultivation')}</li>
                  <li>{t('guide.cannabisClubs')}</li>
                  <li>{t('guide.publicConsumption')}</li>
                  <li>{t('guide.drivingRestrictions')}</li>
                </ul>
              </CardContent>
            </Card>
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <p className="text-amber-800 dark:text-amber-200 text-sm">
                <strong>{t('guide.disclaimer')}</strong> {t('guide.disclaimerText')}
              </p>
            </div>
          </div>
        )
      },
      {
        id: "cannabis-clubs",
        title: t('guide.cannabisClubs'),
        content: (
          <div className="space-y-4">
            <p>{t('guide.clubsIntro')}</p>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="what-are-clubs" className="border-border">
                <AccordionTrigger className="text-foreground hover:text-primary">
                  {t('guide.whatAreClubs')}
                </AccordionTrigger>
                <AccordionContent>
                  <p>{t('guide.clubsDescription')}</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="membership" className="border-border">
                <AccordionTrigger className="text-foreground hover:text-primary">
                  {t('guide.membership')}
                </AccordionTrigger>
                <AccordionContent>
                  <p>{t('guide.membershipDescription')}</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>{t('guide.membershipRequirements')}</li>
                    <li>{t('guide.membershipLimits')}</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="club-operations" className="border-border">
                <AccordionTrigger className="text-foreground hover:text-primary">
                  {t('guide.clubOperations')}
                </AccordionTrigger>
                <AccordionContent>
                  <p>{t('guide.operationsDescription')}</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )
      }
    ],
    health: [
      {
        id: "responsible-use",
        title: t('guide.responsibleUse'),
        content: (
          <div className="space-y-4">
            <p>{t('guide.responsibleIntro')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-white/80 dark:bg-navy-light/80 backdrop-blur-sm">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">{t('guide.bestPractices')}</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>{t('guide.startLow')}</li>
                    <li>{t('guide.knowSource')}</li>
                    <li>{t('guide.avoidMixing')}</li>
                    <li>{t('guide.stayHydrated')}</li>
                    <li>{t('guide.planAhead')}</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="bg-white/80 dark:bg-navy-light/80 backdrop-blur-sm">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">{t('guide.whenToAvoid')}</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>{t('guide.drivingOperating')}</li>
                    <li>{t('guide.pregnancy')}</li>
                    <li>{t('guide.mentalHealth')}</li>
                    <li>{t('guide.heartConditions')}</li>
                    <li>{t('guide.youngAge')}</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      },
      {
        id: "potential-risks",
        title: t('guide.potentialRisks'),
        content: (
          <div className="space-y-4">
            <p>{t('guide.risksIntro')}</p>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="short-term" className="border-border">
                <AccordionTrigger className="text-foreground hover:text-primary">
                  {t('guide.shortTermRisks')}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>{t('guide.anxiety')}</li>
                    <li>{t('guide.paranoia')}</li>
                    <li>{t('guide.impairedCoordination')}</li>
                    <li>{t('guide.increasedHeartRate')}</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="long-term" className="border-border">
                <AccordionTrigger className="text-foreground hover:text-primary">
                  {t('guide.longTermRisks')}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>{t('guide.respiratoryIssues')}</li>
                    <li>{t('guide.dependence')}</li>
                    <li>{t('guide.memoryIssues')}</li>
                    <li>{t('guide.mentalHealthImpact')}</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="high-risk-groups" className="border-border">
                <AccordionTrigger className="text-foreground hover:text-primary">
                  {t('guide.highRiskGroups')}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>{t('guide.adolescents')}</li>
                    <li>{t('guide.pregnantWomen')}</li>
                    <li>{t('guide.historyOfPsychosis')}</li>
                    <li>{t('guide.heartPatients')}</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )
      }
    ]
  };

  return (
    <div className="min-h-screen bg-linen dark:bg-navy-dark pb-28 pt-16">
      <Navbar />
      <div className={`container px-4 py-6 max-w-7xl mx-auto ${isIOS && isNativePlatform ? 'pt-8' : 'pt-6'}`}>
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-navy-dark dark:text-white flex items-center">
            <BookOpen className="h-6 w-6 mr-2 text-primary" />
            {t('navigation.guide')}
          </h1>
          <p className="text-navy-DEFAULT/80 dark:text-gray-300">
            {t('guide.introText')}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="basics" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              {t('guide.basics')}
            </TabsTrigger>
            <TabsTrigger value="legal" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              {t('guide.legal')}
            </TabsTrigger>
            <TabsTrigger value="health" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              {t('guide.health')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="basics" className="mt-0">
            <div className="space-y-6">
              {guideContent.basics.map((section) => (
                <Card key={section.id} className="overflow-hidden bg-white dark:bg-navy-light border-navy-DEFAULT dark:border-navy-light shadow-md">
                  <div 
                    className="p-4 flex justify-between items-center cursor-pointer bg-linen/50 dark:bg-navy-400/50"
                    onClick={() => toggleSection(section.id)}
                  >
                    <h3 className="text-lg font-semibold text-navy-dark dark:text-white">{section.title}</h3>
                    <Button variant="ghost" size="sm" className="p-1 h-auto">
                      {isSectionExpanded(section.id) ? (
                        <ChevronUp className="h-5 w-5 text-navy-DEFAULT dark:text-gray-300" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-navy-DEFAULT dark:text-gray-300" />
                      )}
                    </Button>
                  </div>
                  {isSectionExpanded(section.id) && (
                    <CardContent className="p-4 pt-6">
                      {section.content}
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="legal" className="mt-0">
            <div className="space-y-6">
              {guideContent.legal.map((section) => (
                <Card key={section.id} className="overflow-hidden bg-white dark:bg-navy-light border-navy-DEFAULT dark:border-navy-light shadow-md">
                  <div 
                    className="p-4 flex justify-between items-center cursor-pointer bg-linen/50 dark:bg-navy-400/50"
                    onClick={() => toggleSection(section.id)}
                  >
                    <h3 className="text-lg font-semibold text-navy-dark dark:text-white">{section.title}</h3>
                    <Button variant="ghost" size="sm" className="p-1 h-auto">
                      {isSectionExpanded(section.id) ? (
                        <ChevronUp className="h-5 w-5 text-navy-DEFAULT dark:text-gray-300" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-navy-DEFAULT dark:text-gray-300" />
                      )}
                    </Button>
                  </div>
                  {isSectionExpanded(section.id) && (
                    <CardContent className="p-4 pt-6">
                      {section.content}
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="health" className="mt-0">
            <div className="space-y-6">
              {guideContent.health.map((section) => (
                <Card key={section.id} className="overflow-hidden bg-white dark:bg-navy-light border-navy-DEFAULT dark:border-navy-light shadow-md">
                  <div 
                    className="p-4 flex justify-between items-center cursor-pointer bg-linen/50 dark:bg-navy-400/50"
                    onClick={() => toggleSection(section.id)}
                  >
                    <h3 className="text-lg font-semibold text-navy-dark dark:text-white">{section.title}</h3>
                    <Button variant="ghost" size="sm" className="p-1 h-auto">
                      {isSectionExpanded(section.id) ? (
                        <ChevronUp className="h-5 w-5 text-navy-DEFAULT dark:text-gray-300" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-navy-DEFAULT dark:text-gray-300" />
                      )}
                    </Button>
                  </div>
                  {isSectionExpanded(section.id) && (
                    <CardContent className="p-4 pt-6">
                      {section.content}
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <BottomNav />
    </div>
  );
};

export default CannabisGuide;
