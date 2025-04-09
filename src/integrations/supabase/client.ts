
// This file initializes the Supabase client with environment variables
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://zvcqcgihydjscvrltkvz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2Y3FjZ2loeWRqc2N2cmx0a3Z6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxOTQ2MzAsImV4cCI6MjA1OTc3MDYzMH0.oh4jdRkSxYKPwFQ2BCJKNO3uKOhTZh4AIXNSXIV4jMc";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

/**
 * Tests the connection to Supabase
 * @returns {Promise<boolean>} True if connection is successful, false otherwise
 */
export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from('strains').select('name').limit(1);
    return !error && Array.isArray(data);
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return false;
  }
};
