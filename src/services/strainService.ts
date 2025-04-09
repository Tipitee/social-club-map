
import { Strain } from "../types/strain";
import { supabase } from "@/integrations/supabase/client";

export const fetchStrains = async (): Promise<Strain[]> => {
  try {
    const { data, error } = await supabase
      .from('strains')
      .select('*');
    
    if (error) {
      console.error('Error fetching strains:', error);
      throw new Error(error.message);
    }

    // Transform the data to match our Strain type
    return (data || []).map(item => ({
      id: item.name.toLowerCase().replace(/\s+/g, '-') || String(Math.random()), // Generate ID from name
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
      ].filter(e => e.effect && e.intensity > 0)
    }));
  } catch (error) {
    console.error('Error in fetchStrains:', error);
    return [];
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
    return [];
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
    return [];
  }
};
