
import React from "react";
import { Card } from "@/components/ui/card";
import { ClubResult } from "@/types/club";

interface ClubMapProps {
  club: ClubResult;
}

const ClubMap: React.FC<ClubMapProps> = ({ club }) => {
  // We're not displaying the map component anymore as requested
  return null;
};

export default ClubMap;
