
import React from "react";
import { Star, Edit, Trash2 } from "lucide-react";
import { JournalEntry } from "@/types/journal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface JournalEntryComponentProps {
  entry: JournalEntry;
}

const JournalEntryComponent: React.FC<JournalEntryComponentProps> = ({ entry }) => {
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
          size={20}
        />
      );
    }
    return stars;
  };

  const getEffectivenessLabel = (rating: number) => {
    if (rating >= 4) return "Very Effective";
    if (rating >= 3) return "Effective";
    return "Moderately Effective";
  };
  
  const getMoodEmoji = (mood: string) => {
    const lowerMood = mood.toLowerCase();
    if (lowerMood.includes("relax")) return "😌";
    if (lowerMood.includes("creat")) return "🤩";
    if (lowerMood.includes("happy")) return "😊";
    if (lowerMood.includes("energy") || lowerMood.includes("focus")) return "⚡";
    if (lowerMood.includes("sleep")) return "😴";
    return "😊";
  };
  
  return (
    <Card className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 p-6 mb-6">
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-bold mb-4 text-white">{entry.date}</h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-800">
            <Edit size={18} />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500 hover:bg-gray-800">
            <Trash2 size={18} />
          </Button>
        </div>
      </div>
      
      <div className="flex justify-between mb-3">
        <span className="text-gray-400">Dosage:</span>
        <span className="text-white font-medium">{entry.dosage} {entry.dosageType}</span>
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between">
          <span className="text-gray-400">Effectiveness:</span>
          <span className="text-white font-medium ml-2">({getEffectivenessLabel(entry.effectiveness)})</span>
        </div>
        <div className="flex mt-1">
          {renderStars(entry.effectiveness)}
        </div>
      </div>
      
      <div className="flex justify-between mb-3">
        <span className="text-gray-400">Mood:</span>
        <div className="flex items-center">
          <span className="mr-2">{getMoodEmoji(entry.mood)}</span>
          <span className="text-white font-medium">{entry.mood}</span>
        </div>
      </div>
      
      <div className="flex justify-between mb-3">
        <span className="text-gray-400">Activity:</span>
        <span className="text-white font-medium">{entry.activity}</span>
      </div>
      
      <div className="mb-3">
        <div className="text-gray-400 mb-2">Side Effects:</div>
        <div className="flex flex-wrap gap-2">
          {entry.sideEffects.map((effect, index) => (
            <span key={index} className="bg-gray-800 px-3 py-1 rounded-full text-sm text-white border border-gray-700">
              {effect}
            </span>
          ))}
        </div>
      </div>
      
      {entry.notes && (
        <div className="mt-4">
          <div className="text-gray-400 mb-1">Notes:</div>
          <p className="text-white bg-gray-800 p-3 rounded-md border border-gray-700">{entry.notes}</p>
        </div>
      )}
    </Card>
  );
};

export default JournalEntryComponent;
