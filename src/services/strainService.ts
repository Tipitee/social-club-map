
import { Strain, StrainEffect } from "../types/strain";
import { supabase } from "@/integrations/supabase/client";

class StrainServiceError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = "StrainServiceError";
  }
}

/**
 * Fetches strains from Supabase with sorting
 */
export const fetchStrains = async (sort: 'name' | 'thc_high' | 'thc_low' = 'name'): Promise<Strain[]> => {
  try {
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
      throw new StrainServiceError(`Error fetching strains: ${error.message}`, error);
    }

    if (!data) {
      return [];
    }

    // Transform the data to match our Strain type
    return data.map(item => ({
      id: item.name ? item.name.toLowerCase().replace(/\s+/g, '-') : crypto.randomUUID(),
      name: item.name,
      img_url: item.img_url,
      type: item.type as 'Indica' | 'Sativa' | 'Hybrid',
      thc_level: parseFloat(item.thc_level) || null,
      most_common_terpene: item.most_common_terpene,
      description: item.description,
      effects: [
        { effect: item.top_effect, intensity: parseInt(item.top_percent) || 0 },
        { effect: item.second_effect, intensity: parseInt(item.second_percent) || 0 },
        { effect: item.third_effect, intensity: parseInt(item.third_percent) || 0 }
      ].filter(e => e.effect && e.intensity > 0) as StrainEffect[]
    }));
  } catch (error) {
    if (error instanceof StrainServiceError) {
      throw error;
    }
    throw new StrainServiceError('Error in fetchStrains', error);
  }
};

/**
 * Tests the connection to the strains table
 */
export const testStrainsConnection = async (): Promise<{
  success: boolean;
  message: string;
  count?: number;
}> => {
  try {
    const { data, error, count } = await supabase
      .from('strains')
      .select('*', { count: 'exact' })
      .limit(1);
    
    if (error) {
      return {
        success: false,
        message: `Connection failed: ${error.message}`
      };
    }
    
    return {
      success: true,
      message: 'Connection successful',
      count: count || 0
    };
  } catch (error) {
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
