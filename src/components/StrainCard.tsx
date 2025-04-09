
import React from "react";
import { Strain } from "@/types/strain";
import { Cannabis, Sun, Circle } from "lucide-react";

interface StrainCardProps {
  strain: Strain;
}

const StrainCard: React.FC<StrainCardProps> = ({ strain }) => {
  const getTypeIcon = () => {
    switch (strain.type) {
      case "Indica":
        return <Cannabis className="h-12 w-12 text-purple-400" />;
      case "Sativa":
        return <Sun className="h-12 w-12 text-yellow-400" />;
      case "Hybrid":
      default:
        return <Circle className="h-12 w-12 text-green-400" />;
    }
  };

  const getTypeColor = () => {
    switch (strain.type) {
      case "Indica":
        return "type-indicator-Indica";
      case "Sativa":
        return "type-indicator-Sativa";
      case "Hybrid":
      default:
        return "type-indicator-Hybrid";
    }
  };

  // Filter out invalid effects
  const validEffects = strain.effects.filter(
    effect => effect && effect.effect && effect.intensity > 0
  );

  return (
    <div className="strain-card">
      <div className="strain-image-container">
        {strain.img_url ? (
          <img
            src={strain.img_url}
            alt={strain.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-gray-800">${getTypeIcon()}</div>`;
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            {getTypeIcon()}
          </div>
        )}
        <div className={`strain-type-badge ${getTypeColor()}`}>
          {strain.type}
        </div>
      </div>
      
      <div className="strain-content">
        <h3 className="strain-title">{strain.name}</h3>
        
        <div className="mt-2">
          {strain.thc_level !== null && strain.thc_level !== undefined ? (
            <>
              <div className="flex justify-between text-sm mb-1">
                <span>THC:</span>
                <span className="font-semibold">{strain.thc_level}%</span>
              </div>
              <div className="thc-bar">
                <div 
                  className="thc-indicator" 
                  style={{ width: `${Math.min(100, ((strain.thc_level || 0) / 30) * 100)}%` }}
                />
              </div>
            </>
          ) : (
            <p className="text-gray-400 text-sm">THC: Lab data pending</p>
          )}
        </div>
        
        <div className="strain-effects">
          {validEffects && validEffects.length > 0 ? (
            validEffects.map((effect, index) => (
              <div key={`${effect.effect}-${index}`}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{effect.effect}</span>
                  <span>{effect.intensity}%</span>
                </div>
                <div className="effect-bar">
                  <div 
                    className="effect-indicator" 
                    style={{ 
                      width: `${effect.intensity}%`,
                      backgroundColor: index === 0 ? '#4CAF50' : 
                                      index === 1 ? '#673AB7' : '#FFC107'  
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-xs mt-2">No effects data available</p>
          )}
        </div>
        
        {strain.most_common_terpene ? (
          <div className="mt-3">
            <span className="text-xs text-gray-400">Dominant Terpene:</span>
            <span className="ml-1 text-sm font-medium">{strain.most_common_terpene}</span>
          </div>
        ) : (
          <div className="mt-3">
            <span className="text-xs text-gray-400">Terpene data unavailable</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StrainCard;
