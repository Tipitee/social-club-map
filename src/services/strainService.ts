import { supabase } from "@/integrations/supabase/client";
import { Strain, StrainFilters } from "@/types/strain";
import { toast } from "@/components/ui/use-toast";

/**
 * Custom error class for strain service errors
 */
export class StrainServiceError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = "StrainServiceError";
  }
}

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

/**
 * Helper function to transform raw DB data to Strain objects
 * @param data Raw data from database
 * @returns Properly formatted Strain objects
 */
const transformStrainData = (data: any[]): Strain[] => {
  return data.map(item => {
    // Extract effect data
    const effects = [];
    
    // Add top effect if available
    if (item.top_effect && item.top_percent) {
      effects.push({
        effect: item.top_effect,
        intensity: parseFloat(item.top_percent) || 0
      });
    }
    
    // Add second effect if available
    if (item.second_effect && item.second_percent) {
      effects.push({
        effect: item.second_effect,
        intensity: parseFloat(item.second_percent) || 0
      });
    }
    
    // Add third effect if available
    if (item.third_effect && item.third_percent) {
      effects.push({
        effect: item.third_effect,
        intensity: parseFloat(item.third_percent) || 0
      });
    }
    
    // Create properly structured Strain object
    return {
      id: item.id || String(Math.random()),
      name: item.name,
      img_url: item.img_url,
      type: (item.type as 'Indica' | 'Sativa' | 'Hybrid') || 'Hybrid',
      thc_level: item.thc_level ? parseFloat(item.thc_level) : null,
      most_common_terpene: item.most_common_terpene,
      description: item.description,
      effects: effects,
    };
  });
};

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
    
    // Prioritize strains with images when sorting by name
    if (sort === 'name') {
      // First query to get strains with images
      const { data: dataWithImages, error: errorWithImages } = await query
        .not('img_url', 'is', null)
        .range((page - 1) * limit, page * limit - 1);
        
      // Second query to get strains without images if needed
      let dataWithoutImages: any[] = [];
      let remainingCount = 0;
      
      if (errorWithImages) {
        throw new StrainServiceError("Failed to fetch strains with images", errorWithImages);
      }
      
      const withImagesCount = dataWithImages?.length || 0;
      
      if (withImagesCount < limit) {
        remainingCount = limit - withImagesCount;
        const { data: remaining, error: errorNoImages } = await supabase
          .from('strains')
          .select('*')
          .is('img_url', null)
          .order('name')
          .range(0, remainingCount - 1);
          
        if (errorNoImages) {
          throw new StrainServiceError("Failed to fetch strains without images", errorNoImages);
        }
        
        dataWithoutImages = remaining || [];
      }
      
      return { 
        strains: transformStrainData([...(dataWithImages || []), ...dataWithoutImages]), 
        total: count || 0 
      };
    } else {
      // Regular pagination for non-name sorts
      const { data, error } = await query
        .range((page - 1) * limit, page * limit - 1);
        
      if (error) {
        throw new StrainServiceError("Failed to fetch strains", error);
      }
      
      return { strains: transformStrainData(data || []), total: count || 0 };
    }
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
    
    return data ? transformStrainData([data])[0] : null;
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
    const { data, error } = await supabase.rpc('get_distinct_effects');
    
    if (error) {
      throw new StrainServiceError("Failed to fetch effects", error);
    }
    
    return data || [];
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
    const { data, error } = await supabase.rpc('get_distinct_terpenes');
    
    if (error) {
      throw new StrainServiceError("Failed to fetch terpenes", error);
    }
    
    return data || [];
  } catch (error) {
    console.error("Error fetching terpenes:", error);
    return [];
  }
};
