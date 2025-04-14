
import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useTranslation } from "react-i18next";

interface ClubErrorProps {
  error: string | null;
}

const ClubError: React.FC<ClubErrorProps> = ({ error }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

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
};

export default ClubError;
