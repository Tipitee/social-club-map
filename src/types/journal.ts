
export type JournalEntry = {
  id: string;
  date: string;
  dosage: string;
  dosageType: string;
  effectiveness: number;
  mood: string;
  activity: string;
  sideEffects: string[];
  notes: string;
};

export type JournalFilter = {
  startDate: Date | null;
  endDate: Date | null;
  minEffectiveness: number;
  maxEffectiveness: number;
  searchTerm: string;
};
