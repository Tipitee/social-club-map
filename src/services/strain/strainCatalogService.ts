
import { 
  testStrainsConnection, 
  getAllEffects, 
  getTerpenes 
} from "../database/strainDbService";

import { fetchStrains, fetchStrainById } from "./strainSearchService";

// Re-export all the strain-related functionality
export { 
  // Database testing and metadata
  testStrainsConnection,
  getAllEffects,
  getTerpenes,
  
  // Strain search and retrieval
  fetchStrains,
  fetchStrainById
};
