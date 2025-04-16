
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ClubResult, RawClubData } from "@/types/club";

// German city data with related terms and neighboring relationships
interface CityMapping {
  aliases: string[];       // Alternative names and common misspellings
  neighbors: string[];     // Names of neighboring cities
  radius: number;          // Approximate search radius in km
  postalCodes: string[];   // Common postal codes for the city
  coordinates: [number, number]; // [longitude, latitude]
}

// Enhanced mapping of German cities with their relationships
const GERMAN_CITIES: Record<string, CityMapping> = {
  "köln": {
    aliases: ["cologne", "koeln", "köln"],
    neighbors: ["brühl", "leverkusen", "bergisch gladbach", "troisdorf", "dormagen", "pulheim", "hürth", "frechen"],
    radius: 30,
    postalCodes: ["50667", "50668", "50670", "50672", "50674", "50676", "50677", "50678", "50679",
                 "50733", "50735", "50737", "50739", "50823", "50825", "50827", "50829", "50858", 
                 "50859", "50931", "50933", "50935", "50937", "50939", "50968", "50969", "50996", "50997", "50999"],
    coordinates: [6.9578, 50.9422]
  },
  "brühl": {
    aliases: ["bruehl", "brühl"],
    neighbors: ["köln", "hürth", "wesseling", "bornheim"],
    radius: 15,
    postalCodes: ["50321"],
    coordinates: [6.9061, 50.8258]
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
                 "14195", "14197", "14199"],
    coordinates: [13.4050, 52.5200]
  },
  "potsdam": {
    aliases: ["potsdam"],
    neighbors: ["berlin", "werder", "teltow", "kleinmachnow"],
    radius: 20,
    postalCodes: ["14467", "14469", "14471", "14473", "14478", "14480"],
    coordinates: [13.0645, 52.3906]
  },
  "münchen": {
    aliases: ["munich", "muenchen", "münchen"],
    neighbors: ["fürstenfeldbruck", "dachau", "freising", "erding", "karlsfeld", "garching", "unterhaching", "grünwald"],
    radius: 35,
    postalCodes: ["80331", "80333", "80335", "80336", "80337", "80339", "80469", "80538", "80539",
                 "80634", "80636", "80637", "80638", "80639", "80686", "80687", "80689", "80796",
                 "80797", "80798", "80799", "80801", "80802", "80803", "80804", "80805", "80807",
                 "80809", "80935", "80937", "80939", "80992", "80993", "80995", "80997", "80999",
                 "81241", "81243", "81245", "81247", "81249", "81369", "81371", "81373", "81375",
                 "81377", "81379", "81475", "81476", "81477", "81479", "81539", "81541", "81543",
                 "81545", "81547", "81549", "81667", "81669", "81671", "81673", "81675", "81677",
                 "81679", "81735", "81737", "81739", "81825", "81827", "81829", "81925", "81927",
                 "81929", "82031", "82034", "82041", "82049", "82065"],
    coordinates: [11.5820, 48.1351]
  },
  "karlsfeld": {
    aliases: ["karlsfeld"],
    neighbors: ["münchen", "dachau"],
    radius: 15,
    postalCodes: ["85757"],
    coordinates: [11.4758, 48.2203]
  },
  "dachau": {
    aliases: ["dachau"],
    neighbors: ["münchen", "karlsfeld"],
    radius: 20,
    postalCodes: ["85221", "85221", "85226"],
    coordinates: [11.4342, 48.2632]
  },
  "frankfurt": {
    aliases: ["frankfurt", "frankfurt am main", "frankfurt/main"],
    neighbors: ["offenbach", "eschborn", "bad homburg", "hanau", "neu-isenburg", "oberursel"],
    radius: 30,
    postalCodes: ["60306", "60308", "60310", "60311", "60313", "60314", "60318", "60320", "60322",
                 "60323", "60325", "60326", "60327", "60329", "60385", "60386", "60433", "60435",
                 "60437", "60438", "60439", "60486", "60488", "60489", "60528", "60529", "60549",
                 "60594", "60596", "60598", "60599"],
    coordinates: [8.6821, 50.1109]
  },
  "hamburg": {
    aliases: ["hamburg"],
    neighbors: ["pinneberg", "norderstedt", "ahrensburg", "reinbek", "wedel", "seevetal"],
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
                 "22765", "22767", "22769", "22844", "22846", "22848", "22850", "22851", "22869"],
    coordinates: [9.9937, 53.5511]
  },
  "düsseldorf": {
    aliases: ["duesseldorf", "düsseldorf"],
    neighbors: ["neuss", "meerbusch", "ratingen", "hilden", "erkrath", "monheim"],
    radius: 25,
    postalCodes: ["40210", "40211", "40213", "40215", "40217", "40219", "40221", "40223", "40225",
                 "40227", "40229", "40231", "40233", "40235", "40237", "40239", "40468", "40470",
                 "40474", "40476", "40477", "40479", "40489", "40545", "40547", "40549", "40589",
                 "40591", "40593", "40595", "40597", "40599", "40625", "40627", "40629"],
    coordinates: [6.7734, 51.2277]
  },
  "bonn": {
    aliases: ["bonn"],
    neighbors: ["sankt augustin", "troisdorf", "königswinter", "bornheim", "siegburg", "alfter"],
    radius: 20,
    postalCodes: ["53111", "53113", "53115", "53117", "53119", "53121", "53123", "53125", "53127",
                 "53129", "53173", "53175", "53177", "53179", "53225", "53227", "53229"],
    coordinates: [7.0982, 50.7374]
  },
  "leverkusen": {
    aliases: ["leverkusen"],
    neighbors: ["köln", "monheim", "langenfeld", "bergisch gladbach"],
    radius: 15,
    postalCodes: ["51373", "51375", "51377", "51379", "51381"],
    coordinates: [7.0220, 51.0459]
  },
  "bergisch gladbach": {
    aliases: ["bergisch gladbach", "gl", "bergisch-gladbach"],
    neighbors: ["köln", "overath", "odenthal", "leverkusen"],
    radius: 15,
    postalCodes: ["51429", "51465", "51469"],
    coordinates: [7.1360, 50.9925]
  }
};

// Calculate the distance between two points using the Haversine formula
// This is more accurate than a simple Euclidean distance for geographic coordinates
const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c; // Distance in km
  return d;
};

// Find all cities within a certain radius of another city
const findCitiesWithinRadius = (
  originCity: string,
  radiusKm: number
): string[] => {
  if (!GERMAN_CITIES[originCity]) return [originCity];
  
  const originCoords = GERMAN_CITIES[originCity].coordinates;
  const citiesInRadius = [originCity];
  
  // Check each city in our database
  for (const [cityName, cityData] of Object.entries(GERMAN_CITIES)) {
    // Skip the origin city
    if (cityName === originCity) continue;
    
    const distance = calculateDistance(
      GERMAN_CITIES[originCity].coordinates[1],
      GERMAN_CITIES[originCity].coordinates[0],
      cityData.coordinates[1],
      cityData.coordinates[0]
    );
    
    // If the city is within the radius, add it
    if (distance <= radiusKm) {
      citiesInRadius.push(cityName);
    }
  }
  
  return citiesInRadius;
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

// Build a mapping of postal code prefixes to cities
const buildPostalPrefixLookup = () => {
  const prefixLookup: Record<string, string[]> = {};
  
  for (const [cityName, data] of Object.entries(GERMAN_CITIES)) {
    for (const postalCode of data.postalCodes) {
      // Go through different prefix lengths for better matching
      for (let i = 1; i <= 3; i++) {
        if (postalCode.length >= i) {
          const prefix = postalCode.substring(0, i);
          
          if (!prefixLookup[prefix]) {
            prefixLookup[prefix] = [];
          }
          if (!prefixLookup[prefix].includes(cityName)) {
            prefixLookup[prefix].push(cityName);
          }
        }
      }
    }
  }
  
  return prefixLookup;
};

// Create postal prefix lookup table
const POSTAL_PREFIX_LOOKUP = buildPostalPrefixLookup();

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
      
      // Match by postal code prefix (1-3 digits)
      for (let i = Math.min(normalized.length, 3); i >= 1; i--) {
        const prefix = normalized.substring(0, i);
        if (POSTAL_PREFIX_LOOKUP[prefix]) {
          return POSTAL_PREFIX_LOOKUP[prefix][0]; // Return the first matching city
        }
      }
    }
    
    // Try partial matches for city names
    for (const [cityName, data] of Object.entries(GERMAN_CITIES)) {
      // Check if query is contained in city name
      if (cityName.toLowerCase().includes(normalized)) {
        return cityName;
      }
      
      // Check if query is contained in any alias
      for (const alias of data.aliases) {
        if (alias.toLowerCase().includes(normalized)) {
          return cityName;
        }
      }
    }
    
    return null;
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
      
      // Try to identify main city from search input
      const mainCity = findMainCity(location.trim().toLowerCase());
      console.log("[DEBUG] Identified main city:", mainCity);
      
      // Set appropriate search radius based on the city or default to 30km
      const searchRadius = mainCity && GERMAN_CITIES[mainCity] 
        ? GERMAN_CITIES[mainCity].radius 
        : 30;
      
      // Get all cities to include in search (main city + cities within radius)
      let searchCities: string[] = mainCity 
        ? findCitiesWithinRadius(mainCity, searchRadius)
        : [];
      
      console.log("[DEBUG] Cities included in search:", searchCities);
      
      // If we couldn't identify a city but have a postal code
      if (!mainCity && isPostalCode) {
        // Try to find cities by postal code prefix
        for (let i = Math.min(location.trim().length, 3); i >= 1; i--) {
          const prefix = location.trim().substring(0, i);
          const citiesByPrefix = POSTAL_PREFIX_LOOKUP[prefix] || [];
          if (citiesByPrefix.length > 0) {
            searchCities = [...citiesByPrefix];
            console.log("[DEBUG] Cities found by postal prefix:", citiesByPrefix);
            break;
          }
        }
      }
      
      // If we still haven't found any cities, show a helpful error
      if (!mainCity && !isPostalCode && searchCities.length === 0) {
        setSearchResults([]);
        setHasSearched(true);
        setError(`No matching locations found for "${location}". Please try another city or postal code.`);
        setLoading(false);
        return;
      }
      
      // Build the query
      let query = supabase.from('clubs').select('*');
      
      // For postal code search
      if (isPostalCode) {
        const postalCode = location.trim();
        
        // If exact postal code (5 digits in Germany)
        if (postalCode.length === 5) {
          query = query.eq('postal_code', postalCode);
        } 
        // For partial postal code, use prefix matching
        else {
          query = query.ilike('postal_code', `${postalCode}%`);
        }
      } 
      // For city-based search
      else if (searchCities.length > 0) {
        // Build a filter that includes all cities in our search radius
        const cityFilters = searchCities
          .map(city => `city.ilike.%${city}%`)
          .join(',');
        
        query = query.or(cityFilters);
      } 
      // Fallback generic search
      else {
        query = query.ilike('city', `%${location.trim()}%`);
      }
      
      // Execute the query
      const { data: searchResults, error: searchError } = await query;
      
      if (searchError) {
        throw new Error(searchError.message);
      }
      
      console.log("[DEBUG] Club search results count:", searchResults?.length);
      
      if (!searchResults || searchResults.length === 0) {
        setSearchResults([]);
        setHasSearched(true);
        setError(`No clubs found in ${location}. Try searching for a nearby city.`);
        setLoading(false);
        return;
      }
      
      // Calculate actual distances based on coordinates when available
      const clubResults: ClubResult[] = (searchResults || []).map(club => {
        let distance: number | undefined;
        
        // If we have coordinates for both the club and the main city
        if (club.latitude && club.longitude && mainCity && GERMAN_CITIES[mainCity]) {
          // Calculate actual distance using Haversine formula
          distance = calculateDistance(
            club.latitude,
            club.longitude,
            GERMAN_CITIES[mainCity].coordinates[1],
            GERMAN_CITIES[mainCity].coordinates[0]
          );
        } 
        // If we have postal code match
        else if (isPostalCode && club.postal_code) {
          // Exact postal code match
          if (club.postal_code === location.trim()) {
            distance = 0.5; // Very close
          }
          // Postal code prefix match
          else if (location.trim().length >= 2 && 
                   club.postal_code.startsWith(location.trim().substring(0, 2))) {
            distance = 3 + Math.random() * 5; // Within city
          }
          // Use city relationships
          else if (mainCity && club.city) {
            if (club.city.toLowerCase().includes(mainCity.toLowerCase())) {
              distance = 5 + Math.random() * 10; // Inside the city
            }
            else if (GERMAN_CITIES[mainCity] && GERMAN_CITIES[mainCity].neighbors.some(n => 
                     club.city?.toLowerCase().includes(n.toLowerCase()))) {
              distance = 15 + Math.random() * 15; // Neighboring city
            }
            else {
              distance = 20 + Math.random() * 20; // Further away
            }
          }
          // Default distance if no better match
          else {
            distance = 20 + Math.random() * 20; // Further away
          }
        }
        // For city name search without coordinates
        else if (mainCity && club.city) {
          // Direct match to searched city
          if (club.city.toLowerCase().includes(mainCity.toLowerCase())) {
            distance = 0 + Math.random() * 10; // Within the city
          }
          // Club is in neighboring city
          else if (GERMAN_CITIES[mainCity] && GERMAN_CITIES[mainCity].neighbors.some(
            neighbor => club.city?.toLowerCase().includes(neighbor.toLowerCase())
          )) {
            distance = 10 + Math.random() * 20; // In a neighboring city
          }
          // Other result
          else {
            distance = 30 + Math.random() * 10; // Further away
          }
        } 
        // Default if we couldn't determine relationships
        else {
          distance = 25 + Math.random() * 15;
        }
        
        return {
          id: club.name || crypto.randomUUID(),
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
    setSearchResults,
    loading,
    error,
    hasSearched,
    setHasSearched,
    searchClubs
  };
}
