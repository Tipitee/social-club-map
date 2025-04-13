
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Search, MapPin } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ClubResult {
  id: string;
  name: string;
  address: string;
  distance: number;
  status: "verified" | "pending" | "unverified";
}

// Mock data - in a real app, this would come from an API call
const mockClubs: ClubResult[] = [
  {
    id: "1",
    name: "Green Valley Club",
    address: "Hauptstraße 123, Berlin",
    distance: 2.3,
    status: "verified"
  },
  {
    id: "2",
    name: "Cannabis Social Berlin",
    address: "Friedrichstraße 45, Berlin",
    distance: 5.7,
    status: "verified"
  },
  {
    id: "3",
    name: "Hanf Freunde e.V.",
    address: "Torstraße 78, Berlin",
    distance: 8.1,
    status: "pending"
  },
  {
    id: "4",
    name: "Green Leaf Association",
    address: "Alexanderplatz 10, Berlin",
    distance: 12.4,
    status: "verified"
  },
  {
    id: "5",
    name: "Berlin Cannabis Club",
    address: "Unter den Linden 26, Berlin",
    distance: 18.9,
    status: "unverified"
  },
  {
    id: "6",
    name: "Kreuzberg Growers",
    address: "Oranienstraße 158, Berlin",
    distance: 27.5,
    status: "pending"
  }
];

const ClubMap: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ClubResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast({
        title: t('clubs.searchError'),
        description: t('clubs.pleaseEnterLocation'),
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would be an API call
    // Simulating search results with mock data
    setSearchResults(mockClubs.filter(club => 
      club.distance <= 30 // Filter to show only clubs within 30km
    ));
    setHasSearched(true);
    
    toast({
      title: t('clubs.searchComplete'),
      description: `${t('clubs.found')} ${mockClubs.length} ${t('navigation.clubs')} ${t('clubs.of')} "${searchQuery}"`
    });
  };
  
  return (
    <div className="min-h-screen bg-linen dark:bg-navy-dark pb-28">
      <Navbar />
      <div className="container px-4 py-6 max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-navy-dark dark:text-white">
          {t('clubs.findLocalClub')}
        </h1>
        
        <div className="mb-6">
          <p className="mb-4 text-navy-dark dark:text-gray-200">
            {t('clubs.findNearYou')}. {t('clubs.searchNearby')}
          </p>
        </div>
        
        <div className="w-full h-[50vh] rounded-lg overflow-hidden shadow-lg border border-navy-DEFAULT dark:border-navy-light bg-card mb-6">
          <iframe 
            src="https://www.google.com/maps/d/u/0/embed?mid=1b3IKZqStnrLLakQHjyJz8Sp_JDZ8vOw&ehbc=2E312F&noprof=1" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy"
            title="Cannabis Clubs in Germany"
            className="w-full h-full" 
          />
        </div>
        
        <Card className="mt-8 border-navy-DEFAULT dark:border-navy-light bg-white dark:bg-navy-light shadow-md">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-navy-dark dark:text-white">
              {t('clubs.searchNearby')}
            </h2>
            
            <div className="flex flex-col md:flex-row gap-3 mb-6">
              <div className="flex-grow relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-navy-dark dark:text-gray-400" size={18} />
                <Input
                  placeholder={t('clubs.enterCityPostal')}
                  className="pl-10 bg-white dark:bg-navy-DEFAULT border-navy-DEFAULT dark:border-navy-light text-navy-dark dark:text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button 
                onClick={handleSearch}
                className="bg-teal dark:bg-teal-dark hover:bg-teal-dark text-white"
              >
                {t('clubs.searchButton')}
              </Button>
            </div>
            
            {hasSearched && (
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-3 text-navy-dark dark:text-white">
                  {t('clubs.resultsWithin')} 30km {searchQuery && `${t('clubs.of')} "${searchQuery}"`}
                </h3>
                
                {searchResults.length === 0 ? (
                  <div className="text-center py-8 text-navy-dark dark:text-gray-300">
                    {t('clubs.noClubsArea')}
                  </div>
                ) : (
                  <div className="space-y-4 mt-4">
                    {searchResults.map((club) => (
                      <div 
                        key={club.id}
                        className="p-4 rounded-lg border border-navy-DEFAULT/30 dark:border-navy-light/30 bg-white dark:bg-navy-DEFAULT flex items-start gap-3"
                      >
                        <div className="mt-1">
                          <MapPin 
                            size={20} 
                            className={
                              club.status === "verified" 
                                ? "text-teal" 
                                : club.status === "pending" 
                                ? "text-amber-500" 
                                : "text-gray-400"
                            } 
                          />
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-navy-dark dark:text-white">{club.name}</h4>
                            {club.status === "verified" && (
                              <span className="px-2 py-0.5 text-xs bg-teal/20 text-teal-dark dark:text-teal-light rounded-full">
                                {t('clubs.verified')}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-navy-dark dark:text-gray-300">{club.address}</p>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {club.distance.toFixed(1)} {t('clubs.awayKm')}
                          </div>
                        </div>
                        <Link to={`/clubs/${club.id}`}>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-navy-DEFAULT dark:border-navy-light text-navy-dark dark:text-white hover:bg-navy-dark/10 dark:hover:bg-white/10"
                          >
                            {t('clubs.details')}
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClubMap;
