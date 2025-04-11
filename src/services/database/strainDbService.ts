
import { supabase } from "@/integrations/supabase/client";
import { extractEffects } from "../utils/effectsParser";
import { createStrainId, extractThcLevel } from "../utils/parseUtils";
import { Strain, FetchStrainsResult } from "@/types/strain";

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
