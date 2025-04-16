
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ClubMembershipProps {
  membershipFee: string;
  waitTime: string;
}

const ClubMembership: React.FC<ClubMembershipProps> = ({ membershipFee, waitTime }) => {
  return (
    <Card className="border-navy-DEFAULT dark:border-navy-light bg-linen dark:bg-navy-light">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-4 text-navy-dark dark:text-white">Membership Information</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-navy-dark dark:text-white">Fees</h4>
            <p className="text-gray-700 dark:text-gray-300">{membershipFee}</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-navy-dark dark:text-white">Expected Wait Time</h4>
            <p className="text-gray-700 dark:text-gray-300">{waitTime}</p>
          </div>
          
          <div className="pt-4">
            <Button 
              className="w-full bg-teal hover:bg-teal-dark text-white font-medium py-3 h-auto"
            >
              Request Membership Information
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClubMembership;
