import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { 
  Loader2, ArrowLeft, Info, Leaf, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { ClubResult } from "@/hooks/use-clubs-search";
import ClubHeader from "@/components/club/ClubHeader";
import ClubTabContent from "@/components/club/ClubTabContent";
import { mockClubDetails } from "@/components/club/mockData";

// Type for the raw database club data
type RawClubData = {
  id?: string;
  name: string;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  status: string | null;
  latitude: number | null;
  longitude: number | null;
  membership_status: boolean | null;
  district: string | null;
  website: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  description: string | null;
  additional_info: string | null;
};

const ClubDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("info");
  const [club, setClub] = useState<ClubResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClub = async () => {
      if (!id) {
        setError("No club ID provided");
        setLoading(false);
        return;
      }

      try {
        const result = await supabase
          .from('clubs')
          .select('*')
          .eq('id', id)
          .single();
        
        const fetchError = result.error;
        const data = result.data as RawClubData | null;
        
        if (fetchError) {
          throw new Error(fetchError.message);
        }

        if (data) {
          const clubData: ClubResult = {
            id: id,
            name: data.name || "Unnamed Club",
            address: data.address || null,
            city: data.city || null,
            postal_code: data.postal_code || null,
            status: (data.status as "verified" | "pending" | "unverified") || "unverified",
            latitude: data.latitude || null,
            longitude: data.longitude || null,
            membership_status: Boolean(data.membership_status),
            district: data.district || null,
            website: data.website || null,
            contact_email: data.contact_email || null,
            contact_phone: data.contact_phone || null,
            description: data.description || null,
            additional_info: data.additional_info || null
          };
          
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

  if (loading) {
    return (
      <div className="min-h-screen bg-linen dark:bg-navy-dark flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-teal mx-auto mb-4" />
          <p className="text-navy-dark dark:text-white">Loading club details...</p>
        </div>
      </div>
    );
  }

  if (error || !club) {
    return (
      <div className="min-h-screen bg-linen dark:bg-navy-dark">
        <Navbar />
        <div className="container px-4 py-6 max-w-7xl mx-auto">
          <div className="mb-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="text-teal dark:text-teal-light hover:bg-transparent hover:text-teal-dark p-0"
            >
              <ArrowLeft size={16} className="mr-1" />
              Back to Club Map
            </Button>
          </div>
          
          <div className="border-navy-DEFAULT dark:border-navy-light bg-white dark:bg-navy-light shadow-md p-8 rounded-lg">
            <h1 className="text-2xl font-bold text-navy-dark dark:text-white mb-4">
              {t('clubs.clubNotFound')}
            </h1>
            <p className="text-navy-dark/70 dark:text-white/70 mb-6">
              {error || t('clubs.unableToLoadClub')}
            </p>
            <Button 
              onClick={() => navigate('/clubs')}
              className="bg-teal hover:bg-teal/90 text-white"
            >
              {t('clubs.returnToClubMap')}
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-linen dark:bg-navy-dark pb-28">
      <Navbar />
      
      <div className="container px-4 py-6 max-w-7xl mx-auto">
        <div className="mb-4">
          <Link to="/clubs" className="inline-flex items-center text-teal dark:text-teal-light hover:underline">
            <ArrowLeft size={16} className="mr-1" />
            Back to Club Map
          </Link>
        </div>
        
        <ClubHeader 
          club={club} 
          memberCount={mockClubDetails.memberCount}
          openingHours={mockClubDetails.openingHours}
          foundingDate={mockClubDetails.foundingDate}
        />
        
        <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="bg-white dark:bg-navy-DEFAULT border border-navy-DEFAULT/20 dark:border-navy-light/20 mb-6">
            <TabsTrigger 
              value="info" 
              className="text-navy-dark dark:text-white data-[state=active]:bg-teal data-[state=active]:text-white"
            >
              <Info size={16} className="mr-2" />
              Information
            </TabsTrigger>
            <TabsTrigger 
              value="strains" 
              className="text-navy-dark dark:text-white data-[state=active]:bg-teal data-[state=active]:text-white"
            >
              <Leaf size={16} className="mr-2" />
              Strains
            </TabsTrigger>
            <TabsTrigger 
              value="events" 
              className="text-navy-dark dark:text-white data-[state=active]:bg-teal data-[state=active]:text-white"
            >
              <Calendar size={16} className="mr-2" />
              Events
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="mt-0">
            <ClubTabContent tab="info" club={club} />
          </TabsContent>
          
          <TabsContent value="strains" className="mt-0">
            <ClubTabContent tab="strains" club={club} />
          </TabsContent>
          
          <TabsContent value="events" className="mt-0">
            <ClubTabContent tab="events" club={club} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClubDetail;
