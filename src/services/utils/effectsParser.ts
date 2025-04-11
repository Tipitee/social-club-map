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
  
  // Default extraction logic - Don't use special case handling, 
  // always stick to actual values from database
  let effects: StrainEffect[] = [];
  
  // Process effects in correct order with proper 0% handling
  if (item.top_effect) {
    const parsedPercent = safeParsePercent(item.top_percent);
    effects.push({
      effect: item.top_effect,
      // Keep actual parsed value even if 0
      intensity: parsedPercent
    });
  }
  
  // Second effect
  if (item.second_effect) {
    const parsedPercent = safeParsePercent(item.second_percent);
    effects.push({
      effect: item.second_effect,
      // Keep actual parsed value even if 0
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
