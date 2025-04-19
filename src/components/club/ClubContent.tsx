
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Info, Leaf, Calendar, AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import ClubHeader from "@/components/club/ClubHeader";
import ClubTabContent from "@/components/club/ClubTabContent";
import { ClubResult } from "@/types/club";
import { mockClubDetails } from "@/components/club/mockData";
import { Button } from "@/components/ui/button";

interface ClubContentProps {
  club: ClubResult;
  fromSearch?: boolean;
}

const ClubContent: React.FC<ClubContentProps> = ({
  club,
  fromSearch = false
}) => {
  const [activeTab, setActiveTab] = useState("info");
  const navigate = useNavigate();
  const location = useLocation();

  const handleBackClick = () => {
    console.log("Back button clicked - fromSearch:", fromSearch);
    if (fromSearch || location.state?.fromSearch) {
      navigate(-1);
    } else {
      navigate("/clubs");
    }
  };

  return (
    <div className="container px-4 py-6 max-w-7xl mx-auto rounded-lg shadow-md bg-background">
      <div className="mb-4">
        <Button 
          variant="ghost" 
          onClick={handleBackClick} 
          className="inline-flex items-center font-medium text-[hsl(var(--back-button-text))] bg-[hsl(var(--back-button-bg))] hover:bg-[hsl(var(--back-button-hover))]"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back
        </Button>
      </div>
      
      {club.status !== "verified" && (
        <Alert variant="warning" className="mb-4 bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
          <AlertTitle className="text-amber-800 dark:text-amber-400 font-medium">Unverified Listing</AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-300">
            <div className="flex flex-col">
              <span>This information is not verified, details may not be accurate.</span>
              <div className="mt-1">
                <Button variant="link" className="text-primary p-0 h-auto text-left w-auto">
                  Suggest modifications or contact us to get verified.
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      <Alert className="mb-4 bg-info-background border-info-border">
        <Info className="h-4 w-4 text-info-icon" />
        <AlertTitle className="text-info-title font-medium">Important</AlertTitle>
        <AlertDescription className="text-info-description">
          The information is provided by users and might not be up to date or correct. 
          If you own the club, contact us to get verified!
        </AlertDescription>
      </Alert>
      
      <ClubHeader club={club} memberCount={mockClubDetails.memberCount} openingHours={mockClubDetails.openingHours} foundingDate={mockClubDetails.foundingDate} />
      
      <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="bg-background border border-border mb-6 shadow-sm px-0 mx-[13px]">
          <TabsTrigger value="info" className="text-card-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium">
            <Info size={16} className="mr-2" />
            Information
          </TabsTrigger>
          <TabsTrigger value="strains" className="text-card-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium">
            <Leaf size={16} className="mr-2" />
            Strains
          </TabsTrigger>
          <TabsTrigger value="events" className="text-card-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium">
            <Calendar size={16} className="mr-2" />
            Events
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="mt-0 rounded-lg p-6 shadow-md border border-border bg-background">
          <ClubTabContent tab="info" club={club} />
        </TabsContent>
        
        <TabsContent value="strains" className="mt-0 rounded-lg p-6 shadow-md border border-border bg-card">
          <ClubTabContent tab="strains" club={club} />
        </TabsContent>
        
        <TabsContent value="events" className="mt-0 rounded-lg p-6 shadow-md border border-border bg-card">
          <ClubTabContent tab="events" club={club} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClubContent;
