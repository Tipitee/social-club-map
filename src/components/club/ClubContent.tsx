
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const ClubContent: React.FC<ClubContentProps> = ({ club, fromSearch = false }) => {
  const [activeTab, setActiveTab] = useState("info");
  const navigate = useNavigate();
  
  const handleBackClick = () => {
    if (fromSearch) {
      navigate(-1); // Goes back to the previous page (search results)
    } else {
      navigate("/clubs"); // Redirects to the clubs page
    }
  };

  return (
    <div className="container px-4 py-6 max-w-7xl mx-auto">
      <div className="mb-4">
        <Button 
          variant="ghost" 
          className="inline-flex items-center text-teal dark:text-teal-light hover:underline font-medium"
          onClick={handleBackClick}
        >
          <ArrowLeft size={16} className="mr-1" />
          Back
        </Button>
      </div>
      
      <Alert variant="warning" className="mb-4 bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700">
        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
        <AlertTitle className="text-amber-800 dark:text-amber-400 font-medium">Unverified Listing</AlertTitle>
        <AlertDescription className="text-amber-700 dark:text-amber-300">
          <div className="flex flex-col">
            <span>This information is not verified, details may not be accurate.</span>
            <Button variant="link" className="text-teal dark:text-teal-light p-0 h-auto mt-1 text-left w-fit">
              Suggest modifications or contact us to get verified.
            </Button>
          </div>
        </AlertDescription>
      </Alert>
      
      <ClubHeader 
        club={club} 
        memberCount={mockClubDetails.memberCount}
        openingHours={mockClubDetails.openingHours}
        foundingDate={mockClubDetails.foundingDate}
      />
      
      <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="bg-white/90 dark:bg-navy-400 border border-navy-DEFAULT/20 dark:border-navy-light/20 mb-6 shadow-sm">
          <TabsTrigger 
            value="info" 
            className="text-navy-dark dark:text-white data-[state=active]:bg-teal data-[state=active]:text-white font-medium"
          >
            <Info size={16} className="mr-2" />
            Information
          </TabsTrigger>
          <TabsTrigger 
            value="strains" 
            className="text-navy-dark dark:text-white data-[state=active]:bg-teal data-[state=active]:text-white font-medium"
          >
            <Leaf size={16} className="mr-2" />
            Strains
          </TabsTrigger>
          <TabsTrigger 
            value="events" 
            className="text-navy-dark dark:text-white data-[state=active]:bg-teal data-[state=active]:text-white font-medium"
          >
            <Calendar size={16} className="mr-2" />
            Events
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="mt-0 bg-white dark:bg-navy-400 rounded-lg p-6 shadow-md border border-gray-100 dark:border-navy-300">
          <ClubTabContent tab="info" club={club} />
        </TabsContent>
        
        <TabsContent value="strains" className="mt-0 bg-white dark:bg-navy-400 rounded-lg p-6 shadow-md border border-gray-100 dark:border-navy-300">
          <ClubTabContent tab="strains" club={club} />
        </TabsContent>
        
        <TabsContent value="events" className="mt-0 bg-white dark:bg-navy-400 rounded-lg p-6 shadow-md border border-gray-100 dark:border-navy-300">
          <ClubTabContent tab="events" club={club} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClubContent;
