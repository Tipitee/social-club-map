
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface ClubResult {
  id: string;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  distance?: number;
  status: "verified" | "pending" | "unverified";
  latitude: number | null;
  longitude: number | null;
  membership_status: boolean;
  district?: string;
  website?: string;
  contact_email?: string;
  contact_phone?: string;
}

export function useClubsSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ClubResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  const debouncedQuery = useDebounce(searchQuery, 500);
  
  const searchClubs = async (location: string) => {
    if (!location.trim()) {
      toast({
        title: "Search Error",
        description: "Please enter a location to search",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log("[DEBUG] Searching for clubs near:", location);
      
      // For now, we'll just search by city as we don't have geocoding yet
      const { data, error: fetchError } = await supabase
        .from('clubs')
        .select('*')
        .or(`city.ilike.%${location}%, postal_code.ilike.%${location}%, district.ilike.%${location}%`)
        .order('name');
      
      console.log("[DEBUG] Club search results:", data);
      
      if (fetchError) {
        console.error("[DEBUG] Club search error:", fetchError);
        throw new Error(fetchError.message);
      }
      
      // Transform data to match our interface
      const clubResults: ClubResult[] = data?.map(club => ({
        id: club.id || "",
        name: club.name || "Unnamed Club",
        address: club.address || "",
        city: club.city || "",
        postal_code: club.postal_code || "",
        status: (club.status as "verified" | "pending" | "unverified") || "unverified",
        latitude: club.latitude,
        longitude: club.longitude,
        membership_status: Boolean(club.membership_status),
        district: club.district,
        website: club.website,
        contact_email: club.contact_email,
        contact_phone: club.contact_phone,
        // For now, we'll add a mock distance based on a random number
        // Later, we can calculate this based on geolocation
        distance: parseFloat((Math.random() * 20 + 1).toFixed(1))
      })) || [];
      
      setSearchResults(clubResults);
      setHasSearched(true);
      
      toast({
        title: "Search Complete",
        description: `Found ${clubResults.length} clubs near "${location}"`
      });
      
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error searching for clubs";
      console.error("[DEBUG] Club search error:", message);
      setError(message);
      toast({
        title: "Search Error",
        description: message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    loading,
    error,
    hasSearched,
    searchClubs
  };
}
