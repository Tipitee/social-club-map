
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface OfflineSaveButtonProps {
  itemId: string;
  itemName: string;
  itemType: 'strain' | 'club';
}

const OfflineSaveButton: React.FC<OfflineSaveButtonProps> = ({ itemId, itemName, itemType }) => {
  const { t } = useTranslation();
  const [isSaved, setIsSaved] = useState(false);
  
  useEffect(() => {
    // Check if this item is saved in offline storage
    // This would be replaced with actual localStorage/IndexedDB check in a real app
    const mockSavedItems = {
      'strain-1': true,
      'strain-2': false,
      'club-1': true
    };
    
    setIsSaved(!!mockSavedItems[`${itemType}-${itemId}`]);
  }, [itemId, itemType]);

  const handleSave = () => {
    // In a real app, this would save the item to local storage
    setIsSaved(true);
    
    toast({
      title: itemType === 'strain' ? t('offline.strainSaved') : t('offline.clubSaved'),
      description: `${itemName} ${t('offline.savedItems')}`
    });
  };

  return (
    <Button
      variant={isSaved ? "outline" : "secondary"}
      size="sm"
      onClick={handleSave}
      disabled={isSaved}
      className={isSaved ? "bg-gray-700 border-emerald-600 text-emerald-400" : ""}
    >
      {isSaved ? (
        <>
          <CheckCircle className="mr-1 h-4 w-4" /> 
          {t('offline.availableOffline')}
        </>
      ) : (
        <>
          <Download className="mr-1 h-4 w-4" />
          {itemType === 'strain' ? t('offline.saveStrain') : t('offline.saveClub')}
        </>
      )}
    </Button>
  );
};

export default OfflineSaveButton;
