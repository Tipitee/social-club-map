
import React, { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { StrainFilters as StrainFiltersType } from "@/types/strain";
import { getAllEffects, getTerpenes } from "@/services/strainService";
import { Search, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  return (
    <div className="bg-gray-800/80 p-6 rounded-xl border border-gray-700 shadow-md space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-xl text-white">{t('strains.filterStrains')}</h2>
      </div>
      
      {/* Search Input */}
      <div>
        <div className="relative">
          <Input
            type="text"
            placeholder={t('strains.filters.searchPlaceholder')}
            value={filters.search || ''}
            onChange={handleSearchChange}
            className="pl-10 bg-gray-700/50 border-gray-600 text-white h-12 text-base"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>
      
      {/* Type Filter - All buttons in one row */}
      <div>
        <h3 className="text-base font-medium mb-3 text-gray-300">{t('strains.filters.type')}</h3>
        <div className="flex flex-row gap-2 flex-nowrap">
          <button
            className={`flex-1 px-4 py-2 rounded-full text-sm font-medium ${
              filters.type === null
                ? "bg-emerald-600 text-white"
                : "bg-gray-700/70 text-gray-300 hover:bg-gray-700"
            }`}
            onClick={() => handleTypeChange(null)}
          >
            {t('strains.filters.all')}
          </button>
          <button
            className={`flex-1 px-4 py-2 rounded-full text-sm font-medium ${
              filters.type === "Indica"
                ? "bg-purple-600 text-white"
                : "bg-gray-700/70 text-gray-300 hover:bg-gray-700"
            }`}
            onClick={() => handleTypeChange("Indica")}
          >
            {t('strains.filters.indica')}
          </button>
          <button
            className={`flex-1 px-4 py-2 rounded-full text-sm font-medium ${
              filters.type === "Sativa"
                ? "bg-amber-500 text-white"
                : "bg-gray-700/70 text-gray-300 hover:bg-gray-700"
            }`}
            onClick={() => handleTypeChange("Sativa")}
          >
            {t('strains.filters.sativa')}
          </button>
          <button
            className={`flex-1 px-4 py-2 rounded-full text-sm font-medium ${
              filters.type === "Hybrid"
                ? "bg-emerald-500 text-white"
                : "bg-gray-700/70 text-gray-300 hover:bg-gray-700"
            }`}
            onClick={() => handleTypeChange("Hybrid")}
          >
            {t('strains.filters.hybrid')}
          </button>
        </div>
      </div>
      
      {/* THC Range Filter */}
      <div>
        <div className="flex justify-between mb-3">
          <h3 className="text-base font-medium text-gray-300">{t('strains.thcLevel')}</h3>
          <span className="text-sm text-white font-medium">
            {filters.thcRange[0]}% - {filters.thcRange[1]}%
          </span>
        </div>
        <div className="px-1 mb-2">
          <Slider
            defaultValue={[filters.thcRange[0], filters.thcRange[1]]}
            min={0}
            max={30}
            step={0.5}
            onValueChange={handleThcChange}
            className="my-6"
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>0%</span>
          <span>30%</span>
        </div>
      </div>
      
      {/* Effect Filter */}
      <div>
        <h3 className="text-base font-medium mb-3 text-gray-300">{t('strains.filters.dominantEffect')}</h3>
        <Select 
          value={filters.effect || "all"} 
          onValueChange={handleEffectChange}
          disabled={loading}
        >
          <SelectTrigger className="w-full bg-gray-700/50 border-gray-600 text-white">
            <SelectValue placeholder={t('strains.filters.allEffects')} />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="all" className="text-white">{t('strains.filters.allEffects')}</SelectItem>
            {effects.map((effect) => (
              <SelectItem key={effect} value={effect} className="text-white">
                {effect}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Terpene Filter */}
      <div>
        <h3 className="text-base font-medium mb-3 text-gray-300">{t('strains.filters.terpene')}</h3>
        <Select 
          value={filters.terpene || "all"} 
          onValueChange={handleTerpeneChange}
          disabled={loading}
        >
          <SelectTrigger className="w-full bg-gray-700/50 border-gray-600 text-white">
            <SelectValue placeholder={t('strains.filters.allTerpenes')} />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="all" className="text-white">{t('strains.filters.allTerpenes')}</SelectItem>
            {terpenes.map((terpene) => (
              <SelectItem key={terpene} value={terpene} className="text-white">
                {terpene}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Sort Options */}
      <div>
        <h3 className="text-base font-medium mb-3 text-gray-300">{t('strains.filters.sortBy')}</h3>
        <Select 
          value={filters.sort} 
          onValueChange={(value: string) => handleSortChange(value as 'name' | 'thc_high' | 'thc_low')}
        >
          <SelectTrigger className="w-full bg-gray-700/50 border-gray-600 text-white">
            <SelectValue placeholder={t('strains.filters.sortBy')} />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700 max-h-[200px]">
            <SelectItem value="name" className="text-white">{t('strains.filters.nameAZ')}</SelectItem>
            <SelectItem value="thc_high" className="text-white">{t('strains.filters.thcHighToLow')}</SelectItem>
            <SelectItem value="thc_low" className="text-white">{t('strains.filters.thcLowToHigh')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default StrainFilters;
