
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
  id?: string;
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

// Simple structure to hold city information for distance calculation
interface CityInfo {
  name: string;
  postal_code: string;
  // Approximate coordinates for city center or postal code area
  latitude: number;
  longitude: number;
}

// Placeholder for common German cities and their postal code ranges
// This allows for finding clubs in nearby cities
const GERMAN_CITIES: Record<string, string[]> = {
  "köln": ["cologne", "koeln", "köln", "50667", "50668", "50670", "50672", "50674", "50676", "50677", "50678", "50679"],
  "bonn": ["bonn", "53111", "53113", "53115"],
  "berlin": ["berlin", "10115", "10117", "10119"],
  "münchen": ["munich", "muenchen", "münchen", "80331", "80333", "80335"],
  "frankfurt": ["frankfurt", "60306", "60308", "60310", "60311", "60313"],
  "hamburg": ["hamburg", "20095", "20097", "20099"],
  "düsseldorf": ["duesseldorf", "düsseldorf", "40210", "40211", "40213"],
  "brühl": ["bruehl", "brühl", "50321"], // Near Cologne
  "leverkusen": ["leverkusen", "51373", "51375"], // Near Cologne
  "bergisch gladbach": ["bergisch gladbach", "51429", "51465"] // Near Cologne
};

// Define neighboring cities for more accurate nearby searches
const NEIGHBORING_CITIES: Record<string, string[]> = {
  "köln": ["brühl", "leverkusen", "bergisch gladbach", "troisdorf", "dormagen", "pulheim"],
  "brühl": ["köln", "hürth", "wesseling", "bornheim"],
  "leverkusen": ["köln", "monheim", "langenfeld"],
  "bergisch gladbach": ["köln", "overath", "odenthal"],
  "bonn": ["sankt augustin", "troisdorf", "königswinter", "bornheim"],
  "düsseldorf": ["neuss", "meerbusch", "ratingen", "hilden"]
};

export function useClubsSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ClubResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  const debouncedQuery = useDebounce(searchQuery, 500);
  
  // Helper function to get related search terms for a city
  const getRelatedSearchTerms = (query: string): string[] => {
    const normalizedQuery = query.toLowerCase().trim();
    
    // Check if the query matches any postal code
    for (const [cityName, terms] of Object.entries(GERMAN_CITIES)) {
      if (terms.some(term => normalizedQuery === term || normalizedQuery.startsWith(term))) {
        return [cityName, ...terms];
      }
    }
    
    // Check if query matches a city name
    for (const [cityName, terms] of Object.entries(GERMAN_CITIES)) {
      if (cityName.includes(normalizedQuery) || terms.some(term => term.includes(normalizedQuery))) {
        return [cityName, ...terms];
      }
    }
    
    // Find neighboring cities if it's an exact city match
    for (const [cityName, neighbors] of Object.entries(NEIGHBORING_CITIES)) {
      if (cityName === normalizedQuery) {
        const relatedTerms = [cityName];
        neighbors.forEach(neighbor => {
          const neighborTerms = GERMAN_CITIES[neighbor] || [neighbor];
          relatedTerms.push(...neighborTerms);
        });
        return relatedTerms;
      }
    }
    
    // No matches, just return original query
    return [normalizedQuery];
  };

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
      
      // Get related search terms for more comprehensive results
      const searchTerms = getRelatedSearchTerms(location.trim().toLowerCase());
      console.log("[DEBUG] Expanded search terms:", searchTerms);
      
      // Build the query to search across city, postal code, and district
      let query = supabase.from('clubs').select('*');
      
      // Create an array of filter conditions
      const filters = searchTerms.map(term => {
        return `city.ilike.%${term}%,postal_code.ilike.%${term}%,district.ilike.%${term}%`;
      });
      
      // Combine all filters with OR
      query = query.or(filters.join(','));
      
      // Execute the query
      const { data: searchResults, error: searchError } = await query;
      
      if (searchError) {
        throw new Error(searchError.message);
      }
      
      console.log("[DEBUG] Club search results count:", searchResults?.length);
      
      // Calculate distance approximation based on whether query was postal code or city name
      const clubResults: ClubResult[] = (searchResults || []).map(club => {
        // Calculate a more meaningful distance if possible
        let distance: number | undefined;
        
        // For now, calculate distance based on relevance to the search query
        // In a real implementation, this would use coordinates and haversine formula
        if (club.city?.toLowerCase() === location.trim().toLowerCase()) {
          distance = Math.random() * 5; // Within the city
        } else if (club.postal_code?.startsWith(location.trim().substring(0, 2))) {
          distance = 5 + Math.random() * 10; // Nearby postal area
        } else {
          distance = 15 + Math.random() * 20; // Further away
        }
        
        return {
          id: club.name, // Use club name as ID since there's no explicit ID column
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
          distance: parseFloat(distance.toFixed(1))
        };
      });
      
      // Sort results by distance (closest first)
      clubResults.sort((a, b) => {
        if (a.distance !== undefined && b.distance !== undefined) {
          return a.distance - b.distance;
        }
        return 0;
      });
      
      // Log the search details for debugging
      console.log("[DEBUG] Search query:", location);
      console.log("[DEBUG] Search results:", clubResults.length);
      if (clubResults.length > 0) {
        console.log("[DEBUG] First result:", {
          name: clubResults[0].name,
          city: clubResults[0].city,
          postal_code: clubResults[0].postal_code,
          distance: clubResults[0].distance
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
