
import React from "react";
import { Card } from "@/components/ui/card";
import { ClubResult } from "@/hooks/use-clubs-search";

interface ClubMapProps {
  club: ClubResult;
}

const ClubMap: React.FC<ClubMapProps> = ({ club }) => {
  if (!club?.latitude || !club?.longitude) {
    return null;
  }

  return (
    <Card className="border-navy-DEFAULT dark:border-navy-light bg-white dark:bg-navy-light overflow-hidden">
      <iframe 
        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAv_1hk3mQJ9JWbSyKMM1YYJ1sAUkfgjfk&q=${club.latitude},${club.longitude}`}
        width="100%" 
        height="200" 
        style={{ border: 0 }} 
        allowFullScreen={true}
        loading="lazy"
        title={`Location of ${club.name}`}
        className="w-full"
      />
    </Card>
  );
};

export default ClubMap;
