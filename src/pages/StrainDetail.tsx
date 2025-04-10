
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchStrainById } from "@/services/strainService";
import { Strain } from "@/types/strain";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Cannabis, Sun, CircleDashed, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const StrainDetail: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [strain, setStrain] = useState<Strain | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadStrain = async () => {
      if (!id) {
        setError("No strain ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const strainData = await fetchStrainById(id);
        
        if (!strainData) {
          setError(t('strains.requestedStrainNotFound'));
        } else {
          setStrain(strainData);
        }
      } catch (error) {
        console.error("Error loading strain:", error);
        const message = error instanceof Error ? error.message : t('strains.errorLoadingStrain');
        setError(message);
        
        toast({
          title: t('strains.errorLoadingStrain'),
          description: message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadStrain();
  }, [id, toast, t]);

  const getTypeIcon = (type: string | null) => {
    switch (type) {
      case "Indica":
        return <Cannabis className="h-5 w-5 text-purple-500 drop-shadow-md" />;
      case "Sativa":
        return <Sun className="h-5 w-5 text-amber-500 drop-shadow-md" />;
      case "Hybrid":
      default:
        return <CircleDashed className="h-5 w-5 text-emerald-500 drop-shadow-md" />;
    }
  };

  const getTypeColor = (type: string | null) => {
    switch (type) {
      case "Indica":
        return "bg-purple-600 text-white";
      case "Sativa":
        return "bg-amber-500 text-white";
      case "Hybrid":
      default:
        return "bg-emerald-500 text-white";
    }
  };

  const getEffectColor = (index: number) => {
    switch (index) {
      case 0: return 'bg-emerald-500'; // Primary effect
      case 1: return 'bg-purple-500';  // Secondary effect
      case 2: return 'bg-amber-500';   // Tertiary effect
      default: return 'bg-blue-500';   // Other effects
    }
  };

  const getBigTypeIcon = (type: string | null) => {
    switch (type) {
      case "Indica":
        return <Cannabis className="h-20 w-20 text-purple-500 drop-shadow-md" />;
      case "Sativa":
        return <Sun className="h-20 w-20 text-amber-500 drop-shadow-md" />;
      case "Hybrid":
      default:
        return <CircleDashed className="h-20 w-20 text-emerald-500 drop-shadow-md" />;
    }
  };

  if (loading) {
    return (
      <div className="container px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft />
          </Button>
          <Skeleton className="h-10 w-40" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Image skeleton */}
          <div className="md:col-span-1">
            <Skeleton className="aspect-square w-full rounded-xl" />
          </div>
          
          {/* Content skeleton */}
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            
            <div className="pt-6">
              <Skeleton className="h-8 w-40 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            
            <div className="pt-6">
              <Skeleton className="h-8 w-40 mb-3" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !strain) {
    return (
      <div className="container px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft />
          </Button>
          <h1 className="text-3xl font-bold">{t('strains.strainNotFound')}</h1>
        </div>
        
        <Card className="border-destructive">
          <CardContent className="p-8 flex flex-col items-center">
            <AlertCircle className="h-20 w-20 text-destructive mb-4" />
            <h2 className="text-2xl font-bold mb-2">{t('strains.errorLoadingStrain')}</h2>
            <p className="text-muted-foreground mb-6">{error || t('strains.requestedStrainNotFound')}</p>
            <Button onClick={() => navigate('/strains')}>
              {t('strains.backToAllStrains')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 pb-20">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft />
          </Button>
          <h1 className="text-3xl font-bold text-white">{t('strains.strainDetails')}</h1>
        </div>
        <LanguageSwitcher />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Strain Image */}
        <div className="md:col-span-1">
          <div className="rounded-xl overflow-hidden bg-gray-800 aspect-square shadow-xl flex items-center justify-center">
            {strain.img_url ? (
              <img
                src={strain.img_url}
                alt={strain.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  const container = e.currentTarget.parentElement;
                  if (container) {
                    container.innerHTML = `
                      <div class="w-full h-full flex items-center justify-center bg-gray-800">
                        ${getBigTypeIcon(strain.type)?.props?.outerHTML || ''}
                      </div>
                    `;
                  }
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full w-full">
                {getBigTypeIcon(strain.type)}
              </div>
            )}
          </div>
          
          <div className="mt-4">
            <Badge className={`${getTypeColor(strain.type)} px-2 py-1 text-sm inline-flex items-center gap-1.5`}>
              {getTypeIcon(strain.type)}
              <span>{strain.type || "Hybrid"}</span>
            </Badge>
          </div>
        </div>
        
        {/* Strain Content */}
        <div className="md:col-span-2">
          <h2 className="text-4xl font-bold mb-4 text-white">{strain.name}</h2>
          
          {strain.thc_level !== null && (
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-white">{t('strains.thcLevel')}</span>
                <span className="font-bold text-white">{strain.thc_level}%</span>
              </div>
              <Progress 
                className="h-4 rounded-full"
                value={Math.min(100, ((strain.thc_level || 0) / 30) * 100)}
              />
            </div>
          )}
          
          {strain.most_common_terpene && (
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm text-white">{t('strains.dominantTerpene')}:</span>
              <Badge variant="outline" className="text-base px-3 py-1 bg-gray-800 border-gray-600 text-white">
                {strain.most_common_terpene}
              </Badge>
            </div>
          )}
          
          {strain.description && (
            <div className="mb-8 bg-gray-800/40 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-white">{t('strains.description')}</h3>
              <div className="prose prose-sm prose-invert max-w-none">
                <p className="text-gray-300">{strain.description}</p>
              </div>
            </div>
          )}
          
          {strain.effects && strain.effects.length > 0 && (
            <div className="mt-8 bg-gray-800/40 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-white">{t('strains.effects')}</h3>
              <div className="space-y-4">
                {strain.effects
                  .filter(effect => effect && effect.effect && effect.intensity > 0)
                  .sort((a, b) => b.intensity - a.intensity) // Sort from highest to lowest
                  .map((effect, index) => (
                    <div key={`${effect.effect}-${index}`} className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-base text-white">{effect.effect}</span>
                        <span className="font-bold text-base text-white">{effect.intensity}%</span>
                      </div>
                      <Progress 
                        className="h-4 rounded-full"
                        value={effect.intensity}
                        indicatorClassName={getEffectColor(index)}
                      />
                    </div>
                  ))}
              </div>
            </div>
          )}
          
          <div className="mt-8">
            <Button
              onClick={() => navigate('/strains')}
              variant="outline"
              className="w-full sm:w-auto border border-gray-600 text-white bg-gray-800 hover:bg-gray-700"
            >
              {t('strains.backToAllStrains')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrainDetail;
