
import React from "react";
import { Strain } from "@/types/strain";
import { Cannabis, Sun, CircleDashed } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "react-i18next";

interface StrainCardProps {
  strain: Strain;
}

const StrainCard: React.FC<StrainCardProps> = ({ strain }) => {
  const { t } = useTranslation();

  const getTypeIcon = () => {
    switch (strain.type) {
      case "Indica":
        return <Cannabis className="h-16 w-16 text-purple-500 drop-shadow-md" />;
      case "Sativa":
        return <Sun className="h-16 w-16 text-amber-500 drop-shadow-md" />;
      case "Hybrid":
      default:
        return <CircleDashed className="h-16 w-16 text-emerald-500 drop-shadow-md" />;
    }
  };

  const getTypeColor = () => {
    switch (strain.type) {
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
      case 2: return 'bg-blue-500';    // Third effect
      default: return 'bg-blue-500';   // Other effects
    }
  };

  console.log("Strain effects data for display:", {
    name: strain.name,
    effects: strain.effects,
    validEffects: strain.effects.filter(effect => effect && effect.effect && effect.effect !== "Unknown"),
    raw: {
      top: strain.top_effect, 
      top_percent: strain.top_percent,
      second: strain.second_effect,
      second_percent: strain.second_percent,
      third: strain.third_effect,
      third_percent: strain.third_percent
    }
  });

  // Filter out "Unknown" effects for display
  const displayEffects = strain.effects.filter(e => e.effect && e.effect !== "Unknown");

  return (
    <div className="rounded-xl overflow-hidden border border-gray-700 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] bg-gray-900 h-full">
      <div className="relative h-48 overflow-hidden group">
        {strain.img_url ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-800 overflow-hidden">
            <img
              src={strain.img_url}
              alt={strain.name}
              className="w-full h-full object-contain p-2"
              onError={(e) => {
                e.currentTarget.onerror = null;
                const container = e.currentTarget.parentElement;
                if (container) {
                  container.innerHTML = `
                    <div class="w-full h-full flex items-center justify-center bg-gray-800">
                      <div class="opacity-60">
                        ${getTypeIcon().props.outerHTML || ''}
                      </div>
                    </div>
                  `;
                }
              }}
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-80 backdrop-blur-sm">
            {getTypeIcon()}
          </div>
        )}
        <Badge className={`absolute top-3 right-3 ${getTypeColor()} px-3 py-1 text-sm font-medium shadow-md`}>
          {strain.type}
        </Badge>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-bold mb-4 text-white line-clamp-1">{strain.name}</h3>
        
        <div className="mt-3">
          {strain.thc_level !== null && strain.thc_level !== undefined ? (
            <>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-white">{t('strains.thcLevel')}</span>
                <span className="font-bold text-white">{strain.thc_level}%</span>
              </div>
              <Progress 
                className="h-3 rounded-full mb-5"
                value={Math.min(100, ((strain.thc_level || 0) / 30) * 100)}
              />
            </>
          ) : (
            <>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-white">{t('strains.thcLevel')}</span>
                <span className="font-bold text-white">?</span>
              </div>
              <Progress 
                className="h-3 rounded-full mb-5 bg-gray-800"
                value={50}
                indicatorClassName="bg-white/30"
              />
            </>
          )}
        </div>
        
        <div className="space-y-2 mb-5">
          {displayEffects.map((effect, index) => (
            <div key={`${effect.effect}-${index}`}>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-white">{effect.effect}</span>
                <span className="font-bold text-white">
                  {effect.intensity > 0 ? `${effect.intensity}%` : '?'}
                </span>
              </div>
              <Progress 
                className="h-2 rounded-full mb-1"
                value={effect.intensity || 50}
                indicatorClassName={getEffectColor(index)}
              />
            </div>
          ))}
        </div>
        
        <div className="h-8 flex items-center">
          {strain.most_common_terpene ? (
            <div className="flex items-center">
              <span className="text-xs text-white mr-2">{t('strains.dominantTerpene')}:</span>
              <Badge variant="outline" className="font-medium text-xs border-gray-600 text-white">
                {strain.most_common_terpene}
              </Badge>
            </div>
          ) : (
            <div className="flex items-center h-full">
              <span className="text-xs text-white mr-2">{t('strains.dominantTerpene')}:</span>
              <Badge variant="outline" className="font-medium text-xs border-gray-600 text-white">
                {t('strains.unknown')}
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StrainCard;
