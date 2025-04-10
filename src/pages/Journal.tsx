
import React, { useState } from "react";
import { Book, Plus, Calendar, Filter, CalendarDays, Clock } from "lucide-react";
import JournalEntryComponent from "@/components/JournalEntry";
import { JournalEntry } from "@/types/journal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

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
    notes: "Good for creativity but not as relaxing as expected. The effects lasted around 2 hours with a gradual come down. I was able to focus on my music project and came up with some interesting melody ideas. Next time I might try a slightly smaller dose to reduce the paranoia effect."
  },
  {
    id: "3",
    date: "January 2nd, 2025",
    dosage: "15mg",
    dosageType: "tincture",
    effectiveness: 5,
    mood: "Sleepy",
    activity: "Sleep aid",
    sideEffects: ["Dry Mouth"],
    notes: "Perfect for sleep. Took about 45 minutes to kick in and helped me fall asleep quickly."
  }
];

type FilterState = {
  effectiveness: number | null;
  dateRange: { start: Date | null; end: Date | null };
  searchText: string;
};

const Journal: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>(mockEntries);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    effectiveness: null,
    dateRange: { start: null, end: null },
    searchText: ""
  });
  const { toast } = useToast();

  const deleteEntry = (id: string) => {
    setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
    toast({
      title: "Entry deleted",
      description: "Journal entry has been removed successfully",
    });
  };

  const handleEditEntry = (entry: JournalEntry) => {
    toast({
      title: "Edit functionality",
      description: "Edit form would open here in a real app",
    });
    console.log("Editing entry:", entry);
  };

  const handleEffectivenessFilter = (rating: number) => {
    setFilters(prev => ({
      ...prev,
      effectiveness: prev.effectiveness === rating ? null : rating
    }));
  };

  const filteredEntries = entries.filter(entry => {
    // Filter by effectiveness
    if (filters.effectiveness !== null && entry.effectiveness !== filters.effectiveness) {
      return false;
    }
    
    // Simple search across fields
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      const matchesSearch = 
        entry.mood.toLowerCase().includes(searchLower) ||
        entry.activity.toLowerCase().includes(searchLower) ||
        entry.notes?.toLowerCase().includes(searchLower) ||
        entry.sideEffects.some(effect => effect.toLowerCase().includes(searchLower));
      
      if (!matchesSearch) return false;
    }
    
    return true;
  });

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
            <div className="flex flex-wrap gap-5">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Effectiveness</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button 
                      key={star} 
                      variant="outline" 
                      size="sm" 
                      className={`px-3 py-1 border-gray-600 
                        ${filters.effectiveness === star 
                          ? "bg-emerald-700 text-white border-emerald-600" 
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"}`}
                      onClick={() => handleEffectivenessFilter(star)}
                    >
                      {star}
                    </Button>
                  ))}
                  {filters.effectiveness !== null && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFilters(prev => ({ ...prev, effectiveness: null }))}
                      className="ml-2 text-gray-400 hover:text-white"
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">Filter by Time</label>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
                    <CalendarDays size={16} className="mr-1" />
                    This Month
                  </Button>
                  <Button variant="outline" size="sm" className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
                    <Clock size={16} className="mr-1" />
                    Last Week
                  </Button>
                  <Button variant="outline" size="sm" className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
                    <Calendar size={16} className="mr-1" />
                    Custom Range
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {filters.effectiveness && (
        <div className="flex gap-2 mb-4">
          <Badge className="bg-emerald-700 text-white px-3 py-1">
            Rating: {filters.effectiveness} ★
          </Badge>
        </div>
      )}

      <div className="mb-4 text-sm text-gray-400">
        {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
      </div>

      {filteredEntries.length > 0 ? (
        <div className="space-y-4">
          {filteredEntries.map(entry => (
            <JournalEntryComponent 
              key={entry.id} 
              entry={entry} 
              onEdit={handleEditEntry}
              onDelete={deleteEntry}
            />
          ))}
        </div>
      ) : (
        <Card className="bg-gray-900 p-8 rounded-lg text-center border border-gray-700">
          <Book size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2 text-white">No journal entries found</h3>
          <p className="text-gray-300 mb-4">
            {entries.length > 0 
              ? "No entries match your current filters. Try adjusting your search criteria."
              : "Start tracking your cannabis experiences"}
          </p>
          <Button className="px-4 py-2 bg-emerald-600 text-white rounded-md flex items-center gap-2 mx-auto hover:bg-emerald-700">
            <Plus size={18} />
            {entries.length > 0 ? "Add New Entry" : "Add First Entry"}
          </Button>
        </Card>
      )}
    </div>
  );
};

export default Journal;
