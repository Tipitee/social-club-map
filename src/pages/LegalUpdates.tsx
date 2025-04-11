
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, ExternalLink, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Navbar from "@/components/Navbar";

// Mock legal updates data
const mockLegalUpdates = [
  {
    id: "legal-1",
    title: "Bundestag Approves Cannabis Act Amendments",
    content: "The German Bundestag has approved amendments to the Cannabis Act, clarifying regulations for cannabis clubs and personal cultivation. The amendments include more specific guidelines on security measures for home growing.",
    category: "federal",
    date: "2025-03-15",
    source: "Bundesgesundheitsministerium",
    url: "#"
  },
  {
    id: "legal-2",
    title: "Bavaria Implements Stricter Public Consumption Zones",
    content: "The state of Bavaria has implemented stricter regulations regarding cannabis consumption in public spaces, designating more areas as restricted zones, particularly around educational institutions and playgrounds.",
    category: "state",
    date: "2025-02-28",
    source: "Bayerisches Staatsministerium",
    url: "#"
  },
  {
    id: "legal-3",
    title: "Medical Cannabis Insurance Coverage Expanded",
    content: "German health insurance providers have expanded coverage for medical cannabis prescriptions, now including a broader range of conditions and removing several administrative barriers for doctors prescribing cannabis-based medications.",
    category: "medical",
    date: "2025-02-10",
    source: "GKV-Spitzenverband",
    url: "#"
  },
  {
    id: "legal-4",
    title: "New Guidelines for Cannabis Club Operations Released",
    content: "The Federal Ministry of Health has released detailed guidelines for cannabis club operations, including security protocols, membership requirements, and quality control standards for cultivation.",
    category: "business",
    date: "2025-01-22",
    source: "Bundesgesundheitsministerium",
    url: "#"
  },
  {
    id: "legal-5",
    title: "THC Limits for Drivers Under Review",
    content: "The Federal Ministry of Transport is reviewing current THC limits for drivers, considering scientific evidence on impairment levels and appropriate testing methods. Changes to driving regulations may be forthcoming.",
    category: "recreational",
    date: "2025-01-05",
    source: "Bundesverkehrsministerium",
    url: "#"
  },
  {
    id: "legal-6",
    title: "Cannabis Quality Control Standards Updated",
    content: "The German Institute for Drugs and Medical Devices has published updated quality control standards for cannabis products, focusing on contaminant testing and THC content verification procedures.",
    category: "business",
    date: "2024-12-15",
    source: "Bundesinstitut für Arzneimittel und Medizinprodukte",
    url: "#"
  },
  {
    id: "legal-7",
    title: "Berlin Expands Cannabis Social Clubs Program",
    content: "Berlin's Senate has announced an expansion of the cannabis social clubs program, increasing the permitted number of clubs and simplifying the registration process to meet growing demand.",
    category: "state",
    date: "2024-12-03",
    source: "Berlin Senatsverwaltung",
    url: "#"
  }
];

const LegalUpdates: React.FC = () => {
  const { t } = useTranslation();
  const [category, setCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  const filteredUpdates = mockLegalUpdates.filter((update) => {
    // Filter by category
    if (category !== "all" && update.category !== category) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !update.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !update.content.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(t('language.select') === 'English' ? 'en-US' : 'de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white pb-24">
      <Navbar />
      <main className="container px-4 py-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{t('legal.title')}</h1>
          <p className="text-gray-400">{t('legal.subtitle')}</p>
        </div>
        
        <div className="mb-6 sticky top-0 z-10 bg-[#121212] pt-2 pb-3">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder={`${t('strains.filters.search')}...`}
                className="pl-8 bg-gray-800 border-gray-700 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Mobile filters */}
            <div className="md:hidden w-full">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 w-full">
                    <Filter className="h-4 w-4 mr-2" />
                    {t('legal.categories.filter')}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="bg-gray-900 text-white border-gray-700">
                  <div className="py-4">
                    <h3 className="text-lg font-medium mb-4">{t('legal.categories.selectCategory')}</h3>
                    <div className="space-y-2">
                      {['all', 'federal', 'state', 'medical', 'recreational', 'business'].map((cat) => (
                        <Button
                          key={cat}
                          variant={category === cat ? "default" : "outline"}
                          className={`w-full ${category === cat ? '' : 'bg-gray-800 border-gray-700 text-white'}`}
                          onClick={() => {
                            setCategory(cat);
                          }}
                        >
                          {t(`legal.categories.${cat}`)}
                        </Button>
                      ))}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            
            {/* Desktop filters */}
            <div className="hidden md:block">
              <Tabs defaultValue="all" value={category} onValueChange={setCategory}>
                <TabsList className="bg-gray-800">
                  <TabsTrigger value="all">{t('legal.categories.all')}</TabsTrigger>
                  <TabsTrigger value="federal">{t('legal.categories.federal')}</TabsTrigger>
                  <TabsTrigger value="state">{t('legal.categories.state')}</TabsTrigger>
                  <TabsTrigger value="medical">{t('legal.categories.medical')}</TabsTrigger>
                  <TabsTrigger value="recreational">{t('legal.categories.recreational')}</TabsTrigger>
                  <TabsTrigger value="business">{t('legal.categories.business')}</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">{t('legal.latestUpdates')}</h2>
            <span className="text-sm text-gray-400">
              {filteredUpdates.length} {t('legal.resultsFound')}
            </span>
          </div>
          
          {filteredUpdates.length > 0 ? (
            <div className="space-y-4">
              {filteredUpdates.map((update) => (
                <Collapsible key={update.id} className="w-full">
                  <Card className="bg-gray-800 border-gray-700 overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white text-lg">{update.title}</CardTitle>
                          <CardDescription className="flex items-center text-gray-400 mt-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            {t('legal.postedOn')} {formatDate(update.date)}
                          </CardDescription>
                        </div>
                        <Badge className={`
                          ${update.category === 'federal' ? 'bg-blue-600' : 
                            update.category === 'state' ? 'bg-green-600' : 
                            update.category === 'medical' ? 'bg-purple-600' : 
                            update.category === 'recreational' ? 'bg-amber-600' : 'bg-gray-600'}
                        `}>
                          {t(`legal.categories.${update.category}`)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CollapsibleTrigger className="text-left w-full">
                        <p className="text-gray-300 line-clamp-2">{update.content}</p>
                        <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 p-0 mt-1">
                          {t('legal.readMore')}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <Separator className="my-3 bg-gray-700" />
                        <div className="pt-2">
                          <p className="text-gray-300">{update.content}</p>
                          <div className="mt-4">
                            <h4 className="font-medium text-sm text-gray-400 mb-2">{t('legal.relatedLinks')}</h4>
                            <ul className="list-disc list-inside text-blue-400 space-y-1 pl-2">
                              <li><a href="#" className="hover:underline">{t('legal.officialAnnouncement')}</a></li>
                              <li><a href="#" className="hover:underline">{t('legal.pressRelease')}</a></li>
                              <li><a href="#" className="hover:underline">{t('legal.fullDocumentation')}</a></li>
                            </ul>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2 border-t border-gray-700">
                      <span className="text-sm text-gray-400">
                        {t('legal.source')}: {update.source}
                      </span>
                      <a href={update.url} className="text-blue-400 hover:text-blue-300 flex items-center text-sm">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        {t('legal.visitSource')}
                      </a>
                    </CardFooter>
                  </Card>
                </Collapsible>
              ))}

              <div className="pt-4 flex justify-center">
                <Button variant="outline" className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                  {t('legal.loadMore')}
                </Button>
              </div>
            </div>
          ) : (
            <Card className="bg-gray-800 border-gray-700 text-center p-8">
              <p className="text-gray-400">{t('legal.noUpdates')}</p>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default LegalUpdates;

