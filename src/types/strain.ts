
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

export type StrainFilters = {
  type: string | null;
  thcRange: [number, number];
  effect: string | null;
  terpene: string | null;
  sort: 'name' | 'thc_high' | 'thc_low';
  search: string;
};
