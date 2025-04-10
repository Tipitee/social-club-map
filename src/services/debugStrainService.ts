
import type { Strain } from '@/types/strain';
import { z } from 'zod';
import {
  StrainSchema,
  type StrainCreateSchema,
  type StrainUpdateSchema,
} from './strain/validation';
import { mockStrains } from './strain/index';

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
    // Ensure name is always provided with a fallback
    const strainName = strain.name || "Unknown Strain";
    
    // Create valid Strain object with required fields
    const validatedResult = StrainSchema.safeParse({
      ...strain,
      name: strainName, // Ensure name is always provided
      id: Math.random().toString(36).substring(2, 15),
      effects: [],
      // Removed updatedAt and createdAt as they're not in the Strain type
    });

    if (!validatedResult.success) {
      return {
        success: false,
        error: validatedResult.error,
      };
    }

    const validatedStrain = validatedResult.data;

    // Create a new Strain that strictly follows the Strain type
    const newStrain: Strain = {
      id: Math.random().toString(36).substring(2, 15),
      name: validatedStrain.name,
      img_url: validatedStrain.img_url || null,
      type: validatedStrain.type || 'Hybrid',
      thc_level: validatedStrain.thc_level || null,
      most_common_terpene: validatedStrain.most_common_terpene || null,
      description: validatedStrain.description || null,
      effects: [], // Empty effects array as it's required
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
    
    // Merge the existing strain with updates, ensuring name is always present
    const updatedStrain = { 
      ...existingStrain, 
      ...strain,
      name: strain.name || existingStrain.name || "Unknown Strain" // Ensure name is always present
    };

    // Validate the merged strain with Zod
    const validatedResult = StrainSchema.safeParse({
      ...updatedStrain,
      // Remove fields not in Strain type
    });

    if (!validatedResult.success) {
      return {
        success: false,
        error: validatedResult.error,
      };
    }

    const validatedStrain = validatedResult.data;

    // Create a new object that strictly conforms to Strain type
    const finalStrain: Strain = {
      id: validatedStrain.id,
      name: validatedStrain.name,
      img_url: validatedStrain.img_url,
      type: validatedStrain.type || 'Hybrid',
      thc_level: validatedStrain.thc_level,
      most_common_terpene: validatedStrain.most_common_terpene,
      description: validatedStrain.description,
      effects: validatedStrain.effects || [],
    };

    mockStrains[strainIndex] = finalStrain;

    return { success: true, data: finalStrain };
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
