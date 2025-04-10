
import { Strain, StrainEffect } from "@/types/strain";
import { supabase } from "@/integrations/supabase/client";

// Function to get Supabase info for debugging
export const getSupabaseInfo = () => supabase;

// Function to fetch raw strains data for debugging
export const fetchRawStrains = async () => {
  try {
    const { data, error } = await supabase
      .from('strains')
      .select('*')
      .limit(3);
    
    return {
      success: !error,
      data,
      error
    };
  } catch (e) {
    return {
      success: false,
      error: e
    };
  }
};

// Mock data for offline development
const mockStrains: Strain[] = [
  {
    id: "1",
    name: "OG Kush",
    type: "Hybrid",
    thc_level: 22.5,
    description: "OG Kush is a legendary strain with a strong earthy, pine aroma and a potent cerebral high.",
    effects: [
      { effect: "Relaxed", intensity: 85 },
      { effect: "Happy", intensity: 75 },
      { effect: "Euphoric", intensity: 70 }
    ],
    most_common_terpene: "Myrcene",
    img_url: "https://images.unsplash.com/photo-1603909223429-69bb7101f94a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FubmFiaXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: "2",
    name: "Blue Dream",
    type: "Hybrid",
    thc_level: 19.8,
    description: "Blue Dream is a sativa-dominant hybrid with a sweet berry aroma. It provides a balanced high with full-body relaxation and gentle cerebral invigoration.",
    effects: [
      { effect: "Happy", intensity: 80 },
      { effect: "Euphoric", intensity: 70 },
      { effect: "Creative", intensity: 65 }
    ],
    most_common_terpene: "Myrcene",
    img_url: "https://images.unsplash.com/photo-1632642794770-644469659a73?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNhbm5hYmlzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: "3",
    name: "Sour Diesel",
    type: "Sativa",
    thc_level: 24.1,
    description: "Sour Diesel is a fast-acting sativa that delivers energizing, dreamy cerebral effects. It features a pungent, diesel-like aroma.",
    effects: [
      { effect: "Energetic", intensity: 90 },
      { effect: "Happy", intensity: 80 },
      { effect: "Creative", intensity: 70 }
    ],
    most_common_terpene: "Limonene",
    img_url: "https://images.unsplash.com/photo-1638321940973-b77793e0a565?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGNhbm5hYmlzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: "4",
    name: "Granddaddy Purple",
    type: "Indica",
    thc_level: 20.7,
    description: "Granddaddy Purple is a famous indica cross known for its sedating effects. It has a complex grape and berry aroma.",
    effects: [
      { effect: "Relaxed", intensity: 95 },
      { effect: "Sleepy", intensity: 85 },
      { effect: "Euphoric", intensity: 70 }
    ],
    most_common_terpene: "Myrcene",
    img_url: "https://images.unsplash.com/photo-1638321941149-39539c855313?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGNhbm5hYmlzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: "5",
    name: "White Widow",
    type: "Hybrid",
    thc_level: 21.3,
    description: "White Widow is a balanced hybrid known for its energizing effects and resin production. It has an earthy, woody aroma.",
    effects: [
      { effect: "Happy", intensity: 80 },
      { effect: "Euphoric", intensity: 75 },
      { effect: "Creative", intensity: 70 }
    ],
    most_common_terpene: "Pinene",
    img_url: "https://images.unsplash.com/photo-1635480999879-a4c589c8ca9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FubmFiaXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: "6",
    name: "Lemon Haze",
    type: "Sativa",
    thc_level: 23.0,
    description: "Lemon Haze is a sativa-dominant strain that smells and tastes of fresh lemons. It's known for its uplifting and energetic effects.",
    effects: [
      { effect: "Energetic", intensity: 85 },
      { effect: "Uplifted", intensity: 80 },
      { effect: "Happy", intensity: 75 }
    ],
    most_common_terpene: "Limonene",
    img_url: "https://example.com/lemon-haze.jpg"
  },
  {
    id: "7",
    name: "Northern Lights",
    type: "Indica",
    thc_level: 18.5,
    description: "Northern Lights is a pure indica strain cherished for its resinous buds, fast flowering, and resilience. It has a sweet, spicy aroma.",
    effects: [
      { effect: "Relaxed", intensity: 90 },
      { effect: "Sleepy", intensity: 80 },
      { effect: "Euphoric", intensity: 70 }
    ],
    most_common_terpene: "Myrcene",
    img_url: "https://example.com/northern-lights.jpg"
  },
  {
    id: "8",
    name: "Jack Herer",
    type: "Sativa",
    thc_level: 22.0,
    description: "Jack Herer is a sativa-dominant hybrid that has gained as much renown as its namesake. It has a spicy, pine-scented aroma with a hint of lemon.",
    effects: [
      { effect: "Creative", intensity: 80 },
      { effect: "Happy", intensity: 75 },
      { effect: "Energetic", intensity: 70 }
    ],
    most_common_terpene: "Terpinolene",
    img_url: "https://example.com/jack-herer.jpg"
  },
  {
    id: "9",
    name: "Girl Scout Cookies",
    type: "Hybrid",
    thc_level: 25.0,
    description: "Girl Scout Cookies is an OG Kush and Durban Poison hybrid cross whose reputation is too big for its own good. It has a sweet and earthy aroma.",
    effects: [
      { effect: "Euphoric", intensity: 90 },
      { effect: "Relaxed", intensity: 80 },
      { effect: "Happy", intensity: 75 }
    ],
    most_common_terpene: "Caryophyllene",
    img_url: "https://example.com/girl-scout-cookies.jpg"
  },
  {
    id: "10",
    name: "Blueberry",
    type: "Indica",
    thc_level: 19.0,
    description: "Blueberry is an indica-dominant hybrid with a strong blueberry aroma and flavor. It provides a relaxed and euphoric high.",
    effects: [
      { effect: "Relaxed", intensity: 85 },
      { effect: "Happy", intensity: 75 },
      { effect: "Sleepy", intensity: 70 }
    ],
    most_common_terpene: "Myrcene",
    img_url: "https://example.com/blueberry.jpg"
  }
];

// Function to simulate fetching strains with filters
export const fetchStrains = async (
  sort: string = "name",
  page: number = 1,
  limit: number = 10
): Promise<{strains: Strain[], total: number}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  let result = [...mockStrains];
  
  // Apply sorting
  if (sort === "name") {
    result.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === "thc") {
    result.sort((a, b) => {
      // Handle null/undefined THC levels by placing them last
      if (a.thc_level === null || a.thc_level === undefined) return 1;
      if (b.thc_level === null || b.thc_level === undefined) return -1;
      return b.thc_level - a.thc_level;
    });
  }
  
  // Calculate pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedStrains = result.slice(startIndex, endIndex);
  
  // Generate keywords for search functionality
  const keywordsArray: string[] = []; // Fix: explicitly define array type
  result.forEach(strain => {
    keywordsArray.push(strain.name.toLowerCase());
    keywordsArray.push(strain.type?.toLowerCase() || "");
    strain.effects.forEach(effect => keywordsArray.push(effect.effect.toLowerCase()));
  });
  
  return {
    strains: paginatedStrains,
    total: result.length
  };
};

export const fetchStrainById = async (id: string): Promise<Strain | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const strain = mockStrains.find(strain => strain.id === id);
  return strain || null;
};

// Test strains connection function for debugging
export const testStrainsConnection = async () => {
  return {
    success: true,
    message: "Mock connection successful",
    count: mockStrains.length
  };
};

// Get all effects from mock data for debugging
export const getAllEffects = async (): Promise<string[]> => {
  const effects = new Set<string>();
  mockStrains.forEach(strain => {
    strain.effects.forEach(effect => {
      effects.add(effect.effect);
    });
  });
  return Array.from(effects).sort();
};

// Get all terpenes from mock data for debugging
export const getTerpenes = async (): Promise<string[]> => {
  const terpenes = new Set<string>();
  mockStrains.forEach(strain => {
    if (strain.most_common_terpene) {
      terpenes.add(strain.most_common_terpene);
    }
  });
  return Array.from(terpenes).sort();
};
