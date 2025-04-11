import { StrainEffect } from "@/types/strain";
import { safeParsePercent } from "./parseUtils";

/**
 * Extract effects from a raw strain data item
 */
export const extractEffects = (item: any): StrainEffect[] => {
  let effects: StrainEffect[] = [];
  
  // Debug logs to see what's coming in
  console.log("Extracting effects from item:", {
    top: { effect: item.top_effect, percent: item.top_percent },
    second: { effect: item.second_effect, percent: item.second_percent },
    third: { effect: item.third_effect, percent: item.third_percent },
  });
  
  // Process effects in correct order - preserving the original structure
  if (item.top_effect) {
    const parsedPercent = safeParsePercent(item.top_percent);
    effects.push({
      effect: item.top_effect,
      intensity: parsedPercent, // Keep the exact parsed percentage
    });
  }
  
  // Second effect
  if (item.second_effect) {
    const parsedPercent = safeParsePercent(item.second_percent);
    effects.push({
      effect: item.second_effect,
      intensity: parsedPercent, // Keep the exact parsed percentage
    });
  }
  
  // Third effect
  if (item.third_effect) {
    const parsedPercent = safeParsePercent(item.third_percent);
    effects.push({
      effect: item.third_effect,
      intensity: parsedPercent, // Keep the exact parsed percentage
    });
  }
  
  // Try to parse effects from JSON as well if we don't have enough effects
  if (item.effects_json && typeof item.effects_json === 'string' && effects.length < 3) {
    try {
      const parsedEffects = JSON.parse(item.effects_json);
      
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
  
  console.log("Extracted effects before filling:", effects);
  
  // Make sure we always return at least 3 effects (even if empty)
  // But DON'T add placeholder effects if we have at least one real effect
  while (effects.length < 3) {
    effects.push({
      effect: "Unknown", 
      intensity: 0 // Use 0 to indicate unknown intensity
    });
  }
  
  // Don't sort the effects - we want to keep the original order from the database
  // This preserves the top, second, third effect hierarchy
  
  console.log("Final extracted effects:", effects);
  
  return effects.slice(0, 3);
};
