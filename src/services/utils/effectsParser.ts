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
  
  // Process top effect - handle both null/undefined values and "0.00"/"0%" values differently
  if (item.top_effect) {
    // For top effect, preserve the original value
    const parsedPercent = safeParsePercent(item.top_percent);
    effects.push({
      effect: item.top_effect,
      // Even if the parsed percentage is 0, keep it as a valid percentage value
      intensity: parsedPercent
    });
  }
  
  // Second effect - similar handling
  if (item.second_effect) {
    const parsedPercent = safeParsePercent(item.second_percent);
    effects.push({
      effect: item.second_effect,
      // Even if the parsed percentage is 0, keep it as a valid percentage value
      intensity: parsedPercent
    });
  }
  
  // Third effect
  if (item.third_effect) {
    const parsedPercent = safeParsePercent(item.third_percent);
    effects.push({
      effect: item.third_effect,
      intensity: parsedPercent
    });
  }
  
  console.log("Extracted effects before filling:", item.name, effects);
  
  // Make sure we always return at least 3 effects
  while (effects.length < 3) {
    effects.push({
      effect: "Unknown", 
      intensity: 0 // Use 0 to indicate unknown intensity
    });
  }
  
  // Limit to exactly 3 effects
  effects = effects.slice(0, 3);
  
  console.log("Final extracted effects:", item.name, effects);
  
  return effects;
};
