
import { supabase } from "@/integrations/supabase/client";
import { JournalEntry, JournalFilter } from "@/types/journal";
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";

// Mock data for development until Supabase is connected
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
  },
  {
    id: "3",
    date: "January 5th, 2025",
    dosage: "5mg",
    dosageType: "tincture",
    effectiveness: 5,
    mood: "focused",
    activity: "Work session",
    sideEffects: [],
    notes: "Perfect microdose for work. Felt focused without any noticeable high."
  }
];

/**
 * Fetch journal entries with optional filtering
 */
export const fetchJournalEntries = async (filter?: JournalFilter): Promise<JournalEntry[]> => {
  try {
    // In a real app, we would fetch from Supabase here
    // const { data, error } = await supabase.from('journal_entries').select('*');
    
    // For now, return mock data with optional filtering
    let entries = [...mockEntries];
    
    if (filter) {
      // Filter by date range
      if (filter.startDate) {
        entries = entries.filter(entry => new Date(entry.date) >= filter.startDate!);
      }
      
      if (filter.endDate) {
        entries = entries.filter(entry => new Date(entry.date) <= filter.endDate!);
      }
      
      // Filter by effectiveness
      if (filter.minEffectiveness > 0) {
        entries = entries.filter(entry => entry.effectiveness >= filter.minEffectiveness);
      }
      
      if (filter.maxEffectiveness < 5) {
        entries = entries.filter(entry => entry.effectiveness <= filter.maxEffectiveness);
      }
      
      // Filter by search term
      if (filter.searchTerm) {
        const term = filter.searchTerm.toLowerCase();
        entries = entries.filter(
          entry => 
            entry.notes?.toLowerCase().includes(term) ||
            entry.activity.toLowerCase().includes(term) ||
            entry.mood.toLowerCase().includes(term) ||
            entry.sideEffects.some(effect => effect.toLowerCase().includes(term))
        );
      }
    }
    
    return entries;
  } catch (error) {
    console.error("Error fetching journal entries:", error);
    toast({
      title: "Error",
      description: "Failed to fetch journal entries",
      variant: "destructive",
    });
    return [];
  }
};

/**
 * Add a new journal entry
 */
export const addJournalEntry = async (entry: Omit<JournalEntry, "id">): Promise<JournalEntry | null> => {
  try {
    // In a real app, we would add to Supabase here
    // const { data, error } = await supabase.from('journal_entries').insert(entry).select().single();
    
    // For now, create a new entry with a unique ID
    const newEntry: JournalEntry = {
      id: uuidv4(),
      ...entry,
    };
    
    // In a real app, we would return the data from Supabase
    // For now, return the mock entry
    toast({
      title: "Success",
      description: "Journal entry added successfully",
    });
    
    return newEntry;
  } catch (error) {
    console.error("Error adding journal entry:", error);
    toast({
      title: "Error",
      description: "Failed to add journal entry",
      variant: "destructive",
    });
    return null;
  }
};

/**
 * Delete a journal entry
 */
export const deleteJournalEntry = async (id: string): Promise<boolean> => {
  try {
    // In a real app, we would delete from Supabase here
    // const { error } = await supabase.from('journal_entries').delete().eq('id', id);
    
    toast({
      title: "Success",
      description: "Journal entry deleted successfully",
    });
    
    return true;
  } catch (error) {
    console.error("Error deleting journal entry:", error);
    toast({
      title: "Error",
      description: "Failed to delete journal entry",
      variant: "destructive",
    });
    return false;
  }
};
