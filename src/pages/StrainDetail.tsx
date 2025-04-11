
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { ChevronLeft, Cannabis, Sun, CircleDashed, Leaf } from "lucide-react";
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Indica":
        return <Cannabis className="h-6 w-6 text-purple-500" />;
      case "Sativa":
        return <Sun className="h-6 w-6 text-amber-500" />;
      case "Hybrid":
      default:
        return <CircleDashed className="h-6 w-6 text-emerald-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Indica":
        return "bg-purple-600";
      case "Sativa":
        return "bg-amber-500";
      case "Hybrid":
      default:
        return "bg-emerald-500";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#121212]">
        <div className="h-8 w-8 border-t-2 border-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !strain) {
    return (
      <div className="container px-4 py-6 mb-20 bg-[#121212] text-white">
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

  // Get valid effects, filtering out "Unknown" values
  const displayEffects = strain.effects
    .filter(effect => effect && effect.effect && effect.effect !== "Unknown")
    .sort((a, b) => b.intensity - a.intensity);

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <Navbar />
      <main className="container px-4 py-8 max-w-5xl mx-auto">
        <div className="mb-6">
          <Link to="/strains">
            <Button variant="outline" size="sm" className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 flex items-center">
              <ChevronLeft className="mr-1 h-4 w-4" />
              {t('strains.backToAllStrains')}
            </Button>
          </Link>
        </div>

        {/* Main Strain Info Card */}
        <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row">
            {/* Strain Image */}
            <div className="md:w-1/3 h-64 md:h-auto">
              <div className="h-full relative bg-gray-800">
                {strain.img_url ? (
                  <img
                    src={strain.img_url}
                    alt={strain.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {getTypeIcon(strain.type)}
                  </div>
                )}
              </div>
            </div>
            
            {/* Strain Details */}
            <div className="md:w-2/3 p-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-white">{strain.name}</h1>
                <Badge className={`${getTypeColor(strain.type)} px-3 py-1 text-sm`}>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(strain.type)}
                    <span>{strain.type}</span>
                  </div>
                </Badge>
              </div>
              
              {/* THC and Terpene Info */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-sm text-gray-400 mb-1">{t('strains.thcLevel')}</h3>
                  <p className="text-2xl font-semibold text-white">
                    {strain.thc_level ? `${strain.thc_level}%` : t('strains.unknown')}
                  </p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-sm text-gray-400 mb-1">{t('strains.dominantTerpene')}</h3>
                  <p className="text-2xl font-semibold text-white">
                    {strain.most_common_terpene || t('strains.unknown')}
                  </p>
                </div>
              </div>
              
              {/* Description */}
              {strain.description && (
                <div>
                  <p className="text-gray-300 line-clamp-3">{strain.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Effects Section with improved design */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <Leaf className="mr-2 h-5 w-5 text-emerald-500" />
            {t('strains.effects')}
          </h2>
          
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {displayEffects && displayEffects.length > 0 ? (
                displayEffects.map((effect, index) => (
                  <div key={`effect-${index}`} className="bg-gray-800 rounded-xl p-5 border border-gray-700 transition-all duration-300 hover:shadow-lg">
                    <h3 className="text-lg font-semibold mb-3 text-white">{effect.effect}</h3>
                    <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                      <div 
                        className={`h-3 rounded-full ${
                          index === 0 ? 'bg-emerald-600' : 
                          index === 1 ? 'bg-purple-600' : 'bg-blue-600'
                        }`}
                        style={{ width: `${effect.intensity}%` }}
                      ></div>
                    </div>
                    <p className="text-right text-sm font-medium text-white mt-1">
                      {`${effect.intensity}%`}
                    </p>
                  </div>
                ))
              ) : (
                // If no effect data available, show placeholders
                Array.from({length: 3}).map((_, index) => (
                  <div key={`effect-placeholder-${index}`} className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                    <h3 className="text-lg font-semibold mb-3 text-white">{t('strains.noData')}</h3>
                    <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                      <div className="bg-gray-600 h-3 rounded-full w-[50%]"></div>
                    </div>
                    <p className="text-right text-sm font-medium text-white mt-1">{t('strains.unknown')}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Description Section - with improved styling */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">{t('strains.description')}</h2>
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <p className="text-gray-300 whitespace-pre-line">{strain.description || t('strains.noDescriptionAvailable')}</p>
          </div>
        </div>

        {/* Reviews Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">{t('strains.reviews.title')}</h2>
          <StrainReviews strainId={id || '1'} strainName={strain.name} />
        </div>

        {/* Removed the "Additional Information" section as requested */}
      </main>
    </div>
  );
};

export default StrainDetail;
