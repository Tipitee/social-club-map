
import { Strain, FetchStrainsResult } from "@/types/strain";
import { supabase } from "@/integrations/supabase/client";
import { extractEffects } from "./utils/effectsParser";
import { createStrainId, extractThcLevel } from "./utils/parseUtils";
import { 
  testStrainsConnection, 
  getAllEffects, 
  getTerpenes 
} from "./database/strainDbService";

// Re-export database service functions
export { testStrainsConnection, getAllEffects, getTerpenes };

/**
 * Map a raw database item to a Strain type
 */
const mapToStrainType = (item: any): Strain => {
  const thcLevel = extractThcLevel(item);
  const effects = extractEffects(item);
  const strainId = createStrainId(item);
  
  return {
    id: strainId,
    name: item.name || "Unknown Strain",
    type: (item.type as 'Indica' | 'Sativa' | 'Hybrid') || 'Hybrid',
    img_url: item.img_url || null,
    thc_level: thcLevel,
    description: item.description || null,
    effects: effects,
    most_common_terpene: item.most_common_terpene || null,
  };
};

/**
 * Sort strains with preference for those with images
 */
const sortStrainsByImagePresence = (strains: Strain[]): Strain[] => {
  return [...strains].sort((a, b) => {
    const aHasImage = Boolean(a.img_url && a.img_url.trim() !== '');
    const bHasImage = Boolean(b.img_url && b.img_url.trim() !== '');
    
    if (aHasImage && !bHasImage) return -1;
    if (!aHasImage && bHasImage) return 1;
    
    return a.name.localeCompare(b.name);
  });
};

/**
 * Fetch strains from Supabase
 * @param sort Sort method
 * @param page Page number
 * @param limit Results per page
 * @param searchQuery Optional search query
 * @returns List of strain data and total count
 */
export const fetchStrains = async (
  sort: string = "name",
  page: number = 1,
  limit: number = 20,
  searchQuery: string = ""
): Promise<FetchStrainsResult> => {
  try {
    // Calculate pagination range
    const from = (page - 1) * limit;
    const to = from + (limit - 1);
    
    // Build query
    let query = supabase
      .from("strains")
      .select("*", { count: "exact" });
    
    // Apply search filter if provided
    if (searchQuery) {
      query = query.ilike("name", `%${searchQuery}%`);
    }
    
    // Apply sorting
    if (sort === "name") {
      query = query.order("name", { ascending: true });
    } else if (sort === "thc_high") {
      query = query.order("thc_level", { ascending: false, nullsFirst: false });
    } else if (sort === "thc_low") {
      query = query.order("thc_level", { ascending: true, nullsFirst: false });
    }
    
    // Apply pagination
    query = query.range(from, to);
    
    // Execute query
    const { data, error, count } = await query;
    
    if (error) {
      console.error("Error fetching strains:", error);
      throw new Error(error.message);
    }
    
    // Transform data into our Strain type
    const strains = data.map(mapToStrainType);
    
    // Sort strains prioritizing those with images
    const sortedStrains = sortStrainsByImagePresence(strains);
    
    return { 
      strains: sortedStrains, 
      total: count || sortedStrains.length 
    };
  } catch (error) {
    console.error("Error in fetchStrains:", error);
    throw error;
  }
};

/**
 * Fetch a specific strain by ID or name
 */
export const fetchStrainById = async (idOrName: string): Promise<Strain | null> => {
  try {
    console.log("Fetching strain with ID or name:", idOrName);
    
    // First try to find by unique_identifier
    let { data, error } = await supabase
      .from("strains")
      .select("*")
      .eq("unique_identifier", idOrName);
    
    if (error) {
      console.error("Error searching by unique_identifier:", error);
      throw new Error(error.message);
    }

    // If no results, try to find by name
    if (!data || data.length === 0) {
      console.log("No results by unique_identifier, trying by name...");
      
      // Try to find by exact name match
      const nameResult = await supabase
        .from("strains")
        .select("*")
        .eq("name", idOrName);
      
      if (nameResult.error) {
        console.error("Error searching by exact name:", nameResult.error);
        throw new Error(nameResult.error.message);
      }
      
      data = nameResult.data;
      
      // If still no results, try with case-insensitive name match
      if (!data || data.length === 0) {
        console.log("No results by exact name, trying case-insensitive match...");
        const insensitiveResult = await supabase
          .from("strains")
          .select("*")
          .ilike("name", idOrName);
          
        if (insensitiveResult.error) {
          console.error("Error searching by case-insensitive name:", insensitiveResult.error);
          throw new Error(insensitiveResult.error.message);
        }
        
        data = insensitiveResult.data;
      }
      
      // If still no results, try with URL-decoded name with fuzzy match
      if (!data || data.length === 0) {
        console.log("No results by name matching, trying with decoded name...");
        const decodedName = decodeURIComponent(idOrName).replace(/-/g, ' ');
        console.log("Decoded name:", decodedName);
        
        const decodedResult = await supabase
          .from("strains")
          .select("*")
          .ilike("name", `%${decodedName}%`);
        
        if (decodedResult.error) {
          console.error("Error searching by decoded name:", decodedResult.error);
          throw new Error(decodedResult.error.message);
        }
        
        data = decodedResult.data;
      }
    }
    
    if (!data || data.length === 0) {
      console.log("No strain found with ID or name:", idOrName);
      return null;
    }
    
    // Take the first result if multiple were found
    const item = data[0];
    console.log("Found strain:", item.name);
    
    return mapToStrainType(item);
  } catch (error) {
    console.error("Error fetching strain:", error);
    throw error;
  }
};
