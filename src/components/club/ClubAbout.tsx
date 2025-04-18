
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClubResult } from "@/types/club";

interface ClubAboutProps {
  club: ClubResult;
  specialties: string[];
  facilities: string[];
}

const ClubAbout: React.FC<ClubAboutProps> = ({
  club,
  specialties,
  facilities
}) => {
  return (
    <Card className="bg-background border-border shadow-md">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-4 text-foreground">About</h3>
        <p className="text-muted-foreground mb-6">
          {club?.description || "No description available for this club."}
        </p>
        
        <h4 className="font-semibold mb-2 text-foreground">Specialties</h4>
        <div className="flex flex-wrap gap-2 mb-6">
          {specialties.map((specialty, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="bg-background/50 text-foreground border-border"
            >
              {specialty}
            </Badge>
          ))}
        </div>
        
        <h4 className="font-semibold mb-2 text-foreground">Facilities</h4>
        <div className="flex flex-wrap gap-2">
          {facilities.map((facility, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="bg-background/50 text-foreground border-border"
            >
              {facility}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClubAbout;
