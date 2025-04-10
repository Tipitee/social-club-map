
import React, { useState, useEffect } from "react";
import { Book, Plus, Search, Filter, Calendar, Star, X } from "lucide-react";
import JournalEntryComponent from "@/components/JournalEntry";
import JournalEntryForm from "@/components/JournalEntryForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { JournalEntry, JournalFilter } from "@/types/journal";
import { fetchJournalEntries } from "@/services/journalService";

const Journal: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showNewEntryForm, setShowNewEntryForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filter, setFilter] = useState<JournalFilter>({
    startDate: null,
    endDate: null,
    minEffectiveness: 0,
    maxEffectiveness: 5,
    searchTerm: ""
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEntries = async () => {
      setIsLoading(true);
      try {
        const data = await fetchJournalEntries(
          searchTerm ? { ...filter, searchTerm } : filter
        );
        setEntries(data);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadEntries();
  }, [filter, searchTerm]);

  const handleNewEntrySuccess = (newEntry: JournalEntry) => {
    setEntries([newEntry, ...entries]);
    setShowNewEntryForm(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilter({ ...filter, searchTerm });
  };

  const clearFilters = () => {
    setFilter({
      startDate: null,
      endDate: null,
      minEffectiveness: 0,
      maxEffectiveness: 5,
      searchTerm: ""
    });
    setSearchTerm("");
  };

  return (
    <div className="container px-4 py-6 mb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Journal</h1>
        <Button 
          className="flex items-center gap-1 bg-secondary hover:bg-secondary/90"
          onClick={() => setShowNewEntryForm(true)}
        >
          <Plus size={18} />
          New Entry
        </Button>
      </div>

      {/* Search bar */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search your journal entries..."
              className="w-full pl-8 bg-gray-800 border-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button type="submit" variant="outline" size="icon" className="shrink-0">
            <Search className="h-4 w-4" />
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="icon" 
            className="shrink-0"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </form>

        {/* Filters UI - Simple version */}
        {showFilters && (
          <div className="mt-3 p-4 bg-gray-800 border border-gray-700 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Filters</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-xs"
                onClick={clearFilters}
              >
                Clear All
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Effectiveness</label>
                <div className="flex items-center gap-2">
                  <Button 
                    variant={filter.minEffectiveness === 1 ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setFilter({...filter, minEffectiveness: 1})}
                    className="h-8 w-8 p-0"
                  >
                    1
                  </Button>
                  <Button 
                    variant={filter.minEffectiveness === 2 ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setFilter({...filter, minEffectiveness: 2})}
                    className="h-8 w-8 p-0"
                  >
                    2
                  </Button>
                  <Button 
                    variant={filter.minEffectiveness === 3 ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setFilter({...filter, minEffectiveness: 3})}
                    className="h-8 w-8 p-0"
                  >
                    3
                  </Button>
                  <Button 
                    variant={filter.minEffectiveness === 4 ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setFilter({...filter, minEffectiveness: 4})}
                    className="h-8 w-8 p-0"
                  >
                    4
                  </Button>
                  <Button 
                    variant={filter.minEffectiveness === 5 ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setFilter({...filter, minEffectiveness: 5})}
                    className="h-8 w-8 p-0"
                  >
                    5
                  </Button>
                  <span className="mx-2">to</span>
                  <span className="h-8 w-8 flex items-center justify-center">5</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Period</label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-8">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    Last 7 days
                  </Button>
                  <Button variant="outline" size="sm" className="h-8">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    Last 30 days
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showNewEntryForm ? (
        <JournalEntryForm 
          onSuccess={handleNewEntrySuccess}
          onCancel={() => setShowNewEntryForm(false)}
        />
      ) : (
        <>
          {isLoading ? (
            <div className="flex justify-center my-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-secondary"></div>
            </div>
          ) : entries.length > 0 ? (
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
              <Button 
                className="px-4 py-2 bg-secondary text-white rounded-md flex items-center gap-2 mx-auto"
                onClick={() => setShowNewEntryForm(true)}
              >
                <Book size={18} />
                Add First Entry
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Journal;
