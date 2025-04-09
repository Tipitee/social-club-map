
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
};

export type ProcessedStrain = Omit<Strain, 'effects'> & {
  effects: StrainEffect[];
};

export type RawStrainData = {
  id?: string;
  name: string;
  img_url?: string | null;
  type?: string;
  thc_level?: string | null; // String from database
  most_common_terpene?: string | null;
  description?: string | null;
  top_effect?: string | null;
  top_percent?: string | null;
  second_effect?: string | null;
  second_percent?: string | null;
  third_effect?: string | null;
  third_percent?: string | null;
  [key: string]: any;
};

export type StrainFilters = {
  type: string | null;
  thcRange: [number, number];
  effect: string | null;
  terpene: string | null;
  sort: 'name' | 'thc_high' | 'thc_low';
  search: string;
};
