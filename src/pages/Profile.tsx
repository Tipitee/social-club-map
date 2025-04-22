
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Edit, User, Save, Loader2, LogOut, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";

type Profile = {
  id: string;
  username: string | null;
  avatar_url: string | null;
  language: string | null;
};

const Profile: React.FC = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const isDarkMode = document.documentElement.classList.contains('dark');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    async function fetchProfile() {
      setLoading(true);
      try {
        const {
          data,
          error
        } = await supabase.from('profiles').select('id, username, avatar_url, language').eq('id', user.id).single();
        if (error) throw error;
        setProfile(data);
        setUsername(data?.username || user.email?.split('@')[0] || '');

        if (data?.language && i18n.language !== data.language) {
          i18n.changeLanguage(data.language);
        }
      } catch (error: any) {
        console.error('Error fetching profile:', error.message);
        toast({
          title: "Error",
          description: "Couldn't load your profile information",
          variant: "destructive",
          duration: 2000
        });
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [user, navigate, toast, t, i18n]);

  const updateProfile = async () => {
    if (!user) return;
    setUpdating(true);
    try {
      const {
        error
      } = await supabase.from('profiles').update({
        username: username,
        updated_at: new Date().toISOString()
      }).eq('id', user.id);
      if (error) throw error;
      toast({
        title: t('profile.profileUpdated'),
        description: t('profile.profileUpdateSuccess'),
        duration: 2000
      });
      setEditMode(false);

      const {
        data
      } = await supabase.from('profiles').select('id, username, avatar_url, language').eq('id', user.id).single();
      if (data) setProfile(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
        duration: 2000
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleLanguageChange = async (lang: string) => {
    if (!user) return;
    try {
      const {
        error
      } = await supabase.from('profiles').update({
        language: lang,
        updated_at: new Date().toISOString()
      }).eq('id', user.id);
      if (error) throw error;
      i18n.changeLanguage(lang);
      toast({
        title: "Language Updated",
        description: lang === 'en' ? "Language set to English" : "Sprache auf Deutsch eingestellt",
        duration: 2000
      });

      const {
        data
      } = await supabase.from('profiles').select('id, username, avatar_url, language').eq('id', user.id).single();
      if (data) setProfile(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
        duration: 2000
      });
    }
  };

  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
    localStorage.setItem('theme', newTheme);

    setProfile(prev => prev ? {
      ...prev
    } : null);
  };

  const getBackgroundClass = () => isDarkMode ? "bg-[#121212] text-white" : "bg-oldLace-500 text-gray-800";
  const getCardClass = () => isDarkMode ? "border-primary/20 shadow-xl bg-gray-800" : "border-cadetGray-300/20 shadow-lg bg-white";

  const handleClose = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linen dark:bg-navy-dark pb-28 pt-16">
        <Navbar />
        <div className="container px-4 py-8 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <BottomNav />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-linen dark:bg-navy-dark pb-28 pt-16">
        <Navbar />
        <div className="container px-4 py-8 max-w-md mx-auto">
          <Card className="bg-white dark:bg-navy-light border-navy-DEFAULT dark:border-navy-light shadow-md">
            <CardContent className="pt-6 text-center">
              <div className="flex justify-center">
                <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <User className="h-12 w-12 text-primary/60" />
                </div>
              </div>
              <h2 className="text-xl font-bold mb-2">Not Signed In</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Sign in to access your profile</p>
              <Button onClick={() => navigate('/auth')} className="bg-primary hover:bg-primary/90 text-white">
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linen dark:bg-navy-dark pb-28 pt-16">
      <Navbar />
      <div className="container px-4 py-8 max-w-xl mx-auto relative">
        <Button 
          onClick={handleClose}
          variant="outline" 
          size="icon" 
          className="absolute top-0 right-0 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
          aria-label="Close profile"
        >
          <X className="h-5 w-5" />
        </Button>
        
        <Card className="bg-white dark:bg-navy-light border-navy-DEFAULT dark:border-navy-light shadow-md backdrop-blur mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4">
                <Avatar className="h-24 w-24 border-2 border-primary">
                  <AvatarImage src={profile?.avatar_url || undefined} alt={username} />
                  <AvatarFallback className="bg-primary/20 text-2xl text-primary font-semibold">
                    {username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button size="sm" className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0 bg-primary hover:bg-primary/90" aria-label={t('profile.changeAvatar')}>
                  <Camera className="h-4 w-4" />
                  <span className="sr-only">{t('profile.changeAvatar')}</span>
                </Button>
              </div>
              
              <div className="text-center">
                {!editMode && <h2 className="text-xl font-bold">{profile?.username || username}</h2>}
              </div>
            </div>

            {editMode ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="username" className="text-gray-700 dark:text-gray-200">
                    {t('profile.usernameLabel')}
                  </Label>
                  <Input id="username" value={username} onChange={e => setUsername(e.target.value)} className="bg-gray-50 dark:bg-navy-400 border-gray-200 dark:border-navy-500 text-gray-900 dark:text-white" placeholder={t('profile.enterUsername')} autoFocus />
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-200">
                    Email
                  </Label>
                  <Input id="email" value={user.email || ""} readOnly className="bg-gray-50 dark:bg-navy-400 border-gray-200 dark:border-navy-500 text-gray-500 dark:text-gray-400" />
                </div>
                
                <div className="flex justify-center gap-4 mt-4">
                  <Button variant="outline" onClick={() => {
                    setEditMode(false);
                    setUsername(profile?.username || user.email?.split('@')[0] || '');
                  }} className="border-gray-200 dark:border-navy-500 hover:bg-gray-100 dark:hover:bg-navy-400 text-gray-800 dark:text-gray-200">
                    {t('profile.cancel')}
                  </Button>
                  <Button onClick={updateProfile} disabled={updating} className="bg-primary hover:bg-primary/90 text-white">
                    {updating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('profile.saving')}
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {t('profile.saveProfile')}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <Button onClick={() => setEditMode(true)} className="mt-4 bg-primary hover:bg-primary/90 text-white" variant="default">
                  <Edit className="mr-2 h-4 w-4" />
                  {t('profile.editProfile')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-navy-light border-navy-DEFAULT dark:border-navy-light shadow-md backdrop-blur mb-8">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">{t('settings.appearance')}</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>{t('settings.language')}</span>
                <div className="flex gap-3">
                  <Button variant={profile?.language === 'en' ? 'default' : 'outline'} onClick={() => handleLanguageChange('en')} className={profile?.language === 'en' ? 'bg-primary hover:bg-primary/90 text-white' : 'bg-white dark:bg-navy-400 border-gray-200 dark:border-navy-500 hover:bg-gray-100 dark:hover:bg-navy-300 text-gray-800 dark:text-gray-200'} size="sm">
                    English
                  </Button>
                  <Button variant={profile?.language === 'de' ? 'default' : 'outline'} onClick={() => handleLanguageChange('de')} className={profile?.language === 'de' ? 'bg-primary hover:bg-primary/90 text-white' : 'bg-white dark:bg-navy-400 border-gray-200 dark:border-navy-500 hover:bg-gray-100 dark:hover:bg-navy-300 text-gray-800 dark:text-gray-200'} size="sm">
                    Deutsch
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                <span>{t('settings.theme')}</span>
                <Button variant="outline" onClick={toggleTheme} className="bg-white dark:bg-navy-400 border-gray-200 dark:border-navy-500 hover:bg-gray-100 dark:hover:bg-navy-300 text-gray-800 dark:text-gray-200" size="sm">
                  {isDarkMode ? t('settings.lightMode') : t('settings.darkMode')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-navy-light border-navy-DEFAULT dark:border-navy-light shadow-md backdrop-blur">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">{t('profile.accountActions')}</h3>
              
              <Button variant="destructive" className="w-full" onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                {t('profile.signOut')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <BottomNav />
    </div>
  );
};

export default Profile;
