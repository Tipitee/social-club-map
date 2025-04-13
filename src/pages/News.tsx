import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, ExternalLink, Search, Filter, FileText, MapPin, AlertTriangle, BookOpen, ArrowUpRight } from "lucide-react";
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
    url: "https://www.bundesgesundheitsministerium.de",
    icon: FileText,
    relatedLinks: [
      { title: "Official Announcement", url: "https://www.bundesgesundheitsministerium.de/announcements" },
      { title: "Press Release", url: "https://www.bundesgesundheitsministerium.de/press" },
      { title: "Full Documentation", url: "https://www.bundesgesundheitsministerium.de/documents" }
    ]
  },
  {
    id: "legal-2",
    title: "Bavaria Implements Stricter Public Consumption Zones",
    content: "The state of Bavaria has implemented stricter regulations regarding cannabis consumption in public spaces, designating more areas as restricted zones, particularly around educational institutions and playgrounds.",
    category: "state",
    date: "2025-02-28",
    source: "Bayerisches Staatsministerium",
    url: "https://www.bayern.de",
    icon: MapPin,
    relatedLinks: [
      { title: "Official Announcement", url: "https://www.bayern.de/announcements" },
      { title: "Press Release", url: "https://www.bayern.de/press" },
      { title: "Full Documentation", url: "https://www.bayern.de/documents" }
    ]
  },
  {
    id: "legal-3",
    title: "Medical Cannabis Insurance Coverage Expanded",
    content: "German health insurance providers have expanded coverage for medical cannabis prescriptions, now including a broader range of conditions and removing several administrative barriers for doctors prescribing cannabis-based medications.",
    category: "medical",
    date: "2025-02-10",
    source: "GKV-Spitzenverband",
    url: "https://www.gkv-spitzenverband.de",
    icon: FileText,
    relatedLinks: [
      { title: "Official Announcement", url: "https://www.gkv-spitzenverband.de/announcements" },
      { title: "Press Release", url: "https://www.gkv-spitzenverband.de/press" },
      { title: "Full Documentation", url: "https://www.gkv-spitzenverband.de/documents" }
    ]
  },
  {
    id: "legal-4",
    title: "New Guidelines for Cannabis Club Operations Released",
    content: "The Federal Ministry of Health has released detailed guidelines for cannabis club operations, including security protocols, membership requirements, and quality control standards for cultivation.",
    category: "business",
    date: "2025-01-22",
    source: "Bundesgesundheitsministerium",
    url: "https://www.bundesgesundheitsministerium.de",
    icon: FileText,
    relatedLinks: [
      { title: "Official Announcement", url: "https://www.bundesgesundheitsministerium.de/announcements" },
      { title: "Press Release", url: "https://www.bundesgesundheitsministerium.de/press" },
      { title: "Full Documentation", url: "https://www.bundesgesundheitsministerium.de/documents" }
    ]
  },
  {
    id: "legal-5",
    title: "THC Limits for Drivers Under Review",
    content: "The Federal Ministry of Transport is reviewing current THC limits for drivers, considering scientific evidence on impairment levels and appropriate testing methods. Changes to driving regulations may be forthcoming.",
    category: "recreational",
    date: "2025-01-05",
    source: "Bundesverkehrsministerium",
    url: "https://www.bmvi.de",
    icon: AlertTriangle,
    relatedLinks: [
      { title: "Official Announcement", url: "https://www.bmvi.de/announcements" },
      { title: "Press Release", url: "https://www.bmvi.de/press" },
      { title: "Full Documentation", url: "https://www.bmvi.de/documents" }
    ]
  },
  {
    id: "legal-6",
    title: "Cannabis Quality Control Standards Updated",
    content: "The German Institute for Drugs and Medical Devices has published updated quality control standards for cannabis products, focusing on contaminant testing and THC content verification procedures.",
    category: "business",
    date: "2024-12-15",
    source: "Bundesinstitut für Arzneimittel und Medizinprodukte",
    url: "https://www.bfarm.de",
    icon: BookOpen,
    relatedLinks: [
      { title: "Official Announcement", url: "https://www.bfarm.de/announcements" },
      { title: "Press Release", url: "https://www.bfarm.de/press" },
      { title: "Full Documentation", url: "https://www.bfarm.de/documents" }
    ]
  },
  {
    id: "legal-7",
    title: "Berlin Expands Cannabis Social Clubs Program",
    content: "Berlin's Senate has announced an expansion of the cannabis social clubs program, increasing the permitted number of clubs and simplifying the registration process to meet growing demand.",
    category: "state",
    date: "2024-12-03",
    source: "Berlin Senatsverwaltung",
    url: "https://www.berlin.de",
    icon: MapPin,
    relatedLinks: [
      { title: "Official Announcement", url: "https://www.berlin.de/announcements" },
      { title: "Press Release", url: "https://www.berlin.de/press" },
      { title: "Full Documentation", url: "https://www.berlin.de/documents" }
    ]
  },
  {
    id: "legal-8",
    title: "New Educational Campaign on Cannabis Use Launched",
    content: "The Federal Center for Health Education has launched a nationwide campaign to educate the public about responsible cannabis use, focusing on harm reduction strategies and health impacts.",
    category: "federal",
    date: "2024-11-20",
    source: "Bundeszentrale für gesundheitliche Aufklärung",
    url: "https://www.bzga.de",
    icon: BookOpen,
    relatedLinks: [
      { title: "Official Announcement", url: "https://www.bzga.de/announcements" },
      { title: "Press Release", url: "https://www.bzga.de/press" },
      { title: "Full Documentation", url: "https://www.bzga.de/documents" }
    ]
  },
  {
    id: "legal-9",
    title: "Hamburg Announces Cannabis Zones in City Parks",
    content: "Hamburg city officials have designated specific areas in public parks where cannabis consumption will be permitted, aiming to reduce use in residential areas and around children.",
    category: "state",
    date: "2024-11-05",
    source: "Hamburg Senat",
    url: "https://www.hamburg.de",
    icon: MapPin,
    relatedLinks: [
      { title: "Official Announcement", url: "https://www.hamburg.de/announcements" },
      { title: "Press Release", url: "https://www.hamburg.de/press" },
      { title: "Full Documentation", url: "https://www.hamburg.de/documents" }
    ]
  },
  {
    id: "legal-10",
    title: "Cannabis Export Regulations for Medical Products Updated",
    content: "German regulators have updated the framework for domestic cannabis producers to export medical cannabis products to other EU countries, opening new market opportunities.",
    category: "medical",
    date: "2024-10-18",
    source: "Bundesinstitut für Arzneimittel und Medizinprodukte",
    url: "https://www.bfarm.de",
    icon: FileText,
    relatedLinks: [
      { title: "Official Announcement", url: "https://www.bfarm.de/announcements" },
      { title: "Press Release", url: "https://www.bfarm.de/press" },
      { title: "Full Documentation", url: "https://www.bfarm.de/documents" }
    ]
  }
];

const News: React.FC = () => {
  const { t } = useTranslation();
  const [category, setCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUpdates = mockLegalUpdates.filter((update) => {
    if (category !== "all" && update.category !== category) {
      return false;
    }
    
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'federal': return 'bg-blue-600 text-white';
      case 'state': return 'bg-green-600 text-white';
      case 'medical': return 'bg-purple-600 text-white';
      case 'recreational': return 'bg-amber-600 text-white';
      case 'business': return 'bg-indigo-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const handleClickSource = (url: string) => {
    window.open(url, '_blank', 'noopener noreferrer');
  };

  const handleClickRelatedLink = (url: string) => {
    window.open(url, '_blank', 'noopener noreferrer');
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <Navbar />
      <main className="container px-4 py-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {t('news.updates')}
          </h1>
          <p className="text-muted-foreground">
            {t('news.stayInformed')}
          </p>
        </div>
        
        <div className="mb-6 sticky top-16 z-10 bg-background pt-2 pb-3">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('common.search')}
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="md:hidden w-full">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Filter className="h-4 w-4 mr-2" />
                    {t('news.categories.filter')}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom">
                  <div className="py-4">
                    <h3 className="text-lg font-medium mb-4">{t('news.categories.selectCategory')}</h3>
                    <div className="space-y-2">
                      {['all', 'federal', 'state', 'medical', 'recreational', 'business'].map((cat) => (
                        <Button
                          key={cat}
                          variant={category === cat ? "default" : "outline"}
                          className="w-full"
                          onClick={() => {
                            setCategory(cat);
                          }}
                        >
                          {t(`news.categories.${cat}`)}
                        </Button>
                      ))}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            
            <div className="hidden md:block">
              <Tabs defaultValue="all" value={category} onValueChange={setCategory}>
                <TabsList>
                  <TabsTrigger value="all">{t('news.categories.all')}</TabsTrigger>
                  <TabsTrigger value="federal">{t('news.categories.federal')}</TabsTrigger>
                  <TabsTrigger value="state">{t('news.categories.state')}</TabsTrigger>
                  <TabsTrigger value="medical">{t('news.categories.medical')}</TabsTrigger>
                  <TabsTrigger value="recreational">{t('news.categories.recreational')}</TabsTrigger>
                  <TabsTrigger value="business">{t('news.categories.business')}</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{t('news.latestUpdates')}</h2>
            <span className="text-sm">
              {filteredUpdates.length} {t('news.resultsFound')}
            </span>
          </div>
          
          {filteredUpdates.length > 0 ? (
            <div className="space-y-4">
              {filteredUpdates.map((update) => (
                <Collapsible key={update.id} className="w-full">
                  <Card className="overflow-hidden hover:bg-card/95 transition-colors">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex">
                          <div className="mr-3 mt-1">
                            <update.icon className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <CardTitle>{update.title}</CardTitle>
                            <CardDescription className="flex items-center mt-1">
                              <Calendar className="h-4 w-4 mr-1" />
                              {t('news.postedOn')} {formatDate(update.date)}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge className={getCategoryColor(update.category)}>
                          {t(`news.categories.${update.category}`)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CollapsibleTrigger className="text-left w-full">
                        <p className="text-muted-foreground line-clamp-2">{update.content}</p>
                        <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 p-0 mt-1">
                          {t('news.readMore')}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <Separator className="my-3" />
                        <div className="pt-2">
                          <p className="text-muted-foreground">{update.content}</p>
                          <div className="mt-4">
                            <h4 className="font-medium text-sm mb-2">{t('news.relatedLinks')}</h4>
                            <ul className="list-disc list-inside space-y-1 pl-2">
                              {update.relatedLinks.map((link, index) => (
                                <li key={`${update.id}-link-${index}`} className="text-blue-400">
                                  <button 
                                    className="hover:underline inline-flex items-center"
                                    onClick={() => handleClickRelatedLink(link.url)}
                                  >
                                    {link.title}
                                    <ArrowUpRight className="h-3 w-3 ml-1" />
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2 border-t">
                      <span className="text-sm">
                        {t('news.source')}: {update.source}
                      </span>
                      <button 
                        onClick={() => handleClickSource(update.url)}
                        className="text-blue-400 hover:text-blue-300 flex items-center text-sm"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        {t('news.visitSource')}
                      </button>
                    </CardFooter>
                  </Card>
                </Collapsible>
              ))}

              <div className="pt-4 flex justify-center">
                <Button variant="outline">
                  {t('news.loadMore')}
                </Button>
              </div>
            </div>
          ) : (
            <Card className="text-center p-8">
              <p>{t('news.noUpdates')}</p>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default News;
