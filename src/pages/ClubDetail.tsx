
import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useClubDetail } from "@/hooks/use-club-detail";
import ClubLoading from "@/components/club/ClubLoading";
import ClubError from "@/components/club/ClubError";
import ClubContent from "@/components/club/ClubContent";

const ClubDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { club, loading, error } = useClubDetail(id);
  
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
    </div>
  );
};

export default ClubDetail;
