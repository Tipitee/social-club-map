
import React, { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { StrainFilters as StrainFiltersType } from "@/types/strain";
import { getAllEffects, getTerpenes } from "@/services/strainService";
import { ArrowDown, ArrowUp, Search } from "lucide-react";
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
  totalStrains: number;
  filteredCount: number;
}

const StrainFilters: React.FC<StrainFiltersProps> = ({ 
  filters, 
  onFilterChange,
  totalStrains,
  filteredCount
}) => {
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
  
  const handleEffectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === "all" ? null : e.target.value;
    onFilterChange({ ...filters, effect: value });
  };

  const handleTerpeneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === "all" ? null : e.target.value;
    onFilterChange({ ...filters, terpene: value });
  };
  
  const handleSortChange = (sort: 'name' | 'thc_high' | 'thc_low') => {
    onFilterChange({ ...filters, sort });
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  return (
    <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 shadow-md space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-lg text-white">Filter Strains</h2>
        <span className="text-xs text-gray-300">
          Showing {filteredCount} of {totalStrains}
        </span>
      </div>
      
      {/* Search Input */}
      <div>
        <div className="relative">
          <Input
            type="text"
            placeholder="Search strains..."
            value={filters.search || ''}
            onChange={handleSearchChange}
            className="pl-9 bg-gray-800 border-gray-600 text-white"
          />
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>
      
      {/* Type Filter */}
      <div>
        <h3 className="text-sm font-medium mb-2 text-gray-300">Type</h3>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1 rounded-full text-sm ${
              filters.type === null
                ? "bg-emerald-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
            onClick={() => handleTypeChange(null)}
          >
            All
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm ${
              filters.type === "Indica"
                ? "bg-purple-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
            onClick={() => handleTypeChange("Indica")}
          >
            Indica
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm ${
              filters.type === "Sativa"
                ? "bg-amber-500 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
            onClick={() => handleTypeChange("Sativa")}
          >
            Sativa
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm ${
              filters.type === "Hybrid"
                ? "bg-emerald-500 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
            onClick={() => handleTypeChange("Hybrid")}
          >
            Hybrid
          </button>
        </div>
      </div>
      
      {/* THC Range Filter */}
      <div>
        <h3 className="text-sm font-medium mb-2 text-gray-300">THC Level (%)</h3>
        <div className="px-1">
          <Slider
            defaultValue={[filters.thcRange[0], filters.thcRange[1]]}
            max={30}
            step={0.5}
            onValueChange={handleThcChange}
            className="my-6"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>{filters.thcRange[0]}%</span>
            <span>{filters.thcRange[1]}%</span>
          </div>
        </div>
      </div>
      
      {/* Effect Filter */}
      <div>
        <h3 className="text-sm font-medium mb-2 text-gray-300">Dominant Effect</h3>
        <select
          className="w-full bg-gray-800 text-white rounded-md p-2 text-sm border-gray-600"
          value={filters.effect || "all"}
          onChange={handleEffectChange}
          disabled={loading}
        >
          <option value="all">All Effects</option>
          {effects.map((effect) => (
            <option key={effect} value={effect}>
              {effect}
            </option>
          ))}
        </select>
        {loading && <p className="text-xs text-gray-400 mt-1">Loading effects...</p>}
      </div>

      {/* Terpene Filter */}
      <div>
        <h3 className="text-sm font-medium mb-2 text-gray-300">Terpene</h3>
        <select
          className="w-full bg-gray-800 text-white rounded-md p-2 text-sm border-gray-600"
          value={filters.terpene || "all"}
          onChange={handleTerpeneChange}
          disabled={loading}
        >
          <option value="all">All Terpenes</option>
          {terpenes.map((terpene) => (
            <option key={terpene} value={terpene}>
              {terpene}
            </option>
          ))}
        </select>
      </div>
      
      {/* Sort Options */}
      <div>
        <h3 className="text-sm font-medium mb-2 text-gray-300">Sort By</h3>
        <div className="flex flex-col gap-1">
          <button 
            className={`flex justify-between items-center px-3 py-2 rounded-md text-sm ${filters.sort === 'name' ? 'bg-gray-800 text-emerald-400' : 'hover:bg-gray-800 text-gray-300'}`}
            onClick={() => handleSortChange('name')}
          >
            <span>Name</span>
            {filters.sort === 'name' && <ArrowDown size={16} />}
          </button>
          <button 
            className={`flex justify-between items-center px-3 py-2 rounded-md text-sm ${filters.sort === 'thc_high' ? 'bg-gray-800 text-emerald-400' : 'hover:bg-gray-800 text-gray-300'}`}
            onClick={() => handleSortChange('thc_high')}
          >
            <span>THC (High to Low)</span>
            {filters.sort === 'thc_high' && <ArrowDown size={16} />}
          </button>
          <button 
            className={`flex justify-between items-center px-3 py-2 rounded-md text-sm ${filters.sort === 'thc_low' ? 'bg-gray-800 text-emerald-400' : 'hover:bg-gray-800 text-gray-300'}`}
            onClick={() => handleSortChange('thc_low')}
          >
            <span>THC (Low to High)</span>
            {filters.sort === 'thc_low' && <ArrowUp size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StrainFilters;
