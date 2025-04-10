
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, ExternalLink, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
  }
];

const LegalUpdates: React.FC = () => {
  const { t } = useTranslation();
  const [category, setCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

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
    <div className="min-h-screen bg-[#121212] text-white pb-20">
      <Navbar />
      <main className="container px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{t('legal.title')}</h1>
          <p className="text-gray-400">{t('legal.subtitle')}</p>
        </div>
        
        <div className="mb-6">
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
            
            <div className="flex-shrink-0 w-full sm:w-auto">
              <Tabs defaultValue="all" value={category} onValueChange={setCategory}>
                <TabsList className="bg-gray-800">
                  <TabsTrigger value="all">{t('legal.categories.all')}</TabsTrigger>
                  <TabsTrigger value="federal">{t('legal.categories.federal')}</TabsTrigger>
                  <TabsTrigger value="state">{t('legal.categories.state')}</TabsTrigger>
                  <TabsTrigger value="medical">{t('legal.categories.medical')}</TabsTrigger>
                  <TabsTrigger value="recreational" className="hidden md:inline-flex">{t('legal.categories.recreational')}</TabsTrigger>
                  <TabsTrigger value="business" className="hidden md:inline-flex">{t('legal.categories.business')}</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white mb-4">{t('legal.latestUpdates')}</h2>
          
          {filteredUpdates.length > 0 ? (
            filteredUpdates.map((update) => (
              <Card key={update.id} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">{update.title}</CardTitle>
                  <CardDescription className="flex items-center text-gray-400">
                    <Calendar className="h-4 w-4 mr-1" />
                    {t('legal.postedOn')} {formatDate(update.date)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">{update.content}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <span className="text-sm text-gray-400">
                    {t('legal.source')}: {update.source}
                  </span>
                  <Button variant="ghost" className="text-blue-400 hover:text-blue-300 p-0">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    {t('legal.readMore')}
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <Card className="bg-gray-800 border-gray-700 text-center p-8">
              <p className="text-gray-400">{t('legal.noUpdates')}</p>
            </Card>
          )}
          
          {filteredUpdates.length > 0 && (
            <div className="pt-4 flex justify-center">
              <Button variant="outline" className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                {t('legal.loadMore')}
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LegalUpdates;
