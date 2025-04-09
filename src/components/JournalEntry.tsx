
import React from "react";
import { Star } from "lucide-react";
import { JournalEntry } from "@/types/journal";

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
          className={`${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}`}
          size={20}
        />
      );
    }
    return stars;
  };

  const getEffectivenessLabel = (rating: number) => {
    if (rating >= 4) return "veryEffective";
    if (rating >= 3) return "effective";
    return "moderatelyEffective";
  };
  
  return (
    <div className="bg-card rounded-xl shadow-lg border border-gray-800 p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">{entry.date}</h2>
      
      <div className="flex justify-between mb-3">
        <span className="text-gray-400">dosage:</span>
        <span className="text-white">{entry.dosage} {entry.dosageType}</span>
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between">
          <span className="text-gray-400">Effectiveness:</span>
          <span className="text-white ml-2">({getEffectivenessLabel(entry.effectiveness)})</span>
        </div>
        <div className="flex mt-1">
          {renderStars(entry.effectiveness)}
        </div>
      </div>
      
      <div className="flex justify-between mb-3">
        <span className="text-gray-400">mood:</span>
        <div className="flex items-center">
          <span className="mr-2">{entry.mood === "relaxed" ? "😌" : entry.mood === "Creative" ? "🤩" : "😊"}</span>
          <span>{entry.mood}</span>
        </div>
      </div>
      
      <div className="flex justify-between mb-3">
        <span className="text-gray-400">activity:</span>
        <span className="text-white">{entry.activity}</span>
      </div>
      
      <div className="mb-3">
        <div className="text-gray-400 mb-2">Side Effects:</div>
        <div className="flex flex-wrap gap-2">
          {entry.sideEffects.map((effect, index) => (
            <span key={index} className="bg-gray-700 px-3 py-1 rounded-full text-sm">
              {effect}
            </span>
          ))}
        </div>
      </div>
      
      {entry.notes && (
        <div className="mt-4">
          <div className="text-gray-400 mb-1">notes:</div>
          <p className="text-white">{entry.notes}</p>
        </div>
      )}
    </div>
  );
};

export default JournalEntryComponent;
