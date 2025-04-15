
import React from "react";
import Navbar from "@/components/Navbar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import GeocodingTool from "@/components/admin/GeocodingTool";

const AdminTools: React.FC = () => {
  return (
    <div className="min-h-screen bg-linen dark:bg-navy-dark pb-28">
      <Navbar />
      <div className="container px-4 py-6 max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-navy-dark dark:text-white">
          Admin Tools
        </h1>
        
        <Alert className="mb-6">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Admin Access Only</AlertTitle>
          <AlertDescription>
            These tools are intended for administrators to manage application data.
            Please use them with caution.
          </AlertDescription>
        </Alert>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-navy-dark dark:text-white">
            Club Data Enhancement
          </h2>
          <GeocodingTool />
        </div>
      </div>
    </div>
  );
};

export default AdminTools;
