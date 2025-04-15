
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ClubResult } from "@/hooks/use-clubs-search";

interface ClubAdditionalInfoProps {
  club: ClubResult;
}

const ClubAdditionalInfo: React.FC<ClubAdditionalInfoProps> = ({ club }) => {
  if (!club?.additional_info) {
    return null;
  }
  
  return (
    <Card className="border-navy-DEFAULT/30 dark:border-navy-light/50 bg-white dark:bg-navy-400 shadow-md">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-4 text-navy-dark dark:text-white">Additional Information</h3>
        <p className="text-navy-dark dark:text-gray-200">{club.additional_info}</p>
      </CardContent>
    </Card>
  );
};

export default ClubAdditionalInfo;
