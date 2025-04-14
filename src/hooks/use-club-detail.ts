
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ClubResult } from "@/hooks/use-clubs-search";
import { RawClubData } from "@/types/club";

const mapRawDataToClub = (id: string, rawData: RawClubData): ClubResult => {
  return {
    id: id,
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
        // Explicitly type the response to avoid deep type instantiation
        const response = await supabase
          .from('clubs')
          .select('*')
          .eq('id', id)
          .single();
          
        if (response.error) {
          throw new Error(response.error.message);
        }

        const data = response.data as RawClubData | null;
        
        if (data) {
          const clubData = mapRawDataToClub(id, data);
          setClub(clubData);
        } else {
          setError("Club not found");
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
