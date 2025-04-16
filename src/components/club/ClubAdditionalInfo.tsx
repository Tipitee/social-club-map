
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ClubResult } from "@/types/club";
import { ExternalLink } from "lucide-react";

interface ClubAdditionalInfoProps {
  club: ClubResult;
}

const ClubAdditionalInfo: React.FC<ClubAdditionalInfoProps> = ({ club }) => {
  if (!club?.additional_info && !club?.website) {
    return null;
  }
  
  // Function to make URLs in text clickable
  const renderTextWithLinks = (text: string) => {
    if (!text) return null;
    
    // Regex to detect URLs in text
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a 
            key={i} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-teal hover:underline inline-flex items-center"
          >
            {part}
            <ExternalLink size={14} className="ml-1" />
          </a>
        );
      }
      return part;
    });
  };
  
  return (
    <Card className="border-navy-DEFAULT/30 dark:border-navy-light/50 bg-white dark:bg-navy-400 shadow-md">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-4 text-navy-dark dark:text-white">Additional Information</h3>
        
        {club.additional_info && (
          <p className="text-navy-dark dark:text-gray-200 mb-4">
            {renderTextWithLinks(club.additional_info)}
          </p>
        )}
        
        {club.website && (
          <div className="mt-2">
            <span className="text-navy-dark dark:text-gray-300 font-medium">Website: </span>
            <a 
              href={club.website.startsWith('http') ? club.website : `https://${club.website}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-teal hover:underline inline-flex items-center break-all"
            >
              {club.website}
              <ExternalLink size={14} className="ml-1 flex-shrink-0" />
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClubAdditionalInfo;
