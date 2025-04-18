import React from "react";
import { Card, CardContent } from "@/components/ui/card";
interface OpeningHoursItem {
  day: string;
  hours: string;
}
interface ClubOpeningHoursProps {
  hours: OpeningHoursItem[];
}
const ClubOpeningHours: React.FC<ClubOpeningHoursProps> = ({
  hours
}) => {
  const getCurrentDayIndex = () => {
    const day = new Date().getDay();
    return day === 0 ? 6 : day - 1; // Sunday is 0 in JS but 6 in our array
  };
  return <Card className="border-navy-DEFAULT dark:border-navy-light bg-white dark:bg-navy-light">
      <CardContent className="p-6 bg-linen-500">
        <h3 className="text-xl font-bold mb-4 text-navy-dark dark:text-white">Opening Hours</h3>
        
        <div className="space-y-2">
          {hours.map((item, index) => <div key={index} className={`flex justify-between ${index === getCurrentDayIndex() ? 'font-bold text-teal dark:text-teal-light' : ''}`}>
              <span className="text-navy-dark dark:text-gray-200">{item.day}</span>
              <span className="text-navy-dark dark:text-gray-200">{item.hours}</span>
            </div>)}
        </div>
      </CardContent>
    </Card>;
};
export default ClubOpeningHours;