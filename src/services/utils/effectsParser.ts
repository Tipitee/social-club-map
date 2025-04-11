
import { StrainEffect } from "@/types/strain";
import { safeParsePercent } from "./parseUtils";

/**
 * Extract effects from a raw strain data item
 */
export const extractEffects = (item: any): StrainEffect[] => {
  let effects: StrainEffect[] = [];
  
  // Process top 3 effects with their respective percentages
  if (item.top_effect) {
    effects.push({
      effect: item.top_effect,
      intensity: safeParsePercent(item.top_percent || 0),
    });
  }
  
  if (item.second_effect) {
    effects.push({
      effect: item.second_effect,
      intensity: safeParsePercent(item.second_percent || 0),
    });
  }
  
  if (item.third_effect) {
    effects.push({
      effect: item.third_effect,
      intensity: safeParsePercent(item.third_percent || 0),
    });
  }
  
  // Try to parse effects from JSON as well
  try {
    if (item.effects_json && typeof item.effects_json === 'string' && effects.length < 3) {
      let parsedEffects;
      try {
        parsedEffects = JSON.parse(item.effects_json);
        
        // Handle different formats
        if (Array.isArray(parsedEffects)) {
          parsedEffects.forEach((effect: any) => {
            if (effect.name && effect.score && !effects.some(e => e.effect === effect.name)) {
              effects.push({
                effect: effect.name,
                intensity: Math.round(effect.score * 100)
              });
            }
          });
        }
        else if (typeof parsedEffects === 'object') {
          // Handle object format
          for (const [key, value] of Object.entries(parsedEffects)) {
            if (typeof value === 'number' && !effects.some(e => e.effect === key)) {
              effects.push({
                effect: key,
                intensity: Math.round(Number(value) * 100)
              });
            }
          }
        }
      } catch (e) {
        console.warn("Could not parse effects_json for strain:", item.name);
      }
    }
  } catch (e) {
    console.error("Error handling effects:", e);
  }
  
  // Make sure we always return at least 3 effects (even if empty)
  while (effects.length < 3) {
    effects.push({
      effect: "", 
      intensity: 0
    });
  }
  
  return effects;
};
