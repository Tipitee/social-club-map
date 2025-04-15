
import React from "react";
import { MapPin, Users, Clock, Calendar, Building } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ClubResult } from "@/hooks/use-clubs-search";

interface ClubHeaderProps {
  club: ClubResult;
  memberCount: number;
  openingHours: { day: string; hours: string }[];
  foundingDate: string;
}

const ClubHeader: React.FC<ClubHeaderProps> = ({ 
  club, 
  memberCount, 
  openingHours,
  foundingDate 
}) => {
  return (
    <div className="bg-white dark:bg-navy-400 rounded-lg shadow-md overflow-hidden mb-6 border border-navy-DEFAULT/20 dark:border-navy-light/30">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-navy-dark dark:text-white">
              {club?.name}
            </h1>
            <div className="flex items-center mt-1 text-gray-600 dark:text-gray-300">
              <MapPin size={16} className="mr-1 flex-shrink-0 text-teal dark:text-teal-light" />
              <span>{club?.address}</span>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Badge variant={club?.membership_status ? "success" : "warning"} className="mb-2">
              {club?.membership_status ? "Accepting Members" : "Waiting List"}
            </Badge>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <Users size={14} className="mr-1 text-teal dark:text-teal-light" />
              <span>{memberCount} members</span>
            </div>
          </div>
        </div>
        
        {/* Quick info pills */}
        <div className="flex flex-wrap gap-3 mt-4">
          <div className="bg-gray-100 dark:bg-navy-300 px-3 py-1 rounded-full flex items-center text-xs text-navy-dark dark:text-white">
            <Clock size={12} className="mr-1 text-teal dark:text-teal-light" />
            Open today: {openingHours[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1].hours}
          </div>
          
          <div className="bg-gray-100 dark:bg-navy-300 px-3 py-1 rounded-full flex items-center text-xs text-navy-dark dark:text-white">
            <Calendar size={12} className="mr-1 text-teal dark:text-teal-light" />
            Founded: {foundingDate}
          </div>
          
          <div className="bg-gray-100 dark:bg-navy-300 px-3 py-1 rounded-full flex items-center text-xs text-navy-dark dark:text-white">
            <Building size={12} className="mr-1 text-teal dark:text-teal-light" />
            {club?.city || "Unknown Location"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubHeader;
