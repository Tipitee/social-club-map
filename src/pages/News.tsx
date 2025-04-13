import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight, Globe } from "lucide-react";

// Mock news data
const newsItems = [
  {
    id: 1,
    title: "Bundestag Approves Cannabis Act Amendments",
    date: "15. März 2025",
    category: "federal",
    summary: "The German Bundestag has approved amendments to the Cannabis Act, clarifying regulations for cannabis clubs and personal cultivation. The amendments include more specific guidelines on security measures for home growing.",
    source: "Bundesgesundheitsministerium",
    sourceUrl: "https://www.bundesgesundheitsministerium.de"
  },
  {
    id: 2,
    title: "Bavaria Implements Stricter Public Consumption Zones",
    date: "28. Februar 2025",
    category: "state",
    summary: "The state of Bavaria has implemented stricter regulations regarding cannabis consumption in public spaces, designating more areas as restricted zones, particularly around educational institutions and playgrounds.",
    source: "Bayerisches Staatsministerium",
    sourceUrl: "https://www.bayern.de"
  },
  {
    id: 3,
    title: "Medical Cannabis Insurance Coverage Expanded",
    date: "10. Februar 2025",
    category: "medical",
    summary: "German health insurance providers have expanded coverage for medical cannabis prescriptions, now including a broader range of conditions and removing several administrative barriers for doctors prescribing cannabis-based medications.",
    source: "GKV-Spitzenverband",
    sourceUrl: "https://www.gkv-spitzenverband.de"
  },
  {
    id: 4,
    title: "New Guidelines for Cannabis Club Operations Released",
    date: "22. Januar 2025",
    category: "business",
    summary: "The Federal Ministry of Health has released detailed guidelines for cannabis club operations, including security protocols, membership requirements, and quality control standards for cultivation.",
    source: "Bundesgesundheitsministerium",
    sourceUrl: "https://www.bundesgesundheitsministerium.de"
  },
  {
    id: 5,
    title: "THC Limits for Drivers Under Review",
    date: "5. Januar 2025",
    category: "recreational",
    summary: "The Federal Ministry of Transport is reviewing current THC limits for drivers, considering scientific evidence on impairment levels and appropriate testing methods. Changes to driving regulations may be forthcoming.",
    source: "Bundesverkehrsministerium",
    sourceUrl: "https://www.bmvi.de"
  },
  {
    id: 6,
    title: "Cannabis Quality Control Standards Updated",
    date: "15. Dezember 2024",
    category: "business",
    summary: "The German Institute for Drugs and Medical Devices has published updated quality control standards for cannabis products, focusing on contaminant testing and THC content verification procedures.",
    source: "Bundesinstitut für Arzneimittel und Medizinprodukte",
    sourceUrl: "https://www.bfarm.de"
  },
  {
    id: 7,
    title: "Berlin Expands Cannabis Social Clubs Program",
    date: "3. Dezember 2024",
    category: "state",
    summary: "Berlin's Senate has announced an expansion of the cannabis social clubs program, increasing the permitted number of clubs and simplifying the registration process to meet growing demand.",
    source: "Berlin Senatsverwaltung",
    sourceUrl: "https://www.berlin.de"
  },
  {
    id: 8,
    title: "New Educational Campaign on Cannabis Use Launched",
    date: "20. November 2024",
    category: "federal",
    summary: "The Federal Center for Health Education has launched a nationwide campaign to educate the public about responsible cannabis use, focusing on harm reduction strategies and health impacts.",
    source: "Bundeszentrale für gesundheitliche Aufklärung",
    sourceUrl: "https://www.bzga.de"
  },
  {
    id: 9,
    title: "Hamburg Announces Cannabis Zones in City Parks",
    date: "5. November 2024",
    category: "state",
    summary: "Hamburg city officials have designated specific areas in public parks where cannabis consumption will be permitted, aiming to reduce use in residential areas and around children.",
    source: "Hamburg Senat",
    sourceUrl: "https://www.hamburg.de"
  },
  {
    id: 10,
    title: "Cannabis Export Regulations for Medical Products Updated",
    date: "18. Oktober 2024",
    category: "medical",
    summary: "German regulators have updated the framework for domestic cannabis producers to export medical cannabis products to other EU countries, opening new market opportunities.",
    source: "Bundesinstitut für Arzneimittel und Medizinprodukte",
    sourceUrl: "https://www.bfarm.de"
  }
];

const News: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("all");
  const [visibleCount, setVisibleCount] = useState(6);
  
  const filteredNews = activeTab === "all" 
    ? newsItems 
    : newsItems.filter(item => item.category === activeTab);
  
  const displayedNews = filteredNews.slice(0, visibleCount);
  const hasMore = displayedNews.length < filteredNews.length;
  
  const loadMore = () => {
    setVisibleCount(prev => prev + 4);
  };
  
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "federal": return "Federal";
      case "state": return "State";
      case "medical": return "Medical";
      case "recreational": return "Recreational";
      case "business": return "Business";
      default: return category;
    }
  };
  
  const getCategoryColor = (category: string): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "error" => {
    switch (category) {
      case "federal": return "default";
      case "state": return "secondary";
      case "medical": return "success";
      case "recreational": return "warning";
      case "business": return "outline";
      default: return "default";
    }
  };
  
  return (
    <div className="min-h-screen bg-linen dark:bg-navy-dark pb-28">
      <Navbar />
      <div className="container px-4 py-6 max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-navy-dark dark:text-white">
          {t('navigation.news')}
        </h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-navy-dark dark:text-white">
            All Updates
          </h2>
          
          <div className="rounded-lg overflow-hidden shadow-sm mb-6 bg-white dark:bg-navy-DEFAULT">
            <div className="grid grid-cols-3 text-center">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === 'all'
                    ? 'border-b-2 border-teal text-teal dark:border-primary dark:text-primary-light'
                    : 'text-navy-dark dark:text-gray-300 hover:text-teal dark:hover:text-primary-light'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('federal')}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === 'federal'
                    ? 'border-b-2 border-teal text-teal dark:border-primary dark:text-primary-light'
                    : 'text-navy-dark dark:text-gray-300 hover:text-teal dark:hover:text-primary-light'
                }`}
              >
                Federal
              </button>
              <button
                onClick={() => setActiveTab('state')}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === 'state'
                    ? 'border-b-2 border-teal text-teal dark:border-primary dark:text-primary-light'
                    : 'text-navy-dark dark:text-gray-300 hover:text-teal dark:hover:text-primary-light'
                }`}
              >
                State
              </button>
            </div>
            <div className="grid grid-cols-3 text-center border-t border-gray-200 dark:border-navy-light">
              <button
                onClick={() => setActiveTab('medical')}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === 'medical'
                    ? 'border-b-2 border-teal text-teal dark:border-primary dark:text-primary-light'
                    : 'text-navy-dark dark:text-gray-300 hover:text-teal dark:hover:text-primary-light'
                }`}
              >
                Medical
              </button>
              <button
                onClick={() => setActiveTab('recreational')}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === 'recreational'
                    ? 'border-b-2 border-teal text-teal dark:border-primary dark:text-primary-light'
                    : 'text-navy-dark dark:text-gray-300 hover:text-teal dark:hover:text-primary-light'
                }`}
              >
                Recreational
              </button>
              <button
                onClick={() => setActiveTab('business')}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === 'business'
                    ? 'border-b-2 border-teal text-teal dark:border-primary dark:text-primary-light'
                    : 'text-navy-dark dark:text-gray-300 hover:text-teal dark:hover:text-primary-light'
                }`}
              >
                Business
              </button>
            </div>
          </div>
            
          <div className="mb-4">
            <p className="text-navy-dark dark:text-white font-medium">
              Latest Updates
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              {filteredNews.length} results found
            </p>
          </div>
          
          <div className="space-y-6">
            {displayedNews.map((item) => (
              <Card 
                key={item.id} 
                className="border-navy-DEFAULT dark:border-navy-light bg-white dark:bg-navy-light shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                    <div className="flex items-center mb-2 md:mb-0">
                      <Calendar size={16} className="mr-1.5 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Posted on {item.date}
                      </span>
                    </div>
                    
                    <Badge className="self-start md:self-auto" variant={getCategoryColor(item.category)}>
                      {getCategoryLabel(item.category)}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 text-navy-dark dark:text-white">
                    {item.title}
                  </h3>
                  
                  <p className="text-navy-dark dark:text-gray-200 mb-4">
                    {item.summary}
                  </p>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between pt-3 border-t border-navy-DEFAULT/20 dark:border-navy-light/20">
                    <div className="mb-3 md:mb-0">
                      <Button variant="link" className="px-0 py-0 h-auto text-teal dark:text-teal-light flex items-center">
                        Read more
                        <ArrowRight size={16} className="ml-1" />
                      </Button>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Source: {item.source}
                      </span>
                      
                      <a 
                        href={item.sourceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-teal dark:text-teal-light hover:underline"
                      >
                        <Globe size={14} className="mr-1" />
                        Visit source
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {hasMore && (
            <div className="mt-8 text-center">
              <Button 
                onClick={loadMore}
                variant="outline"
                className="border-navy-DEFAULT dark:border-navy-light text-navy-dark dark:text-white hover:bg-navy-DEFAULT/10 dark:hover:bg-white/10"
              >
                Load More
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default News;
