
import React from "react";
import { Loader2 } from "lucide-react";

interface StrainItem {
  name: string;
  thc: string;
  cbd: string;
  type: string;
}

interface ClubStrainsProps {
  strains: StrainItem[];
}

const ClubStrains: React.FC<ClubStrainsProps> = ({ strains }) => {
  if (!strains || strains.length === 0) {
    return (
      <div className="text-center py-8">
        <Loader2 className="h-8 w-8 mx-auto mb-4 text-gray-400 animate-spin" />
        <p className="text-gray-500 dark:text-gray-300">Loading strain information...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4 text-navy-dark dark:text-white">Available Strains</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {strains.map((strain, index) => (
          <div 
            key={index} 
            className="border border-gray-200 dark:border-navy-300 rounded-lg overflow-hidden shadow-sm bg-white dark:bg-navy-500"
          >
            <div 
              className={`p-3 text-white font-medium ${
                strain.type === 'Indica' ? 'bg-strain-indica' : 
                strain.type === 'Sativa' ? 'bg-strain-sativa' : 
                'bg-strain-hybrid'
              }`}
            >
              {strain.name} - {strain.type}
            </div>
            
            <div className="p-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">THC:</span>
                <span className="text-sm font-medium text-navy-dark dark:text-white">{strain.thc}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">CBD:</span>
                <span className="text-sm font-medium text-navy-dark dark:text-white">{strain.cbd}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClubStrains;
