
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
 * @returns List of strain data and total count
 */
export const fetchStrains = async (
  sort: string = "name",
  page: number = 1,
  limit: number = 20 // Show 20 strains per page
): Promise<{ strains: Strain[]; total: number }> => {
  try {
    // Calculate pagination range
    const from = (page - 1) * limit;
    const to = from + (limit - 1);
    
    // Build query
    let query = supabase
      .from("strains")
      .select("*", { count: "exact" })
      .range(from, to);
    
    // Apply sorting
    if (sort === "name") {
      query = query.order("name", { ascending: true });
    } else if (sort === "thc") {
      query = query.order("thc_level", { ascending: false });
    }
    
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
      
      // Add top effect if available
      if (item.top_effect) {
        effects.push({
          effect: item.top_effect,
          intensity: safeParsePercent(item.highest_percent || 0),
        });
      }
      
      // Parse effects
      try {
        // Some strains have effects_json as a JSON string
        if (item.effects_json && typeof item.effects_json === 'string') {
          let parsedEffects;
          try {
            parsedEffects = JSON.parse(item.effects_json);
            
            // Handle different formats
            if (Array.isArray(parsedEffects)) {
              parsedEffects.forEach((effect: any) => {
                if (effect.name && effect.score) {
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
                if (typeof value === 'number') {
                  effects.push({
                    effect: key,
                    intensity: Math.round(Number(value) * 100)
                  });
                }
              }
            }
          } catch (e) {
            // Parse individual effects from non-JSON fields
            const effectsRawData = [
              item.top_effect ? `${item.top_effect}: ${safeParsePercent(item.highest_percent)}%` : null,
              item.second_effect ? `${item.second_effect}: ${safeParsePercent(item.highest_percent || 0)}%` : null, 
              item.third_effect ? `${item.third_effect}: ${safeParsePercent(item.highest_percent || 0)}%` : null
            ].filter(Boolean);
          }
        }
      } catch (e) {
        console.error("Error parsing effects for strain:", item.name, e);
      }
      
      // Add second effect if available - fixed property names
      if (item.second_effect) {
        effects.push({ 
          effect: item.second_effect, 
          intensity: safeParsePercent(item.highest_percent || 0)
        });
      }
      
      // Add third effect if available
      if (item.third_effect) {
        effects.push({ 
          effect: item.third_effect,
          intensity: safeParsePercent(item.highest_percent || 0)
        });
      }

      // Create strain object
      return {
        id: item.unique_identifier || `strain-${Math.random().toString(36).substring(2, 9)}`,
        name: item.name || "Unknown Strain",
        type: (item.type as 'Indica' | 'Sativa' | 'Hybrid') || 'Hybrid',
        img_url: item.img_url || null,
        thc_level: thcLevel,
        description: item.description || null,
        effects: effects,
        most_common_terpene: item.most_common_terpene || null,
      };
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
 * Fetch a specific strain by ID
 */
export const fetchStrainById = async (id: string): Promise<Strain | null> => {
  try {
    const { data, error } = await supabase
      .from("strains")
      .select("*")
      .eq("unique_identifier", id)
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    if (!data) {
      return null;
    }
    
    // Extract effects
    let effects: StrainEffect[] = [];
    
    // Add top effect if available
    if (data.top_effect) {
      effects.push({
        effect: data.top_effect,
        intensity: safeParsePercent(data.highest_percent || 0),
      });
    }
    
    // Add second effect if available - fixed property names
    if (data.second_effect) {
      effects.push({ 
        effect: data.second_effect, 
        intensity: safeParsePercent(data.highest_percent || 0)
      });
    }
    
    // Add third effect if available
    if (data.third_effect) {
      effects.push({ 
        effect: data.third_effect,
        intensity: safeParsePercent(data.highest_percent || 0)
      });
    }
    
    // Try to parse effects from JSON
    try {
      if (data.effects_json && typeof data.effects_json === 'string') {
        const parsedEffects = JSON.parse(data.effects_json);
        
        if (Array.isArray(parsedEffects)) {
          parsedEffects.forEach((effect: any) => {
            if (effect.name && effect.score) {
              effects.push({
                effect: effect.name,
                intensity: Math.round(effect.score * 100)
              });
            }
          });
        } else if (typeof parsedEffects === 'object') {
          for (const [key, value] of Object.entries(parsedEffects)) {
            if (typeof value === 'number') {
              effects.push({
                effect: key,
                intensity: Math.round(Number(value) * 100)
              });
            }
          }
        }
      }
    } catch (e) {
      console.warn("Could not parse effects_json", e);
    }
    
    // Create strain object
    const thcLevel = extractThcLevel(data);
    
    return {
      id: data.unique_identifier || `strain-${Math.random().toString(36).substring(2, 9)}`,
      name: data.name || "Unknown Strain",
      type: (data.type as 'Indica' | 'Sativa' | 'Hybrid') || 'Hybrid',
      img_url: data.img_url || null,
      thc_level: thcLevel,
      description: data.description || null,
      effects: effects,
      most_common_terpene: data.most_common_terpene || null,
    };
  } catch (error) {
    console.error("Error fetching strain:", error);
    throw error;
  }
};

