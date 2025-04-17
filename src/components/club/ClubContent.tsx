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
  return <div className="container px-4 py-6 max-w-7xl mx-auto rounded-lg shadow-md bg-navy-200">
      <div className="mb-4">
        <Button variant="ghost" onClick={handleBackClick} className="inline-flex items-center text-teal dark:text-teal-light hover:underline font-medium bg-navy-200 hover:bg-navy-100">
          <ArrowLeft size={16} className="mr-1" />
          Back
        </Button>
      </div>
      
      {club.status !== "verified" && <Alert variant="warning" className="mb-4 bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
          <AlertTitle className="text-amber-800 dark:text-amber-400 font-medium">Unverified Listing</AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-300">
            <div className="flex flex-col">
              <span>This information is not verified, details may not be accurate.</span>
              <div className="mt-1">
                <Button variant="link" className="text-teal dark:text-teal-light p-0 h-auto text-left w-auto">
                  Suggest modifications or contact us to get verified.
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>}
      
      {/* Always show a warning about exact location data protection */}
      <Alert className="mb-4 bg-teal-50 dark:bg-teal-900/20 border-teal-300 dark:border-teal-800">
        <Info className="h-4 w-4 text-teal dark:text-teal-light" />
        <AlertTitle className="text-navy-dark dark:text-white font-medium">Important</AlertTitle>
        <AlertDescription className="text-navy-dark/80 dark:text-gray-300">The informations are provided by users and might not be up to date or correct. If you own the club, contact us to get verified!</AlertDescription>
      </Alert>
      
      <ClubHeader club={club} memberCount={mockClubDetails.memberCount} openingHours={mockClubDetails.openingHours} foundingDate={mockClubDetails.foundingDate} />
      
      <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="bg-linen dark:bg-navy-400 border border-navy-DEFAULT/20 dark:border-navy-light/20 mb-6 shadow-sm px-0 mx-[13px]">
          <TabsTrigger value="info" className="text-navy-dark dark:text-white data-[state=active]:bg-teal data-[state=active]:text-white font-medium">
            <Info size={16} className="mr-2" />
            Information
          </TabsTrigger>
          <TabsTrigger value="strains" className="text-navy-dark dark:text-white data-[state=active]:bg-teal data-[state=active]:text-white font-medium">
            <Leaf size={16} className="mr-2" />
            Strains
          </TabsTrigger>
          <TabsTrigger value="events" className="text-navy-dark dark:text-white data-[state=active]:bg-teal data-[state=active]:text-white font-medium">
            <Calendar size={16} className="mr-2" />
            Events
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="mt-0 rounded-lg p-6 shadow-md border border-gray-100 dark:border-navy-300 bg-navy-200">
          <ClubTabContent tab="info" club={club} />
        </TabsContent>
        
        <TabsContent value="strains" className="mt-0 bg-white dark:bg-navy-DEFAULT rounded-lg p-6 shadow-md border border-gray-100 dark:border-navy-300">
          <ClubTabContent tab="strains" club={club} />
        </TabsContent>
        
        <TabsContent value="events" className="mt-0 bg-white dark:bg-navy-DEFAULT rounded-lg p-6 shadow-md border border-gray-100 dark:border-navy-300">
          <ClubTabContent tab="events" club={club} />
        </TabsContent>
      </Tabs>
    </div>;
};
export default ClubContent;