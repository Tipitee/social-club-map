
import React from "react";
import { Phone, Mail, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ClubResult } from "@/hooks/use-clubs-search";

interface ClubContactInfoProps {
  club: ClubResult;
}

const ClubContactInfo: React.FC<ClubContactInfoProps> = ({ club }) => {
  return (
    <Card className="border-navy-DEFAULT dark:border-navy-light bg-white dark:bg-navy-light">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-4 text-navy-dark dark:text-white">Contact</h3>
        
        <div className="space-y-3">
          {club?.contact_phone && (
            <div className="flex items-start">
              <Phone size={18} className="mr-3 mt-0.5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-gray-700 dark:text-gray-300">{club.contact_phone}</p>
              </div>
            </div>
          )}
          
          {club?.contact_email && (
            <div className="flex items-start">
              <Mail size={18} className="mr-3 mt-0.5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
              <div>
                <a href={`mailto:${club.contact_email}`} className="text-teal dark:text-teal-light hover:underline">
                  {club.contact_email}
                </a>
              </div>
            </div>
          )}
          
          {club?.website && (
            <div className="flex items-start">
              <Globe size={18} className="mr-3 mt-0.5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
              <div>
                <a href={club.website} target="_blank" rel="noopener noreferrer" className="text-teal dark:text-teal-light hover:underline">
                  {club.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            </div>
          )}
          
          {!club?.contact_phone && !club?.contact_email && !club?.website && (
            <p className="text-gray-500 dark:text-gray-400 italic">No contact information available</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClubContactInfo;
