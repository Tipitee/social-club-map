
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Strain {
  name: string;
  thc: string;
  cbd: string;
  type: string;
}

interface ClubStrainsProps {
  strains: Strain[];
}

const ClubStrains: React.FC<ClubStrainsProps> = ({ strains }) => {
  return (
    <Card className="border-navy-DEFAULT dark:border-navy-light bg-white dark:bg-navy-light">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-4 text-navy-dark dark:text-white">Available Strains</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {strains.map((strain, index) => (
            <div 
              key={index} 
              className="border border-gray-200 dark:border-navy-500 rounded-lg p-4 bg-gray-50 dark:bg-navy-400"
            >
              <h4 className="font-bold text-navy-dark dark:text-white">{strain.name}</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="bg-gray-100 dark:bg-navy-300 text-navy-dark dark:text-white border-gray-300 dark:border-navy-500">
                  {strain.type}
                </Badge>
                <Badge variant="outline" className="bg-gray-100 dark:bg-navy-300 text-navy-dark dark:text-white border-gray-300 dark:border-navy-500">
                  THC: {strain.thc}
                </Badge>
                <Badge variant="outline" className="bg-gray-100 dark:bg-navy-300 text-navy-dark dark:text-white border-gray-300 dark:border-navy-500">
                  CBD: {strain.cbd}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-sm text-gray-600 dark:text-gray-300">
          <p>* Strain availability is subject to change. Please contact the club for current inventory.</p>
          <p>* All strains are tested for quality and potency in compliance with German regulations.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClubStrains;
