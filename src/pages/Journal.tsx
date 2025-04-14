import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { CalendarIcon, PlusCircle, Edit, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from 'date-fns';

interface JournalEntry {
  id: string;
  date: string;
  title: string;
  notes: string;
  dosage: string;
}

const Journal: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newEntry, setNewEntry] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    title: "",
    notes: "",
    dosage: "",
  });
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editedEntry, setEditedEntry] = useState<JournalEntry | null>(null);

  useEffect(() => {
    if (user) {
      // Mock data loading
      const mockEntries: JournalEntry[] = [
        {
          id: "1",
          date: "2024-01-20",
          title: "First Entry",
          notes: "Felt relaxed and creative.",
          dosage: "5mg",
        },
        {
          id: "2",
          date: "2024-01-25",
          title: "Second Entry",
          notes: "Good for pain relief.",
          dosage: "10mg",
        },
      ];
      setEntries(mockEntries);
    }
  }, [user]);

  const redirectToAuth = () => {
    navigate("/auth");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEntry(prev => ({ ...prev, [name]: value }));
  };

  const addEntry = () => {
    const newId = String(Date.now());
    const entryToAdd = { ...newEntry, id: newId };
    setEntries(prev => [...prev, entryToAdd]);
    setNewEntry({ date: format(new Date(), 'yyyy-MM-dd'), title: "", notes: "", dosage: "" });
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
      setEditedEntry(prev => ({ ...prev, [name]: value }));
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
              className="bg-teal-DEFAULT hover:bg-teal-dark text-white"
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
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-navy-dark dark:text-white">
          {t('navigation.journal')}
        </h1>

        <Card className="mb-6">
          <CardContent className="p-5">
            <h2 className="text-xl font-semibold mb-4 text-navy-dark dark:text-white">
              {t('journal.addEntry')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date" className="input-label">
                  {t('journal.date')}
                </Label>
                <Input
                  type="date"
                  id="date"
                  name="date"
                  value={newEntry.date}
                  onChange={handleInputChange}
                  className="input-field form-control"
                />
              </div>
              <div>
                <Label htmlFor="dosage" className="input-label">
                  {t('journal.dosage')}
                </Label>
                <Input
                  type="text"
                  id="dosage"
                  name="dosage"
                  value={newEntry.dosage}
                  onChange={handleInputChange}
                  placeholder={t('journal.enterDosage') as string}
                  className="input-field form-control"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="title" className="input-label">
                {t('journal.title')}
              </Label>
              <Input
                type="text"
                id="title"
                name="title"
                value={newEntry.title}
                onChange={handleInputChange}
                placeholder={t('journal.enterTitle') as string}
                className="input-field form-control"
              />
            </div>
            <div>
              <Label htmlFor="notes" className="input-label">
                {t('journal.notes')}
              </Label>
              <Textarea
                id="notes"
                name="notes"
                value={newEntry.notes}
                onChange={handleInputChange}
                placeholder={t('journal.enterNotes') as string}
                className="input-field form-control"
              />
            </div>
            <Button
              onClick={addEntry}
              className="bg-teal-DEFAULT hover:bg-teal-dark text-white mt-4"
            >
              {t('journal.addEntry')}
            </Button>
          </CardContent>
        </Card>

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
                </div>
                {editingEntryId === entry.id ? (
                  <>
                    <Input
                      type="text"
                      name="title"
                      value={editedEntry?.title || ""}
                      onChange={handleEditInputChange}
                      className="input-field form-control mb-2"
                    />
                    <Textarea
                      name="notes"
                      value={editedEntry?.notes || ""}
                      onChange={handleEditInputChange}
                      className="input-field form-control mb-2"
                    />
                    <Input
                      type="text"
                      name="dosage"
                      value={editedEntry?.dosage || ""}
                      onChange={handleEditInputChange}
                      className="input-field form-control mb-2"
                    />
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
                    <h3 className="text-lg font-semibold text-navy-dark dark:text-white mb-2">
                      {entry.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      {t('journal.dosage')}: {entry.dosage}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      {entry.notes}
                    </p>
                    <div className="flex justify-end">
                      <Button
                        onClick={() => startEditing(entry.id)}
                        variant="secondary"
                      >
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
