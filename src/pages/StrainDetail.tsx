
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { fetchStrainById } from "@/services/strainService";
import StrainReviews from "@/components/StrainReviews";
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

  // Log strain details to verify data
  console.log("Strain detail data:", {
    name: strain.name,
    effects: strain.effects,
    raw_effects: {
      top: strain.top_effect, top_percent: strain.top_percent,
      second: strain.second_effect, second_percent: strain.second_percent,
      third: strain.third_effect, third_percent: strain.third_percent
    }
  });

  // Get valid effects, filtering out "Unknown" values
  const displayEffects = strain.effects
    .filter(effect => effect && effect.effect && effect.effect !== "Unknown")
    .sort((a, b) => b.intensity - a.intensity);

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
                <p className="text-xl font-medium text-white">
                  {strain.thc_level ? `${strain.thc_level}%` : t('strains.unknown')}
                </p>
              </div>
              <div>
                <p className="text-gray-400">{t('strains.dominantTerpene')}</p>
                <p className="text-xl font-medium text-white">
                  {strain.most_common_terpene || t('strains.unknown')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section - Now shown directly */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">{t('strains.description')}</h2>
          <div className="bg-gray-800 rounded-lg p-6">
            <p className="text-gray-300 whitespace-pre-line">{strain.description || t('strains.noDescriptionAvailable')}</p>
          </div>
        </div>

        {/* Effects Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">{t('strains.effects')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {displayEffects && displayEffects.length > 0 ? (
              displayEffects.map((effect, index) => (
                <div key={`effect-${index}`} className="bg-gray-800 rounded-lg p-4">
                  <h3 className="font-medium mb-2 text-white">{effect.effect}</h3>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        index === 0 ? 'bg-emerald-600' : 
                        index === 1 ? 'bg-purple-600' : 'bg-blue-600'
                      }`}
                      style={{ width: `${effect.intensity}%` }}
                    ></div>
                  </div>
                  <p className="text-right text-sm text-white mt-1">
                    {`${effect.intensity}%`}
                  </p>
                </div>
              ))
            ) : (
              // If no effect data available, show placeholders
              Array.from({length: 3}).map((_, index) => (
                <div key={`effect-placeholder-${index}`} className="bg-gray-800 rounded-lg p-4">
                  <h3 className="font-medium mb-2 text-white">{t('strains.noData')}</h3>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className="bg-gray-600 h-2.5 rounded-full w-[50%]"></div>
                  </div>
                  <p className="text-right text-sm text-white mt-1">{t('strains.unknown')}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">{t('strains.reviews.title')}</h2>
          <StrainReviews strainId={id || '1'} strainName={strain.name} />
        </div>

        <Separator className="my-8 bg-gray-700" />

        <div>
          <h2 className="text-xl font-semibold mb-4">{t('strains.strainDetails')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {/* Additional strain details here if needed */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StrainDetail;
