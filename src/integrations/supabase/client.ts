
// This file initializes the Supabase client with environment variables
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Get environment variables with proper fallbacks for development
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://zvcqcgihydjscvrltkvz.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2Y3FjZ2loeWRqc2N2cmx0a3Z6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxOTQ2MzAsImV4cCI6MjA1OTc3MDYzMH0.oh4jdRkSxYKPwFQ2BCJKNO3uKOhTZh4AIXNSXIV4jMc";

console.log("[DEBUG] Initializing Supabase with URL:", SUPABASE_URL);
console.log("[DEBUG] Key starts with:", SUPABASE_ANON_KEY.substring(0, 10) + "...");
console.log("[DEBUG] Client initialization timestamp:", new Date().toISOString());

// Create the client with debug logging enabled
export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_ANON_KEY,
  { 
    auth: {
      persistSession: true,
      autoRefreshToken: true
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'x-client-info': 'lovable-app'
      }
    }
  }
);

/**
 * Tests the connection to Supabase
 * @returns {Promise<boolean>} True if connection is successful, false otherwise
 */
export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    console.log("[DEBUG] Testing basic Supabase connection");
    const { data, error } = await supabase.from('strains').select('name').limit(1);
    
    // Log full response for debugging
    console.log("[DEBUG] Basic connection test full response:", { data, error });
    
    if (error) {
      console.error('[DEBUG] Supabase connection test error:', error);
      return false;
    }
    
    console.log("[DEBUG] Basic connection test successful. Records found:", Array.isArray(data) ? data.length : 0);
    return Array.isArray(data);
  } catch (error) {
    console.error('[DEBUG] Supabase connection test exception:', error);
    return false;
  }
};
