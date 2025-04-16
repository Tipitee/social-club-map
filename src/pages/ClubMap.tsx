
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Search, MapPin, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useClubsSearch } from "@/hooks/use-clubs-search";
import { testSupabaseConnection } from "@/integrations/supabase/client";
import BottomNav from "@/components/BottomNav";

const ClubMap: React.FC = () => {
  const { t } = useTranslation();
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    loading,
    error,
    hasSearched,
    searchClubs
  } = useClubsSearch();
  
  // Test Supabase connection on component mount
  React.useEffect(() => {
    const checkConnection = async () => {
      const connected = await testSupabaseConnection();
      console.log("[DEBUG] Supabase connection test:", connected);
    };
    
    checkConnection();
  }, []);
  
  const handleSearch = () => {
    searchClubs(searchQuery);
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-navy-dark dark:text-gray-300" size={18} />
                <Input
                  placeholder={t('clubs.enterCityPostal')}
                  className="pl-10 bg-white dark:bg-navy-400 border-navy-DEFAULT dark:border-navy-400 text-navy-dark dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button 
                onClick={handleSearch}
                className="bg-teal dark:bg-teal-dark hover:bg-teal-dark text-white"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin mr-2" />
                ) : null}
                {t('clubs.searchButton')}
              </Button>
            </div>
            
            {error && (
              <div className="p-4 mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-700 dark:text-red-300">
                {error}
              </div>
            )}
            
            {hasSearched && (
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-3 text-navy-dark dark:text-white">
                  {searchQuery && `${t('clubs.resultsFor')} "${searchQuery}"`}
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
                        className="p-4 rounded-lg border border-navy-DEFAULT/30 dark:border-navy-light/30 bg-white dark:bg-navy-300 shadow-md hover:bg-gray-50 dark:hover:bg-navy-400 transition-colors"
                      >
                        <div className="flex items-start gap-3">
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
                              {!club.membership_status && (
                                <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-300">
                                  {t('clubs.waitlist')}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-navy-dark dark:text-gray-300">{club.address}</p>
                            <p className="text-sm text-navy-dark dark:text-gray-300">
                              {club.city && `${club.city}`}
                              {club.postal_code && `, ${club.postal_code}`}
                            </p>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {club.distance && `${club.distance.toFixed(1)} ${t('clubs.awayKm')}`}
                            </div>
                          </div>
                          <Link to={`/clubs/${encodeURIComponent(club.name)}`} state={{ fromSearch: true }}>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-navy-DEFAULT dark:border-navy-light text-navy-dark dark:text-white hover:bg-navy-dark/10 dark:hover:bg-white/10"
                            >
                              {t('clubs.details')}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <BottomNav />
    </div>
  );
};

export default ClubMap;
