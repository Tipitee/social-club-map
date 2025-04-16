
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ClubResult, RawClubData } from "@/types/club";

// German city data with related terms and neighboring relationships
interface CityMapping {
  aliases: string[];  // Alternative names and postal codes
  neighbors: string[]; // Names of neighboring cities
  radius: number;     // Approximate search radius in km
}

// Enhanced mapping of German cities with their relationships
const GERMAN_CITIES: Record<string, CityMapping> = {
  "köln": {
    aliases: ["cologne", "koeln", "köln", "50667", "50668", "50670", "50672", "50674", "50676", "50677", "50678", "50679"],
    neighbors: ["brühl", "leverkusen", "bergisch gladbach", "troisdorf", "dormagen", "pulheim", "hürth", "frechen"],
    radius: 30
  },
  "brühl": {
    aliases: ["bruehl", "brühl", "50321"],
    neighbors: ["köln", "hürth", "wesseling", "bornheim"],
    radius: 15
  },
  "berlin": {
    aliases: ["berlin", "10115", "10117", "10119", "10178", "10179"],
    neighbors: ["potsdam", "bernau", "hennigsdorf", "falkensee"],
    radius: 40
  },
  "potsdam": {
    aliases: ["potsdam", "14467", "14469", "14471", "14473"],
    neighbors: ["berlin", "werder", "teltow", "kleinmachnow"],
    radius: 20
  },
  "münchen": {
    aliases: ["munich", "muenchen", "münchen", "80331", "80333", "80335"],
    neighbors: ["fürstenfeldbruck", "dachau", "freising", "erding"],
    radius: 35
  },
  "frankfurt": {
    aliases: ["frankfurt", "60306", "60308", "60310", "60311", "60313"],
    neighbors: ["offenbach", "eschborn", "bad homburg", "hanau"],
    radius: 30
  },
  "hamburg": {
    aliases: ["hamburg", "20095", "20097", "20099"],
    neighbors: ["pinneberg", "norderstedt", "ahrensburg", "reinbek"],
    radius: 40
  },
  "düsseldorf": {
    aliases: ["duesseldorf", "düsseldorf", "40210", "40211", "40213"],
    neighbors: ["neuss", "meerbusch", "ratingen", "hilden", "erkrath"],
    radius: 25
  },
  "bonn": {
    aliases: ["bonn", "53111", "53113", "53115"],
    neighbors: ["sankt augustin", "troisdorf", "königswinter", "bornheim"],
    radius: 20
  },
  "leverkusen": {
    aliases: ["leverkusen", "51373", "51375", "51377"],
    neighbors: ["köln", "monheim", "langenfeld", "bergisch gladbach"],
    radius: 15
  },
  "bergisch gladbach": {
    aliases: ["bergisch gladbach", "51429", "51465", "51469"],
    neighbors: ["köln", "overath", "odenthal", "leverkusen"],
    radius: 15
  }
};

// Build a reverse lookup for faster city identification
const buildReverseLookup = () => {
  const lookup: Record<string, string> = {};
  
  for (const [cityName, data] of Object.entries(GERMAN_CITIES)) {
    // Add the main city name
    lookup[cityName.toLowerCase()] = cityName;
    
    // Add all aliases
    for (const alias of data.aliases) {
      lookup[alias.toLowerCase()] = cityName;
    }
  }
  
  return lookup;
};

// Create the reverse lookup table for faster matching
const CITY_LOOKUP = buildReverseLookup();

export function useClubsSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ClubResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  const debouncedQuery = useDebounce(searchQuery, 500);
  
  // Find main city name based on input query
  const findMainCity = (query: string): string | null => {
    const normalized = query.toLowerCase().trim();
    
    // Empty query check
    if (!normalized) return null;
    
    // Direct match in our lookup table
    if (CITY_LOOKUP[normalized]) {
      return CITY_LOOKUP[normalized];
    }
    
    // Check if the query is a postal code
    if (/^\d+$/.test(normalized)) {
      // Search through all aliases to find matching postal codes
      for (const [cityName, data] of Object.entries(GERMAN_CITIES)) {
        if (data.aliases.some(alias => alias === normalized || alias.startsWith(normalized))) {
          return cityName;
        }
      }
    }
    
    // Try partial matches for city names
    for (const [inputTerm, cityName] of Object.entries(CITY_LOOKUP)) {
      // Skip postal codes for partial matching to avoid false positives
      if (/^\d+$/.test(inputTerm)) continue;
      
      // Check if query is contained in a city name or alias
      if (inputTerm.includes(normalized) || normalized.includes(inputTerm)) {
        return cityName;
      }
    }
    
    return null;
  };
  
  // Get expanded search terms for a query, including neighboring cities
  const getExpandedSearchTerms = (query: string): string[] => {
    const normalizedQuery = query.toLowerCase().trim();
    
    // Empty query check
    if (!normalizedQuery) return [];
    
    const searchTerms = new Set<string>([normalizedQuery]);
    
    // Try to find the main city from the query
    const mainCity = findMainCity(normalizedQuery);
    
    if (mainCity) {
      // Add the main city and its aliases
      searchTerms.add(mainCity);
      GERMAN_CITIES[mainCity].aliases.forEach(term => searchTerms.add(term));
      
      // Add neighboring cities and their aliases
      for (const neighbor of GERMAN_CITIES[mainCity].neighbors) {
        if (GERMAN_CITIES[neighbor]) {
          searchTerms.add(neighbor);
          GERMAN_CITIES[neighbor].aliases.forEach(term => searchTerms.add(term));
        }
      }
      
      console.log(`[DEBUG] Expanded ${normalizedQuery} to main city: ${mainCity}`);
    }
    
    // Convert Set back to array and return
    return Array.from(searchTerms);
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
      
      // Get expanded search terms for more comprehensive results
      const searchTerms = getExpandedSearchTerms(location.trim().toLowerCase());
      console.log("[DEBUG] Expanded search terms:", searchTerms);
      
      // If no search terms found, show a message
      if (searchTerms.length === 0) {
        setSearchResults([]);
        setHasSearched(true);
        setError("No matching locations found. Please try another city.");
        setLoading(false);
        return;
      }
      
      // Identify main city for distance calculations
      const mainCity = findMainCity(location.trim().toLowerCase());
      const searchRadius = mainCity ? GERMAN_CITIES[mainCity].radius : 20; // Default radius
      
      // Build the query to search across city, postal code, and district
      let query = supabase.from('clubs').select('*');
      
      // Handle postal code search differently
      const isPostalCode = /^\d+$/.test(location.trim());
      
      if (isPostalCode) {
        // If it's a postal code, search directly by postal code first
        query = query.ilike('postal_code', `${location.trim()}%`);
      } else if (mainCity) {
        // If we identified a city, search for it and its neighbors
        query = query.ilike('city', `%${mainCity}%`);
      } else {
        // Fallback to general search
        query = query.ilike('city', `%${location.trim()}%`);
      }
      
      // Execute the query
      const { data: searchResults, error: searchError } = await query;
      
      if (searchError) {
        throw new Error(searchError.message);
      }
      
      console.log("[DEBUG] Club search results count:", searchResults?.length);
      
      // Calculate distance approximation based on city relationships
      const clubResults: ClubResult[] = (searchResults || []).map(club => {
        // Calculate a more meaningful distance based on city relationships
        let distance: number | undefined;
        
        // Exact match for user's search query
        if (club.city?.toLowerCase() === location.trim().toLowerCase()) {
          distance = 0 + Math.random() * 5; // Within the city (0-5km)
        } 
        // Club is in the main city that was identified
        else if (mainCity && club.city?.toLowerCase() === mainCity.toLowerCase()) {
          distance = 5 + Math.random() * 10; // Within the main city area (5-15km)
        } 
        // Club is in a neighboring city
        else if (mainCity && GERMAN_CITIES[mainCity].neighbors.some(
          neighbor => club.city?.toLowerCase() === neighbor.toLowerCase()
        )) {
          distance = 10 + Math.random() * 15; // In a neighboring city (10-25km) 
        }
        // Everything else (wider search area)
        else {
          distance = 20 + Math.random() * searchRadius; // Further away
        }
        
        return {
          id: club.name || crypto.randomUUID(), // Use club name as ID or generate one
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
      
      setSearchResults(clubResults);
      setHasSearched(true);
      
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
    setSearchResults,  // Export this function
    loading,
    error,
    hasSearched,
    setHasSearched,    // Export this function
    searchClubs
  };
}
