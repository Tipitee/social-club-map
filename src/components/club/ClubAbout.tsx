
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClubResult } from "@/hooks/use-clubs-search";

interface ClubAboutProps {
  club: ClubResult;
  specialties: string[];
  facilities: string[];
}

const ClubAbout: React.FC<ClubAboutProps> = ({ club, specialties, facilities }) => {
  return (
    <Card className="border-navy-DEFAULT/30 dark:border-navy-light/50 bg-white dark:bg-navy-400 shadow-md">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-4 text-navy-dark dark:text-white">About</h3>
        <p className="text-navy-dark dark:text-gray-200 mb-6">
          {club?.description || "No description available for this club."}
        </p>
        
        <h4 className="font-semibold mb-2 text-navy-dark dark:text-white">Specialties</h4>
        <div className="flex flex-wrap gap-2 mb-6">
          {specialties.map((specialty, index) => (
            <Badge key={index} variant="outline" className="bg-gray-50 dark:bg-navy-300 border-navy-DEFAULT/30 dark:border-navy-light/50">
              {specialty}
            </Badge>
          ))}
        </div>
        
        <h4 className="font-semibold mb-2 text-navy-dark dark:text-white">Facilities</h4>
        <div className="flex flex-wrap gap-2">
          {facilities.map((facility, index) => (
            <Badge key={index} variant="outline" className="bg-gray-50 dark:bg-navy-300 border-navy-DEFAULT/30 dark:border-navy-light/50">
              {facility}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClubAbout;
