
import { Strain, StrainEffect } from "@/types/strain";

/**
 * Helper function to transform raw DB data to Strain objects
 * @param data Raw data from database
 * @returns Properly formatted Strain objects
 */
export const transformStrainData = (data: any[]): Strain[] => {
  return data.map(item => {
    // Validate required fields
    if (!item.name) {
      console.error("Invalid strain data, missing name:", item);
      // Use a default name to prevent null constraint violations
      item.name = "Unknown Strain";
    }
    
    // Extract effect data
    const effects: StrainEffect[] = [];
    
    // Add top effect if available
    if (item.top_effect && item.top_percent) {
      effects.push({
        effect: item.top_effect,
        intensity: safeNumberConversion(item.top_percent, 0) || 0
      });
    }
    
    // Add second effect if available
    if (item.second_effect && item.second_percent) {
      effects.push({
        effect: item.second_effect,
        intensity: safeNumberConversion(item.second_percent, 0) || 0
      });
    }
    
    // Add third effect if available
    if (item.third_effect && item.third_percent) {
      effects.push({
        effect: item.third_effect,
        intensity: safeNumberConversion(item.third_percent, 0) || 0
      });
    }
    
    // Create properly structured Strain object
    return {
      id: item.id || String(Math.random()),
      name: item.name,
      img_url: item.img_url,
      type: (item.type as 'Indica' | 'Sativa' | 'Hybrid') || 'Hybrid',
      thc_level: safeNumberConversion(item.thc_level),
      most_common_terpene: item.most_common_terpene,
      description: item.description,
      effects: effects,
    };
  });
};

/**
 * Safe number conversion with fallback
 * @param value - Value to convert
 * @param fallback - Default value if conversion fails
 * @returns Number or fallback
 */
export function safeNumberConversion(value: string | null | undefined, fallback: number | null = null): number | null {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }
  
  const number = parseFloat(value);
  return isNaN(number) ? fallback : number;
}

/**
 * Safe JSON parsing with type validation
 */
export function safeJsonParse<T>(jsonString: string | null | undefined, defaultValue: T): T {
  if (!jsonString) {
    return defaultValue;
  }
  
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error("JSON parse error:", error);
    return defaultValue;
  }
}
