
import React from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";

const ClubMap: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container px-4 py-6">
        <h1 className="text-2xl font-bold mb-6 text-foreground">Cannabis Clubs in Germany</h1>
        
        <div className="mb-6">
          <p className="mb-4 text-muted-foreground">
            Explore cannabis clubs across Germany. The map below shows established and upcoming clubs in major cities.
          </p>
        </div>
        
        <div className="w-full h-[70vh] rounded-lg overflow-hidden shadow-lg border border-border mb-6 bg-card">
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
        
        <Card className="mt-6 border-border">
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-2 text-foreground">About German Cannabis Clubs</h2>
            <p className="text-muted-foreground text-sm">
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
