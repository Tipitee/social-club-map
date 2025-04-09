
import React from "react";
import { Strain } from "@/types/strain";
import { Cannabis, Sun, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";

interface StrainCardProps {
  strain: Strain;
}

const StrainCard: React.FC<StrainCardProps> = ({ strain }) => {
  const { t } = useLanguage();

  const getTypeIcon = () => {
    switch (strain.type) {
      case "Indica":
        return <Cannabis className="h-14 w-14 text-purple-400 drop-shadow-glow-purple" />;
      case "Sativa":
        return <Sun className="h-14 w-14 text-amber-400 drop-shadow-glow-amber" />;
      case "Hybrid":
      default:
        return <Circle className="h-14 w-14 text-emerald-400 drop-shadow-glow-emerald" />;
    }
  };

  const getTypeColor = () => {
    switch (strain.type) {
      case "Indica":
        return "bg-purple-600 hover:bg-purple-700 text-white";
      case "Sativa":
        return "bg-amber-500 hover:bg-amber-600 text-white";
      case "Hybrid":
      default:
        return "bg-emerald-500 hover:bg-emerald-600 text-white";
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

  // Filter out invalid effects
  const validEffects = strain.effects.filter(
    effect => effect && effect.effect && effect.intensity > 0
  );

  return (
    <div className="rounded-xl overflow-hidden border border-gray-700 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] bg-card">
      <div className="relative h-48 overflow-hidden">
        {strain.img_url ? (
          <img
            src={strain.img_url}
            alt={strain.name}
            className="w-full h-full object-contain bg-gray-900 p-1"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = `
                <div class="w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-80 backdrop-blur-sm">
                  ${getTypeIcon().props.outerHTML || getTypeIcon()}
                </div>
              `;
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-80 backdrop-blur-sm">
            {getTypeIcon()}
          </div>
        )}
        <Badge className={`absolute top-3 right-3 ${getTypeColor()} px-3 py-1 text-xs font-semibold shadow-md`}>
          {strain.type}
        </Badge>
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-bold mb-2 text-foreground">{strain.name}</h3>
        
        <div className="mt-3">
          {strain.thc_level !== null && strain.thc_level !== undefined ? (
            <>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-300">{t("thcLevel")}</span>
                <span className="font-bold text-white">{strain.thc_level}%</span>
              </div>
              <div className="h-3 w-full bg-gray-800 rounded-full overflow-hidden mb-4">
                <div 
                  className="h-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(100, ((strain.thc_level || 0) / 30) * 100)}%` }}
                />
              </div>
            </>
          ) : (
            <p className="text-gray-400 text-sm mb-4">{t("labDataPending")}</p>
          )}
        </div>
        
        <div className="space-y-2">
          {validEffects && validEffects.length > 0 ? (
            validEffects.slice(0, 3).map((effect, index) => (
              <div key={`${effect.effect}-${index}`}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-gray-300">{effect.effect}</span>
                  <span className="font-bold text-white">{effect.intensity}%</span>
                </div>
                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden mb-1">
                  <div 
                    className={`h-full ${getEffectColor(index)} transition-all duration-500 ease-out`}
                    style={{ width: `${effect.intensity}%` }}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-xs">{t("noEffectsData")}</p>
          )}
        </div>
        
        {strain.most_common_terpene ? (
          <div className="mt-4 flex items-center">
            <span className="text-xs text-gray-400 mr-2">{t("dominantTerpene")}:</span>
            <Badge variant="outline" className="font-medium text-xs">
              {strain.most_common_terpene}
            </Badge>
          </div>
        ) : (
          <div className="mt-4">
            <span className="text-xs text-gray-400">{t("terpeneDataUnavailable")}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StrainCard;
