
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
        <Link to="/clubs" className="inline-flex items-center text-teal dark:text-teal-light hover:underline font-medium">
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
