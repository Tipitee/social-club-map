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
    title: "Bundestag genehmigt Änderungen des Cannabis-Gesetzes",
    titleEn: "Bundestag Approves Cannabis Act Amendments",
    date: "15. März 2025",
    category: "federal",
    summary: "Der Deutsche Bundestag hat Änderungen am Cannabis-Gesetz genehmigt, die Vorschriften für Cannabis-Clubs und persönlichen Anbau präzisieren. Die Änderungen beinhalten spezifischere Richtlinien für Sicherheitsmaßnahmen beim Heimanbau.",
    summaryEn: "The German Bundestag has approved amendments to the Cannabis Act, clarifying regulations for cannabis clubs and personal cultivation. The amendments include more specific guidelines on security measures for home growing.",
    source: "Bundesgesundheitsministerium",
    sourceUrl: "https://www.bundesgesundheitsministerium.de"
  },
  {
    id: 2,
    title: "Bayern setzt strengere öffentliche Konsumzonen um",
    titleEn: "Bavaria Implements Stricter Public Consumption Zones",
    date: "28. Februar 2025",
    category: "state",
    summary: "Der Freistaat Bayern hat strengere Vorschriften für den Cannabis-Konsum im öffentlichen Raum eingeführt und mehr Bereiche als Sperrzonen ausgewiesen, insbesondere in der Nähe von Bildungseinrichtungen und Spielplätzen.",
    summaryEn: "The state of Bavaria has implemented stricter regulations regarding cannabis consumption in public spaces, designating more areas as restricted zones, particularly around educational institutions and playgrounds.",
    source: "Bayerisches Staatsministerium",
    sourceUrl: "https://www.bayern.de"
  },
  {
    id: 3,
    title: "Krankenkassendeckung für medizinisches Cannabis erweitert",
    titleEn: "Medical Cannabis Insurance Coverage Expanded",
    date: "10. Februar 2025",
    category: "medical",
    summary: "Deutsche Krankenversicherungen haben die Abdeckung für medizinische Cannabis-Verschreibungen erweitert und umfassen nun ein breiteres Spektrum von Erkrankungen. Zudem wurden mehrere administrative Hürden für Ärzte, die Cannabis-basierte Medikamente verschreiben, abgebaut.",
    summaryEn: "German health insurance providers have expanded coverage for medical cannabis prescriptions, now including a broader range of conditions and removing several administrative barriers for doctors prescribing cannabis-based medications.",
    source: "GKV-Spitzenverband",
    sourceUrl: "https://www.gkv-spitzenverband.de"
  },
  {
    id: 4,
    title: "Neue Richtlinien für Cannabis-Club-Betrieb veröffentlicht",
    titleEn: "New Guidelines for Cannabis Club Operations Released",
    date: "22. Januar 2025",
    category: "business",
    summary: "Das Bundesgesundheitsministerium hat detaillierte Richtlinien für den Betrieb von Cannabis-Clubs veröffentlicht, einschließlich Sicherheitsprotokollen, Mitgliedschaftsanforderungen und Qualitätskontrollstandards für den Anbau.",
    summaryEn: "The Federal Ministry of Health has released detailed guidelines for cannabis club operations, including security protocols, membership requirements, and quality control standards for cultivation.",
    source: "Bundesgesundheitsministerium",
    sourceUrl: "https://www.bundesgesundheitsministerium.de"
  },
  {
    id: 5,
    title: "THC-Grenzwerte für Fahrer werden überprüft",
    titleEn: "THC Limits for Drivers Under Review",
    date: "5. Januar 2025",
    category: "recreational",
    summary: "Das Bundesministerium für Verkehr überprüft die aktuellen THC-Grenzwerte für Autofahrer und berücksichtigt wissenschaftliche Erkenntnisse zu Beeinträchtigungen und geeigneten Testmethoden. Änderungen der Verkehrsvorschriften könnten bevorstehen.",
    summaryEn: "The Federal Ministry of Transport is reviewing current THC limits for drivers, considering scientific evidence on impairment levels and appropriate testing methods. Changes to driving regulations may be forthcoming.",
    source: "Bundesverkehrsministerium",
    sourceUrl: "https://www.bmvi.de"
  },
  {
    id: 6,
    title: "Cannabis-Qualitätskontrollstandards aktualisiert",
    titleEn: "Cannabis Quality Control Standards Updated",
    date: "15. Dezember 2024",
    category: "business",
    summary: "Das Deutsche Institut für Arzneimittel und Medizinprodukte hat aktualisierte Qualitätskontrollstandards für Cannabis-Produkte veröffentlicht, mit Schwerpunkt auf Schadstofftests und THC-Gehalt-Verifizierungsverfahren.",
    summaryEn: "The German Institute for Drugs and Medical Devices has published updated quality control standards for cannabis products, focusing on contaminant testing and THC content verification procedures.",
    source: "Bundesinstitut für Arzneimittel und Medizinprodukte",
    sourceUrl: "https://www.bfarm.de"
  },
  {
    id: 7,
    title: "Berlin erweitert Cannabis Social Clubs Programm",
    titleEn: "Berlin Expands Cannabis Social Clubs Program",
    date: "3. Dezember 2024",
    category: "state",
    summary: "Der Berliner Senat hat eine Erweiterung des Cannabis-Social-Clubs-Programms angekündigt, indem die erlaubte Anzahl von Clubs erhöht und der Registrierungsprozess vereinfacht wird, um der wachsenden Nachfrage gerecht zu werden.",
    summaryEn: "Berlin's Senate has announced an expansion of the cannabis social clubs program, increasing the permitted number of clubs and simplifying the registration process to meet growing demand.",
    source: "Berlin Senatsverwaltung",
    sourceUrl: "https://www.berlin.de"
  },
  {
    id: 8,
    title: "Neue Aufklärungskampagne zum Cannabis-Konsum gestartet",
    titleEn: "New Educational Campaign on Cannabis Use Launched",
    date: "20. November 2024",
    category: "federal",
    summary: "Die Bundeszentrale für gesundheitliche Aufklärung hat eine landesweite Kampagne gestartet, um die Öffentlichkeit über verantwortungsvollen Cannabis-Konsum aufzuklären, mit Schwerpunkt auf Strategien zur Schadensminimierung und gesundheitlichen Auswirkungen.",
    summaryEn: "The Federal Center for Health Education has launched a nationwide campaign to educate the public about responsible cannabis use, focusing on harm reduction strategies and health impacts.",
    source: "Bundeszentrale für gesundheitliche Aufklärung",
    sourceUrl: "https://www.bzga.de"
  },
  {
    id: 9,
    title: "Hamburg kündigt Cannabis-Zonen in Stadtparks an",
    titleEn: "Hamburg Announces Cannabis Zones in City Parks",
    date: "5. November 2024",
    category: "state",
    summary: "Hamburger Stadtbeamte haben spezifische Bereiche in öffentlichen Parks ausgewiesen, in denen Cannabis-Konsum erlaubt sein wird, um den Konsum in Wohngebieten und in der Nähe von Kindern zu reduzieren.",
    summaryEn: "Hamburg city officials have designated specific areas in public parks where cannabis consumption will be permitted, aiming to reduce use in residential areas and around children.",
    source: "Hamburg Senat",
    sourceUrl: "https://www.hamburg.de"
  },
  {
    id: 10,
    title: "Cannabis-Exportvorschriften für medizinische Produkte aktualisiert",
    titleEn: "Cannabis Export Regulations for Medical Products Updated",
    date: "18. Oktober 2024",
    category: "medical",
    summary: "Deutsche Regulierungsbehörden haben den Rahmen für inländische Cannabis-Produzenten aktualisiert, um medizinische Cannabis-Produkte in andere EU-Länder zu exportieren, was neue Marktchancen eröffnet.",
    summaryEn: "German regulators have updated the framework for domestic cannabis producers to export medical cannabis products to other EU countries, opening new market opportunities.",
    source: "Bundesinstitut für Arzneimittel und Medizinprodukte",
    sourceUrl: "https://www.bfarm.de"
  }
];

const News: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("all");
  const [visibleCount, setVisibleCount] = useState(6);
  
  const filteredNews = activeTab === "all" 
    ? newsItems 
    : newsItems.filter(item => item.category === activeTab);
  
  const displayedNews = filteredNews.slice(0, visibleCount);
  const hasMore = displayedNews.length < filteredNews.length;
  
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "federal": return t('news.federal');
      case "state": return t('news.state');
      case "medical": return t('news.medical');
      case "recreational": return t('news.recreational');
      case "business": return t('news.business');
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
  
  const loadMore = () => {
    setVisibleCount(prev => prev + 4);
  };

  const isGerman = i18n.language === 'de';
  
  return (
    <div className="min-h-screen bg-linen dark:bg-navy-dark pb-28">
      <Navbar />
      <div className="container px-4 py-6 max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-navy-dark dark:text-white">
          {t('navigation.news')}
        </h1>
        
        <div className="mb-8">
          <div className="tab-menu mb-6 flex flex-wrap">
            <Button
              variant="ghost"
              className={`tab-button ${activeTab === 'all' ? 'tab-button-active' : 'tab-button-inactive'}`}
              onClick={() => setActiveTab('all')}
            >
              {t('strains.all')}
            </Button>
            <Button
              variant="ghost"
              className={`tab-button ${activeTab === 'federal' ? 'tab-button-active' : 'tab-button-inactive'}`}
              onClick={() => setActiveTab('federal')}
            >
              {t('news.federal')}
            </Button>
            <Button
              variant="ghost"
              className={`tab-button ${activeTab === 'state' ? 'tab-button-active' : 'tab-button-inactive'}`}
              onClick={() => setActiveTab('state')}
            >
              {t('news.state')}
            </Button>
            <Button
              variant="ghost"
              className={`tab-button ${activeTab === 'medical' ? 'tab-button-active' : 'tab-button-inactive'}`}
              onClick={() => setActiveTab('medical')}
            >
              {t('news.medical')}
            </Button>
            <Button
              variant="ghost"
              className={`tab-button ${activeTab === 'recreational' ? 'tab-button-active' : 'tab-button-inactive'}`}
              onClick={() => setActiveTab('recreational')}
            >
              {t('news.recreational')}
            </Button>
            <Button
              variant="ghost"
              className={`tab-button ${activeTab === 'business' ? 'tab-button-active' : 'tab-button-inactive'}`}
              onClick={() => setActiveTab('business')}
            >
              {t('news.business')}
            </Button>
          </div>
          
          <div className="mb-4">
            <p className="text-gray-600 dark:text-gray-300">
              {filteredNews.length} {t('news.results')}
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
                        {t('news.postedOn')} {item.date}
                      </span>
                    </div>
                    
                    <Badge className="self-start md:self-auto" variant={getCategoryColor(item.category)}>
                      {getCategoryLabel(item.category)}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 text-navy-dark dark:text-white">
                    {isGerman ? item.title : item.titleEn}
                  </h3>
                  
                  <p className="text-navy-dark dark:text-gray-200 mb-4">
                    {isGerman ? item.summary : item.summaryEn}
                  </p>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between pt-3 border-t border-navy-DEFAULT/20 dark:border-navy-light/20">
                    <div className="mb-3 md:mb-0">
                      <Button variant="link" className="px-0 py-0 h-auto text-teal dark:text-teal-light flex items-center">
                        {t('news.readMore')}
                        <ArrowRight size={16} className="ml-1" />
                      </Button>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {t('news.source')}: {item.source}
                      </span>
                      
                      <a 
                        href={item.sourceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-teal dark:text-teal-light hover:underline"
                      >
                        <Globe size={14} className="mr-1" />
                        {t('news.visitSource')}
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
                {t('news.loadMore')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default News;
