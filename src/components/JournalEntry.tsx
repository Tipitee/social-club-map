
import React, { useState } from "react";
import { Star, Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { JournalEntry } from "@/types/journal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface JournalEntryComponentProps {
  entry: JournalEntry;
  onEdit?: (entry: JournalEntry) => void;
  onDelete?: (id: string) => void;
}

const JournalEntryComponent: React.FC<JournalEntryComponentProps> = ({ 
  entry,
  onEdit,
  onDelete
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
          size={20}
        />
      );
    }
    return stars;
  };

  const getEffectivenessLabel = (rating: number) => {
    if (rating >= 4) return "Very Effective";
    if (rating >= 3) return "Effective";
    return "Moderately Effective";
  };
  
  const getMoodEmoji = (mood: string) => {
    const lowerMood = mood.toLowerCase();
    if (lowerMood.includes("relax")) return "😌";
    if (lowerMood.includes("creat")) return "🤩";
    if (lowerMood.includes("happy")) return "😊";
    if (lowerMood.includes("energy") || lowerMood.includes("focus")) return "⚡";
    if (lowerMood.includes("sleep")) return "😴";
    return "😊";
  };

  const handleEditClick = () => {
    if (onEdit) {
      onEdit(entry);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (onDelete) {
      onDelete(entry.id);
    }
    setShowDeleteDialog(false);
  };
  
  return (
    <>
      <Card className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 p-6 mb-6 transition-all duration-300">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold mb-4 text-white">{entry.date}</h2>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-white hover:bg-gray-800"
              onClick={handleEditClick}
            >
              <Edit size={18} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-red-500 hover:bg-gray-800"
              onClick={handleDeleteClick}
            >
              <Trash2 size={18} />
            </Button>
          </div>
        </div>
        
        <div className="flex justify-between mb-3">
          <span className="text-gray-400">Dosage:</span>
          <span className="text-white font-medium">{entry.dosage} {entry.dosageType}</span>
        </div>
        
        <div className="mb-3">
          <div className="flex justify-between">
            <span className="text-gray-400">Effectiveness:</span>
            <span className="text-white font-medium ml-2">({getEffectivenessLabel(entry.effectiveness)})</span>
          </div>
          <div className="flex mt-1">
            {renderStars(entry.effectiveness)}
          </div>
        </div>
        
        <div className="flex justify-between mb-3">
          <span className="text-gray-400">Mood:</span>
          <div className="flex items-center">
            <span className="mr-2">{getMoodEmoji(entry.mood)}</span>
            <span className="text-white font-medium">{entry.mood}</span>
          </div>
        </div>
        
        <div className="flex justify-between mb-3">
          <span className="text-gray-400">Activity:</span>
          <span className="text-white font-medium">{entry.activity}</span>
        </div>
        
        <div className="mb-3">
          <div className="text-gray-400 mb-2">Side Effects:</div>
          <div className="flex flex-wrap gap-2">
            {entry.sideEffects.map((effect, index) => (
              <Badge key={index} variant="outline" className="bg-gray-800 text-sm text-white border border-gray-700">
                {effect}
              </Badge>
            ))}
          </div>
        </div>
        
        {entry.notes && (
          <div className={`mt-4 ${!expanded && entry.notes.length > 120 ? 'relative' : ''}`}>
            <div className="text-gray-400 mb-1">Notes:</div>
            <div className="relative">
              <p className={`text-white bg-gray-800 p-3 rounded-md border border-gray-700 ${
                !expanded && entry.notes.length > 120 ? 'line-clamp-3' : ''
              }`}>
                {entry.notes}
              </p>
              
              {entry.notes.length > 120 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpanded(!expanded)}
                  className="mt-1 text-gray-400 hover:text-white flex items-center justify-center w-full"
                >
                  {expanded ? (
                    <>Show less <ChevronUp size={16} className="ml-1" /></>
                  ) : (
                    <>Show more <ChevronDown size={16} className="ml-1" /></>
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-gray-900 border border-gray-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Journal Entry</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete this journal entry? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default JournalEntryComponent;
