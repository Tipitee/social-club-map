
import { supabase } from "@/integrations/supabase/client";
import { Strain } from "@/types/strain";

export interface RawStrainData {
  [key: string]: any;
}

/**
 * Type guard to check if a value is a Strain object
 * @param value - Any value that needs validation as a Strain
 * @returns Boolean indicating if the value is a Strain object
 */
function isValidStrain(value: unknown): value is Strain {
  return typeof value === 'object' && 
         value !== null &&
         'name' in value && 
         typeof (value as any).name === 'string';
}

/**
 * Function to check if data is a Strain array
 * @param data - Any data that needs validation
 * @returns Boolean indicating if the data is a Strain array
 */
function isStrainArray(data: unknown): data is Strain[] {
  return Array.isArray(data) && 
         data.every(item => isValidStrain(item));
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

    // Validate data shape
    if (!Array.isArray(data)) {
      console.error('[DEBUG] Invalid data format, expected array:', data);
      return { success: false, data: null, error: new Error('Invalid data format') };
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
 * Safely parses and validates JSON string as Strain data
 * @param jsonString - JSON string to parse
 * @returns Validated Strain array or null if invalid
 */
export const parseStrainData = (jsonString: string): Strain[] | null => {
  try {
    // Add explicit type assertion to unknown first
    const parsedData = JSON.parse(jsonString) as unknown;
    
    if (isStrainArray(parsedData)) {
      console.log('[DEBUG] Successfully parsed and validated strain data');
      return parsedData;
    } else {
      console.error('[DEBUG] Data failed strain array validation:', parsedData);
      return null;
    }
  } catch (e) {
    console.error('[DEBUG] JSON parse error:', e);
    return null;
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
