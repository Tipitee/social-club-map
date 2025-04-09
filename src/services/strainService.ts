
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
 * Fetches strains from Supabase with sorting and detailed logging
 */
export const fetchStrains = async (sort: 'name' | 'thc_high' | 'thc_low' = 'name'): Promise<Strain[]> => {
  try {
    console.log('[DEBUG] Starting strain fetch with sort:', sort);
    // Use a safer way to access the URL
    const supabaseUrl = supabase.getUrl() || 'https://default-url.supabase.co';
    console.log('[DEBUG] Supabase URL being used:', supabaseUrl);
    
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
    
    // Log the query we're about to make
    console.log('[DEBUG] Executing strain query with params:', { column, ascending });
    
    // Execute the query with full logging
    const { data, error } = await supabase
      .from('strains')
      .select('*')
      .order(column, { ascending });
    
    // Enhanced error handling with detailed logs
    if (error) {
      console.error('[DEBUG] Supabase query error:', error);
      console.error('[DEBUG] Error code:', error.code);
      console.error('[DEBUG] Error message:', error.message);
      console.error('[DEBUG] Error details:', error.details);
      throw new StrainServiceError(`Error fetching strains: ${error.message}`, error);
    }

    // Check for null or empty data with detailed logging
    if (!data) {
      console.log('[DEBUG] No data returned from Supabase');
      return [];
    }

    // Log the raw response
    console.log('[DEBUG] Raw data from Supabase:', {
      count: data.length,
      columns: data.length > 0 ? Object.keys(data[0]) : [],
      firstItem: data.length > 0 ? JSON.stringify(data[0]) : null,
      hasNullNames: data.some(item => !item.name)
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
      
      // Log individual item transformation for debugging
      console.log(`[DEBUG] Transforming item: ${name}`, {
        raw_thc: item.thc_level,
        parsed_thc: thcLevel,
        effects: [
          item.top_effect ? `${item.top_effect}: ${safeParsePercent(item.top_percent)}%` : null,
          item.second_effect ? `${item.second_effect}: ${safeParsePercent(item.second_percent)}%` : null, 
          item.third_effect ? `${item.third_effect}: ${safeParsePercent(item.third_percent)}%` : null
        ].filter(Boolean)
      });
      
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
 * Tests the connection to the strains table with proper count and detailed logging
 */
export const testStrainsConnection = async (): Promise<HealthCheckResult> => {
  try {
    console.log('[DEBUG] Testing strains connection');
    
    // Using count to get exact count of records
    const { count, error } = await supabase
      .from('strains')
      .select('*', { count: 'exact', head: true });
    
    console.log('[DEBUG] Count query result:', { count, error });
    
    if (error) {
      console.error('[DEBUG] Connection test error:', error);
      console.error('[DEBUG] Error details:', { code: error.code, details: error.details });
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
    
    console.log('[DEBUG] Sample query result:', { data: sampleData, error: sampleError });
    
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

// Helper functions with added logging
export const getAllEffects = async (): Promise<string[]> => {
  try {
    console.log('[DEBUG] Getting all effects');
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
    
    const effects = Array.from(effectsSet).sort();
    console.log('[DEBUG] Found effects:', effects);
    
    return effects;
  } catch (error) {
    console.error('[DEBUG] Error getting effects:', error);
    throw new StrainServiceError('Error getting effects', error);
  }
};

export const getTerpenes = async (): Promise<string[]> => {
  try {
    console.log('[DEBUG] Getting all terpenes');
    const strains = await fetchStrains();
    const terpenesSet = new Set<string>();
    
    strains.forEach(strain => {
      if (strain.most_common_terpene) {
        terpenesSet.add(strain.most_common_terpene);
      }
    });
    
    const terpenes = Array.from(terpenesSet).sort();
    console.log('[DEBUG] Found terpenes:', terpenes);
    
    return terpenes;
  } catch (error) {
    console.error('[DEBUG] Error getting terpenes:', error);
    throw new StrainServiceError('Error getting terpenes', error);
  }
};
