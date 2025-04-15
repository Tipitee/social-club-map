
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useClubDetail } from "@/hooks/use-club-detail";
import ClubLoading from "@/components/club/ClubLoading";
import ClubError from "@/components/club/ClubError";
import ClubContent from "@/components/club/ClubContent";
import { useToast } from "@/hooks/use-toast";
import BottomNav from "@/components/BottomNav";

const ClubDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { club, loading, error } = useClubDetail(id);
  const { toast } = useToast();
  
  useEffect(() => {
    // Show toast when club data is loaded
    if (club && !loading) {
      toast({
        title: "Club information loaded",
        description: `Viewing details for ${club.name}`,
        variant: "default",
      });
    }
    
    // Show error toast if there's an issue
    if (error) {
      toast({
        title: "Error loading club data",
        description: "Please try again or select another club.",
        variant: "destructive",
      });
    }
  }, [club, loading, error, toast]);
  
  if (loading) {
    return <ClubLoading />;
  }

  if (error || !club) {
    return <ClubError error={error} />;
  }
  
  return (
    <div className="min-h-screen bg-linen dark:bg-navy-dark pb-28">
      <Navbar />
      <ClubContent club={club} />
      <BottomNav />
    </div>
  );
};

export default ClubDetail;
