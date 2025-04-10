
import React from "react";
import { Strain } from "@/types/strain";
import { Cannabis, Sun, CircleDashed } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface StrainCardProps {
  strain: Strain;
}

const StrainCard: React.FC<StrainCardProps> = ({ strain }) => {
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
      case 2: return 'bg-amber-500';   // Tertiary effect
      default: return 'bg-blue-500';   // Other effects
    }
  };

  // Filter out invalid effects
  const validEffects = strain.effects
    .filter(effect => effect && effect.effect && effect.intensity > 0)
    .sort((a, b) => b.intensity - a.intensity)
    .slice(0, 3); // Only show top 3 effects

  return (
    <div className="rounded-xl overflow-hidden border border-gray-700 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] bg-gray-900">
      <div className="relative h-48 overflow-hidden group">
        {strain.img_url ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-800 overflow-hidden">
            <img
              src={strain.img_url}
              alt={strain.name}
              className="w-full h-full object-cover object-center"
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
                <span className="font-medium text-gray-300">THC Level</span>
                <span className="font-bold text-white">{strain.thc_level}%</span>
              </div>
              <Progress 
                className="h-3 rounded-full mb-5"
                value={Math.min(100, ((strain.thc_level || 0) / 30) * 100)}
              />
            </>
          ) : (
            <p className="text-gray-400 text-sm mb-5">THC: Lab data pending</p>
          )}
        </div>
        
        <div className="space-y-2 mb-5">
          {validEffects && validEffects.length > 0 ? (
            validEffects.map((effect, index) => (
              <div key={`${effect.effect}-${index}`}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-gray-300">{effect.effect}</span>
                  <span className="font-bold text-white">{effect.intensity}%</span>
                </div>
                <Progress 
                  className="h-2 rounded-full mb-1"
                  value={effect.intensity}
                  indicatorClassName={getEffectColor(index)}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-xs">No effects data available</p>
          )}
        </div>
        
        <div className="h-8 flex items-center">
          {strain.most_common_terpene ? (
            <div className="flex items-center">
              <span className="text-xs text-gray-400 mr-2">Dominant Terpene:</span>
              <Badge variant="outline" className="font-medium text-xs border-gray-600 text-white">
                {strain.most_common_terpene}
              </Badge>
            </div>
          ) : (
            <div className="flex items-center h-full">
              <span className="text-xs text-gray-400">Terpene data unavailable</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StrainCard;
