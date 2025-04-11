
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Book, Plus, Filter, CalendarDays, Clock, Loader2 } from "lucide-react";
import JournalEntryComponent from "@/components/JournalEntry";
import { JournalEntry } from "@/types/journal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import NewJournalEntry from "@/components/NewJournalEntry";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";

type FilterState = {
  effectiveness: number | null;
  dateRange: { start: Date | null; end: Date | null };
  searchText: string;
};

const Journal: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showNewEntryDialog, setShowNewEntryDialog] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    effectiveness: null,
    dateRange: { start: null, end: null },
    searchText: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Detect theme for styling
  const isDarkMode = document.documentElement.classList.contains('dark');

  // Fetch journal entries from Supabase
  useEffect(() => {
    async function fetchEntries() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('journal_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (data) {
          const formattedEntries: JournalEntry[] = data.map(entry => ({
            id: entry.id,
            date: entry.date,
            dosage: entry.dosage,
            dosageType: entry.dosage_type,
            effectiveness: entry.effectiveness,
            mood: entry.mood,
            activity: entry.activity,
            sideEffects: entry.side_effects,
            notes: entry.notes || ''
          }));
          setEntries(formattedEntries);
        }
      } catch (error: any) {
        console.error('Error fetching journal entries:', error.message);
        toast({
          title: t('journal.error'),
          description: t('journal.errorFetchingEntries'),
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchEntries();
  }, [user, toast, t]);

  const deleteEntry = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
      toast({
        title: t('journal.entryDeleted'),
        description: t('journal.entryDeletedSuccess'),
      });
    } catch (error: any) {
      toast({
        title: t('journal.error'),
        description: t('journal.errorDeletingEntry'),
        variant: "destructive"
      });
    }
  };

  const handleEditEntry = (entry: JournalEntry) => {
    toast({
      title: t('journal.editFunctionality'),
      description: t('journal.editFormWouldOpen'),
    });
    console.log("Editing entry:", entry);
  };

  const handleEffectivenessFilter = (rating: number) => {
    setFilters(prev => ({
      ...prev,
      effectiveness: prev.effectiveness === rating ? null : rating
    }));
  };

  const handleSaveNewEntry = async (newEntryData: Omit<JournalEntry, "id">) => {
    if (!user) {
      toast({
        title: t('journal.authRequired'),
        description: t('journal.signInToSave'),
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          date: newEntryData.date,
          dosage: newEntryData.dosage,
          dosage_type: newEntryData.dosageType,
          effectiveness: newEntryData.effectiveness,
          mood: newEntryData.mood,
          activity: newEntryData.activity,
          side_effects: newEntryData.sideEffects,
          notes: newEntryData.notes
        })
        .select('*')
        .single();
      
      if (error) throw error;
      
      if (data) {
        const formattedEntry: JournalEntry = {
          id: data.id,
          date: data.date,
          dosage: data.dosage,
          dosageType: data.dosage_type,
          effectiveness: data.effectiveness,
          mood: data.mood,
          activity: data.activity,
          sideEffects: data.side_effects,
          notes: data.notes || ''
        };
        
        setEntries(prev => [formattedEntry, ...prev]);
        setShowNewEntryDialog(false);
        
        toast({
          title: t('journal.entryAdded'),
          description: t('journal.entryAddedSuccess'),
        });
      }
    } catch (error: any) {
      toast({
        title: t('journal.error'),
        description: error.message || t('journal.errorSavingEntry'),
        variant: "destructive"
      });
    }
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
        (entry.notes && entry.notes.toLowerCase().includes(searchLower)) ||
        entry.sideEffects.some(effect => effect.toLowerCase().includes(searchLower));
      
      if (!matchesSearch) return false;
    }
    
    return true;
  });

  // Dynamic styling based on theme
  const getBackgroundClass = () => isDarkMode 
    ? "bg-[#121212] text-white"
    : "bg-oldLace-500 text-gray-800";
    
  const getCardClass = () => isDarkMode
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-200";
    
  const getCardTextClass = () => isDarkMode
    ? "text-white"
    : "text-gray-800";
    
  const getSecondaryTextClass = () => isDarkMode
    ? "text-gray-400"
    : "text-gray-500";

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (!user) {
      return (
        <Card className={getCardClass()}>
          <CardContent className="p-8 rounded-lg text-center">
            <Book size={48} className={`mx-auto mb-4 ${getSecondaryTextClass()}`} />
            <h3 className="text-xl font-semibold mb-2">{t('journal.authRequired')}</h3>
            <p className={`${getSecondaryTextClass()} mb-4`}>
              {t('journal.signInToViewEntries')}
            </p>
            <Button 
              className="px-4 py-2 bg-primary text-white rounded-md flex items-center gap-2 mx-auto hover:bg-primary/90"
              onClick={() => navigate('/auth')}
            >
              {t('auth.signIn')}
            </Button>
          </CardContent>
        </Card>
      );
    }

    if (filteredEntries.length === 0) {
      return (
        <Card className={getCardClass()}>
          <CardContent className="p-8 rounded-lg text-center">
            <Book size={48} className={`mx-auto mb-4 ${getSecondaryTextClass()}`} />
            <h3 className="text-xl font-semibold mb-2">
              {entries.length > 0 
                ? t('journal.noEntriesFound')
                : t('journal.noEntries')}
            </h3>
            <p className={`${getSecondaryTextClass()} mb-4`}>
              {entries.length > 0 
                ? t('journal.adjustFilters')
                : t('journal.startTracking')}
            </p>
            <Button 
              className="px-4 py-2 bg-primary text-white rounded-md flex items-center gap-2 mx-auto hover:bg-primary/90"
              onClick={() => setShowNewEntryDialog(true)}
            >
              <Plus size={18} />
              {entries.length > 0 ? t('journal.addNew') : t('journal.addFirst')}
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <>
        <div className={`mb-4 text-sm ${getSecondaryTextClass()}`}>
          {filteredEntries.length} {filteredEntries.length === 1 ? t('journal.entry') : t('journal.entries')}
        </div>

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
      </>
    );
  };

  return (
    <div className={`min-h-screen ${getBackgroundClass()} pb-24`}>
      <Navbar />
      <div className="container px-4 py-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">{t('journal.trackConsumption')}</h1>
          
          {/* Button layout */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              className={isDarkMode 
                ? "bg-gray-800 border-gray-700 text-white hover:bg-gray-700 h-10 w-10 sm:h-10 sm:w-auto sm:px-4"
                : "bg-white border-gray-200 text-gray-800 hover:bg-gray-100 h-10 w-10 sm:h-10 sm:w-auto sm:px-4"
              }
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={20} className="sm:mr-2" />
              <span className="hidden sm:inline">{t('journal.filters')}</span>
            </Button>
            <Button 
              className="bg-primary hover:bg-primary/90 text-white h-10 w-10 sm:h-10 sm:w-auto sm:px-4"
              size="icon"
              onClick={() => setShowNewEntryDialog(true)}
            >
              <Plus size={20} className="sm:mr-2" />
              <span className="hidden sm:inline">{t('journal.newEntry')}</span>
            </Button>
          </div>
        </div>

        {showFilters && (
          <Card className={`mb-6 ${getCardClass()}`}>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-5">
                <div>
                  <label className={`block text-sm font-medium ${getCardTextClass()} mb-2`}>{t('journal.effectiveness')}</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Button 
                        key={star} 
                        variant="outline" 
                        size="sm" 
                        className={`px-3 py-1 ${
                          filters.effectiveness === star 
                            ? "bg-primary text-white border-primary/50" 
                            : isDarkMode
                              ? "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white border-gray-600"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-800 border-gray-200"
                        }`}
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
                        className={`ml-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                      >
                        {t('common.clear')}
                      </Button>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${getCardTextClass()} mb-2`}>{t('journal.filterByTime')}</label>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                        : "bg-gray-100 border-gray-200 text-gray-800 hover:bg-gray-200"
                      }
                    >
                      <CalendarDays size={16} className="mr-1" />
                      {t('journal.thisMonth')}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                        : "bg-gray-100 border-gray-200 text-gray-800 hover:bg-gray-200"
                      }
                    >
                      <Clock size={16} className="mr-1" />
                      {t('journal.lastWeek')}
                    </Button>
                  </div>
                </div>
                
                <div className="w-full">
                  <label className={`block text-sm font-medium ${getCardTextClass()} mb-2`}>{t('journal.search')}</label>
                  <Input
                    type="search"
                    value={filters.searchText}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchText: e.target.value }))}
                    className={isDarkMode 
                      ? "bg-gray-700 border-gray-600 text-white" 
                      : "bg-white border-gray-200 text-gray-800"
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {filters.effectiveness && (
          <div className="flex gap-2 mb-4">
            <Badge className="bg-primary text-white px-3 py-1">
              {t('journal.ratingBadge', { rating: filters.effectiveness })}
            </Badge>
          </div>
        )}

        {renderContent()}

        <NewJournalEntry 
          isOpen={showNewEntryDialog}
          onClose={() => setShowNewEntryDialog(false)}
          onSave={handleSaveNewEntry}
        />
      </div>
    </div>
  );
};

export default Journal;
