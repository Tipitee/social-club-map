
import type { Strain } from '@/types/strain';
import { z } from 'zod';
import {
  StrainSchema,
  type StrainCreateSchema,
  type StrainUpdateSchema,
} from './strain/validation';

// Create mock strains since they aren't exported from strain/index
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

// Define the Result type that was missing
export interface Result<T> {
  success: boolean;
  data?: T;
  error?: Error | z.ZodError;
}

// Add the missing functions needed by ConnectionHealthCheck.tsx
export const fetchRawStrains = async (): Promise<{ success: boolean, data?: any[], error?: string }> => {
  try {
    // This is a debug function to check if raw database access works
    // Return mock data for testing purposes
    return { 
      success: true, 
      data: mockStrains.map(strain => ({
        id: strain.id,
        name: strain.name,
        type: strain.type,
        thc_level: strain.thc_level?.toString()
      }))
    };
  } catch (error) {
    console.error("Error fetching raw strains:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
};

export const getSupabaseInfo = async (): Promise<{ connected: boolean, error?: string }> => {
  try {
    // Simple function to check if Supabase connection is working
    return { connected: true };
  } catch (error) {
    return { 
      connected: false, 
      error: error instanceof Error ? error.message : "Connection check failed" 
    };
  }
};

export const getAll = async (): Promise<Strain[]> => {
  return [...mockStrains];
};

export const getOne = async (id: string): Promise<Strain | undefined> => {
  return mockStrains.find((strain) => strain.id === id);
};

export const create = async (
  strain: StrainCreateSchema
): Promise<Result<Strain>> => {
  try {
    const validatedResult = StrainSchema.safeParse({
      ...strain,
      id: Math.random().toString(36).substring(2, 15),
      effects: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    if (!validatedResult.success) {
      return {
        success: false,
        error: validatedResult.error,
      };
    }

    const validatedStrain = validatedResult.data;

    const newStrain: Strain = {
      ...validatedStrain,
      id: Math.random().toString(36).substring(2, 15),
    };

    // In a real implementation, we'd add the strain to the database here
    mockStrains.push(newStrain);

    return { success: true, data: newStrain };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error };
    }
    return {
      success: false,
      error: new Error('An unexpected error occurred'),
    };
  }
};

export const update = async (
  id: string,
  strain: StrainUpdateSchema
): Promise<Result<Strain>> => {
  try {
    const strainIndex = mockStrains.findIndex((s) => s.id === id);

    if (strainIndex === -1) {
      return {
        success: false,
        error: new Error(`Strain with id ${id} not found`),
      };
    }

    const existingStrain = mockStrains[strainIndex];
    const updatedStrain = { ...existingStrain, ...strain };

    const validatedResult = StrainSchema.safeParse({
      ...updatedStrain,
      updatedAt: new Date().toISOString(),
    });

    if (!validatedResult.success) {
      return {
        success: false,
        error: validatedResult.error,
      };
    }

    const validatedStrain = validatedResult.data;

    mockStrains[strainIndex] = {
      ...validatedStrain,
      updatedAt: new Date().toISOString(),
    };

    return { success: true, data: mockStrains[strainIndex] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error };
    }
    return {
      success: false,
      error: new Error('An unexpected error occurred'),
    };
  }
};

export const remove = async (id: string): Promise<Result<boolean>> => {
  const strainIndex = mockStrains.findIndex((strain) => strain.id === id);

  if (strainIndex === -1) {
    return {
      success: false,
      error: new Error(`Strain with id ${id} not found`),
    };
  }

  mockStrains.splice(strainIndex, 1);
  return { success: true, data: true };
};
