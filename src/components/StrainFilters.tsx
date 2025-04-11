
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

  // Calculate active filters count
  const activeFilters = [
    filters.type && 'type', 
    filters.effect && 'effect',
    filters.terpene && 'terpene',
    filters.search && 'search',
    (filters.thcRange[0] > 0 || filters.thcRange[1] < 30) ? 'thc' : null
  ].filter(Boolean);

  return (
    <div className="bg-gray-800/80 p-4 rounded-xl border border-gray-700 shadow-md space-y-4 sticky top-20">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold text-lg text-white">{t('strains.filters.title')}</h2>
        {activeFilters.length > 0 && (
          <Badge variant="outline" className="bg-gray-700 px-2 py-1 text-xs">
            {activeFilters.length} {t('strains.filters.active')}
          </Badge>
        )}
      </div>
      
      {/* Search Input */}
      <div className="relative">
        <Input
          type="text"
          placeholder={t('strains.filters.search')}
          value={filters.search || ''}
          onChange={handleSearchChange}
          className="pl-9 bg-gray-700/50 border-gray-600 text-white h-9 text-sm"
        />
        <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        {filters.search && (
          <button 
            onClick={() => clearFilter('search')} 
            className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X size={14} />
          </button>
        )}
      </div>
      
      {/* Type Filter - All buttons in one row */}
      <div>
        <div className="flex justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-300">{t('strains.filters.type')}</h3>
          {filters.type && (
            <button 
              onClick={() => clearFilter('type')} 
              className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
            >
              {t('strains.filters.clear')} <X size={10} />
            </button>
          )}
        </div>
        <div className="flex flex-row gap-1 flex-nowrap">
          <button
            className={`flex-1 px-2 py-1.5 rounded-full text-xs font-medium ${
              filters.type === null
                ? "bg-[#348080] text-white"
                : "bg-gray-700/70 text-gray-300 hover:bg-gray-700"
            } transition-colors`}
            onClick={() => handleTypeChange(null)}
          >
            {t('strains.filters.all')}
          </button>
          <button
            className={`flex-1 px-2 py-1.5 rounded-full text-xs font-medium ${
              filters.type === "Indica"
                ? "bg-purple-600 text-white"
                : "bg-gray-700/70 text-gray-300 hover:bg-gray-700"
            } transition-colors`}
            onClick={() => handleTypeChange("Indica")}
          >
            {t('strains.filters.indica')}
          </button>
          <button
            className={`flex-1 px-2 py-1.5 rounded-full text-xs font-medium ${
              filters.type === "Sativa"
                ? "bg-amber-500 text-white"
                : "bg-gray-700/70 text-gray-300 hover:bg-gray-700"
            } transition-colors`}
            onClick={() => handleTypeChange("Sativa")}
          >
            {t('strains.filters.sativa')}
          </button>
          <button
            className={`flex-1 px-2 py-1.5 rounded-full text-xs font-medium ${
              filters.type === "Hybrid"
                ? "bg-emerald-500 text-white"
                : "bg-gray-700/70 text-gray-300 hover:bg-gray-700"
            } transition-colors`}
            onClick={() => handleTypeChange("Hybrid")}
          >
            {t('strains.filters.hybrid')}
          </button>
        </div>
      </div>
      
      {/* THC Range Filter */}
      <div>
        <div className="flex justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-300">{t('strains.thcLevel')}</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white font-medium bg-gray-700 px-2 py-0.5 rounded">
              {filters.thcRange[0]}% - {filters.thcRange[1]}%
            </span>
            {(filters.thcRange[0] > 0 || filters.thcRange[1] < 30) && (
              <button 
                onClick={() => clearFilter('thcRange')} 
                className="text-xs text-gray-400 hover:text-white"
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
            onValueChange={handleThcChange}
            className="my-4"
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>0%</span>
          <span>30%</span>
        </div>
      </div>
      
      {/* Effect Filter */}
      <div>
        <div className="flex justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-300">{t('strains.filters.effect')}</h3>
          {filters.effect && (
            <button 
              onClick={() => clearFilter('effect')} 
              className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
            >
              {t('strains.filters.clear')} <X size={10} />
            </button>
          )}
        </div>
        <Select 
          value={filters.effect || "all"} 
          onValueChange={handleEffectChange}
          disabled={loading}
        >
          <SelectTrigger className="w-full bg-gray-700/50 border-gray-600 text-white h-9 text-sm">
            <SelectValue placeholder={t('strains.filters.all')} />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700 max-h-[200px]">
            <SelectItem value="all" className="text-white text-sm">{t('strains.filters.all')}</SelectItem>
            {effects.map((effect) => (
              <SelectItem key={effect} value={effect} className="text-white text-sm">
                {effect}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Terpene Filter */}
      <div>
        <div className="flex justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-300">{t('strains.filters.terpene')}</h3>
          {filters.terpene && (
            <button 
              onClick={() => clearFilter('terpene')} 
              className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
            >
              {t('strains.filters.clear')} <X size={10} />
            </button>
          )}
        </div>
        <Select 
          value={filters.terpene || "all"} 
          onValueChange={handleTerpeneChange}
          disabled={loading}
        >
          <SelectTrigger className="w-full bg-gray-700/50 border-gray-600 text-white h-9 text-sm">
            <SelectValue placeholder={t('strains.filters.all')} />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700 max-h-[200px]">
            <SelectItem value="all" className="text-white text-sm">{t('strains.filters.all')}</SelectItem>
            {terpenes.map((terpene) => (
              <SelectItem key={terpene} value={terpene} className="text-white text-sm">
                {terpene}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Sort Options */}
      <div>
        <h3 className="text-sm font-medium mb-2 text-gray-300">{t('strains.filters.sort')}</h3>
        <Select 
          value={filters.sort} 
          onValueChange={(value: string) => handleSortChange(value as 'name' | 'thc_high' | 'thc_low')}
        >
          <SelectTrigger className="w-full bg-gray-700/50 border-gray-600 text-white h-9 text-sm">
            <SelectValue placeholder={t('strains.filters.sort')} />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700 max-h-[200px]">
            <SelectItem value="name" className="text-white text-sm">{t('strains.filters.nameAZ')}</SelectItem>
            <SelectItem value="thc_high" className="text-white text-sm">{t('strains.filters.thcHighLow')}</SelectItem>
            <SelectItem value="thc_low" className="text-white text-sm">{t('strains.filters.thcLowHigh')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default StrainFilters;
