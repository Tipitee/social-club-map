
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Edit, User, Save, Loader2, LogOut } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";

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

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    async function fetchProfile() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, avatar_url, language')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        setProfile(data);
        setUsername(data?.username || user.email?.split('@')[0] || '');
        
        // Update language based on profile if it exists
        if (data?.language && i18n.language !== data.language) {
          i18n.changeLanguage(data.language);
        }
      } catch (error: any) {
        console.error('Error fetching profile:', error.message);
        toast({
          title: "Error",
          description: "Couldn't load your profile information",
          variant: "destructive",
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
      const { error } = await supabase
        .from('profiles')
        .update({ 
          username: username,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });
      setEditMode(false);
      
      // Refresh profile data
      const { data } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, language')
        .eq('id', user.id)
        .single();
        
      if (data) setProfile(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleLanguageChange = async (lang: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          language: lang,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      i18n.changeLanguage(lang);
      
      toast({
        title: "Language Updated",
        description: lang === 'en' ? "Language set to English" : "Sprache auf Deutsch eingestellt",
      });
      
      // Refresh profile data
      const { data } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, language')
        .eq('id', user.id)
        .single();
        
      if (data) setProfile(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#13141f] to-[#1c1f2e] text-white pb-24">
        <Navbar />
        <div className="container px-4 py-8 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#13141f] to-[#1c1f2e] text-white pb-24">
        <Navbar />
        <div className="container px-4 py-8 max-w-md mx-auto">
          <Card className="bg-gray-900/70 border-gray-700 shadow-xl">
            <CardContent className="pt-6 text-center">
              <div className="flex justify-center">
                <div className="h-24 w-24 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <User className="h-12 w-12 text-gray-400" />
                </div>
              </div>
              <h2 className="text-xl font-bold mb-2">Not Signed In</h2>
              <p className="text-gray-400 mb-4">Sign in to access your profile</p>
              <Button onClick={() => navigate('/auth')} className="bg-primary hover:bg-primary/90">
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#13141f] to-[#1c1f2e] text-white pb-24">
      <Navbar />
      <div className="container px-4 py-8 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-8 text-center">My Profile</h1>
        
        <Card className="bg-gray-900/70 border-gray-700 shadow-xl backdrop-blur mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4">
                <Avatar className="h-24 w-24 border-2 border-primary">
                  <AvatarImage src={profile?.avatar_url || undefined} alt={username} />
                  <AvatarFallback className="bg-primary/20 text-2xl text-primary font-semibold">
                    {username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button size="sm" className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0 bg-primary hover:bg-primary/90">
                  <Camera className="h-4 w-4" />
                  <span className="sr-only">Change Avatar</span>
                </Button>
              </div>
              
              <div className="text-center">
                <h2 className="text-xl font-bold">{profile?.username || user.email?.split('@')[0]}</h2>
                <p className="text-gray-400">{user.email}</p>
              </div>
            </div>

            {editMode ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="username" className="text-white">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-gray-800/80 border-gray-700 text-white"
                  />
                </div>
                
                <div className="flex justify-center gap-4 mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setEditMode(false);
                      setUsername(profile?.username || user.email?.split('@')[0] || '');
                    }}
                    className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={updateProfile} 
                    disabled={updating}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {updating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <Button 
                  onClick={() => setEditMode(true)}
                  className="mt-4 bg-gray-800 hover:bg-gray-700 text-white"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900/70 border-gray-700 shadow-xl backdrop-blur mb-8">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Language Preferences</h3>
            <div className="flex gap-3">
              <Button 
                variant={profile?.language === 'en' ? 'default' : 'outline'}
                onClick={() => handleLanguageChange('en')} 
                className={profile?.language === 'en' 
                  ? 'bg-primary hover:bg-primary/90 flex-1' 
                  : 'bg-gray-800 border-gray-700 hover:bg-gray-700 flex-1'
                }
              >
                English
              </Button>
              <Button 
                variant={profile?.language === 'de' ? 'default' : 'outline'}
                onClick={() => handleLanguageChange('de')} 
                className={profile?.language === 'de' 
                  ? 'bg-primary hover:bg-primary/90 flex-1' 
                  : 'bg-gray-800 border-gray-700 hover:bg-gray-700 flex-1'
                }
              >
                Deutsch
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900/70 border-gray-700 shadow-xl backdrop-blur">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Account Actions</h3>
              
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={signOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
