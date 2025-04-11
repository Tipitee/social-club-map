
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { ChevronLeft, Cannabis, Sun, CircleDashed, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
        return <Cannabis className="h-5 w-5 text-purple-500" />;
      case "Sativa":
        return <Sun className="h-5 w-5 text-amber-500" />;
      case "Hybrid":
      default:
        return <CircleDashed className="h-5 w-5 text-emerald-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Indica":
        return "bg-strain-indica";
      case "Sativa":
        return "bg-strain-sativa";
      case "Hybrid":
      default:
        return "bg-strain-hybrid";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-8 w-8 border-t-2 border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !strain) {
    return (
      <div className="container px-4 py-6 mb-20">
        <h1 className="text-2xl font-bold mb-4">{t('strains.strainNotFound')}</h1>
        <p className="text-muted-foreground mb-4">{t('strains.errorLoadingStrain')}</p>
        <p className="text-muted-foreground mb-6">{t('strains.requestedStrainNotFound')}</p>
        <Link to="/strains">
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Strains
          </Button>
        </Link>
      </div>
    );
  }

  // Get valid effects, filtering out "Unknown" values
  const displayEffects = strain.effects
    .filter(effect => effect && effect.effect && effect.effect !== "Unknown")
    .sort((a, b) => b.intensity - a.intensity)
    .slice(0, 3); // Only show top 3 effects

  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      <main className="container px-4 py-8 max-w-5xl mx-auto mb-20">
        <div className="mb-6">
          <Link to="/strains">
            <Button variant="outline" size="sm" className="flex items-center">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Strains
            </Button>
          </Link>
        </div>

        {/* Main Strain Info Card */}
        <div className="bg-card rounded-xl overflow-hidden border shadow-lg mb-6">
          <div className="flex flex-col md:flex-row">
            {/* Strain Image */}
            <div className="md:w-1/3 h-56 md:h-auto">
              <div className="h-full relative">
                {strain.img_url ? (
                  <img
                    src={strain.img_url}
                    alt={strain.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    {getTypeIcon(strain.type)}
                  </div>
                )}
              </div>
            </div>
            
            {/* Strain Details */}
            <div className="md:w-2/3 p-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold">{strain.name}</h1>
                <Badge className={`${getTypeColor(strain.type)} px-3 py-1 text-sm`}>
                  <div className="flex items-center gap-1">
                    {getTypeIcon(strain.type)}
                    <span>{strain.type}</span>
                  </div>
                </Badge>
              </div>
              
              {/* THC and Terpene Info - IMPROVED SMALLER SIZE */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-muted rounded-md inline-flex items-center p-2">
                  <div className="px-2">
                    <span className="text-xs text-muted-foreground">THC Level</span>
                    <p className="text-xs font-semibold">
                      {strain.thc_level ? `${strain.thc_level}%` : t('strains.unknown')}
                    </p>
                  </div>
                </div>
                <div className="bg-muted rounded-md inline-flex items-center p-2">
                  <div className="px-2">
                    <span className="text-xs text-muted-foreground">Dominant Terpene</span>
                    <p className="text-xs font-semibold">
                      {strain.most_common_terpene || t('strains.unknown')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Effects Section with improved design - SLIMMER HEIGHT */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Leaf className="mr-2 h-5 w-5 text-primary" />
            {t('strains.effects')}
          </h2>
          
          <div className="bg-card rounded-xl border p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {displayEffects && displayEffects.length > 0 ? (
                displayEffects.map((effect, index) => (
                  <div key={`effect-${index}`} className="effect-block bg-muted/50 border-muted">
                    <h3 className="text-sm font-semibold mb-1">{effect.effect}</h3>
                    <div className="w-full bg-muted rounded-full h-2 mb-1">
                      <div 
                        className={`h-2 rounded-full ${
                          index === 0 ? 'bg-primary' : 
                          index === 1 ? 'bg-strain-indica' : 'bg-strain-sativa'
                        }`}
                        style={{ width: `${effect.intensity}%` }}
                      ></div>
                    </div>
                    <p className="text-right text-xs font-medium text-muted-foreground mt-1">
                      {`${effect.intensity}%`}
                    </p>
                  </div>
                ))
              ) : (
                // If no effect data available, show placeholders
                Array.from({length: 3}).map((_, index) => (
                  <div key={`effect-placeholder-${index}`} className="effect-block bg-muted/50 border-muted">
                    <h3 className="text-sm font-semibold mb-1">{t('strains.noData')}</h3>
                    <div className="w-full bg-muted rounded-full h-2 mb-1">
                      <div className="bg-muted/50 h-2 rounded-full w-[50%]"></div>
                    </div>
                    <p className="text-right text-xs font-medium text-muted-foreground mt-1">{t('strains.unknown')}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Description</h2>
          <div className="bg-card rounded-xl border p-4 md:p-6">
            <p className="text-foreground whitespace-pre-line">{strain.description || t('strains.noDescriptionAvailable')}</p>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-20">
          <StrainReviews strainId={id || '1'} strainName={strain.name} />
        </div>
      </main>
    </div>
  );
};

export default StrainDetail;
