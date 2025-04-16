
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
  postalCodes: string[]; // Common postal codes for the city
}

// Enhanced mapping of German cities with their relationships
const GERMAN_CITIES: Record<string, CityMapping> = {
  "köln": {
    aliases: ["cologne", "koeln", "köln"],
    neighbors: ["brühl", "leverkusen", "bergisch gladbach", "troisdorf", "dormagen", "pulheim", "hürth", "frechen"],
    radius: 30,
    postalCodes: ["50667", "50668", "50670", "50672", "50674", "50676", "50677", "50678", "50679",
                 "50733", "50735", "50737", "50739", "50823", "50825", "50827", "50829", "50858", 
                 "50859", "50931", "50933", "50935", "50937", "50939", "50968", "50969", "50996", "50997", "50999"]
  },
  "brühl": {
    aliases: ["bruehl", "brühl"],
    neighbors: ["köln", "hürth", "wesseling", "bornheim"],
    radius: 15,
    postalCodes: ["50321"]
  },
  "berlin": {
    aliases: ["berlin"],
    neighbors: ["potsdam", "bernau", "hennigsdorf", "falkensee"],
    radius: 40,
    postalCodes: ["10115", "10117", "10119", "10178", "10179", "10243", "10245", "10247", "10249",
                 "10405", "10435", "10437", "10439", "10551", "10553", "10555", "10557", "10559",
                 "10585", "10587", "10589", "10623", "10625", "10627", "10629", "10707", "10709",
                 "10711", "10713", "10715", "10717", "10719", "10777", "10779", "10781", "10783",
                 "10785", "10787", "10789", "10823", "10825", "10827", "10829", "10961", "10963",
                 "10965", "10967", "10969", "10997", "10999", "12043", "12045", "12047", "12049",
                 "12051", "12053", "12055", "12057", "12059", "12099", "12101", "12103", "12105",
                 "12107", "12109", "12157", "12159", "12161", "12163", "12165", "12167", "12169",
                 "12203", "12205", "12207", "12209", "12247", "12249", "12277", "12279", "12305",
                 "12307", "12309", "12347", "12349", "12351", "12353", "12355", "12357", "12359",
                 "12435", "12437", "12439", "12459", "12487", "12489", "12524", "12526", "12527",
                 "12529", "12555", "12557", "12559", "12587", "12589", "12619", "12621", "12623",
                 "12627", "12629", "12679", "12681", "12683", "12685", "12687", "12689", "13051",
                 "13053", "13055", "13057", "13059", "13086", "13088", "13089", "13125", "13127",
                 "13129", "13156", "13158", "13159", "13187", "13189", "13347", "13349", "13351",
                 "13353", "13355", "13357", "13359", "13403", "13405", "13407", "13409", "13435",
                 "13437", "13439", "13465", "13467", "13469", "13503", "13505", "13507", "13509",
                 "13581", "13583", "13585", "13587", "13589", "13591", "13593", "13595", "13597",
                 "13599", "13627", "13629", "14050", "14052", "14053", "14055", "14057", "14059",
                 "14089", "14109", "14129", "14131", "14163", "14165", "14167", "14169", "14193",
                 "14195", "14197", "14199"]
  },
  "potsdam": {
    aliases: ["potsdam"],
    neighbors: ["berlin", "werder", "teltow", "kleinmachnow"],
    radius: 20,
    postalCodes: ["14467", "14469", "14471", "14473", "14478", "14480"]
  },
  "münchen": {
    aliases: ["munich", "muenchen", "münchen"],
    neighbors: ["fürstenfeldbruck", "dachau", "freising", "erding"],
    radius: 35,
    postalCodes: ["80331", "80333", "80335", "80336", "80337", "80339", "80469", "80538", "80539",
                 "80634", "80636", "80637", "80638", "80639", "80686", "80687", "80689", "80796",
                 "80797", "80798", "80799", "80801", "80802", "80803", "80804", "80805", "80807",
                 "80809", "80935", "80937", "80939", "80992", "80993", "80995", "80997", "80999",
                 "81241", "81243", "81245", "81247", "81249", "81369", "81371", "81373", "81375",
                 "81377", "81379", "81475", "81476", "81477", "81479", "81539", "81541", "81543",
                 "81545", "81547", "81549", "81667", "81669", "81671", "81673", "81675", "81677",
                 "81679", "81735", "81737", "81739", "81825", "81827", "81829", "81925", "81927",
                 "81929", "82031", "82034", "82041", "82049", "82065"]
  },
  "frankfurt": {
    aliases: ["frankfurt"],
    neighbors: ["offenbach", "eschborn", "bad homburg", "hanau"],
    radius: 30,
    postalCodes: ["60306", "60308", "60310", "60311", "60313", "60314", "60318", "60320", "60322",
                 "60323", "60325", "60326", "60327", "60329", "60385", "60386", "60433", "60435",
                 "60437", "60438", "60439", "60486", "60488", "60489", "60528", "60529", "60549",
                 "60594", "60596", "60598", "60599"]
  },
  "hamburg": {
    aliases: ["hamburg"],
    neighbors: ["pinneberg", "norderstedt", "ahrensburg", "reinbek"],
    radius: 40,
    postalCodes: ["20095", "20097", "20099", "20144", "20146", "20148", "20149", "20249", "20251",
                 "20253", "20255", "20257", "20259", "20354", "20355", "20357", "20359", "20457",
                 "20459", "20535", "20537", "20539", "22041", "22043", "22045", "22049", "22081",
                 "22083", "22085", "22087", "22089", "22111", "22113", "22115", "22117", "22119",
                 "22143", "22145", "22147", "22149", "22159", "22175", "22177", "22179", "22297",
                 "22299", "22301", "22303", "22305", "22307", "22309", "22335", "22337", "22339",
                 "22359", "22391", "22393", "22395", "22397", "22399", "22415", "22417", "22419",
                 "22453", "22455", "22457", "22459", "22523", "22525", "22527", "22529", "22547",
                 "22549", "22559", "22587", "22589", "22605", "22607", "22609", "22761", "22763",
                 "22765", "22767", "22769", "22844", "22846", "22848", "22850", "22851", "22869"]
  },
  "düsseldorf": {
    aliases: ["duesseldorf", "düsseldorf"],
    neighbors: ["neuss", "meerbusch", "ratingen", "hilden", "erkrath"],
    radius: 25,
    postalCodes: ["40210", "40211", "40213", "40215", "40217", "40219", "40221", "40223", "40225",
                 "40227", "40229", "40231", "40233", "40235", "40237", "40239", "40468", "40470",
                 "40474", "40476", "40477", "40479", "40489", "40545", "40547", "40549", "40589",
                 "40591", "40593", "40595", "40597", "40599", "40625", "40627", "40629"]
  },
  "bonn": {
    aliases: ["bonn"],
    neighbors: ["sankt augustin", "troisdorf", "königswinter", "bornheim"],
    radius: 20,
    postalCodes: ["53111", "53113", "53115", "53117", "53119", "53121", "53123", "53125", "53127",
                 "53129", "53173", "53175", "53177", "53179", "53225", "53227", "53229"]
  },
  "leverkusen": {
    aliases: ["leverkusen"],
    neighbors: ["köln", "monheim", "langenfeld", "bergisch gladbach"],
    radius: 15,
    postalCodes: ["51373", "51375", "51377", "51379", "51381"]
  },
  "bergisch gladbach": {
    aliases: ["bergisch gladbach"],
    neighbors: ["köln", "overath", "odenthal", "leverkusen"],
    radius: 15,
    postalCodes: ["51429", "51465", "51469"]
  }
};

// Build comprehensive postal code lookup table
const buildPostalCodeLookup = () => {
  const postalCodeLookup: Record<string, string> = {};
  
  // Process each city
  for (const [cityName, data] of Object.entries(GERMAN_CITIES)) {
    // Add all postal codes for the city
    for (const postalCode of data.postalCodes) {
      postalCodeLookup[postalCode] = cityName;
    }
  }
  
  return postalCodeLookup;
};

// Create the postal code lookup table
const POSTAL_CODE_LOOKUP = buildPostalCodeLookup();

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
  
  // Find main city based on input query, including postal code matching
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
      // Direct match in postal code lookup
      if (POSTAL_CODE_LOOKUP[normalized]) {
        return POSTAL_CODE_LOOKUP[normalized];
      }
      
      // Partial postal code match (first 2-3 digits)
      if (normalized.length >= 2) {
        const prefix = normalized.substring(0, 2);
        
        // Check all postal codes for prefix match
        for (const [postalCode, cityName] of Object.entries(POSTAL_CODE_LOOKUP)) {
          if (postalCode.startsWith(prefix)) {
            return cityName;
          }
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
      
      // Check if input is a postal code
      const isPostalCode = /^\d+$/.test(location.trim());
      let mainCity = null;
      
      if (isPostalCode) {
        // Try to find the corresponding city for this postal code
        for (const [city, data] of Object.entries(GERMAN_CITIES)) {
          if (data.postalCodes.some(code => code.startsWith(location.trim()))) {
            mainCity = city;
            console.log(`[DEBUG] Postal code ${location.trim()} matched to city ${city}`);
            break;
          }
        }
        
        // If no direct match, try partial match
        if (!mainCity && location.trim().length >= 2) {
          const prefix = location.trim().substring(0, 2);
          for (const [city, data] of Object.entries(GERMAN_CITIES)) {
            if (data.postalCodes.some(code => code.startsWith(prefix))) {
              mainCity = city;
              console.log(`[DEBUG] Postal code prefix ${prefix} matched to city ${city}`);
              break;
            }
          }
        }
      } else {
        // Try to identify city from name
        mainCity = findMainCity(location.trim().toLowerCase());
      }
      
      // Get expanded search terms for more comprehensive results
      const searchTerms = getExpandedSearchTerms(location.trim().toLowerCase());
      console.log("[DEBUG] Expanded search terms:", searchTerms);
      
      // If no search terms found, show a message
      if (searchTerms.length === 0 && !mainCity && !isPostalCode) {
        setSearchResults([]);
        setHasSearched(true);
        setError("No matching locations found. Please try another city.");
        setLoading(false);
        return;
      }
      
      // Search radius based on identified city or default
      const searchRadius = mainCity ? GERMAN_CITIES[mainCity].radius : 20;
      
      // Build the query to search across city, postal code, and district
      let query = supabase.from('clubs').select('*');
      
      if (isPostalCode) {
        // If it's a postal code, search more broadly by prefix
        const postalPrefix = location.trim().substring(0, 2);
        query = query.ilike('postal_code', `${postalPrefix}%`);
      } else if (mainCity) {
        // If we identified a city, search for it and its neighbors
        const citySearchTerms = [
          mainCity, 
          ...GERMAN_CITIES[mainCity].neighbors
        ];
        
        // Build OR query for multiple cities
        const cityFilters = citySearchTerms.map(city => 
          `city.ilike.%${city}%`
        ).join(',');
        
        query = query.or(cityFilters);
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
        
        // For postal code search
        if (isPostalCode) {
          if (club.postal_code && club.postal_code.startsWith(location.trim())) {
            distance = 0.5 + Math.random() * 2; // Very close (0.5-2.5km)
          } else if (mainCity && club.city?.toLowerCase() === mainCity.toLowerCase()) {
            distance = 2 + Math.random() * 5; // Within the city (2-7km)
          } else {
            distance = 5 + Math.random() * searchRadius; // Further away
          }
        } 
        // For city name search
        else {
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
