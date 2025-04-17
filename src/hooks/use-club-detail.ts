
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ClubResult, RawClubData } from "@/types/club";
import { SupabaseResponse } from "@/types/supabase";

const mapRawDataToClub = (name: string, rawData: RawClubData): ClubResult => {
  return {
    id: name, // Using name as ID since there's no explicit id column
    name: rawData.name || "Unnamed Club",
    address: rawData.address || null,
    city: rawData.city || null,
    postal_code: rawData.postal_code || null,
    status: (rawData.status as "verified" | "pending" | "unverified") || "unverified",
    latitude: rawData.latitude || null,
    longitude: rawData.longitude || null,
    membership_status: Boolean(rawData.membership_status),
    district: rawData.district || null,
    website: rawData.website || null,
    contact_email: rawData.contact_email || null,
    contact_phone: rawData.contact_phone || null,
    description: rawData.description || null,
    additional_info: rawData.additional_info || null
  };
};

/**
 * Fetches a club by its ID from Supabase
 * Note: In our database, clubs don't have an 'id' column, so we use 'name' to identify them
 */
const fetchClubById = async (id: string): Promise<SupabaseResponse<RawClubData>> => {
  try {
    if (!id) {
      return {
        data: null,
        error: new Error("No club ID provided")
      };
    }
    
    console.log("Fetching club data for:", id);
    
    // First try to find the club by name (which is what we're using as ID)
    const response = await supabase.from('clubs').select('*').eq('name', id).single();
    
    // If no results or error, try more flexible search using ilike
    if (response.error || !response.data) {
      console.log("Exact match not found, trying fuzzy search");
      const fallbackResponse = await supabase
        .from('clubs')
        .select('*')
        .ilike('name', `%${id}%`)
        .maybeSingle(); // Using maybeSingle instead of single to avoid errors
      
      return {
        data: fallbackResponse.data as RawClubData | null,
        error: fallbackResponse.error ? new Error(fallbackResponse.error.message) : null
      };
    }
    
    // Return the found club data
    return {
      data: response.data as RawClubData | null,
      error: response.error ? new Error(response.error.message) : null
    };
  } catch (err) {
    // Handle any unexpected errors
    console.error("Error in fetchClubById:", err);
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error occurred')
    };
  }
};

export function useClubDetail(id: string | undefined) {
  const [club, setClub] = useState<ClubResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClub = async () => {
      if (!id) {
        setError("No club ID provided");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching club with ID:", id);
        const { data, error: supabaseError } = await fetchClubById(id);
          
        if (supabaseError) {
          throw new Error(supabaseError.message);
        }

        if (data) {
          const mappedClub = mapRawDataToClub(data.name, data);
          setClub(mappedClub);
          console.log("Club data loaded successfully:", mappedClub.name);
        } else {
          setError(`Club "${id}" not found`);
        }
      } catch (err) {
        console.error("Error fetching club:", err);
        setError(err instanceof Error ? err.message : "Failed to load club details");
      } finally {
        setLoading(false);
      }
    };

    fetchClub();
  }, [id]);

  return { club, loading, error };
}
