
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

    console.log('[DEBUG] Raw data from Supabase, count:', data.length);
    if (data.length > 0) {
      console.log('[DEBUG] First item sample:', JSON.stringify(data[0]));
    } else {
      console.log('[DEBUG] No items returned from Supabase');
    }
    
    // Transform the data to match our Strain type with safe parsing
    return data.map(item => {
      // Parse THC level safely
      let thcLevel = null;
      if (item.thc_level !== null && item.thc_level !== undefined) {
        thcLevel = typeof item.thc_level === 'string' 
          ? parseFloat(item.thc_level) || null
          : typeof item.thc_level === 'number' ? item.thc_level : null;
      }

      // Helper function to safely parse percentage values
      const safeParsePercent = (value: string | number | null | undefined): number => {
        if (value === null || value === undefined) return 0;
        const parsed = typeof value === 'string' ? parseInt(value, 10) : value;
        return isNaN(parsed) ? 0 : parsed;
      };
      
      // Safely create effects array from individual effect fields
      const effects: StrainEffect[] = [];
      
      // Safely add top effect if both name and percent exist
      if (item.top_effect) {
        effects.push({ 
          effect: item.top_effect, 
          intensity: safeParsePercent(item.top_percent)
        });
      }
      
      // Safely add second effect if it exists
      if (item.second_effect) {
        effects.push({ 
          effect: item.second_effect, 
          intensity: safeParsePercent(item.second_percent)
        });
      }
      
      // Safely add third effect if it exists
      if (item.third_effect) {
        effects.push({ 
          effect: item.third_effect,
          intensity: safeParsePercent(item.third_percent)
        });
      }

      return {
        id: item.name ? item.name.toLowerCase().replace(/\s+/g, '-') : crypto.randomUUID(),
        name: item.name || 'Unknown Strain',
        img_url: item.img_url,
        type: (item.type || 'Hybrid') as 'Indica' | 'Sativa' | 'Hybrid',
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
    const { count, error } = await supabase
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
