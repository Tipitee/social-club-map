
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Search, MapPin, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useClubsSearch } from "@/hooks/use-clubs-search";
import { testSupabaseConnection } from "@/integrations/supabase/client";
import BottomNav from "@/components/BottomNav";
import ClubMap from "@/components/club/ClubMap";
import { ClubResult } from "@/types/club";
import { toast } from "@/hooks/use-toast";
import { Capacitor } from "@capacitor/core";

const SEARCH_RESULTS_STORAGE_KEY = "club-search-results";
const SEARCH_QUERY_STORAGE_KEY = "club-search-query";

const ClubMapPage: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    loading,
    error,
    hasSearched,
    setHasSearched,
    searchClubs
  } = useClubsSearch();

  const [isNative, setIsNative] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  // Set platform detection on component mount
  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());
    setIsIOS(Capacitor.getPlatform() === 'ios');
  }, []);

  // Load saved search results from session storage
  useEffect(() => {
    const storedQuery = sessionStorage.getItem(SEARCH_QUERY_STORAGE_KEY);
    const storedResults = sessionStorage.getItem(SEARCH_RESULTS_STORAGE_KEY);
    if (storedQuery) {
      setSearchQuery(storedQuery);
      if (storedResults) {
        try {
          const parsedResults = JSON.parse(storedResults) as ClubResult[];
          setSearchResults(parsedResults);
          setHasSearched(true);
        } catch (err) {
          console.error("Error parsing stored search results:", err);
          sessionStorage.removeItem(SEARCH_RESULTS_STORAGE_KEY);
        }
      }
    }
  }, []);

  // Save search results to session storage
  useEffect(() => {
    if (hasSearched && searchResults.length > 0) {
      sessionStorage.setItem(SEARCH_RESULTS_STORAGE_KEY, JSON.stringify(searchResults));
      sessionStorage.setItem(SEARCH_QUERY_STORAGE_KEY, searchQuery);
    }
  }, [searchResults, searchQuery, hasSearched]);

  // Test Supabase connection
  React.useEffect(() => {
    const checkConnection = async () => {
      const connected = await testSupabaseConnection();
      console.log("[DEBUG] Supabase connection test:", connected);
    };
    checkConnection();
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search Error",
        description: "Please enter a location or postal code to search",
        variant: "destructive"
      });
      return;
    }
    
    const isPostalCode = /^\d{1,5}$/.test(searchQuery.trim());
    if (isPostalCode) {
      console.log("[DEBUG] Searching with postal code:", searchQuery);
    } else {
      console.log("[DEBUG] Searching with city name:", searchQuery);
    }
    
    searchClubs(searchQuery);
  };

  const handleClubClick = (clubId: string) => {
    navigate(`/clubs/${encodeURIComponent(clubId)}`, {
      state: {
        fromSearch: true
      }
    });
  };

  return (
    <div className="bg-background min-h-dvh">
      <div className={`container mx-auto px-4 ${isIOS && isNative ? 'pt-[calc(env(safe-area-inset-top)+64px)]' : 'pt-16'} pb-[calc(64px+env(safe-area-inset-bottom,0px))]`}>
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
          {t('clubs.findLocalClub')}
        </h1>
        
        <div className={`w-full ${isNative ? 'h-[50vh]' : 'h-[40vh]'} rounded-lg overflow-hidden shadow-lg border border-border bg-card mb-6 relative`}>
          <ClubMap allClubs={searchResults.length > 0 ? searchResults : undefined} />
        </div>
        
        <Card className="mt-8 border-border shadow-md rounded-lg">
          <CardContent className="p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-card-foreground">
              {t('clubs.searchNearby')}
            </h2>
            
            <div className="flex flex-col md:flex-row gap-3 mb-6">
              <div className="flex-grow relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input 
                  placeholder={t('clubs.enterCityPostal')} 
                  className="pl-10 border-border shadow-sm" 
                  value={searchQuery} 
                  onChange={e => setSearchQuery(e.target.value)} 
                  onKeyDown={e => e.key === 'Enter' && handleSearch()} 
                />
              </div>
              <Button 
                onClick={handleSearch} 
                className="bg-primary text-white hover:bg-primary/90 shadow-sm" 
                disabled={loading}
              >
                {loading ? <Loader2 size={18} className="animate-spin mr-2" /> : null}
                {t('clubs.searchButton')}
              </Button>
            </div>
            
            {error && (
              <div className="p-4 mb-4 bg-destructive/10 border border-destructive/30 rounded-md text-destructive">
                {error}
              </div>
            )}
            
            {hasSearched && (
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-3 text-card-foreground">
                  {searchQuery && `${t('clubs.resultsFor')} "${searchQuery}"`}
                </h3>
                
                {searchResults.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {t('clubs.noClubsArea')}
                  </div>
                ) : (
                  <div className="space-y-4 mt-4">
                    {searchResults.map(club => (
                      <div 
                        key={club.id} 
                        onClick={() => handleClubClick(club.name)} 
                        className="p-4 rounded-lg border border-border shadow-md transition-colors cursor-pointer hover:bg-accent/10"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            <MapPin 
                              size={20} 
                              className={
                                club.status === "verified" ? "text-primary" : 
                                club.status === "pending" ? "text-amber-500" : 
                                "text-muted-foreground"
                              } 
                            />
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-foreground">{club.name}</h4>
                              {!club.membership_status && (
                                <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-300">
                                  {t('clubs.waitlist')}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-foreground">{club.address}</p>
                            <p className="text-sm text-foreground">
                              {club.city && `${club.city}`}
                              {club.postal_code && `, ${club.postal_code}`}
                            </p>
                            <div className="text-xs text-muted-foreground mt-1">
                              {club.distance && `${club.distance.toFixed(1)} ${t('clubs.awayKm')}`}
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-border text-foreground hover:bg-accent/20" 
                            onClick={e => {
                              e.stopPropagation();
                              handleClubClick(club.name);
                            }}
                          >
                            {t('clubs.details')}
                          </Button>
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
    </div>
  );
};

export default ClubMapPage;
