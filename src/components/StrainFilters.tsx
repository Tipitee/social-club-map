import React, { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { StrainFilters as StrainFiltersType } from "@/types/strain";
import { getAllEffects, getTerpenes } from "@/services/strainService";
import { Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface StrainFiltersProps {
  filters: StrainFiltersType;
  onFilterChange: (filters: StrainFiltersType) => void;
}

const StrainFilters: React.FC<StrainFiltersProps> = ({ 
  filters, 
  onFilterChange,
}) => {
  const { t } = useTranslation();
  const [effects, setEffects] = useState<string[]>([]);
  const [terpenes, setTerpenes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadFiltersData = async () => {
      try {
        setLoading(true);
        const [effectsList, terpenesList] = await Promise.all([
          getAllEffects(),
          getTerpenes()
        ]);
        setEffects(effectsList);
        setTerpenes(terpenesList);
      } catch (error) {
        console.error("Error loading filter data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadFiltersData();
  }, []);
  
  const handleTypeChange = (type: string | null) => {
    onFilterChange({ ...filters, type });
  };
  
  const handleThcChange = (values: number[]) => {
    onFilterChange({ ...filters, thcRange: [values[0], values[1]] });
  };
  
  const handleEffectChange = (value: string) => {
    const effectValue = value === "all" ? null : value;
    onFilterChange({ ...filters, effect: effectValue });
  };

  const handleTerpeneChange = (value: string) => {
    const terpeneValue = value === "all" ? null : value;
    onFilterChange({ ...filters, terpene: terpeneValue });
  };
  
  const handleSortChange = (value: 'name' | 'thc_high' | 'thc_low') => {
    onFilterChange({ ...filters, sort: value });
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const clearFilter = (filterType: keyof StrainFiltersType) => {
    if (filterType === 'type') {
      onFilterChange({ ...filters, type: null });
    } else if (filterType === 'effect') {
      onFilterChange({ ...filters, effect: null });
    } else if (filterType === 'terpene') {
      onFilterChange({ ...filters, terpene: null });
    } else if (filterType === 'search') {
      onFilterChange({ ...filters, search: '' });
    } else if (filterType === 'thcRange') {
      onFilterChange({ ...filters, thcRange: [0, 30] });
    }
  };

  const activeFilters = [
    filters.type && 'type', 
    filters.effect && 'effect',
    filters.terpene && 'terpene',
    filters.search && 'search',
    (filters.thcRange[0] > 0 || filters.thcRange[1] < 30) ? 'thc' : null
  ].filter(Boolean);

  return (
    <div className="bg-white/90 dark:bg-navy-dark/90 p-4 rounded-xl border border-gray-300 dark:border-gray-700 shadow-md space-y-4 sticky top-20">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold text-lg text-navy-dark dark:text-white">{t('strains.filters.title')}</h2>
        {activeFilters.length > 0 && (
          <Badge variant="outline" className="bg-teal-light/20 dark:bg-gray-700 px-2 py-1 text-xs">
            {activeFilters.length} {t('strains.filters.active')}
          </Badge>
        )}
      </div>
      
      <div className="relative">
        <Input
          type="text"
          placeholder={t('strains.filters.search')}
          value={filters.search || ''}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          className="pl-9 bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 text-navy-dark dark:text-white h-9 text-sm"
        />
        <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        {filters.search && (
          <button 
            onClick={() => onFilterChange({ ...filters, search: '' })} 
            className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-navy-dark dark:hover:text-white"
          >
            <X size={14} />
          </button>
        )}
      </div>
      
      <div>
        <div className="flex justify-between mb-2">
          <h3 className="text-sm font-medium text-navy-dark dark:text-gray-300">{t('strains.filters.type')}</h3>
          {filters.type && (
            <button 
              onClick={() => onFilterChange({ ...filters, type: null })} 
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-navy-dark dark:hover:text-white flex items-center gap-1"
            >
              {t('strains.filters.clear')} <X size={10} />
            </button>
          )}
        </div>
        <div className="flex flex-row gap-1 flex-nowrap">
          <button
            className={`flex-1 px-2 py-1.5 rounded-full text-xs font-medium ${
              filters.type === null
                ? "bg-teal-DEFAULT text-white"
                : "bg-gray-200 dark:bg-gray-700/70 text-navy-dark dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
            } transition-colors`}
            onClick={() => onFilterChange({ ...filters, type: null })}
          >
            {t('strains.filters.all')}
          </button>
          <button
            className={`flex-1 px-2 py-1.5 rounded-full text-xs font-medium ${
              filters.type === "Indica"
                ? "bg-indica text-white"
                : "bg-gray-200 dark:bg-gray-700/70 text-navy-dark dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
            } transition-colors`}
            onClick={() => onFilterChange({ ...filters, type: "Indica" })}
          >
            {t('strains.filters.indica')}
          </button>
          <button
            className={`flex-1 px-2 py-1.5 rounded-full text-xs font-medium ${
              filters.type === "Sativa"
                ? "bg-sativa text-white"
                : "bg-gray-200 dark:bg-gray-700/70 text-navy-dark dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
            } transition-colors`}
            onClick={() => onFilterChange({ ...filters, type: "Sativa" })}
          >
            {t('strains.filters.sativa')}
          </button>
          <button
            className={`flex-1 px-2 py-1.5 rounded-full text-xs font-medium ${
              filters.type === "Hybrid"
                ? "bg-hybrid text-white"
                : "bg-gray-200 dark:bg-gray-700/70 text-navy-dark dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
            } transition-colors`}
            onClick={() => onFilterChange({ ...filters, type: "Hybrid" })}
          >
            {t('strains.filters.hybrid')}
          </button>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between mb-2">
          <h3 className="text-sm font-medium text-navy-dark dark:text-gray-300">{t('strains.thcLevel')}</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-navy-dark dark:text-white font-medium bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded">
              {filters.thcRange[0]}% - {filters.thcRange[1]}%
            </span>
            {(filters.thcRange[0] > 0 || filters.thcRange[1] < 30) && (
              <button 
                onClick={() => onFilterChange({ ...filters, thcRange: [0, 30] })} 
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-navy-dark dark:hover:text-white"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
        <div className="px-1 mb-2">
          <Slider
            defaultValue={[filters.thcRange[0], filters.thcRange[1]]}
            min={0}
            max={30}
            step={0.5}
            value={[filters.thcRange[0], filters.thcRange[1]]}
            onValueChange={(values) => onFilterChange({ ...filters, thcRange: [values[0], values[1]] })}
            className="my-4"
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>0%</span>
          <span>30%</span>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between mb-2">
          <h3 className="text-sm font-medium text-navy-dark dark:text-gray-300">{t('strains.filters.effect')}</h3>
          {filters.effect && (
            <button 
              onClick={() => onFilterChange({ ...filters, effect: null })} 
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-navy-dark dark:hover:text-white flex items-center gap-1"
            >
              {t('strains.filters.clear')} <X size={10} />
            </button>
          )}
        </div>
        <Select 
          value={filters.effect || "all"} 
          onValueChange={(value) => onFilterChange({ ...filters, effect: value === "all" ? null : value })}
          disabled={loading}
        >
          <SelectTrigger className="w-full bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 text-navy-dark dark:text-white h-9 text-sm">
            <SelectValue placeholder={t('strains.filters.all')} />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 max-h-[200px]">
            <SelectItem value="all" className="text-navy-dark dark:text-white text-sm">{t('strains.filters.all')}</SelectItem>
            {effects.map((effect) => (
              <SelectItem key={effect} value={effect} className="text-navy-dark dark:text-white text-sm">
                {effect}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <div className="flex justify-between mb-2">
          <h3 className="text-sm font-medium text-navy-dark dark:text-gray-300">{t('strains.filters.terpene')}</h3>
          {filters.terpene && (
            <button 
              onClick={() => onFilterChange({ ...filters, terpene: null })} 
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-navy-dark dark:hover:text-white flex items-center gap-1"
            >
              {t('strains.filters.clear')} <X size={10} />
            </button>
          )}
        </div>
        <Select 
          value={filters.terpene || "all"} 
          onValueChange={(value) => onFilterChange({ ...filters, terpene: value === "all" ? null : value })}
          disabled={loading}
        >
          <SelectTrigger className="w-full bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 text-navy-dark dark:text-white h-9 text-sm">
            <SelectValue placeholder={t('strains.filters.all')} />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 max-h-[200px]">
            <SelectItem value="all" className="text-navy-dark dark:text-white text-sm">{t('strains.filters.all')}</SelectItem>
            {terpenes.map((terpene) => (
              <SelectItem key={terpene} value={terpene} className="text-navy-dark dark:text-white text-sm">
                {terpene}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2 text-navy-dark dark:text-gray-300">{t('strains.filters.sort')}</h3>
        <Select 
          value={filters.sort} 
          onValueChange={(value: string) => onFilterChange({ ...filters, sort: value as 'name' | 'thc_high' | 'thc_low' })}
        >
          <SelectTrigger className="w-full bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 text-navy-dark dark:text-white h-9 text-sm">
            <SelectValue placeholder={t('strains.filters.sort')} />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 max-h-[200px]">
            <SelectItem value="name" className="text-navy-dark dark:text-white text-sm">{t('strains.filters.nameAZ')}</SelectItem>
            <SelectItem value="thc_high" className="text-navy-dark dark:text-white text-sm">{t('strains.filters.thcHighLow')}</SelectItem>
            <SelectItem value="thc_low" className="text-navy-dark dark:text-white text-sm">{t('strains.filters.thcLowHigh')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default StrainFilters;
