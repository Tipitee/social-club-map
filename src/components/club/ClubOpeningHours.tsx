
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface OpeningHoursItem {
  day: string;
  hours: string;
}

interface ClubOpeningHoursProps {
  hours: OpeningHoursItem[];
}

const ClubOpeningHours: React.FC<ClubOpeningHoursProps> = ({ hours }) => {
  const getCurrentDayIndex = () => {
    const day = new Date().getDay();
    return day === 0 ? 6 : day - 1; // Sunday is 0 in JS but 6 in our array
  };

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-4 text-card-foreground">Opening Hours</h3>
        
        <div className="space-y-2">
          {hours.map((item, index) => (
            <div 
              key={index} 
              className={`flex justify-between ${
                index === getCurrentDayIndex() 
                  ? 'font-bold text-primary' 
                  : 'text-card-foreground'
              }`}
            >
              <span>{item.day}</span>
              <span>{item.hours}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClubOpeningHours;
