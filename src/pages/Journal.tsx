
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, PlusCircle, Edit, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from 'date-fns';
import NewJournalEntry from "@/components/NewJournalEntry";
import { JournalEntry } from "@/types/journal";
import { v4 as uuidv4 } from "uuid";

const Journal: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editedEntry, setEditedEntry] = useState<JournalEntry | null>(null);
  const [showNewEntryModal, setShowNewEntryModal] = useState(false);

  useEffect(() => {
    if (user) {
      const mockEntries: JournalEntry[] = [
        {
          id: "1",
          date: "2024-01-20",
          dosage: "5mg",
          dosageType: "edible",
          effectiveness: 4,
          mood: "relaxed",
          activity: "reading",
          sideEffects: ["dry-mouth"],
          notes: "Felt relaxed and creative.",
        },
        {
          id: "2",
          date: "2024-01-25",
          dosage: "10mg",
          dosageType: "joints",
          effectiveness: 5,
          mood: "happy",
          activity: "music",
          sideEffects: ["dry-eyes"],
          notes: "Good for pain relief.",
        },
      ];
      setEntries(mockEntries);
    }
  }, [user]);

  const redirectToAuth = () => {
    navigate("/auth");
  };

  const handleSaveNew = (entry: Omit<JournalEntry, "id">) => {
    const newEntry = {
      ...entry,
      id: uuidv4(),
    };
    setEntries(prev => [newEntry, ...prev]);
    setShowNewEntryModal(false);
  };

  const startEditing = (id: string) => {
    const entryToEdit = entries.find(entry => entry.id === id);
    if (entryToEdit) {
      setEditingEntryId(id);
      setEditedEntry({ ...entryToEdit });
    }
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editedEntry) {
      const { name, value } = e.target;
      setEditedEntry(prev => ({ ...prev!, [name]: value }));
    }
  };

  const saveEntry = () => {
    if (editedEntry) {
      setEntries(prev =>
        prev.map(entry => (entry.id === editedEntry.id ? { ...editedEntry } : entry))
      );
      setEditingEntryId(null);
      setEditedEntry(null);
    }
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
    setEditingEntryId(null);
    setEditedEntry(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-linen dark:bg-navy-dark">
        <Navbar />
        <div className="container px-4 py-6 max-w-3xl mx-auto">
          <div className="auth-required-block">
            <h3 className="text-xl font-semibold mb-3">{t('auth.signInRequired')}</h3>
            <p className="mb-4">{t('journal.signInToTrack')}</p>
            <Button
              onClick={redirectToAuth}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              {t('auth.signIn')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linen dark:bg-navy-dark">
      <Navbar />
      <div className="container px-4 py-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-navy-dark dark:text-white">
            {t('navigation.journal')}
          </h1>
          <Button
            onClick={() => setShowNewEntryModal(true)}
            className="bg-teal-DEFAULT hover:bg-teal-dark text-white"
          >
            <PlusCircle size={18} className="mr-1" />
            {t('journal.addEntry')}
          </Button>
        </div>

        <NewJournalEntry
          isOpen={showNewEntryModal}
          onClose={() => setShowNewEntryModal(false)}
          onSave={handleSaveNew}
        />

        <h2 className="text-xl font-semibold mb-4 text-navy-dark dark:text-white">
          {t('journal.existingEntries')}
        </h2>
        <div className="space-y-4">
          {entries.map(entry => (
            <Card key={entry.id} className="journal-entry">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <CalendarIcon size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {entry.date}
                    </span>
                  </div>
                  <Badge variant="outline" className={entry.effectiveness >= 4 ? "bg-teal-DEFAULT/20 text-teal-DEFAULT" : ""}>
                    {t('journal.effectiveness')}: {entry.effectiveness}/5
                  </Badge>
                </div>
                {editingEntryId === entry.id ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor="date" className="input-label">
                          {t('journal.date')}
                        </Label>
                        <Input
                          type="date"
                          id="date"
                          name="date"
                          value={editedEntry?.date || ""}
                          onChange={handleEditInputChange}
                          className="input-field form-control"
                        />
                      </div>
                      <div>
                        <Label htmlFor="dosage" className="input-label">
                          {t('journal.dosage')}
                        </Label>
                        <div className="flex">
                          <Input
                            type="text"
                            id="dosage"
                            name="dosage"
                            value={editedEntry?.dosage || ""}
                            onChange={handleEditInputChange}
                            className="input-field form-control rounded-r-none"
                          />
                          <Input
                            type="text"
                            id="dosageType"
                            name="dosageType"
                            value={editedEntry?.dosageType || ""}
                            onChange={handleEditInputChange}
                            className="input-field form-control rounded-l-none w-1/3"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <Label htmlFor="notes" className="input-label">
                        {t('journal.notes')}
                      </Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        value={editedEntry?.notes || ""}
                        onChange={handleEditInputChange}
                        className="input-field form-control"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        onClick={saveEntry}
                        className="bg-teal-DEFAULT hover:bg-teal-dark text-white"
                      >
                        {t('journal.save')}
                      </Button>
                      <Button
                        onClick={() => deleteEntry(entry.id)}
                        variant="destructive"
                      >
                        {t('journal.delete')}
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold text-navy-dark dark:text-white">
                          {entry.mood && <span className="capitalize">{entry.mood}</span>}
                          {entry.mood && entry.activity && " • "}
                          {entry.activity && (
                            <span className="text-gray-600 dark:text-gray-400">
                              {t(`journal.activities.${entry.activity}`)}
                            </span>
                          )}
                        </h3>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-2">
                        {t('journal.dosage')}: <strong>{entry.dosage} {entry.dosageType}</strong>
                      </p>
                    </div>
                    
                    {entry.sideEffects && entry.sideEffects.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {t('journal.sideEffects')}:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {entry.sideEffects.map(effect => (
                            <Badge key={effect} variant="outline" className="bg-gray-100 dark:bg-navy-400 text-xs">
                              {t(`journal.sideEffects.${effect}`)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-3 whitespace-pre-line">
                      {entry.notes}
                    </p>
                    
                    <div className="flex justify-end">
                      <Button
                        onClick={() => startEditing(entry.id)}
                        variant="secondary"
                        size="sm"
                      >
                        <Edit size={14} className="mr-1" />
                        {t('journal.edit')}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Journal;
