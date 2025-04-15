
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
      console.log("[DEBUG] Searching for clubs with query:", location);
      
      // Sanitize and prepare the search query
      const sanitizedQuery = location.trim().toLowerCase();
      
      // Create a more comprehensive search query using ILIKE
      // This allows for partial matches on multiple fields
      const { data, error: fetchError } = await supabase
        .from('clubs')
        .select('*')
        .or(
          `name.ilike.%${sanitizedQuery}%,` +
          `city.ilike.%${sanitizedQuery}%,` +
          `postal_code.ilike.%${sanitizedQuery}%,` +
          `district.ilike.%${sanitizedQuery}%,` +
          `description.ilike.%${sanitizedQuery}%,` +
          `address.ilike.%${sanitizedQuery}%`
        )
        .order('name') as { data: RawClubData[] | null; error: any };
      
      console.log("[DEBUG] Club search results count:", data?.length);
      
      if (fetchError) {
        console.error("[DEBUG] Club search error:", fetchError);
        throw new Error(fetchError.message);
      }
      
      // Map data with proper type handling
      const clubResults: ClubResult[] = (data || []).map(club => {
        // Calculate a more accurate distance if possible
        let distance: number | undefined;
        
        if (club.latitude && club.longitude) {
          // For now, use a random distance as placeholder
          // In a real implementation, this would use the user's location if available
          distance = parseFloat((Math.random() * 20 + 1).toFixed(1));
        }
        
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
          distance: distance
        };
      });
      
      // Log the search details for debugging
      console.log("[DEBUG] Search query:", sanitizedQuery);
      console.log("[DEBUG] Search results:", clubResults.length);
      if (clubResults.length > 0) {
        console.log("[DEBUG] First result:", {
          name: clubResults[0].name,
          city: clubResults[0].city,
          postal_code: clubResults[0].postal_code
        });
      }
      
      setSearchResults(clubResults);
      setHasSearched(true);
      
      if (clubResults.length === 0) {
        toast({
          title: "No Results",
          description: `No clubs found matching "${location}"`,
          variant: "default"
        });
      } else {
        toast({
          title: "Search Complete",
          description: `Found ${clubResults.length} clubs matching "${location}"`,
          variant: "default"
        });
      }
      
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
