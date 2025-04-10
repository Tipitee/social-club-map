
import React, { useState } from "react";
import { Book, Plus, Calendar, Filter } from "lucide-react";
import JournalEntryComponent from "@/components/JournalEntry";
import { JournalEntry } from "@/types/journal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="container px-4 py-6 mb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Journal</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
            <span className="hidden sm:inline ml-1">Filters</span>
          </Button>
          <Button 
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Plus size={18} />
            <span className="hidden sm:inline ml-1">New Entry</span>
          </Button>
        </div>
      </div>

      {showFilters && (
        <Card className="mb-6 bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Date Range</label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
                    <Calendar size={16} className="mr-1" />
                    Select Dates
                  </Button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Effectiveness</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button 
                      key={star} 
                      variant="outline" 
                      size="sm" 
                      className="px-3 py-1 bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white"
                    >
                      {star}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {entries.length > 0 ? (
        <div className="space-y-4">
          {entries.map(entry => (
            <JournalEntryComponent key={entry.id} entry={entry} />
          ))}
        </div>
      ) : (
        <Card className="bg-gray-900 p-8 rounded-lg text-center border border-gray-700">
          <Book size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2 text-white">No journal entries yet</h3>
          <p className="text-gray-300 mb-4">
            Start tracking your cannabis experiences
          </p>
          <Button className="px-4 py-2 bg-emerald-600 text-white rounded-md flex items-center gap-2 mx-auto hover:bg-emerald-700">
            <Plus size={18} />
            Add First Entry
          </Button>
        </Card>
      )}
    </div>
  );
};

export default Journal;
