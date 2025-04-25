
import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Plant, 
  Flask, 
  BookOpen, 
  ShieldCheck, 
  Leaf, 
  Activity 
} from "lucide-react";

const CannabisGuide: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="page-container bg-background">
      <div className="page-content">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
          {t('guide.title')}
        </h1>

        <Tabs defaultValue="basics" className="w-full">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-8">
            <TabsTrigger value="basics" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden md:inline">{t('guide.basics')}</span>
            </TabsTrigger>
            <TabsTrigger value="strains" className="flex items-center gap-2">
              <Plant className="h-4 w-4" />
              <span className="hidden md:inline">{t('guide.strains')}</span>
            </TabsTrigger>
            <TabsTrigger value="compounds" className="flex items-center gap-2">
              <Flask className="h-4 w-4" />
              <span className="hidden md:inline">{t('guide.compounds')}</span>
            </TabsTrigger>
            <TabsTrigger value="effects" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden md:inline">{t('guide.effects')}</span>
            </TabsTrigger>
            <TabsTrigger value="safety" className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              <span className="hidden md:inline">{t('guide.safety')}</span>
            </TabsTrigger>
            <TabsTrigger value="terminology" className="flex items-center gap-2">
              <Leaf className="h-4 w-4" />
              <span className="hidden md:inline">{t('guide.terminology')}</span>
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[calc(100vh-300px)]">
            <TabsContent value="basics">
              <Card>
                <CardHeader>
                  <CardTitle>{t('guide.basics')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{t('guide.whatIsCannabis')}</h3>
                    <p className="text-muted-foreground">{t('guide.cannabisDescription')}</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{t('guide.differentTypes')}</h3>
                    <p className="text-muted-foreground">{t('guide.typesDescription')}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="strains">
              <Card>
                <CardHeader>
                  <CardTitle>{t('guide.strains')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Indica</h3>
                      <p className="text-muted-foreground">{t('guide.indicaDescription')}</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Sativa</h3>
                      <p className="text-muted-foreground">{t('guide.sativaDescription')}</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Hybrid</h3>
                      <p className="text-muted-foreground">{t('guide.hybridDescription')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="compounds">
              <Card>
                <CardHeader>
                  <CardTitle>{t('guide.compounds')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">THC</h3>
                    <p className="text-muted-foreground">{t('guide.thcDescription')}</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">CBD</h3>
                    <p className="text-muted-foreground">{t('guide.cbdDescription')}</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{t('guide.terpenes')}</h3>
                    <p className="text-muted-foreground">{t('guide.terpenesDescription')}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="effects">
              <Card>
                <CardHeader>
                  <CardTitle>{t('guide.effects')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">{t('guide.shortTerm')}</h3>
                      <p className="text-muted-foreground">{t('guide.shortTermEffects')}</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">{t('guide.longTerm')}</h3>
                      <p className="text-muted-foreground">{t('guide.longTermEffects')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="safety">
              <Card>
                <CardHeader>
                  <CardTitle>{t('guide.safety')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">{t('guide.dosage')}</h3>
                      <p className="text-muted-foreground">{t('guide.dosageGuidelines')}</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">{t('guide.precautions')}</h3>
                      <p className="text-muted-foreground">{t('guide.safetyPrecautions')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="terminology">
              <Card>
                <CardHeader>
                  <CardTitle>{t('guide.terminology')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Add common terms and definitions */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">{t('guide.commonTerms')}</h3>
                      <div className="grid gap-4">
                        <div>
                          <h4 className="font-medium">THC</h4>
                          <p className="text-sm text-muted-foreground">{t('guide.thcTerm')}</p>
                        </div>
                        <div>
                          <h4 className="font-medium">CBD</h4>
                          <p className="text-sm text-muted-foreground">{t('guide.cbdTerm')}</p>
                        </div>
                        <div>
                          <h4 className="font-medium">{t('guide.terpenesTerm')}</h4>
                          <p className="text-sm text-muted-foreground">{t('guide.terpenesDefinition')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  );
};

export default CannabisGuide;
