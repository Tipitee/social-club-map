
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UsernamePromptProps {
  isOpen: boolean;
  onClose: () => void;
  onUsernameSaved: (username: string) => void;
}

const UsernamePrompt: React.FC<UsernamePromptProps> = ({ isOpen, onClose, onUsernameSaved }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [username, setUsername] = useState('');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  
  // Detect current theme
  const isDarkMode = document.documentElement.classList.contains('dark');

  const handleSaveUsername = async () => {
    if (!user || !username.trim()) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          username: username.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast({
        title: t('profile.profileUpdated'),
        description: t('profile.usernameUpdated'),
        duration: 2000,
      });
      
      onUsernameSaved(username);
      onClose();
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setSaving(false);
    }
  };

  const getDialogContentClass = () => isDarkMode 
    ? "bg-gray-900 border-primary/20"
    : "bg-oldLace-500 border-cadetGray-300/50";
    
  const getTitleClass = () => isDarkMode
    ? "text-white"
    : "text-gray-800";
    
  const getDescriptionClass = () => isDarkMode
    ? "text-gray-400"
    : "text-gray-600";
    
  const getLabelClass = () => isDarkMode
    ? "text-gray-200"
    : "text-gray-700";
    
  const getInputClass = () => isDarkMode
    ? "bg-gray-800 border-gray-700 text-white"
    : "bg-white border-cadetGray-300 text-gray-800";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={`${getDialogContentClass()} shadow-lg`}
      >
        <DialogHeader>
          <DialogTitle 
            className={`text-center text-xl font-bold ${getTitleClass()}`}
          >
            {t('profile.createUsername')}
          </DialogTitle>
          <DialogDescription 
            className={`text-center ${getDescriptionClass()}`}
          >
            {t('profile.usernameNeededForReviews')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-6 py-4">
          <div className="bg-primary/10 rounded-full p-4">
            <User className="h-10 w-10 text-primary" />
          </div>
          
          <div className="w-full space-y-2">
            <Label 
              htmlFor="username" 
              className={`text-sm font-medium ${getLabelClass()}`}
            >
              {t('profile.usernameLabel')}
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t('profile.enterUsername')}
              className={`w-full ${getInputClass()}`}
              autoFocus
            />
          </div>
          
          <Button 
            onClick={handleSaveUsername} 
            disabled={saving || !username.trim()}
            className="w-full bg-primary hover:bg-primary/90 text-white"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('profile.saving')}
              </>
            ) : (
              t('profile.saveUsername')
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UsernamePrompt;
