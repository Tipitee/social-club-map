
import React, { useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useClubDetail } from "@/hooks/use-club-detail";
import ClubLoading from "@/components/club/ClubLoading";
import ClubError from "@/components/club/ClubError";
import ClubContent from "@/components/club/ClubContent";
import BottomNav from "@/components/BottomNav";

const ClubDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const fromSearch = Boolean(location.state?.fromSearch);
  const { club, loading, error } = useClubDetail(id);
  
  useEffect(() => {
    if (!location.state) {
      sessionStorage.setItem('direct-club-access', 'true');
    }
    
    // Log details about the navigation state
    console.log("Club detail - From search:", fromSearch);
    console.log("Club detail - ID:", id);
  }, [location.state, id, fromSearch]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-linen dark:bg-navy-dark">
        <Navbar />
        <ClubLoading />
        <BottomNav />
      </div>
    );
  }

  if (error || !club) {
    return (
      <div className="min-h-screen bg-linen dark:bg-navy-dark">
        <Navbar />
        <ClubError error={error} />
        <BottomNav />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-linen dark:bg-navy-dark pb-28">
      <Navbar />
      <ClubContent club={club} fromSearch={fromSearch} />
      <BottomNav />
    </div>
  );
};

export default ClubDetail;
