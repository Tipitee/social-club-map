
import { mockStrains } from './strain/index';
import type { Strain } from '@/types/strain';
import { z } from 'zod';
import {
  StrainSchema,
  type StrainCreateSchema,
  type StrainUpdateSchema,
} from './strain/validation';
import { type Result } from './strain/api';

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
    const validatedResult = StrainSchema.safeParse(strain);

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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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

    const validatedResult = StrainSchema.safeParse(updatedStrain);

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
