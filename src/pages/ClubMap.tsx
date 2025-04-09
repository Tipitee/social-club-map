
import React from "react";
import MockMap from "@/components/MockMap";

const ClubMap: React.FC = () => {
  return (
    <div className="container px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Cannabis Clubs in Germany</h1>
      
      <div className="mb-6">
        <p className="text-gray-300 mb-4">
          Explore cannabis clubs across Germany. The map below shows clubs in major cities:
        </p>
        <ul className="list-disc list-inside text-gray-400 mb-4 pl-2">
          <li>Berlin - Northeastern Germany</li>
          <li>Munich - Southern Bavaria</li>
          <li>Hamburg - Northern Germany</li>
          <li>Cologne - Western Germany</li>
        </ul>
        <p className="text-sm text-gray-500 italic">
          *Currently displaying mock data - Real club locations coming soon
        </p>
      </div>
      
      <MockMap />
      
      <div className="mt-6 p-4 bg-card rounded-lg border border-gray-800">
        <h2 className="text-lg font-semibold mb-2">About German Cannabis Clubs</h2>
        <p className="text-gray-300 text-sm">
          Cannabis Social Clubs in Germany are part of the country's new cannabis policy. 
          These non-profit associations allow members to collectively cultivate and 
          distribute cannabis for personal use, providing a regulated alternative to 
          the illicit market.
        </p>
      </div>
    </div>
  );
};

export default ClubMap;
