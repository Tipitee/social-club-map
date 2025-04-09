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

// Define a simpler type for internal use to avoid recursive type issues
type RawStrainData = {
  id?: string;
  name: string;
  img_url?: string | null;
  type?: string;
  thc_level?: number | null;
  most_common_terpene?: string | null;
  description?: string | null;
  top_effect?: string | null;
  top_percent?: string | null;
  second_effect?: string | null;
  second_percent?: string | null;
  third_effect?: string | null;
  third_percent?: string | null;
  [key: string]: any;
};

/**
 * Helper function to transform raw DB data to Strain objects
 * @param data Raw data from database
 * @returns Properly formatted Strain objects
 */
const transformStrainData = (data: RawStrainData[]): Strain[] => {
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
      thc_level: item.thc_level ? parseFloat(String(item.thc_level)) : null,
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
    
    return { 
      strains: transformStrainData(allStrains as RawStrainData[]), 
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
    
    return data ? transformStrainData([data as RawStrainData])[0] : null;
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
