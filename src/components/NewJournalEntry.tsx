
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
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
import { CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

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
  const { t } = useTranslation();
  const [dosage, setDosage] = useState("");
  const [dosageType, setDosageType] = useState("edible");
  const [effectiveness, setEffectiveness] = useState(3);
  const [mood, setMood] = useState("");
  const [activity, setActivity] = useState("");
  const [sideEffects, setSideEffects] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const { toast } = useToast();
  const isDarkMode = document.documentElement.classList.contains('dark');

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
        title: t('journal.error'),
        description: t('journal.enterDosage'),
        variant: "destructive",
      });
      return;
    }

    if (!mood) {
      toast({
        title: t('journal.error'),
        description: t('journal.enterMood'),
        variant: "destructive",
      });
      return;
    }

    if (!activity) {
      toast({
        title: t('journal.error'),
        description: t('journal.enterActivity'),
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

  // Determine color scheme based on theme
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200";
  const inputBgColor = isDarkMode ? "bg-gray-800" : "bg-gray-50";
  const inputBorderColor = isDarkMode ? "border-gray-700" : "border-gray-200";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const textMutedColor = isDarkMode ? "text-gray-400" : "text-gray-500";
  
  // Button colors
  const primaryBtnBg = "bg-emerald-600 hover:bg-emerald-700";
  const outlineBtnBg = isDarkMode ? "bg-gray-800 hover:bg-gray-700 border-gray-700" : 
    "bg-white hover:bg-gray-100 border-gray-200";
  
  // Effect badge colors
  const badgeBg = isDarkMode ? "bg-gray-800" : "bg-gray-100";
  const badgeBorder = isDarkMode ? "border-gray-700" : "border-gray-200";
  const selectedBadgeBg = isDarkMode ? "bg-emerald-900/50 border-emerald-600" : 
    "bg-emerald-100 border-emerald-400";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${bgColor} ${borderColor} ${textColor} max-w-md max-h-[90vh] overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle className={`text-xl font-bold ${textColor}`}>{t('journal.addNewEntry')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dosage">{t('journal.dosage')}</Label>
              <Input
                id="dosage"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className={`${inputBgColor} ${inputBorderColor} ${textColor}`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dosageType">{t('journal.type')}</Label>
              <Select value={dosageType} onValueChange={setDosageType}>
                <SelectTrigger className={`${inputBgColor} ${inputBorderColor} ${textColor}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={`${inputBgColor} ${borderColor}`}>
                  <SelectItem value="edible" className={textColor}>{t('journal.edible')}</SelectItem>
                  <SelectItem value="flower" className={textColor}>{t('journal.flower')}</SelectItem>
                  <SelectItem value="vaporized" className={textColor}>{t('journal.vaporized')}</SelectItem>
                  <SelectItem value="tincture" className={textColor}>{t('journal.tincture')}</SelectItem>
                  <SelectItem value="concentrate" className={textColor}>{t('journal.concentrate')}</SelectItem>
                  <SelectItem value="other" className={textColor}>{t('journal.other')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t('journal.effectiveness')} (1-5)</Label>
            <div className="flex gap-2 justify-between">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  type="button"
                  variant={effectiveness === rating ? "default" : "outline"}
                  onClick={() => setEffectiveness(rating)}
                  className={`flex-1 ${
                    effectiveness === rating
                      ? primaryBtnBg
                      : outlineBtnBg
                  }`}
                >
                  {rating}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mood">{t('journal.mood')}</Label>
            <Input
              id="mood"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className={`${inputBgColor} ${inputBorderColor} ${textColor}`}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="activity">{t('journal.activity')}</Label>
            <Input
              id="activity"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className={`${inputBgColor} ${inputBorderColor} ${textColor}`}
            />
          </div>

          <div className="space-y-2">
            <Label>{t('journal.sideEffects')}</Label>
            <div className="flex flex-wrap gap-2">
              {possibleEffects.map((effect) => (
                <Badge
                  key={effect}
                  variant="outline"
                  className={`cursor-pointer select-none px-2.5 py-1 text-sm ${
                    sideEffects.includes(effect)
                      ? selectedBadgeBg
                      : `${badgeBg} ${badgeBorder}`
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
            <Label htmlFor="notes">{t('journal.notes')}</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={`${inputBgColor} ${inputBorderColor} ${textColor} min-h-[100px]`}
            />
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className={outlineBtnBg}
          >
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleSubmit} 
            className={primaryBtnBg}
          >
            {t('journal.saveEntry')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewJournalEntry;
