
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
 * Sort strains with top priority for those with images
 */
export const sortStrainsByImagePresence = (strains: Strain[]): Strain[] => {
  // Debug logging
  console.log("Before image sort, first 5 strain names:", 
    strains.slice(0, 5).map(s => s.name)
  );
  
  // First make a copy to avoid mutating the original array
  const sorted = [...strains];
  
  // CRITICAL: Strict image-first sorting - this is the PRIMARY sort criteria
  sorted.sort((a, b) => {
    // Define image presence more explicitly
    const aHasImage = Boolean(a.img_url && a.img_url.trim() !== '');
    const bHasImage = Boolean(b.img_url && b.img_url.trim() !== '');
    
    // Force image sorting - this MUST be the primary sort
    if (aHasImage && !bHasImage) return -1; // A has image, B doesn't - A comes first
    if (!aHasImage && bHasImage) return 1;  // B has image, A doesn't - B comes first
    
    // Only if both have or don't have images, then sort by name as secondary sort
    return a.name.localeCompare(b.name);
  });
  
  // Debug logging after sorting
  console.log("After image sort, first 5 strain names:", 
    sorted.slice(0, 5).map(s => s.name)
  );
  console.log("Image presence for first 5 strains after sort:", 
    sorted.slice(0, 5).map(s => ({
      name: s.name,
      hasImage: Boolean(s.img_url && s.img_url.trim() !== '')
    }))
  );
  
  return sorted;
};
