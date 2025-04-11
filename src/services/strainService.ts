
import { Strain, StrainEffect } from "../types/strain";
import { supabase } from "@/integrations/supabase/client";

/**
 * Safe parsing of percentage values from string
 */
const safeParsePercent = (value: string | number | null | undefined): number => {
  if (value === null || value === undefined) return 0;
  
  if (typeof value === 'number') return Math.round(value);
  
  try {
    const parsed = parseFloat(value);
    if (isNaN(parsed)) return 0;
    return Math.round(parsed);
  } catch (e) {
    return 0;
  }
};

/**
 * Extract thc level from item data
 */
const extractThcLevel = (item: any): number | null => {
  if (item.thc_level) {
    return parseFloat(item.thc_level);
  }
  
  if (item.thc) {
    return parseFloat(item.thc);
  }
  
  return null;
};

/**
 * Test connection to the strains table
 */
export const testStrainsConnection = async (): Promise<{success: boolean, message: string, count?: number}> => {
  try {
    const { data, error, count } = await supabase
      .from("strains")
      .select("*", { count: "exact", head: true })
      .limit(1);
      
    if (error) {
      return {
        success: false,
        message: `Database error: ${error.message}`,
      };
    }
    
    return {
      success: true,
      message: count 
        ? `Connected to database with ${count} strains`
        : "Connected to database but no strains found",
      count: count || 0
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      message: `Connection test failed: ${message}`,
    };
  }
};

/**
 * Get all unique effects from strains
 */
export const getAllEffects = async (): Promise<string[]> => {
  try {
    const effects: Set<string> = new Set();
    
    // Fetch a sample of strains to extract effects
    const { data } = await supabase
      .from("strains")
      .select("effects_json, top_effect, second_effect, third_effect")
      .limit(100);
      
    if (!data) return [];
    
    // Extract effects from all sources
    data.forEach(item => {
      // Add direct effect fields if they exist
      if (item.top_effect) effects.add(item.top_effect);
      if (item.second_effect) effects.add(item.second_effect);
      if (item.third_effect) effects.add(item.third_effect);
      
      // Parse effects_json if it exists
      try {
        if (item.effects_json && typeof item.effects_json === 'string') {
          const parsed = JSON.parse(item.effects_json);
          
          if (Array.isArray(parsed)) {
            parsed.forEach((effect: any) => {
              if (effect && effect.name) effects.add(effect.name);
            });
          } else if (typeof parsed === 'object') {
            Object.keys(parsed).forEach(effect => effects.add(effect));
          }
        }
      } catch (e) {
        console.warn("Could not parse effects_json");
      }
    });
    
    // Convert Set to array and sort
    return Array.from(effects).sort();
  } catch (error) {
    console.error("Error getting effects:", error);
    return [];
  }
};

/**
 * Get all unique terpenes from strains
 */
export const getTerpenes = async (): Promise<string[]> => {
  try {
    const terpenes: Set<string> = new Set();
    
    // Fetch strains with terpene data
    const { data } = await supabase
      .from("strains")
      .select("most_common_terpene, terpenes_json")
      .not("most_common_terpene", "is", null)
      .limit(100);
      
    if (!data) return [];
    
    // Extract terpenes
    data.forEach(item => {
      if (item.most_common_terpene) {
        terpenes.add(item.most_common_terpene);
      }
      
      // Parse terpenes_json if it exists
      try {
        if (item.terpenes_json && typeof item.terpenes_json === 'string') {
          const parsed = JSON.parse(item.terpenes_json);
          
          if (Array.isArray(parsed)) {
            parsed.forEach((terpene: any) => {
              if (terpene && terpene.name) terpenes.add(terpene.name);
            });
          } else if (typeof parsed === 'object') {
            Object.keys(parsed).forEach(terpene => terpenes.add(terpene));
          }
        }
      } catch (e) {
        console.warn("Could not parse terpenes_json");
      }
    });
    
    // Convert Set to array and sort
    return Array.from(terpenes).sort();
  } catch (error) {
    console.error("Error getting terpenes:", error);
    return [];
  }
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
  limit: number = 20, // Show 20 strains per page
  searchQuery: string = ""
): Promise<{ strains: Strain[]; total: number }> => {
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
    const strains = data.map(item => {
      let effects: StrainEffect[] = [];
      const thcLevel = extractThcLevel(item);
      
      // Process top 3 effects - using the correct property names
      if (item.top_effect) {
        effects.push({
          effect: item.top_effect,
          intensity: safeParsePercent(item.highest_percent || 90), // highest_percent is the DB field for top_percent
        });
      }
      
      if (item.second_effect) {
        effects.push({
          effect: item.second_effect,
          intensity: safeParsePercent(item.second_percent || 80),
        });
      }
      
      if (item.third_effect) {
        effects.push({
          effect: item.third_effect,
          intensity: safeParsePercent(item.third_percent || 70),
        });
      }
      
      // Try to parse effects from JSON as well
      try {
        if (item.effects_json && typeof item.effects_json === 'string' && effects.length < 3) {
          let parsedEffects;
          try {
            parsedEffects = JSON.parse(item.effects_json);
            
            // Handle different formats
            if (Array.isArray(parsedEffects)) {
              parsedEffects.forEach((effect: any) => {
                if (effect.name && effect.score && !effects.some(e => e.effect === effect.name)) {
                  effects.push({
                    effect: effect.name,
                    intensity: Math.round(effect.score * 100)
                  });
                }
              });
            }
            else if (typeof parsedEffects === 'object') {
              // Handle object format
              for (const [key, value] of Object.entries(parsedEffects)) {
                if (typeof value === 'number' && !effects.some(e => e.effect === key)) {
                  effects.push({
                    effect: key,
                    intensity: Math.round(Number(value) * 100)
                  });
                }
              }
            }
          } catch (e) {
            console.warn("Could not parse effects_json for strain:", item.name);
          }
        }
      } catch (e) {
        console.error("Error handling effects for strain:", item.name, e);
      }
      
      // Ensure we have a valid ID - removed item.id reference
      const strainId = item.unique_identifier || item.name.replace(/\s+/g, '-').toLowerCase();

      // Create strain object
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
    });
    
    // Always prioritize strains with images first
    strains.sort((a, b) => {
      const aHasImage = Boolean(a.img_url && a.img_url.trim() !== '');
      const bHasImage = Boolean(b.img_url && b.img_url.trim() !== '');
      
      if (aHasImage && !bHasImage) return -1;
      if (!aHasImage && bHasImage) return 1;
      
      return a.name.localeCompare(b.name);
    });
    
    return { 
      strains, 
      total: count || strains.length 
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
    
    // Extract effects - use the same logic as in fetchStrains for consistency
    let effects: StrainEffect[] = [];
    
    // Add effects from top/second/third effect fields with their respective percentages
    if (item.top_effect) {
      effects.push({
        effect: item.top_effect,
        intensity: safeParsePercent(item.highest_percent || 90),
      });
    }
    
    if (item.second_effect) {
      effects.push({
        effect: item.second_effect,
        intensity: safeParsePercent(item.second_percent || 80),
      });
    }
    
    if (item.third_effect) {
      effects.push({
        effect: item.third_effect,
        intensity: safeParsePercent(item.third_percent || 70),
      });
    }
    
    // Try to parse effects from JSON
    try {
      if (item.effects_json && typeof item.effects_json === 'string' && effects.length < 3) {
        let parsedEffects;
        try {
          parsedEffects = JSON.parse(item.effects_json);
          
          // Handle different formats
          if (Array.isArray(parsedEffects)) {
            parsedEffects.forEach((effect: any) => {
              if (effect.name && effect.score && !effects.some(e => e.effect === effect.name)) {
                effects.push({
                  effect: effect.name,
                  intensity: Math.round(effect.score * 100)
                });
              }
            });
          }
          else if (typeof parsedEffects === 'object') {
            // Handle object format
            for (const [key, value] of Object.entries(parsedEffects)) {
              if (typeof value === 'number' && !effects.some(e => e.effect === key)) {
                effects.push({
                  effect: key,
                  intensity: Math.round(Number(value) * 100)
                });
              }
            }
          }
        } catch (e) {
          console.warn("Could not parse effects_json for strain:", item.name);
        }
      }
    } catch (e) {
      console.error("Error handling effects for strain:", item.name, e);
    }
    
    // Create strain object - removed item.id reference
    const thcLevel = extractThcLevel(item);
    const strainId = item.unique_identifier || item.name.replace(/\s+/g, '-').toLowerCase();
    
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
  } catch (error) {
    console.error("Error fetching strain:", error);
    throw error;
  }
};
