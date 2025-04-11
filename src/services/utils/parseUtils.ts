
/**
 * Safe parsing of percentage values from string
 */
export const safeParsePercent = (value: string | number | null | undefined): number => {
  if (value === null || value === undefined) return 0;
  
  if (typeof value === 'number') return Math.round(value);
  
  try {
    const parsed = parseFloat(value);
    if (isNaN(parsed)) return 0;
    return Math.round(parsed);
  } catch (e) {
    return 0;
  }
};

/**
 * Extract thc level from item data
 */
export const extractThcLevel = (item: any): number | null => {
  if (item.thc_level && !isNaN(parseFloat(item.thc_level))) {
    return parseFloat(item.thc_level);
  }
  
  if (item.thc && !isNaN(parseFloat(item.thc))) {
    return parseFloat(item.thc);
  }
  
  return null;
};

/**
 * Create valid strain ID from available fields
 */
export const createStrainId = (item: any): string => {
  return item.unique_identifier || item.name.replace(/\s+/g, '-').toLowerCase();
};
