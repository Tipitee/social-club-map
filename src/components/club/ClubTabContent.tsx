
import React from "react";
import ClubAbout from "./ClubAbout";
import ClubMembership from "./ClubMembership";
import ClubAdditionalInfo from "./ClubAdditionalInfo";
import ClubContactInfo from "./ClubContactInfo";
import ClubOpeningHours from "./ClubOpeningHours";
import ClubMap from "./ClubMap";
import ClubStrains from "./ClubStrains";
import ClubEvents from "./ClubEvents";
import { mockClubDetails } from "./mockData";
import { ClubResult } from "@/hooks/use-clubs-search";

interface ClubTabContentProps {
  tab: string;
  club: ClubResult;
}

const ClubTabContent: React.FC<ClubTabContentProps> = ({ tab, club }) => {
  if (tab === "info") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - About & Details */}
        <div className="lg:col-span-2 space-y-6">
          <ClubAbout 
            club={club} 
            specialties={mockClubDetails.specialties}
            facilities={mockClubDetails.facilities}
          />
          
          <ClubMembership 
            membershipFee={mockClubDetails.membershipFee}
            waitTime={mockClubDetails.membershipWaitTime}
          />
          
          <ClubAdditionalInfo club={club} />
        </div>
        
        {/* Right column - Contact & Hours */}
        <div className="space-y-6">
          <ClubContactInfo club={club} />
          
          <ClubOpeningHours hours={mockClubDetails.openingHours} />
          
          <ClubMap club={club} />
        </div>
      </div>
    );
  }

  if (tab === "strains") {
    return <ClubStrains strains={mockClubDetails.strains} />;
  }

  if (tab === "events") {
    return <ClubEvents events={mockClubDetails.events} />;
  }

  return null;
};

export default ClubTabContent;
