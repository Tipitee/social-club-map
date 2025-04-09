
import React, { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { StrainFilters as StrainFiltersType } from "@/types/strain";
import { getAllEffects } from "@/services/strainService";

interface StrainFiltersProps {
  filters: StrainFiltersType;
  onFilterChange: (filters: StrainFiltersType) => void;
}

const StrainFilters: React.FC<StrainFiltersProps> = ({ 
  filters, 
  onFilterChange 
}) => {
  const [effects, setEffects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadEffects = async () => {
      try {
        const effectsList = await getAllEffects();
        setEffects(effectsList);
      } catch (error) {
        console.error("Error loading effects:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadEffects();
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

  return (
    <div className="bg-card p-4 rounded-xl border border-gray-800 shadow-md space-y-4">
      <h2 className="font-bold text-lg mb-3">Filter Strains</h2>
      
      {/* Type Filter */}
      <div>
        <h3 className="text-sm font-medium mb-2">Type</h3>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1 rounded-full text-sm ${
              filters.type === null
                ? "bg-primary text-white"
                : "bg-gray-700 text-gray-300"
            }`}
            onClick={() => handleTypeChange(null)}
          >
            All
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm ${
              filters.type === "Indica"
                ? "bg-purple-800 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
            onClick={() => handleTypeChange("Indica")}
          >
            Indica
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm ${
              filters.type === "Sativa"
                ? "bg-yellow-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
            onClick={() => handleTypeChange("Sativa")}
          >
            Sativa
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm ${
              filters.type === "Hybrid"
                ? "bg-green-600 text-white"
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
        <h3 className="text-sm font-medium mb-2">THC Level (%)</h3>
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
        <h3 className="text-sm font-medium mb-2">Dominant Effect</h3>
        <select
          className="w-full bg-gray-800 text-white rounded-md p-2 text-sm border-gray-700"
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
    </div>
  );
};

export default StrainFilters;
