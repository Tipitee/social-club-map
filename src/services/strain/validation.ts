
import { z } from "zod";

// Define a validation schema for strain data to prevent database errors
export const strainInsertSchema = z.object({
  name: z.string().min(1, "Strain name is required"),
  type: z.enum(['Indica', 'Sativa', 'Hybrid']).nullable(),
  thc_level: z.number().nullable(),
  img_url: z.string().nullable(),
  description: z.string().nullable(),
  most_common_terpene: z.string().nullable(),
  top_effect: z.string().nullable()
});

// Export types based on the schema
export type StrainInsertData = z.infer<typeof strainInsertSchema>;

// Additional schemas needed by debugStrainService.ts
export const StrainSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Strain name is required"),
  type: z.enum(['Indica', 'Sativa', 'Hybrid']).nullable(),
  thc_level: z.number().nullable(),
  img_url: z.string().nullable(),
  description: z.string().nullable(),
  most_common_terpene: z.string().nullable(),
  effects: z.array(z.object({
    effect: z.string(),
    intensity: z.number()
  })),
  updatedAt: z.string().optional(),
  createdAt: z.string().optional()
});

export type StrainCreateSchema = z.infer<typeof strainInsertSchema>;
export type StrainUpdateSchema = Partial<z.infer<typeof strainInsertSchema>>;
