
import { supabase } from "@/integrations/supabase/client";
import { Strain } from "@/types/strain";

export interface RawStrainData {
  [key: string]: any;
}

/**
 * Function to check if data is a Strain array
 */
function isStrainArray(data: unknown): data is Strain[] {
  return Array.isArray(data) && data.every(item => 
    typeof item === 'object' && 
    item !== null && 
    'name' in item
  );
}

/**
 * Basic fetch function with no transformations to debug raw data
 */
export const fetchRawStrains = async () => {
  try {
    console.log('[DEBUG] Starting raw strain fetch');
    
    const { data, error } = await supabase
      .from('strains')
      .select('*')
      .limit(10);
    
    console.log('[DEBUG] Raw strain fetch results:', { 
      success: !error,
      recordCount: data ? data.length : 0,
      firstRecord: data && data.length > 0 ? data[0] : null,
      error
    });
    
    if (error) {
      console.error('[DEBUG] Raw fetch error:', error);
      return { success: false, data: null, error };
    }

    return { success: true, data, error: null };
  } catch (e) {
    console.error('[DEBUG] Exception in raw fetch:', e);
    return { success: false, data: null, error: e };
  }
};

/**
 * Tests direct SQL query to verify database connectivity
 */
export const testDirectQuery = async () => {
  try {
    console.log('[DEBUG] Testing direct query');
    
    // Using proper typing for the function call
    const { data, error } = await supabase.rpc('get_strain_count');
    
    console.log('[DEBUG] Direct query result:', { data, error });
    
    return { success: !error, data, error };
  } catch (e) {
    console.error('[DEBUG] Exception in direct query:', e);
    return { success: false, data: null, error: e };
  }
};

/**
 * Gets the version of the Supabase client
 */
export const getSupabaseInfo = () => {
  return {
    url: 'Using Supabase client',
    clientVersion: '@supabase/supabase-js',
    timestamp: new Date().toISOString()
  };
};
