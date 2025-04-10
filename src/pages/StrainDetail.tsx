
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchStrainById } from "@/services/strainService";
import StrainReviews from "@/components/StrainReviews";
import OfflineSaveButton from "@/components/OfflineSaveButton";
import Navbar from "@/components/Navbar";

const StrainDetail: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  
  const { data: strain, error, isLoading } = useQuery({
    queryKey: ['strain', id],
    queryFn: () => fetchStrainById(id || ''),
  });

  if (isLoading) {
    return (
      <div className="container px-4 py-6 mb-20 text-center">
        <div className="h-6 w-6 border-t-2 border-blue-500 rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  if (error || !strain) {
    return (
      <div className="container px-4 py-6 mb-20">
        <h1 className="text-2xl font-bold text-white mb-4">{t('strains.strainNotFound')}</h1>
        <p className="text-gray-400 mb-4">{t('strains.errorLoadingStrain')}</p>
        <p className="text-gray-400 mb-6">{t('strains.requestedStrainNotFound')}</p>
        <Link to="/strains">
          <Button variant="outline" className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
            <ChevronLeft className="mr-2 h-4 w-4" />
            {t('strains.backToAllStrains')}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white pb-24">
      <Navbar />
      <main className="container px-4 py-6">
        <div className="mb-4">
          <Link to="/strains">
            <Button variant="outline" size="sm" className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
              <ChevronLeft className="mr-2 h-4 w-4" />
              {t('strains.backToAllStrains')}
            </Button>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="md:w-1/3">
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={strain.img_url || "/placeholder.svg"}
                alt={strain.name}
                className="w-full h-64 object-cover"
              />
            </div>
          </div>

          <div className="md:w-2/3">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl md:text-3xl font-bold text-white">{strain.name}</h1>
              <Badge className={`
                ${strain.type === 'Indica' ? 'bg-purple-600' : 
                  strain.type === 'Sativa' ? 'bg-red-600' : 'bg-blue-600'}
              `}>
                {strain.type}
              </Badge>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400">{t('strains.thcLevel')}</p>
                <p className="text-xl font-medium">
                  {strain.thc_level ? `${strain.thc_level}%` : t('strains.labDataPending')}
                </p>
              </div>
              <div>
                <p className="text-gray-400">{t('strains.dominantTerpene')}</p>
                <p className="text-xl font-medium">
                  {strain.most_common_terpene || t('strains.terpeneUnavailable')}
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <OfflineSaveButton 
                itemId={strain.unique_identifier || strain.id || '1'} 
                itemName={strain.name} 
                itemType="strain" 
              />
            </div>
          </div>
        </div>

        <Tabs defaultValue="effects" className="w-full mt-6">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="effects">{t('strains.effects')}</TabsTrigger>
            <TabsTrigger value="description">{t('strains.description')}</TabsTrigger>
            <TabsTrigger value="reviews">{t('strains.reviews.title')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="effects" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {strain.top_effect && (
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="font-medium mb-2">{strain.top_effect}</h3>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-emerald-600 h-2.5 rounded-full" 
                      style={{ width: `${strain.highest_percent || '80'}%` }}
                    ></div>
                  </div>
                  <p className="text-right text-sm text-gray-400 mt-1">{strain.highest_percent}%</p>
                </div>
              )}

              {strain.second_effect && (
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="font-medium mb-2">{strain.second_effect}</h3>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-emerald-600 h-2.5 rounded-full" 
                      style={{ width: `${strain.second_percent || '60'}%` }}
                    ></div>
                  </div>
                  <p className="text-right text-sm text-gray-400 mt-1">{strain.second_percent}%</p>
                </div>
              )}

              {strain.third_effect && (
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="font-medium mb-2">{strain.third_effect}</h3>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-emerald-600 h-2.5 rounded-full" 
                      style={{ width: `${strain.third_percent || '40'}%` }}
                    ></div>
                  </div>
                  <p className="text-right text-sm text-gray-400 mt-1">{strain.third_percent}%</p>
                </div>
              )}
              
              {/* If no effect data available, show the effects array data */}
              {(!strain.top_effect && strain.effects && strain.effects.length > 0) && (
                strain.effects.slice(0, 3).map((effect, index) => (
                  <div key={`effect-${index}`} className="bg-gray-800 rounded-lg p-4">
                    <h3 className="font-medium mb-2">{effect.effect}</h3>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-emerald-600 h-2.5 rounded-full" 
                        style={{ width: `${effect.intensity}%` }}
                      ></div>
                    </div>
                    <p className="text-right text-sm text-gray-400 mt-1">{effect.intensity}%</p>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="description" className="mt-4">
            <div className="bg-gray-800 rounded-lg p-6">
              <p className="text-gray-300 whitespace-pre-line">{strain.description || "No description available for this strain yet."}</p>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-4">
            <StrainReviews strainId={id || '1'} strainName={strain.name} />
          </TabsContent>
        </Tabs>

        <Separator className="my-8 bg-gray-700" />

        <div>
          <h2 className="text-xl font-semibold mb-4">{t('strains.strainDetails')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {/* Strain details here */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StrainDetail;
