
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ClubMembershipProps {
  membershipFee: string;
  waitTime: string;
}

const ClubMembership: React.FC<ClubMembershipProps> = ({
  membershipFee,
  waitTime
}) => {
  // Use CSS variables from our theme system which are properly isolated
  return (
    <Card className="bg-card border-border shadow-md">
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
          
          <div className="pt-4">
            <Button variant="default" className="w-full text-primary-foreground font-medium h-auto py-3">
              Request Membership Information
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClubMembership;
