
import { Strain } from "@/types/strain";
import { extractEffects } from "../utils/effectsParser";
import { createStrainId, extractThcLevel } from "../utils/parseUtils";

/**
 * Map a raw database item to a Strain type
 */
export const mapToStrainType = (item: any): Strain => {
  const thcLevel = extractThcLevel(item);
  const effects = extractEffects(item);
  const strainId = createStrainId(item);
  
  return {
    id: strainId,
    name: item.name || "Unknown Strain",
    type: (item.type as 'Indica' | 'Sativa' | 'Hybrid') || 'Hybrid',
    img_url: item.img_url || null,
    thc_level: thcLevel,
    description: item.description || null,
    effects: effects,
    most_common_terpene: item.most_common_terpene || null,
    // Include original effect fields for debugging
    top_effect: item.top_effect || null,
    top_percent: item.top_percent || null,
    second_effect: item.second_effect || null,
    second_percent: item.second_percent || null,
    third_effect: item.third_effect || null,
    third_percent: item.third_percent || null,
  };
};

/**
 * Sort strains with preference for those with images
 * This ensures strains with images come first in the list
 */
export const sortStrainsByImagePresence = (strains: Strain[]): Strain[] => {
  // Log before sorting to debug
  console.log("Before image sort, first 5 strains:", 
    strains.slice(0, 5).map(s => ({ name: s.name, hasImg: Boolean(s.img_url && s.img_url.trim() !== '') }))
  );
  
  const sorted = [...strains].sort((a, b) => {
    // First priority: Has image or not - STRICT BOOLEAN COMPARISON
    const aHasImage = Boolean(a.img_url && a.img_url.trim() !== '');
    const bHasImage = Boolean(b.img_url && b.img_url.trim() !== '');
    
    if (aHasImage && !bHasImage) return -1;
    if (!aHasImage && bHasImage) return 1;
    
    // Second priority: Alphabetical by name
    return a.name.localeCompare(b.name);
  });
  
  // Log after sorting to confirm results
  console.log("After image sort, first 5 strains:", 
    sorted.slice(0, 5).map(s => ({ name: s.name, hasImg: Boolean(s.img_url && s.img_url.trim() !== '') }))
  );
  
  return sorted;
};
