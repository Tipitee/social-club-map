
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Download, WifiOff, Database, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

// Mock data for offline items
const mockOfflineStrains = [
  { id: '1', name: 'Blue Dream', type: 'hybrid', thcLevel: 18, saved: true },
  { id: '2', name: 'Northern Lights', type: 'indica', thcLevel: 16, saved: true },
  { id: '3', name: 'Jack Herer', type: 'sativa', thcLevel: 19, saved: false }
];

const mockOfflineClubs = [
  { id: '1', name: 'Berlin Cannabis Social Club', location: 'Berlin', saved: true },
  { id: '2', name: 'Munich Green Collective', location: 'Munich', saved: false }
];

const OfflineAccess: React.FC = () => {
  const { t } = useTranslation();
  const [savedStrains, setSavedStrains] = useState<any[]>([]);
  const [savedClubs, setSavedClubs] = useState<any[]>([]);
  const [storageUsage, setStorageUsage] = useState(0);

  useEffect(() => {
    // Load saved items from localStorage (in a real app)
    // Here we'll use the mock data
    setSavedStrains(mockOfflineStrains.filter(strain => strain.saved));
    setSavedClubs(mockOfflineClubs.filter(club => club.saved));
    
    // Calculate mock storage usage (0-100)
    setStorageUsage(35);
  }, []);

  const handleRemoveItem = (type: 'strain' | 'club', id: string) => {
    if (type === 'strain') {
      setSavedStrains(prev => prev.filter(strain => strain.id !== id));
      toast({
        title: t('offline.removedFromOffline'),
        description: `${id === '1' ? 'Blue Dream' : 'Northern Lights'} ${t('offline.removedFromOffline').toLowerCase()}`
      });
    } else {
      setSavedClubs(prev => prev.filter(club => club.id !== id));
      toast({
        title: t('offline.removedFromOffline'),
        description: `Berlin Cannabis Social Club ${t('offline.removedFromOffline').toLowerCase()}`
      });
    }
  };

  const handleClearAll = () => {
    setSavedStrains([]);
    setSavedClubs([]);
    setStorageUsage(0);
    
    toast({
      title: t('offline.clearAll'),
      description: t('offline.noSavedItems')
    });
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white pb-20">
      <Navbar />
      <main className="container px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{t('offline.title')}</h1>
          <p className="text-gray-400">{t('offline.description')}</p>
        </div>

        <Card className="mb-8 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2 text-emerald-400" />
              {t('offline.storageUsage')}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {storageUsage}% {t('offline.storageUsage').toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={storageUsage} className="h-2 mb-4" />
            <Button 
              variant="destructive" 
              onClick={handleClearAll}
              disabled={savedStrains.length === 0 && savedClubs.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {t('offline.clearAll')}
            </Button>
          </CardContent>
        </Card>

        <Tabs defaultValue="strains" className="w-full">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="strains" className="data-[state=active]:bg-emerald-700">
              {t('app.navigation.strains')}
            </TabsTrigger>
            <TabsTrigger value="clubs" className="data-[state=active]:bg-emerald-700">
              {t('app.navigation.clubs')}
            </TabsTrigger>
          </TabsList>
          
          {/* Strains Content */}
          <TabsContent value="strains" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedStrains.length > 0 ? (
                savedStrains.map(strain => (
                  <Card key={strain.id} className="bg-gray-800 border-gray-700">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white">{strain.name}</CardTitle>
                          <CardDescription className="text-gray-400">
                            {strain.type} | THC: {strain.thcLevel}%
                          </CardDescription>
                        </div>
                        <Badge className="bg-emerald-700 text-white">
                          <WifiOff className="h-3 w-3 mr-1" />
                          {t('offline.availableOffline')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleRemoveItem('strain', strain.id)}
                        className="mt-2"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        {t('offline.removedFromOffline')}
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="bg-gray-800 border-gray-700 col-span-2 text-center p-8">
                  <WifiOff className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                  <p className="text-gray-400">{t('offline.noSavedItems')}</p>
                </Card>
              )}
            </div>
          </TabsContent>
          
          {/* Clubs Content */}
          <TabsContent value="clubs" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedClubs.length > 0 ? (
                savedClubs.map(club => (
                  <Card key={club.id} className="bg-gray-800 border-gray-700">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white">{club.name}</CardTitle>
                          <CardDescription className="text-gray-400">
                            {club.location}
                          </CardDescription>
                        </div>
                        <Badge className="bg-emerald-700 text-white">
                          <WifiOff className="h-3 w-3 mr-1" />
                          {t('offline.availableOffline')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleRemoveItem('club', club.id)}
                        className="mt-2"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        {t('offline.removedFromOffline')}
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="bg-gray-800 border-gray-700 col-span-2 text-center p-8">
                  <WifiOff className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                  <p className="text-gray-400">{t('offline.noSavedItems')}</p>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default OfflineAccess;
