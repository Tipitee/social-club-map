
// This file re-exports all strain-related functionality from more focused service files

import { 
  fetchStrains,
  fetchStrainById,
  testStrainsConnection,
  getAllEffects,
  getTerpenes
} from "./strain/strainCatalogService";

// Re-export all functionality
export {
  fetchStrains,
  fetchStrainById,
  testStrainsConnection,
  getAllEffects,
  getTerpenes
};
