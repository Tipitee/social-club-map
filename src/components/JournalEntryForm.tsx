
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { JournalEntry } from "@/types/journal";
import { addJournalEntry } from "@/services/journalService";

interface JournalEntryFormProps {
  onSuccess: (entry: JournalEntry) => void;
  onCancel: () => void;
}

type FormValues = Omit<JournalEntry, "id">;

const commonSideEffects = [
  "Dry Mouth", "Dry Eyes", "Hunger", "Paranoia", 
  "Anxiety", "Dizziness", "Fatigue", "Headache"
];

const dosageTypes = [
  "edible", "vaporized", "flower", "concentrate", 
  "tincture", "topical", "capsule", "other"
];

const moodOptions = [
  "relaxed", "Creative", "focused", "energetic", 
  "sleepy", "calm", "happy", "anxious"
];

const JournalEntryForm: React.FC<JournalEntryFormProps> = ({ onSuccess, onCancel }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedSideEffects, setSelectedSideEffects] = useState<string[]>([]);
  const [customSideEffect, setCustomSideEffect] = useState("");
  const [effectiveness, setEffectiveness] = useState<number>(3);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  const handleSideEffectClick = (effect: string) => {
    if (selectedSideEffects.includes(effect)) {
      setSelectedSideEffects(selectedSideEffects.filter(item => item !== effect));
    } else {
      setSelectedSideEffects([...selectedSideEffects, effect]);
    }
  };

  const addCustomSideEffect = () => {
    if (customSideEffect.trim() && !selectedSideEffects.includes(customSideEffect)) {
      setSelectedSideEffects([...selectedSideEffects, customSideEffect]);
      setCustomSideEffect("");
    }
  };

  const onSubmit = async (data: any) => {
    const formattedDate = format(date, "MMMM do, yyyy");
    
    const entryData: Omit<JournalEntry, "id"> = {
      date: formattedDate,
      dosage: data.dosage,
      dosageType: data.dosageType,
      effectiveness: effectiveness,
      mood: data.mood,
      activity: data.activity,
      sideEffects: selectedSideEffects,
      notes: data.notes || "",
    };
    
    const result = await addJournalEntry(entryData);
    if (result) {
      onSuccess(result);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-card border border-gray-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Add Journal Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="journal-entry-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Date Picker */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  id="date"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Dosage and Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dosage">Dosage</Label>
              <Input 
                id="dosage" 
                placeholder="e.g. 10mg, 0.5g" 
                {...register("dosage", { required: true })}
                className="bg-gray-800 border-gray-700"
              />
              {errors.dosage && <p className="text-red-500 text-sm">Dosage is required</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dosageType">Type</Label>
              <Select 
                onValueChange={(value) => register("dosageType").onChange({ target: { value } })}
                defaultValue="flower"
              >
                <SelectTrigger id="dosageType" className="bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {dosageTypes.map((type) => (
                    <SelectItem key={type} value={type} className="capitalize">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Effectiveness Rating */}
          <div className="space-y-2">
            <Label>Effectiveness (1-5)</Label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  type="button"
                  variant={rating === effectiveness ? "default" : "outline"}
                  className={cn(
                    "h-10 w-10 p-0 rounded-full",
                    rating === effectiveness && "bg-secondary text-white"
                  )}
                  onClick={() => setEffectiveness(rating)}
                >
                  {rating}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Mood */}
          <div className="space-y-2">
            <Label htmlFor="mood">Mood</Label>
            <Select 
              onValueChange={(value) => register("mood").onChange({ target: { value } })}
              defaultValue="relaxed"
            >
              <SelectTrigger id="mood" className="bg-gray-800 border-gray-700">
                <SelectValue placeholder="Select mood" />
              </SelectTrigger>
              <SelectContent>
                {moodOptions.map((mood) => (
                  <SelectItem key={mood} value={mood} className="capitalize">
                    {mood}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Activity */}
          <div className="space-y-2">
            <Label htmlFor="activity">Activity</Label>
            <Input 
              id="activity" 
              placeholder="e.g. Evening relaxation, Creative work"
              {...register("activity", { required: true })}
              className="bg-gray-800 border-gray-700"
            />
            {errors.activity && <p className="text-red-500 text-sm">Activity is required</p>}
          </div>
          
          {/* Side Effects */}
          <div className="space-y-2">
            <Label>Side Effects</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {commonSideEffects.map((effect) => (
                <Button
                  key={effect}
                  type="button"
                  variant={selectedSideEffects.includes(effect) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSideEffectClick(effect)}
                  className={selectedSideEffects.includes(effect) ? "bg-secondary" : ""}
                >
                  {effect}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input 
                placeholder="Add custom side effect" 
                value={customSideEffect}
                onChange={(e) => setCustomSideEffect(e.target.value)}
                className="bg-gray-800 border-gray-700"
              />
              <Button 
                type="button" 
                onClick={addCustomSideEffect} 
                disabled={!customSideEffect.trim()}
              >
                Add
              </Button>
            </div>
            {selectedSideEffects.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-400 mb-1">Selected side effects:</p>
                <div className="flex flex-wrap gap-1">
                  {selectedSideEffects.map((effect, index) => (
                    <span 
                      key={index} 
                      className="bg-gray-700 text-white px-2 py-1 rounded-full text-xs flex items-center"
                    >
                      {effect}
                      <X 
                        size={14} 
                        className="ml-1 cursor-pointer" 
                        onClick={() => setSelectedSideEffects(selectedSideEffects.filter(e => e !== effect))}
                      />
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea 
              id="notes" 
              placeholder="Additional notes about your experience..."
              {...register("notes")}
              className="min-h-[100px] bg-gray-800 border-gray-700"
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" form="journal-entry-form" className="bg-secondary">Save Entry</Button>
      </CardFooter>
    </Card>
  );
};

export default JournalEntryForm;
