
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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

// Raw data type from database
interface RawClubData {
  id: string;
  name: string;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  status: string | null;
  latitude: number | null;
  longitude: number | null;
  membership_status: boolean | null;
  district: string | null;
  website: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  description: string | null;
  additional_info: string | null;
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
      
      // Explicitly type the response to avoid deep type instantiation
      const { data, error: fetchError } = await supabase
        .from('clubs')
        .select('*')
        .or(`city.ilike.%${location}%, postal_code.ilike.%${location}%, district.ilike.%${location}%`)
        .order('name') as { data: RawClubData[] | null; error: any };
      
      console.log("[DEBUG] Club search results:", data);
      
      if (fetchError) {
        console.error("[DEBUG] Club search error:", fetchError);
        throw new Error(fetchError.message);
      }
      
      // Map data with proper type handling
      const clubResults: ClubResult[] = (data || []).map(club => {
        return {
          id: club.id || crypto.randomUUID(), // Use actual ID if available, fallback to UUID
          name: club.name || "Unnamed Club",
          address: club.address || null,
          city: club.city || null,
          postal_code: club.postal_code || null,
          status: (club.status as "verified" | "pending" | "unverified") || "unverified",
          latitude: club.latitude || null,
          longitude: club.longitude || null,
          membership_status: Boolean(club.membership_status),
          district: club.district || null,
          website: club.website || null,
          contact_email: club.contact_email || null,
          contact_phone: club.contact_phone || null,
          description: club.description || null,
          additional_info: club.additional_info || null,
          distance: parseFloat((Math.random() * 20 + 1).toFixed(1))
        };
      });
      
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
