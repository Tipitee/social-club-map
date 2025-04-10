
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JournalEntry } from "@/types/journal";
import { CheckCircle, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

interface NewJournalEntryProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Omit<JournalEntry, "id">) => void;
}

const possibleEffects = [
  "Dry Mouth",
  "Dry Eyes",
  "Paranoia",
  "Anxiety",
  "Dizziness",
  "Headache",
  "Hunger",
  "Insomnia",
  "Nausea",
];

const NewJournalEntry: React.FC<NewJournalEntryProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [dosage, setDosage] = useState("");
  const [dosageType, setDosageType] = useState("edible");
  const [effectiveness, setEffectiveness] = useState(3);
  const [mood, setMood] = useState("");
  const [activity, setActivity] = useState("");
  const [sideEffects, setSideEffects] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const handleSideEffectToggle = (effect: string) => {
    setSideEffects((prev) =>
      prev.includes(effect)
        ? prev.filter((e) => e !== effect)
        : [...prev, effect]
    );
  };

  const handleSubmit = () => {
    // Basic validation
    if (!dosage) {
      toast({
        title: "Missing Information",
        description: "Please enter a dosage amount",
        variant: "destructive",
      });
      return;
    }

    if (!mood) {
      toast({
        title: "Missing Information",
        description: "Please enter your mood",
        variant: "destructive",
      });
      return;
    }

    if (!activity) {
      toast({
        title: "Missing Information",
        description: "Please enter an activity",
        variant: "destructive",
      });
      return;
    }

    const newEntry = {
      date: format(new Date(), "MMMM do, yyyy"),
      dosage,
      dosageType,
      effectiveness,
      mood,
      activity,
      sideEffects,
      notes,
    };

    onSave(newEntry);
    
    // Reset form
    setDosage("");
    setDosageType("edible");
    setEffectiveness(3);
    setMood("");
    setActivity("");
    setSideEffects([]);
    setNotes("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">Add New Journal Entry</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dosage">Dosage</Label>
              <Input
                id="dosage"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="e.g. 10mg, 0.5g"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dosageType">Type</Label>
              <Select value={dosageType} onValueChange={setDosageType}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="edible" className="text-white">Edible</SelectItem>
                  <SelectItem value="flower" className="text-white">Flower</SelectItem>
                  <SelectItem value="vaporized" className="text-white">Vaporized</SelectItem>
                  <SelectItem value="tincture" className="text-white">Tincture</SelectItem>
                  <SelectItem value="concentrate" className="text-white">Concentrate</SelectItem>
                  <SelectItem value="other" className="text-white">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Effectiveness (1-5)</Label>
            <div className="flex gap-2 justify-between">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  type="button"
                  variant={effectiveness === rating ? "default" : "outline"}
                  onClick={() => setEffectiveness(rating)}
                  className={`flex-1 ${
                    effectiveness === rating
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-gray-800 border-gray-700 hover:bg-gray-700"
                  }`}
                >
                  {rating}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mood">Mood</Label>
            <Input
              id="mood"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="e.g. Relaxed, Creative, Energetic"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="activity">Activity</Label>
            <Input
              id="activity"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              placeholder="e.g. Meditation, Movie Night, Hiking"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label>Side Effects</Label>
            <div className="flex flex-wrap gap-2">
              {possibleEffects.map((effect) => (
                <Badge
                  key={effect}
                  variant="outline"
                  className={`cursor-pointer select-none px-2.5 py-1 text-sm ${
                    sideEffects.includes(effect)
                      ? "bg-emerald-900/50 border-emerald-600"
                      : "bg-gray-800 border-gray-700"
                  }`}
                  onClick={() => handleSideEffectToggle(effect)}
                >
                  {sideEffects.includes(effect) && (
                    <CheckCircle className="h-3.5 w-3.5 mr-1" />
                  )}
                  {effect}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes about your experience..."
              className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="bg-gray-800 border-gray-700 text-white">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            Save Entry
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewJournalEntry;
