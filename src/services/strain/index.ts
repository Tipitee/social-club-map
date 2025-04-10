
// Re-export everything from individual modules
export * from './api';
export * from './errors';
export * from './transformers';
export * from './validation';

// Add mock strains for debug purposes
import { Strain } from "@/types/strain";

// Export mock strains that can be used by debugStrainService
export const mockStrains: Strain[] = [
  {
    id: "mock-1",
    name: "OG Kush",
    img_url: null,
    type: "Hybrid",
    thc_level: 22,
    most_common_terpene: "Myrcene",
    description: "A classic strain known for its potent effects and earthy flavor profile.",
    effects: [
      { effect: "Relaxed", intensity: 80 },
      { effect: "Euphoric", intensity: 65 },
      { effect: "Sleepy", intensity: 50 }
    ],
  },
  {
    id: "mock-2",
    name: "Blue Dream",
    img_url: null,
    type: "Sativa",
    thc_level: 18,
    most_common_terpene: "Pinene",
    description: "A balanced hybrid that provides gentle cerebral stimulation.",
    effects: [
      { effect: "Creative", intensity: 70 },
      { effect: "Uplifted", intensity: 65 },
      { effect: "Focused", intensity: 60 }
    ],
  }
];

// This index file allows imports like:
// import { fetchStrains, transformStrainData } from '@/services/strain';
