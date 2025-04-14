
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Info, Leaf, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClubHeader from "@/components/club/ClubHeader";
import ClubTabContent from "@/components/club/ClubTabContent";
import { ClubResult } from "@/hooks/use-clubs-search";
import { mockClubDetails } from "@/components/club/mockData";

interface ClubContentProps {
  club: ClubResult;
}

const ClubContent: React.FC<ClubContentProps> = ({ club }) => {
  const [activeTab, setActiveTab] = useState("info");
  
  return (
    <div className="container px-4 py-6 max-w-7xl mx-auto">
      <div className="mb-4">
        <Link to="/clubs" className="inline-flex items-center text-teal dark:text-teal-light hover:underline">
          <ArrowLeft size={16} className="mr-1" />
          Back to Club Map
        </Link>
      </div>
      
      <ClubHeader 
        club={club} 
        memberCount={mockClubDetails.memberCount}
        openingHours={mockClubDetails.openingHours}
        foundingDate={mockClubDetails.foundingDate}
      />
      
      <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="bg-white dark:bg-navy-DEFAULT border border-navy-DEFAULT/20 dark:border-navy-light/20 mb-6">
          <TabsTrigger 
            value="info" 
            className="text-navy-dark dark:text-white data-[state=active]:bg-teal data-[state=active]:text-white"
          >
            <Info size={16} className="mr-2" />
            Information
          </TabsTrigger>
          <TabsTrigger 
            value="strains" 
            className="text-navy-dark dark:text-white data-[state=active]:bg-teal data-[state=active]:text-white"
          >
            <Leaf size={16} className="mr-2" />
            Strains
          </TabsTrigger>
          <TabsTrigger 
            value="events" 
            className="text-navy-dark dark:text-white data-[state=active]:bg-teal data-[state=active]:text-white"
          >
            <Calendar size={16} className="mr-2" />
            Events
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="mt-0">
          <ClubTabContent tab="info" club={club} />
        </TabsContent>
        
        <TabsContent value="strains" className="mt-0">
          <ClubTabContent tab="strains" club={club} />
        </TabsContent>
        
        <TabsContent value="events" className="mt-0">
          <ClubTabContent tab="events" club={club} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClubContent;
