
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

  // Filter valid effects (those with effect name and intensity > 0)
  const validEffects = strain.effects && strain.effects.filter(
    effect => effect && effect.effect && effect.intensity > 0
  );

  // Always ensure we have exactly 3 effects to display
  const displayEffects = Array(3).fill(null).map((_, index) => {
    // If we have a valid effect at this index, use it
    if (validEffects && validEffects[index]) {
      return validEffects[index];
    }
    // Otherwise create a placeholder "Unknown" effect
    return { effect: "Unknown", intensity: 50 };
  });

  return (
    <div className="rounded-xl overflow-hidden border border-gray-700 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] bg-gray-800">
      <div className="relative h-48 overflow-hidden bg-gray-900">
        {strain.img_url ? (
          <img
            src={strain.img_url}
            alt={strain.name}
            className="w-full h-full object-cover bg-gray-900"
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
        <h3 className="text-lg font-bold mb-2 text-white">{strain.name}</h3>
        
        <div className="mt-3">
          {/* Always show THC level - either actual or placeholder */}
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-gray-300">{t("thcLevel")}</span>
            <span className="font-bold text-white">{strain.thc_level !== null && strain.thc_level !== undefined ? `${strain.thc_level}%` : "?%"}</span>
          </div>
          <div className="h-3 w-full bg-gray-700 rounded-full overflow-hidden mb-4">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: strain.thc_level !== null && strain.thc_level !== undefined ? 
                `${Math.min(100, ((strain.thc_level || 0) / 30) * 100)}%` : 
                "50%" }}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          {/* Always display exactly 3 effects (real or placeholder) */}
          {displayEffects.map((effect, index) => (
            <div key={`${effect.effect}-${index}`}>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-gray-300">{effect.effect}</span>
                <span className="font-bold text-white">{effect.effect === "Unknown" ? "?%" : `${effect.intensity}%`}</span>
              </div>
              <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden mb-1">
                <div 
                  className={`h-full ${getEffectColor(index)} transition-all duration-500 ease-out`}
                  style={{ width: `${effect.intensity}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        
        {/* Improve terpene message to maintain consistent sizing */}
        <div className="mt-4 h-9 flex items-center">
          {strain.most_common_terpene ? (
            <div className="flex items-center w-full">
              <span className="text-xs text-gray-400 mr-2">{t("dominantTerpene")}:</span>
              <Badge variant="outline" className="font-medium text-xs border-gray-600 text-gray-300">
                {strain.most_common_terpene}
              </Badge>
            </div>
          ) : (
            <div className="flex items-center w-full">
              <span className="text-xs text-gray-400">{t("terpeneDataUnavailable")}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StrainCard;
