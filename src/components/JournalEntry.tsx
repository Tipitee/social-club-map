
import React, { useState } from "react";
import { Star, Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { JournalEntry } from "@/types/journal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  
  // Detect theme for conditional styling
  const isDarkMode = document.documentElement.classList.contains('dark');

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`${i < rating ? "text-yellow-400 fill-yellow-400" : isDarkMode ? "text-gray-600" : "text-gray-400"}`}
          size={20}
        />
      );
    }
    return stars;
  };

  const getEffectivenessLabel = (rating: number) => {
    if (rating >= 4) return t('journal.veryEffective');
    if (rating >= 3) return t('journal.effective'); 
    return t('journal.moderatelyEffective');
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
  
  const getEntryCardClass = () => isDarkMode 
    ? "bg-gray-900 border-gray-800" 
    : "bg-white border-cadetGray-200";
    
  const getLabelClass = () => isDarkMode 
    ? "text-gray-400" 
    : "text-gray-500";
    
  const getValueClass = () => isDarkMode 
    ? "text-white" 
    : "text-gray-800";
    
  const getNotesClass = () => isDarkMode 
    ? "bg-gray-800 border-gray-700 text-white" 
    : "bg-gray-50 border-gray-200 text-gray-800";
    
  const getBadgeClass = () => isDarkMode 
    ? "bg-gray-800 text-white border-gray-700" 
    : "bg-gray-100 text-gray-800 border-gray-200";
    
  const getAlertDialogClass = () => isDarkMode
    ? "bg-gray-900 border-gray-700 text-white"
    : "bg-white border-gray-200 text-gray-800";
    
  const getCancelButtonClass = () => isDarkMode
    ? "bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
    : "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200";
  
  return (
    <>
      <Card className={`rounded-xl shadow-lg border p-6 mb-6 transition-all duration-300 ${getEntryCardClass()}`}>
        <div className="flex justify-between items-start">
          <h2 className={`text-xl font-bold mb-4 ${getValueClass()}`}>{entry.date}</h2>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`${getLabelClass()} hover:${getValueClass()} hover:bg-accent/20`}
              onClick={handleEditClick}
            >
              <Edit size={18} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`${getLabelClass()} hover:text-red-500 hover:bg-red-500/10`}
              onClick={handleDeleteClick}
            >
              <Trash2 size={18} />
            </Button>
          </div>
        </div>
        
        <div className="flex justify-between mb-3">
          <span className={getLabelClass()}>{t('journal.dosage')}:</span>
          <span className={`${getValueClass()} font-medium`}>{entry.dosage} {entry.dosageType}</span>
        </div>
        
        <div className="mb-3">
          <div className="flex justify-between">
            <span className={getLabelClass()}>{t('journal.effectiveness')}:</span>
            <span className={`${getValueClass()} font-medium ml-2`}>({getEffectivenessLabel(entry.effectiveness)})</span>
          </div>
          <div className="flex mt-1">
            {renderStars(entry.effectiveness)}
          </div>
        </div>
        
        <div className="flex justify-between mb-3">
          <span className={getLabelClass()}>{t('journal.mood')}:</span>
          <div className="flex items-center">
            <span className="mr-2">{getMoodEmoji(entry.mood)}</span>
            <span className={`${getValueClass()} font-medium`}>{entry.mood}</span>
          </div>
        </div>
        
        <div className="flex justify-between mb-3">
          <span className={getLabelClass()}>{t('journal.activity')}:</span>
          <span className={`${getValueClass()} font-medium`}>{entry.activity}</span>
        </div>
        
        <div className="mb-3">
          <div className={`${getLabelClass()} mb-2`}>{t('journal.sideEffects')}:</div>
          <div className="flex flex-wrap gap-2">
            {entry.sideEffects.length > 0 ? (
              entry.sideEffects.map((effect, index) => (
                <Badge key={index} variant="outline" className={`text-sm ${getBadgeClass()}`}>
                  {effect}
                </Badge>
              ))
            ) : (
              <span className={`text-sm ${getLabelClass()}`}>{t('journal.noSideEffects')}</span>
            )}
          </div>
        </div>
        
        {entry.notes && (
          <div className={`mt-4 ${!expanded && entry.notes.length > 120 ? 'relative' : ''}`}>
            <div className={`${getLabelClass()} mb-1`}>{t('journal.notes')}:</div>
            <div className="relative">
              <p className={`${getNotesClass()} p-3 rounded-md border ${
                !expanded && entry.notes.length > 120 ? 'line-clamp-3' : ''
              }`}>
                {entry.notes}
              </p>
              
              {entry.notes.length > 120 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpanded(!expanded)}
                  className={`mt-1 ${getLabelClass()} hover:${getValueClass()} flex items-center justify-center w-full`}
                >
                  {expanded ? (
                    <>{t('journal.showLess')} <ChevronUp size={16} className="ml-1" /></>
                  ) : (
                    <>{t('journal.showMore')} <ChevronDown size={16} className="ml-1" /></>
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className={getAlertDialogClass()}>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('journal.deleteEntry')}</AlertDialogTitle>
            <AlertDialogDescription className={getLabelClass()}>
              {t('journal.deleteConfirmation')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className={getCancelButtonClass()}>
              {t('common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default JournalEntryComponent;
