
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

// Export a type based on the schema
export type StrainInsertData = z.infer<typeof strainInsertSchema>;
