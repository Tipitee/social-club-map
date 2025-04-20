import React from "react";
import ClubAbout from "./ClubAbout";
import ClubMembership from "./ClubMembership";
import ClubAdditionalInfo from "./ClubAdditionalInfo";
import ClubContactInfo from "./ClubContactInfo";
import ClubOpeningHours from "./ClubOpeningHours";
import ClubStrains from "./ClubStrains";
import ClubEvents from "./ClubEvents";
import { mockClubDetails } from "./mockData";
import { ClubResult } from "@/types/club";
interface ClubTabContentProps {
  tab: string;
  club: ClubResult;
}
const ClubTabContent: React.FC<ClubTabContentProps> = ({
  tab,
  club
}) => {
  // Ensure mockClubDetails has all the required properties before rendering
  const details = mockClubDetails || {
    openingHours: [],
    memberCount: 0,
    foundingDate: '',
    specialties: [],
    facilities: [],
    membershipFee: '',
    membershipWaitTime: '',
    strains: [],
    events: []
  };
  if (tab === "info") {
    return <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - About & Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg p-5 shadow-sm border border-gray-200 dark:border-navy-300 bg-navy-800">
            <ClubAbout club={club} specialties={details.specialties} facilities={details.facilities} />
          </div>
          
          <div className="rounded-lg p-5 shadow-sm border border-gray-200 dark:border-navy-300 bg-ashGray-400">
            <ClubMembership membershipFee={details.membershipFee} waitTime={details.membershipWaitTime} />
          </div>
          
          <div className="rounded-lg p-5 shadow-sm border border-gray-200 dark:border-navy-300 bg-ashGray-400">
            <ClubAdditionalInfo club={club} />
          </div>
        </div>
        
        {/* Right column - Contact & Hours */}
        <div className="space-y-6">
          <div className="rounded-lg p-5 shadow-sm border border-gray-200 dark:border-navy-300 bg-ashGray-400">
            <ClubContactInfo club={club} />
          </div>
          
          <div className="rounded-lg p-5 shadow-sm border border-gray-200 dark:border-navy-300 bg-ashGray-400">
            <ClubOpeningHours hours={details.openingHours} />
          </div>
        </div>
      </div>;
  }
  if (tab === "strains") {
    return <ClubStrains strains={details.strains} />;
  }
  if (tab === "events") {
    return <ClubEvents events={details.events} />;
  }
  return null;
};
export default ClubTabContent;