import React, { useState } from "react";
import { Plus, X, Loader2, ThumbsUp, ThumbsDown, Wind, Coffee, Book, Music, Tv, Users, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { JournalEntry } from "@/types/journal";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

type NewJournalEntryProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Omit<JournalEntry, "id">) => void;
};

const SIDE_EFFECTS = [
  { id: "dry-mouth", label: "Dry Mouth", icon: ThumbsDown },
  { id: "dry-eyes", label: "Dry Eyes", icon: ThumbsDown },
  { id: "headache", label: "Headache", icon: ThumbsDown },
  { id: "paranoia", label: "Paranoia", icon: ThumbsDown },
  { id: "dizziness", label: "Dizziness", icon: Wind },
  { id: "anxiety", label: "Anxiety", icon: ThumbsDown },
];

const ACTIVITIES = [
  { id: "relaxing", label: "Relaxing", icon: Coffee },
  { id: "reading", label: "Reading", icon: Book },
  { id: "music", label: "Listening to Music", icon: Music },
  { id: "watching", label: "Watching TV/Movies", icon: Tv },
  { id: "social", label: "Socializing", icon: Users },
];

const DOSAGE_TYPES = [
  { value: "edible", label: "Edible" },
  { value: "joints", label: "Joints" },
  { value: "mg", label: "mg (Milligrams)" },
  { value: "g", label: "g (Grams)" },
  { value: "ml", label: "ml (Milliliters)" },
  { value: "puffs", label: "Puffs" },
  { value: "drops", label: "Drops" },
  { value: "servings", label: "Servings" },
  { value: "flower", label: "Flower" },
  { value: "concentrate", label: "Concentrate" },
  { value: "tincture", label: "Tincture" },
];

const NewJournalEntry: React.FC<NewJournalEntryProps> = ({ isOpen, onClose, onSave }) => {
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  
  const [dosage, setDosage] = useState("");
  const [dosageType, setDosageType] = useState("edible");
  const [effectiveness, setEffectiveness] = useState(0);
  const [mood, setMood] = useState("");
  const [activity, setActivity] = useState("");
  const [selectedEffects, setSelectedEffects] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const isDarkMode = document.documentElement.classList.contains('dark');
  
  const handleSave = () => {
    setSaving(true);
    try {
      const newEntry: Omit<JournalEntry, "id"> = {
        date: format(new Date(), "yyyy-MM-dd"),
        dosage,
        dosageType,
        effectiveness,
        mood,
        activity,
        sideEffects: selectedEffects,
        notes,
      };
      
      onSave(newEntry);
    } finally {
      setSaving(false);
    }
  };
  
  const clearForm = () => {
    setDosage("");
    setDosageType("edible");
    setEffectiveness(0);
    setMood("");
    setActivity("");
    setSelectedEffects([]);
    setNotes("");
  };

  const toggleEffect = (effectId: string) => {
    setSelectedEffects(prev => 
      prev.includes(effectId) 
        ? prev.filter(id => id !== effectId) 
        : [...prev, effectId]
    );
  };

  const getEntryDialogClass = () => isDarkMode 
    ? "bg-gray-800/95 border-primary/20" 
    : "bg-oldLace-500 border-cadetGray-300/50";

  const getLabelClass = () => isDarkMode
    ? "text-white" 
    : "text-gray-800";

  const getInputClass = () => isDarkMode
    ? "bg-gray-700 border-gray-600 text-white focus:ring-primary/70" 
    : "bg-white/70 border-cadetGray-300 text-gray-800 focus:ring-primary/70";
    
  const getDropdownClass = () => isDarkMode
    ? "bg-gray-700 border-gray-600 text-white"
    : "bg-white border-cadetGray-300 text-gray-800";
    
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        clearForm();
      }
    }}>
      <DialogContent className={`${getEntryDialogClass()} max-w-3xl max-h-[90vh] overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle className={`text-center text-xl font-bold mb-4 ${getLabelClass()}`}>
            {t('journal.newEntry')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="dosage" className={getLabelClass()}>
                {t('journal.dosage')}
              </Label>
              <div className="flex mt-1 gap-0">
                <Input
                  id="dosage"
                  type="text"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  className={`${getInputClass()} rounded-r-none flex-1`}
                  placeholder="Enter amount"
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className={`${getDropdownClass()} rounded-l-none min-w-[120px] flex justify-between items-center`}
                    >
                      {DOSAGE_TYPES.find(type => type.value === dosageType)?.label || dosageType}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className={getDropdownClass()}>
                    {DOSAGE_TYPES.map((type) => (
                      <DropdownMenuItem 
                        key={type.value}
                        onClick={() => setDosageType(type.value)}
                        className={
                          dosageType === type.value
                            ? "bg-primary/20 text-primary font-medium"
                            : ""
                        }
                      >
                        {type.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <div>
              <Label className={getLabelClass()}>
                {t('journal.effectiveness')}
              </Label>
              <div className="flex items-center gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    type="button"
                    variant={effectiveness === rating ? "default" : "outline"}
                    size="sm"
                    onClick={() => setEffectiveness(rating)}
                    className={effectiveness === rating 
                      ? "bg-primary hover:bg-primary/90 text-white" 
                      : isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                        : "bg-white border-cadetGray-300 text-gray-800 hover:bg-gray-100"
                    }
                  >
                    {rating}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="mood" className={getLabelClass()}>
                {t('journal.mood')}
              </Label>
              <Input
                id="mood"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className={`${getInputClass()} mt-1`}
              />
            </div>
            
            <div>
              <Label htmlFor="activity" className={getLabelClass()}>
                {t('journal.activity')}
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                {ACTIVITIES.map((act) => {
                  const isSelected = activity === act.id;
                  return (
                    <Button
                      key={act.id}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActivity(isSelected ? "" : act.id)}
                      className={`flex items-center justify-start gap-2 ${
                        isSelected 
                          ? "bg-primary hover:bg-primary/90 text-white" 
                          : isDarkMode
                            ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                            : "bg-white border-cadetGray-300 text-gray-800 hover:bg-gray-100"
                      }`}
                    >
                      <act.icon className="w-4 h-4" />
                      <span className="text-xs">{t(`journal.activities.${act.id}`)}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label className={getLabelClass()}>
                {t('journal.sideEffects')}
              </Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {SIDE_EFFECTS.map((effect) => {
                  const isSelected = selectedEffects.includes(effect.id);
                  return (
                    <Button
                      key={effect.id}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleEffect(effect.id)}
                      className={`flex items-center justify-start gap-2 h-auto py-1.5 ${
                        isSelected 
                          ? "bg-primary hover:bg-primary/90 text-white" 
                          : isDarkMode
                            ? "bg-gray-700/90 border-gray-600 text-gray-100 hover:bg-gray-600"
                            : "bg-white/90 border-cadetGray-300 text-gray-800 hover:bg-gray-100"
                      }`}
                    >
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                      ) : (
                        <effect.icon className="w-4 h-4 flex-shrink-0" />
                      )}
                      <span className="text-xs whitespace-nowrap overflow-hidden text-ellipsis">
                        {t(`journal.sideEffects.${effect.id}`)}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </div>
            
            <div>
              <Label htmlFor="notes" className={getLabelClass()}>
                {t('journal.notes')}
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={5}
                className={`${getInputClass()} mt-1`}
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className={isDarkMode 
              ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600" 
              : "bg-white border-cadetGray-300 text-gray-800 hover:bg-gray-100"
            }
          >
            <X className="w-4 h-4 mr-2" />
            {t('common.cancel')}
          </Button>
          <Button 
            type="button"
            disabled={saving || !dosage || effectiveness === 0}
            onClick={handleSave}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('common.saving')}
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                {t('journal.saveEntry')}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewJournalEntry;
