
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ClubMembershipProps {
  membershipFee: string;
  waitTime: string;
  className?: string;
}

const ClubMembership: React.FC<ClubMembershipProps> = ({
  membershipFee,
  waitTime,
  className = ""
}) => {
  return (
    <Card className={`bg-transparent border-border shadow-md ${className}`}>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-4 text-card-foreground">Membership Information</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-card-foreground">Fees</h4>
            <p className="text-muted-foreground">{membershipFee}</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-card-foreground">Expected Wait Time</h4>
            <p className="text-muted-foreground">{waitTime}</p>
          </div>
          
          <div className="pt-4 text-center">
            <Button 
              variant="default" 
              className="w-full md:max-w-sm lg:max-w-md mx-auto text-primary-foreground font-medium h-auto py-3 membership-request-button"
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
