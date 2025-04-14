
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";

export interface ClubResult {
  id: string;
  name: string;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  distance?: number;
  status: "verified" | "pending" | "unverified";
  latitude: number | null;
  longitude: number | null;
  membership_status: boolean;
  district?: string | null;
  website?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  description?: string | null;
  additional_info?: string | null;
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
      const clubResults: ClubResult[] = data?.map(club => {
        // Type cast the raw data first to avoid deep type instantiation
        const rawClubData = club as Tables["clubs"]["Row"];
        
        // Create a uniquely identified club entry
        return {
          id: crypto.randomUUID(), // Generate a random ID since it doesn't exist in database
          name: rawClubData.name || "Unnamed Club",
          address: rawClubData.address,
          city: rawClubData.city,
          postal_code: rawClubData.postal_code,
          status: (rawClubData.status as "verified" | "pending" | "unverified") || "unverified",
          latitude: rawClubData.latitude,
          longitude: rawClubData.longitude,
          membership_status: Boolean(rawClubData.membership_status),
          district: rawClubData.district,
          website: rawClubData.website,
          contact_email: rawClubData.contact_email,
          contact_phone: rawClubData.contact_phone,
          description: rawClubData.description,
          additional_info: rawClubData.additional_info,
          // For now, we'll add a mock distance based on a random number
          // Later, we can calculate this based on geolocation
          distance: parseFloat((Math.random() * 20 + 1).toFixed(1))
        };
      }) || [];
      
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
