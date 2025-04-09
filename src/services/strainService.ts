import { Strain, StrainEffect } from "../types/strain";
import { supabase } from "@/integrations/supabase/client";

class StrainServiceError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = "StrainServiceError";
  }
}

/**
 * Result type for health check operations
 */
export interface HealthCheckResult {
  success: boolean;
  message: string;
  count?: number;
}

/**
 * Fetches strains from Supabase with sorting
 */
export const fetchStrains = async (sort: 'name' | 'thc_high' | 'thc_low' = 'name'): Promise<Strain[]> => {
  try {
    console.log('[DEBUG] Starting strain fetch with sort:', sort);
    
    // Determine sort order
    let column = 'name';
    let ascending = true;
    
    if (sort === 'thc_high') {
      column = 'thc_level';
      ascending = false;
    } else if (sort === 'thc_low') {
      column = 'thc_level';
      ascending = true;
    }
    
    const { data, error } = await supabase
      .from('strains')
      .select('*')
      .order(column, { ascending });
    
    if (error) {
      console.error('[DEBUG] Supabase error:', error);
      throw new StrainServiceError(`Error fetching strains: ${error.message}`, error);
    }

    if (!data) {
      console.log('[DEBUG] No data returned from Supabase');
      return [];
    }

    console.log('[DEBUG] Raw data from Supabase (first item):', data.length > 0 ? data[0] : 'No items');
    
    // Transform the data to match our Strain type
    return data.map(item => {
      // Parse THC level from string to number if needed
      let thcLevel = null;
      if (item.thc_level !== null) {
        thcLevel = typeof item.thc_level === 'string' 
          ? parseFloat(item.thc_level) 
          : item.thc_level;
      }

      // Create effects array from individual effect fields
      const effects: StrainEffect[] = [];
      if (item.top_effect && item.top_percent) {
        effects.push({ 
          effect: item.top_effect, 
          intensity: typeof item.top_percent === 'string' 
            ? parseInt(item.top_percent, 10) || 0 
            : item.top_percent || 0 
        });
      }
      
      if (item.second_effect && item.second_percent) {
        effects.push({ 
          effect: item.second_effect, 
          intensity: typeof item.second_percent === 'string' 
            ? parseInt(item.second_percent, 10) || 0 
            : item.second_percent || 0 
        });
      }
      
      if (item.third_effect && item.third_percent) {
        effects.push({ 
          effect: item.third_effect, 
          intensity: typeof item.third_percent === 'string' 
            ? parseInt(item.third_percent, 10) || 0 
            : item.third_percent || 0 
        });
      }

      return {
        id: item.name ? item.name.toLowerCase().replace(/\s+/g, '-') : crypto.randomUUID(),
        name: item.name,
        img_url: item.img_url,
        type: item.type as 'Indica' | 'Sativa' | 'Hybrid',
        thc_level: thcLevel,
        most_common_terpene: item.most_common_terpene,
        description: item.description,
        effects: effects
      };
    });
  } catch (error) {
    console.error('[DEBUG] Error in fetchStrains:', error);
    if (error instanceof StrainServiceError) {
      throw error;
    }
    throw new StrainServiceError('Error in fetchStrains', error);
  }
};

/**
 * Tests the connection to the strains table with proper count
 */
export const testStrainsConnection = async (): Promise<HealthCheckResult> => {
  try {
    console.log('[DEBUG] Testing strains connection');
    // Use count: 'exact' to get the actual count of records
    const { data, error, count } = await supabase
      .from('strains')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('[DEBUG] Connection test error:', error);
      return {
        success: false,
        message: `Connection failed: ${error.message}`
      };
    }
    
    console.log('[DEBUG] Connection test successful, count:', count);
    return {
      success: true,
      message: 'Connection successful',
      count: count || 0
    };
  } catch (error) {
    console.error('[DEBUG] Connection test exception:', error);
    return {
      success: false,
      message: `Connection test error: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

export const getAllEffects = async (): Promise<string[]> => {
  try {
    const strains = await fetchStrains();
    const effectsSet = new Set<string>();
    
    strains.forEach(strain => {
      strain.effects.forEach(effect => {
        if (effect.effect && effect.intensity > 0) {
          effectsSet.add(effect.effect);
        }
      });
    });
    
    return Array.from(effectsSet).sort();
  } catch (error) {
    console.error('Error getting effects:', error);
    throw new StrainServiceError('Error getting effects', error);
  }
};

export const getTerpenes = async (): Promise<string[]> => {
  try {
    const strains = await fetchStrains();
    const terpenesSet = new Set<string>();
    
    strains.forEach(strain => {
      if (strain.most_common_terpene) {
        terpenesSet.add(strain.most_common_terpene);
      }
    });
    
    return Array.from(terpenesSet).sort();
  } catch (error) {
    console.error('Error getting terpenes:', error);
    throw new StrainServiceError('Error getting terpenes', error);
  }
};
