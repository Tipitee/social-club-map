
import { supabase } from "@/integrations/supabase/client";
import { Strain } from "@/types/strain";
import { transformStrainData } from "./transformers";
import { StrainServiceError } from "./errors";
import { strainInsertSchema, StrainInsertData } from "./validation";
import { z } from "zod";

/**
 * Result type for API operations
 */
export interface Result<T> {
  success: boolean;
  data?: T;
  error?: Error;
}

/**
 * Fetches strains with optional sorting, pagination, and filtering
 */
export const fetchStrains = async (
  sort: 'name' | 'thc_high' | 'thc_low' = 'name',
  page: number = 1,
  limit: number = 20
): Promise<{ strains: Strain[], total: number }> => {
  try {
    console.log(`Fetching strains with sort: ${sort}, page: ${page}, limit: ${limit}`);
    
    // Get connection info without accessing protected properties
    console.log("Using Supabase connection");
    
    // Get total count first
    const { count, error: countError } = await supabase
      .from('strains')
      .select('*', { count: 'exact', head: true });
      
    if (countError) {
      throw new StrainServiceError("Failed to get strain count", countError);
    }
    
    // Build query for actual data
    let query = supabase.from('strains').select('*');
    
    // Apply sorting
    if (sort === 'name') {
      query = query.order('name', { ascending: true });
    } else if (sort === 'thc_high') {
      query = query.order('thc_level', { ascending: false });
    } else if (sort === 'thc_low') {
      query = query.order('thc_level', { ascending: true });
    }
    
    // First get strains with images
    const { data: dataWithImages, error: errorWithImages } = await query
      .not('img_url', 'is', null)
      .range((page - 1) * limit, page * limit - 1);
      
    if (errorWithImages) {
      throw new StrainServiceError("Failed to fetch strains with images", errorWithImages);
    }
    
    const withImagesCount = dataWithImages?.length || 0;
    
    // Then get strains with THC levels but no images
    let dataWithThc: any[] = [];
    if (withImagesCount < limit) {
      const remainingForThc = limit - withImagesCount;
      
      const { data: remaining, error: errorThc } = await supabase
        .from('strains')
        .select('*')
        .is('img_url', null)
        .not('thc_level', 'is', null)
        .order('thc_level', { ascending: false })
        .range(0, remainingForThc - 1);
        
      if (errorThc) {
        throw new StrainServiceError("Failed to fetch strains with THC data", errorThc);
      }
      
      dataWithThc = remaining || [];
    }
    
    // Finally get remaining strains
    let remainingStrains: any[] = [];
    const totalWithPriority = withImagesCount + (dataWithThc?.length || 0);
    
    if (totalWithPriority < limit) {
      const finalRemaining = limit - totalWithPriority;
      
      const { data: others, error: errorOthers } = await supabase
        .from('strains')
        .select('*')
        .is('img_url', null)
        .is('thc_level', null)
        .order('name')
        .range(0, finalRemaining - 1);
        
      if (errorOthers) {
        throw new StrainServiceError("Failed to fetch remaining strains", errorOthers);
      }
      
      remainingStrains = others || [];
    }
    
    // Combine all results
    const allStrains = [
      ...(dataWithImages || []), 
      ...(dataWithThc || []),
      ...(remainingStrains || [])
    ];
    
    // Transform the data - filter out any invalid entries
    const transformedStrains = transformStrainData(allStrains.filter(strain => strain !== null));
    
    return { 
      strains: transformedStrains, 
      total: count || 0 
    };
  } catch (error) {
    console.error("Strain fetch error:", error);
    throw error instanceof StrainServiceError 
      ? error 
      : new StrainServiceError("Failed to fetch strains", error);
  }
};

/**
 * Fetch a single strain by ID
 */
export const fetchStrainById = async (id: string): Promise<Strain | null> => {
  try {
    const { data, error } = await supabase
      .from('strains')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      throw new StrainServiceError(`Failed to fetch strain with ID ${id}`, error);
    }
    
    if (!data) {
      return null;
    }
    
    // Validate required fields
    if (!data.name) {
      console.error(`Invalid strain data for ID ${id}, missing name:`, data);
      // Use a default name to prevent null constraint violations
      data.name = "Unknown Strain";
    }
    
    // Cast to any to avoid type issues, then transform
    const transformedData = transformStrainData([data as any]);
    return transformedData[0] || null;
  } catch (error) {
    console.error(`Error fetching strain ${id}:`, error);
    throw error instanceof StrainServiceError 
      ? error 
      : new StrainServiceError(`Failed to fetch strain with ID ${id}`, error);
  }
};

/**
 * Get a list of all available effects
 */
export const getAllEffects = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('strains')
      .select('top_effect, second_effect, third_effect');
    
    if (error) {
      throw new StrainServiceError("Failed to fetch effects", error);
    }
    
    // Extract all effects and remove duplicates
    const effectSet = new Set<string>();
    
    data?.forEach(strain => {
      if (strain.top_effect) effectSet.add(strain.top_effect);
      if (strain.second_effect) effectSet.add(strain.second_effect);
      if (strain.third_effect) effectSet.add(strain.third_effect);
    });
    
    // Convert to array, filter out nulls and empty strings, and sort
    return Array.from(effectSet)
      .filter(effect => effect && effect.trim() !== '')
      .sort();
  } catch (error) {
    console.error("Error fetching effects:", error);
    return [];
  }
};

/**
 * Get a list of all available terpenes
 */
export const getTerpenes = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('strains')
      .select('most_common_terpene');
    
    if (error) {
      throw new StrainServiceError("Failed to fetch terpenes", error);
    }
    
    // Extract terpenes and remove duplicates
    const terpeneSet = new Set<string>();
    
    data?.forEach(strain => {
      if (strain.most_common_terpene) {
        terpeneSet.add(strain.most_common_terpene);
      }
    });
    
    // Convert to array, filter out nulls and empty strings, and sort
    return Array.from(terpeneSet)
      .filter(terpene => terpene && terpene.trim() !== '')
      .sort();
  } catch (error) {
    console.error("Error fetching terpenes:", error);
    return [];
  }
};

/**
 * Create or update a strain
 * - Handles data validation
 * - Ensures required fields are present
 */
export const upsertStrain = async (strainData: Partial<Strain>): Promise<Result<Strain>> => {
  try {
    // Validate the strain data
    try {
      // Ensure name is present
      if (!strainData.name || strainData.name.trim() === '') {
        throw new Error("Strain name is required");
      }
      
      // Extract ID separately (don't include it in insertData)
      const strainId = strainData.id;
      
      // Fix: Simplify the data structure to avoid deep instantiation issues
      const effects = strainData.effects || [];
      
      // Prepare the data for insertion - explicitly define each field without recursive references
      const insertData: StrainInsertData = {
        name: strainData.name,
        type: strainData.type || 'Hybrid',
        thc_level: strainData.thc_level || null,
        img_url: strainData.img_url || null,
        description: strainData.description || null,
        most_common_terpene: strainData.most_common_terpene || null,
        top_effect: effects.length > 0 ? effects[0].effect : null
      };
      
      // Validate with Zod
      strainInsertSchema.parse(insertData);
      
      // Explicitly define effects-related fields to avoid recursion
      const effectsData = {
        top_effect: effects.length > 0 ? effects[0].effect : null,
        top_percent: effects.length > 0 ? String(effects[0].intensity) : null,
        second_effect: effects.length > 1 ? effects[1].effect : null,
        second_percent: effects.length > 1 ? String(effects[1].intensity) : null,
        third_effect: effects.length > 2 ? effects[2].effect : null,
        third_percent: effects.length > 2 ? String(effects[2].intensity) : null
      };
      
      // Combine basic data with effects data
      const fullInsertData = {
        ...insertData,
        ...effectsData
      };
      
      let result;
      
      // Insert or update the strain
      if (strainId) {
        // Update existing strain
        const { data, error } = await supabase
          .from('strains')
          .update(fullInsertData)
          .eq('id', strainId)
          .select()
          .single();
          
        if (error) {
          throw new StrainServiceError(`Failed to update strain: ${error.message}`, error);
        }
        
        result = data;
      } else {
        // Insert new strain
        const { data, error } = await supabase
          .from('strains')
          .insert(fullInsertData)
          .select()
          .single();
          
        if (error) {
          throw new StrainServiceError(`Failed to insert strain: ${error.message}`, error);
        }
        
        result = data;
      }
      
      if (!result) {
        throw new StrainServiceError("No data returned from strain operation");
      }
      
      // Transform the returned data
      const transformedData = transformStrainData([result]);
      return { success: true, data: transformedData[0] };
      
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        const errors = validationError.errors.map(e => e.message).join(", ");
        throw new Error(`Validation error: ${errors}`);
      }
      throw validationError;
    }
  } catch (error) {
    console.error("Error saving strain:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error saving strain";
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error(errorMessage) 
    };
  }
};

/**
 * Test connection to strains table and return count
 * @returns Result object with success status, message and count
 */
export const testStrainsConnection = async () => {
  try {
    console.log('[DEBUG] Testing strains connection');
    
    const { count, error } = await supabase
      .from('strains')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('[DEBUG] Strains connection test failed:', error);
      return { 
        success: false, 
        message: `Database connection error: ${error.message}`,
        count: 0
      };
    }
    
    return { 
      success: true, 
      message: count && count > 0 ? 
        `Successfully connected to strains table (${count} records)` : 
        'Connected to strains table but no records found',
      count: count || 0
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    console.error('[DEBUG] Strains connection test exception:', e);
    return { 
      success: false, 
      message: `Exception testing strains connection: ${errorMessage}`,
      count: 0
    };
  }
};
