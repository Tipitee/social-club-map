
export type StrainEffect = {
  effect: string;
  intensity: number;
};

export type Strain = {
  id: string;
  name: string;
  img_url: string | null;
  type: 'Indica' | 'Sativa' | 'Hybrid';
  thc_level: number | null;
  most_common_terpene: string | null;
  description: string | null;
  effects: StrainEffect[];
  created_at?: string;
  // Add missing properties required by StrainDetail component
  unique_identifier?: string;
  top_effect?: string | null;
  highest_percent?: string | number | null;
  second_effect?: string | null;
  second_percent?: string | number | null;
  third_effect?: string | null;
  third_percent?: string | number | null;
};

export type StrainFilters = {
  type: string | null;
  thcRange: [number, number];
  effect: string | null;
  terpene: string | null;
  sort: 'name' | 'thc_high' | 'thc_low';
  search: string;
};

// These types help with the API type errors
export type RawStrainData = {
  id: string;
  name: string;
  img_url?: string | null;
  type: 'Indica' | 'Sativa' | 'Hybrid';
  thc_level?: number | null;
  most_common_terpene?: string | null;
  description?: string | null;
  effects_json?: string;
  created_at?: string;
};

export type StrainInsertData = {
  name: string;
  type: 'Indica' | 'Sativa' | 'Hybrid';
  thc_level?: number | null;
  most_common_terpene?: string | null;
  description?: string | null;
  effects_json?: string;
};

export type FetchStrainsResult = {
  strains: Strain[];
  total: number;
};
