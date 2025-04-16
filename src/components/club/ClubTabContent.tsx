
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
import { ClubResult } from "@/types/club";

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
          <div className="bg-white dark:bg-navy-light rounded-lg p-5 shadow-sm border border-gray-100 dark:border-navy-300">
            <ClubAbout 
              club={club} 
              specialties={mockClubDetails.specialties}
              facilities={mockClubDetails.facilities}
            />
          </div>
          
          <div className="bg-white dark:bg-navy-light rounded-lg p-5 shadow-sm border border-gray-100 dark:border-navy-300">
            <ClubMembership 
              membershipFee={mockClubDetails.membershipFee}
              waitTime={mockClubDetails.membershipWaitTime}
            />
          </div>
          
          <div className="bg-white dark:bg-navy-light rounded-lg p-5 shadow-sm border border-gray-100 dark:border-navy-300">
            <ClubAdditionalInfo club={club} />
          </div>
        </div>
        
        {/* Right column - Contact & Hours */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-navy-light rounded-lg p-5 shadow-sm border border-gray-100 dark:border-navy-300">
            <ClubContactInfo club={club} />
          </div>
          
          <div className="bg-white dark:bg-navy-light rounded-lg p-5 shadow-sm border border-gray-100 dark:border-navy-300">
            <ClubOpeningHours hours={mockClubDetails.openingHours} />
          </div>
          
          {/* Map is now shown on the club detail page header or removed completely */}
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
