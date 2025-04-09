
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
    
    // Execute the query with full logging
    console.log('[DEBUG] Executing strain query with params:', { column, ascending });
    const { data, error } = await supabase
      .from('strains')
      .select('*')
      .order(column, { ascending });
    
    // Enhanced error handling
    if (error) {
      console.error('[DEBUG] Supabase query error:', error);
      throw new StrainServiceError(`Error fetching strains: ${error.message}`, error);
    }

    // Check for null or empty data
    if (!data) {
      console.log('[DEBUG] No data returned from Supabase');
      return [];
    }

    // Log the raw response
    console.log('[DEBUG] Raw data from Supabase:', {
      count: data.length,
      firstItem: data.length > 0 ? data[0] : null
    });
    
    // Transform the data to match our Strain type with safe parsing
    const transformedStrains = data.map(item => {
      // Handle missing name by generating a unique ID
      const name = item.name || 'Unknown Strain';
      const id = name.toLowerCase().replace(/\s+/g, '-');
      
      // Parse THC level safely - handle both string and number types
      let thcLevel: number | null = null;
      if (item.thc_level !== null && item.thc_level !== undefined) {
        thcLevel = typeof item.thc_level === 'string' 
          ? parseFloat(item.thc_level) || null  // Convert string to number or null if NaN
          : typeof item.thc_level === 'number' 
            ? item.thc_level 
            : null;
      }

      // Helper function to safely parse percentage values
      const safeParsePercent = (value: string | number | null | undefined): number => {
        if (value === null || value === undefined) return 0;
        if (typeof value === 'string') {
          // Try to parse as integer first
          const parsedInt = parseInt(value, 10);
          if (!isNaN(parsedInt)) return parsedInt;
          
          // If that fails, try parsing as float
          const parsedFloat = parseFloat(value);
          return isNaN(parsedFloat) ? 0 : parsedFloat;
        }
        return typeof value === 'number' ? value : 0;
      };
      
      // Safely create effects array from individual effect fields
      const effects: StrainEffect[] = [];
      
      // Add effects only if they exist
      if (item.top_effect) {
        effects.push({ 
          effect: item.top_effect, 
          intensity: safeParsePercent(item.top_percent)
        });
      }
      
      if (item.second_effect) {
        effects.push({ 
          effect: item.second_effect, 
          intensity: safeParsePercent(item.second_percent)
        });
      }
      
      if (item.third_effect) {
        effects.push({ 
          effect: item.third_effect,
          intensity: safeParsePercent(item.third_percent)
        });
      }

      // Create the strain object with safe defaults
      return {
        id: id || crypto.randomUUID(), // Ensure we always have an ID
        name,
        img_url: item.img_url || null,
        type: (item.type || 'Hybrid') as 'Indica' | 'Sativa' | 'Hybrid',
        thc_level: thcLevel,
        most_common_terpene: item.most_common_terpene || null,
        description: item.description || null,
        effects
      };
    });
    
    console.log('[DEBUG] Transformed strains:', {
      count: transformedStrains.length,
      firstItem: transformedStrains.length > 0 ? transformedStrains[0] : null
    });
    
    return transformedStrains;
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
    
    // Using count to get exact count of records
    const { count, error } = await supabase
      .from('strains')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('[DEBUG] Connection test error:', error);
      return {
        success: false,
        message: `Connection failed: ${error.message}`,
        count: 0
      };
    }
    
    // Additional validation query to make sure we can actually fetch data
    const { data: sampleData, error: sampleError } = await supabase
      .from('strains')
      .select('name')
      .limit(1);
      
    const recordsExist = Array.isArray(sampleData) && sampleData.length > 0;
    
    console.log('[DEBUG] Connection test results:', { 
      count, 
      error,
      sampleQuery: {
        success: !sampleError,
        recordsExist,
        error: sampleError
      }
    });
    
    if (sampleError) {
      return {
        success: false,
        message: `Connection successful but data fetch failed: ${sampleError.message}`,
        count: count || 0
      };
    }
    
    return {
      success: true,
      message: `Connection successful${recordsExist ? ' with data' : ''}`,
      count: count || 0
    };
  } catch (error) {
    console.error('[DEBUG] Connection test exception:', error);
    return {
      success: false,
      message: `Connection test error: ${error instanceof Error ? error.message : String(error)}`,
      count: 0
    };
  }
};

// Helper functions
export const getAllEffects = async (): Promise<string[]> => {
  try {
    const strains = await fetchStrains();
    const effectsSet = new Set<string>();
    
    strains.forEach(strain => {
      if (strain.effects && Array.isArray(strain.effects)) {
        strain.effects.forEach(effect => {
          if (effect && effect.effect && effect.intensity > 0) {
            effectsSet.add(effect.effect);
          }
        });
      }
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
