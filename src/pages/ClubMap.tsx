
import React from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const ClubMap: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container px-4 py-6">
        <h1 className="text-2xl font-bold mb-6 text-foreground">{t('clubs.findLocalClub')}</h1>
        
        <div className="mb-6">
          <p className="mb-4 text-muted-foreground">
            {t('clubs.findNearYou')}. {t('clubs.searchNearby')}
          </p>
        </div>
        
        <div className="w-full h-[70vh] rounded-lg overflow-hidden shadow-lg border border-border bg-card mb-6">
          <iframe 
            src="https://www.google.com/maps/d/u/0/embed?mid=1b3IKZqStnrLLakQHjyJz8Sp_JDZ8vOw&ehbc=2E312F&noprof=1" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy"
            title="Cannabis Clubs in Germany"
            className="w-full h-full" 
          />
        </div>
        
        <Card className="mt-6">
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-2 text-foreground">{t('clubs.findNearYou')}</h2>
            <p className="text-muted-foreground">
              Cannabis Social Clubs in Germany are part of the country's new cannabis policy. 
              These non-profit associations allow members to collectively cultivate and 
              distribute cannabis for personal use, providing a regulated alternative to 
              the illicit market.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClubMap;
