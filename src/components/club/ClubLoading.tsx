
import React from "react";
import { Loader2 } from "lucide-react";

const ClubLoading: React.FC = () => {
  return (
    <div className="min-h-screen bg-linen dark:bg-navy-dark flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal mx-auto mb-4" />
        <p className="text-navy-dark dark:text-white">Loading club details...</p>
      </div>
    </div>
  );
};

export default ClubLoading;
