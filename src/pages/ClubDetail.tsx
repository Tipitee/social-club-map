
import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useClubDetail } from "@/hooks/use-club-detail";
import ClubLoading from "@/components/club/ClubLoading";
import ClubError from "@/components/club/ClubError";
import ClubContent from "@/components/club/ClubContent";
import BottomNav from "@/components/BottomNav";
import { Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Capacitor } from "@capacitor/core";
import { toast } from "@/hooks/use-toast";

const ClubDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  // Safely access state and provide default value
  const fromSearch = location.state?.fromSearch || false;
  const [isNative, setIsNative] = useState(false);
  
  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());
  }, []);
  
  // Handle the case where id might be undefined
  const safeId = id || '';
  const { club, loading, error } = useClubDetail(safeId);
  
  // Share functionality
  const shareClub = async () => {
    if (!club) return;
    
    const shareData = {
      title: `Green Bud Guide - ${club.name}`,
      text: `Check out ${club.name} on Green Bud Guide`,
      url: window.location.href
    };
    
    if (Capacitor.isNativePlatform()) {
      // On native platforms, we'd use a plugin for sharing
      // This is a placeholder for future implementation
      toast({
        title: "Share",
        description: "Sharing functionality will be available in the next update",
      });
    } else if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback for browsers that don't support sharing
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Club link copied to clipboard",
      });
    }
  };
  
  useEffect(() => {
    if (!location.state) {
      sessionStorage.setItem('direct-club-access', 'true');
    }
    
    // Log details about the navigation state
    console.log("Club detail - From search:", fromSearch);
    console.log("Club detail - ID:", safeId);
  }, [location.state, safeId, fromSearch]);
  
  // If user tries to access by direct URL and club is not found
  useEffect(() => {
    if (error && !location.state) {
      // Add a small delay to allow the error to be displayed before navigating away
      const timer = setTimeout(() => {
        navigate('/clubs', { replace: true });
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [error, location.state, navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-16">
        <Navbar />
        <ClubLoading />
        <BottomNav />
      </div>
    );
  }

  if (error || !club) {
    return (
      <div className="min-h-screen bg-background pt-16">
        <Navbar />
        <ClubError error={error} />
        <BottomNav />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background pb-20 pt-16">
      <Navbar />
      <div className="container px-4 max-w-7xl mx-auto relative">
        {isNative && (
          <div className="absolute top-2 right-2 z-10">
            <Button 
              onClick={shareClub}
              size="icon"
              variant="ghost"
              className="h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm shadow-md"
            >
              <Share className="h-5 w-5 text-foreground" />
            </Button>
          </div>
        )}
      </div>
      <ClubContent club={club} fromSearch={fromSearch} />
    </div>
  );
};

export default ClubDetail;
