
import React, { useState } from "react";
import { Book } from "lucide-react";
import JournalEntryComponent from "@/components/JournalEntry";
import { JournalEntry } from "@/types/journal";

// Mock journal entries (in a real app, these would come from Supabase)
const mockEntries: JournalEntry[] = [
  {
    id: "1",
    date: "January 15th, 2025",
    dosage: "10mg",
    dosageType: "edible",
    effectiveness: 4,
    mood: "relaxed",
    activity: "Evening relaxation",
    sideEffects: ["Dry Mouth", "hunger"],
    notes: "Helped with anxiety and sleep. Felt relaxed after about 1 hour."
  },
  {
    id: "2",
    date: "January 10th, 2025",
    dosage: "0.5g",
    dosageType: "vaporized",
    effectiveness: 3,
    mood: "Creative",
    activity: "Music production",
    sideEffects: ["Dry Eyes", "Paranoia"],
    notes: "Good for creativity but not as relaxing as expected."
  }
];

const Journal: React.FC = () => {
  const [entries] = useState<JournalEntry[]>(mockEntries);

  return (
    <div className="container px-4 py-6 mb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Journal</h1>
        <button className="flex items-center gap-1 px-4 py-2 rounded-md bg-secondary text-white">
          <Book size={18} />
          New Entry
        </button>
      </div>

      {entries.length > 0 ? (
        <div className="space-y-4">
          {entries.map(entry => (
            <JournalEntryComponent key={entry.id} entry={entry} />
          ))}
        </div>
      ) : (
        <div className="bg-card p-8 rounded-lg text-center border border-gray-700">
          <Book size={48} className="mx-auto mb-4 text-gray-500" />
          <h3 className="text-xl font-semibold mb-2">No journal entries yet</h3>
          <p className="text-gray-400 mb-4">
            Start tracking your cannabis experiences
          </p>
          <button className="px-4 py-2 bg-secondary text-white rounded-md flex items-center gap-2 mx-auto">
            <Book size={18} />
            Add First Entry
          </button>
        </div>
      )}
    </div>
  );
};

export default Journal;
