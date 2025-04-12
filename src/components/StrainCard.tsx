import React from "react";
import { Strain } from "@/types/strain";
import { Cannabis, Sun, CircleDashed } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "react-i18next";
interface StrainCardProps {
  strain: Strain;
}
const StrainCard: React.FC<StrainCardProps> = ({
  strain
}) => {
  const {
    t
  } = useTranslation();
  const getTypeIcon = () => {
    switch (strain.type) {
      case "Indica":
        return <Cannabis className="h-16 w-16 text-indica drop-shadow-md" />;
      case "Sativa":
        return <Sun className="h-16 w-16 text-sativa drop-shadow-md" />;
      case "Hybrid":
      default:
        return <CircleDashed className="h-16 w-16 text-hybrid drop-shadow-md" />;
    }
  };
  const getTypeColor = () => {
    switch (strain.type) {
      case "Indica":
        return "bg-indica text-white";
      case "Sativa":
        return "bg-sativa text-white";
      case "Hybrid":
      default:
        return "bg-hybrid text-white";
    }
  };
  const getEffectColor = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-primary';
      // Primary effect - teal
      case 1:
        return 'bg-coral-DEFAULT';
      // Secondary effect - coral
      case 2:
        return 'bg-sand-dark';
      // Third effect - sand dark
      default:
        return 'bg-teal-light';
      // Other effects - teal light
    }
  };

  // Filter out "Unknown" effects for display
  const displayEffects = strain.effects.filter(e => e.effect && e.effect !== "Unknown");
  return <div className="strain-card h-full">
      <div className="relative h-48 overflow-hidden group">
        {strain.img_url ? <div className="w-full h-full flex items-center justify-center overflow-hidden bg-white/10 dark:bg-navy-light/30">
            <img src={strain.img_url} alt={strain.name} className="w-full h-full object-contain p-2" onError={e => {
          e.currentTarget.onerror = null;
          const container = e.currentTarget.parentElement;
          if (container) {
            container.innerHTML = `
                    <div class="w-full h-full flex items-center justify-center bg-white/10 dark:bg-navy-light/30">
                      <div class="opacity-80">
                        ${getTypeIcon().props.outerHTML || ''}
                      </div>
                    </div>
                  `;
          }
        }} />
          </div> : <div className="w-full h-full flex items-center justify-center bg-white/10 dark:bg-navy-light/30 backdrop-blur-sm rounded-sm">
            {getTypeIcon()}
          </div>}
        <Badge className={`absolute top-3 right-3 ${getTypeColor()} px-3 py-1 text-xs font-medium shadow-md`}>
          {strain.type}
        </Badge>
      </div>
      
      <div className="p-5 bg-zinc-50">
        <h3 className="text-lg font-bold mb-4 line-clamp-1 dark:text-gray-100 text-navy-dark">{strain.name}</h3>
        
        <div className="mt-3">
          {strain.thc_level !== null && strain.thc_level !== undefined ? <>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium dark:text-gray-200 text-navy-dark">{t('strains.thcLevel')}</span>
                <span className="font-bold dark:text-gray-100 text-navy-dark">{strain.thc_level}%</span>
              </div>
              <Progress className="h-2 rounded-full mb-4" value={Math.min(100, (strain.thc_level || 0) / 30 * 100)} indicatorClassName="bg-primary" />
            </> : <>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium dark:text-gray-200 text-navy-dark">{t('strains.thcLevel')}</span>
                <span className="font-bold dark:text-gray-100 text-navy-dark">?</span>
              </div>
              <Progress className="h-2 rounded-full mb-4" value={50} indicatorClassName="bg-gray-400/30" />
            </>}
        </div>
        
        <div className="space-y-2 mb-4">
          {displayEffects.slice(0, 2).map((effect, index) => <div key={`${effect.effect}-${index}`}>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium dark:text-gray-200 text-navy-dark line-clamp-1">{effect.effect}</span>
                <span className="font-bold dark:text-gray-100 text-navy-dark">
                  {`${effect.intensity}%`}
                </span>
              </div>
              <Progress className="h-1.5 rounded-full mb-1" value={effect.intensity} indicatorClassName={getEffectColor(index)} />
            </div>)}
        </div>
        
        <div className="h-6 flex items-center">
          {strain.most_common_terpene ? <div className="flex items-center">
              <span className="text-xs text-gray-600 dark:text-gray-300 mr-1">{t('strains.dominantTerpene')}:</span>
              <Badge variant="outline" className="font-medium text-xs border-gray-300 dark:border-primary/30 text-navy-dark dark:text-gray-200">
                {strain.most_common_terpene}
              </Badge>
            </div> : <div className="flex items-center h-full">
              <span className="text-xs text-gray-600 dark:text-gray-300 mr-1">{t('strains.dominantTerpene')}:</span>
              <Badge variant="outline" className="font-medium text-xs border-gray-300 dark:border-primary/30 text-navy-dark dark:text-gray-200">
                {t('strains.unknown')}
              </Badge>
            </div>}
        </div>
      </div>
    </div>;
};
export default StrainCard;