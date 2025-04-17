import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
import ClubMap from "@/components/club/ClubMap";
import { ClubResult } from "@/types/club";
import { toast } from "@/hooks/use-toast";

// Key for storing search results in session storage
const SEARCH_RESULTS_STORAGE_KEY = "club-search-results";
const SEARCH_QUERY_STORAGE_KEY = "club-search-query";
const ClubMapPage: React.FC = () => {
  const {
    t
  } = useTranslation();
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

  // Effect to restore search state from session storage when returning to this page
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
          // Clear the invalid stored data
          sessionStorage.removeItem(SEARCH_RESULTS_STORAGE_KEY);
        }
      }
    }
  }, []);

  // Effect to save search results to session storage
  useEffect(() => {
    if (hasSearched && searchResults.length > 0) {
      sessionStorage.setItem(SEARCH_RESULTS_STORAGE_KEY, JSON.stringify(searchResults));
      sessionStorage.setItem(SEARCH_QUERY_STORAGE_KEY, searchQuery);
    }
  }, [searchResults, searchQuery, hasSearched]);

  // Test Supabase connection on component mount
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

    // Check if input is a postal code (German postal codes are 5 digits)
    const isPostalCode = /^\d{1,5}$/.test(searchQuery.trim());
    if (isPostalCode) {
      console.log("[DEBUG] Searching with postal code:", searchQuery);
    } else {
      console.log("[DEBUG] Searching with city name:", searchQuery);
    }
    searchClubs(searchQuery);
  };
  const handleClubClick = (clubId: string) => {
    // Navigate to club detail with state indicating we came from search
    navigate(`/clubs/${encodeURIComponent(clubId)}`, {
      state: {
        fromSearch: true
      }
    });
  };
  return <div className="min-h-screen bg-linen dark:bg-navy-dark pb-28">
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
        
        <div className="w-full h-[50vh] rounded-lg overflow-hidden shadow-lg border border-navy-DEFAULT/30 dark:border-navy-light/30 bg-white dark:bg-navy-300 mb-6">
          <ClubMap allClubs={searchResults.length > 0 ? searchResults : undefined} />
        </div>
        
        <Card className="mt-8 border-navy-DEFAULT/30 dark:border-navy-light/30 bg-cadetGray-100 dark:bg-navy-DEFAULT shadow-md">
          <CardContent className="p-6 bg-linen-800">
            <h2 className="text-xl font-semibold mb-4 text-navy-dark dark:text-white">
              {t('clubs.searchNearby')}
            </h2>
            
            <div className="flex flex-col md:flex-row gap-3 mb-6">
              <div className="flex-grow relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-navy-dark dark:text-gray-300" size={18} />
                <Input placeholder={t('clubs.enterCityPostal')} className="pl-10 bg-white dark:bg-navy-300 border-navy-DEFAULT/30 dark:border-navy-light/30 text-navy-dark dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-300" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
              </div>
              <Button onClick={handleSearch} className="bg-teal dark:bg-teal-dark hover:bg-teal-dark text-white" disabled={loading}>
                {loading ? <Loader2 size={18} className="animate-spin mr-2" /> : null}
                {t('clubs.searchButton')}
              </Button>
            </div>
            
            {error && <div className="p-4 mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-700 dark:text-red-300">
                {error}
              </div>}
            
            {hasSearched && <div className="mt-4">
                <h3 className="text-lg font-medium mb-3 text-navy-dark dark:text-white">
                  {searchQuery && `${t('clubs.resultsFor')} "${searchQuery}"`}
                </h3>
                
                {searchResults.length === 0 ? <div className="text-center py-8 text-navy-dark dark:text-gray-300">
                    {t('clubs.noClubsArea')}
                  </div> : <div className="space-y-4 mt-4">
                    {searchResults.map(club => <div key={club.id} className="p-4 rounded-lg border border-navy-DEFAULT/30 dark:border-navy-light/30 bg-white dark:bg-navy-300 shadow-md hover:bg-gray-50 dark:hover:bg-navy-400 transition-colors cursor-pointer" onClick={() => handleClubClick(club.name)}>
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            <MapPin size={20} className={club.status === "verified" ? "text-teal" : club.status === "pending" ? "text-amber-500" : "text-gray-400"} />
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-navy-dark dark:text-white">{club.name}</h4>
                              {!club.membership_status && <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-300">
                                  {t('clubs.waitlist')}
                                </Badge>}
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
                          <Button variant="outline" size="sm" className="border-navy-DEFAULT/50 dark:border-navy-light/50 text-navy-dark dark:text-white hover:bg-navy-dark/10 dark:hover:bg-white/10" onClick={e => {
                    e.stopPropagation();
                    handleClubClick(club.name);
                  }}>
                            {t('clubs.details')}
                          </Button>
                        </div>
                      </div>)}
                  </div>}
              </div>}
          </CardContent>
        </Card>
      </div>
      <BottomNav />
    </div>;
};
export default ClubMapPage;