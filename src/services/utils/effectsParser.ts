
import { StrainEffect } from "@/types/strain";
import { safeParsePercent } from "./parseUtils";

/**
 * Extract effects from a raw strain data item
 */
export const extractEffects = (item: any): StrainEffect[] => {
  // Debug logs to see what's coming in
  console.log("Extracting effects from item:", item.name, {
    top: { effect: item.top_effect, percent: item.top_percent },
    second: { effect: item.second_effect, percent: item.second_percent },
    third: { effect: item.third_effect, percent: item.third_percent },
  });
  
  let effects: StrainEffect[] = [];
  
  // Process top effect
  if (item.top_effect) {
    // For euphoric and similar effects, the actual percentage value might be in highest_percent
    // rather than top_percent for some strains
    const percentValue = item.top_percent || item.highest_percent || "51";
    const parsedPercent = safeParsePercent(percentValue);
    
    effects.push({
      effect: item.top_effect,
      intensity: parsedPercent > 0 ? parsedPercent : 51 // Default to 51% if no valid percentage
    });
  }
  
  // Second effect
  if (item.second_effect) {
    // For stress and similar effects, the percentage might be missing
    const parsedPercent = safeParsePercent(item.second_percent);
    
    effects.push({
      effect: item.second_effect,
      intensity: parsedPercent > 0 ? parsedPercent : 50 // Default to 50% if no valid percentage
    });
  }
  
  // Third effect
  if (item.third_effect) {
    const parsedPercent = safeParsePercent(item.third_percent);
    
    effects.push({
      effect: item.third_effect,
      intensity: parsedPercent > 0 ? parsedPercent : 46 // Default to 46% if no valid percentage
    });
  }
  
  console.log("Extracted effects before filling:", item.name, effects);
  
  // Make sure we always return at least 3 effects
  while (effects.length < 3) {
    effects.push({
      effect: "Unknown", 
      intensity: 0
    });
  }
  
  // Limit to exactly 3 effects
  effects = effects.slice(0, 3);
  
  console.log("Final extracted effects:", item.name, effects);
  
  return effects;
};
