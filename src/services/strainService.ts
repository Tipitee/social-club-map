
import { Strain } from "../types/strain";

// This is mock data to simulate data from Supabase
export const mockStrains: Strain[] = [
  {
    id: "1",
    name: "Northern Lights",
    img_url: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843",
    type: "Indica",
    thc_level: 18.5,
    most_common_terpene: "Myrcene",
    description: "A classic indica known for its relaxing effects and sweet, spicy flavor profile.",
    effects: [
      { effect: "Relaxed", intensity: 85 },
      { effect: "Sleepy", intensity: 70 },
      { effect: "Happy", intensity: 60 }
    ]
  },
  {
    id: "2",
    name: "Sour Diesel",
    img_url: null,
    type: "Sativa",
    thc_level: 22.1,
    most_common_terpene: "Limonene",
    description: "Energizing sativa with a pungent diesel-like aroma and uplifting effects.",
    effects: [
      { effect: "Energetic", intensity: 80 },
      { effect: "Creative", intensity: 75 },
      { effect: "Focused", intensity: 65 }
    ]
  },
  {
    id: "3",
    name: "Blue Dream",
    img_url: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
    type: "Hybrid",
    thc_level: 20.0,
    most_common_terpene: null,
    description: null,
    effects: [
      { effect: "Relaxed", intensity: 70 },
      { effect: "Creative", intensity: 65 },
      { effect: "", intensity: 0 }
    ]
  },
  {
    id: "4",
    name: "Granddaddy Purple",
    img_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    type: "Indica",
    thc_level: null,
    most_common_terpene: "Pinene",
    description: "A potent indica with deep purple hues and grape-like flavor and aroma.",
    effects: [
      { effect: "Relaxed", intensity: 90 },
      { effect: "Sleepy", intensity: 85 },
      { effect: "Hungry", intensity: 60 }
    ]
  },
  {
    id: "5",
    name: "Green Crack",
    img_url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9",
    type: "Sativa",
    thc_level: 19.3,
    most_common_terpene: "Caryophyllene",
    description: "Invigorating sativa strain noted for its sharp energy and focus effects.",
    effects: [
      { effect: "Focused", intensity: 85 },
      { effect: "Energetic", intensity: 80 },
      { effect: "", intensity: 0 }
    ]
  },
  {
    id: "6",
    name: "Wedding Cake",
    img_url: null,
    type: "Hybrid",
    thc_level: 25.0,
    most_common_terpene: "Limonene",
    description: "A potent hybrid with a sweet, rich flavor profile and relaxing effects.",
    effects: [
      { effect: "Relaxed", intensity: 75 },
      { effect: "Happy", intensity: 70 },
      { effect: "Euphoric", intensity: 65 }
    ]
  },
];

export const fetchStrains = (): Promise<Strain[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockStrains);
    }, 500);
  });
};

export const getAllEffects = (): string[] => {
  const effectsSet = new Set<string>();
  
  mockStrains.forEach(strain => {
    strain.effects.forEach(effect => {
      if (effect.effect && effect.intensity > 0) {
        effectsSet.add(effect.effect);
      }
    });
  });
  
  return Array.from(effectsSet).sort();
};
