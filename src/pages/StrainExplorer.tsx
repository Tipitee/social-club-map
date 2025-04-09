
import React, { useState, useEffect } from "react";
import { fetchStrains } from "@/services/strainService";
import { Strain, StrainFilters as StrainFiltersType } from "@/types/strain";
import StrainCard from "@/components/StrainCard";
import StrainFilters from "@/components/StrainFilters";
import { useToast } from "@/components/ui/use-toast";
import { Filter, ArrowDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const StrainExplorer: React.FC = () => {
  const [strains, setStrains] = useState<Strain[]>([]);
  const [filteredStrains, setFilteredStrains] = useState<Strain[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();
  
  const [filters, setFilters] = useState<StrainFiltersType>({
    type: null,
    thcRange: [0, 30],
    effect: null,
    terpene: null,
    sort: 'name',
  });

  useEffect(() => {
    const loadStrains = async () => {
      try {
        const data = await fetchStrains();
        setStrains(data);
        setFilteredStrains(data);
        setLoading(false);
      } catch (error) {
        toast({
          title: "Error loading strains",
          description: "There was a problem loading the strain data.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    loadStrains();
  }, [toast]);

  useEffect(() => {
    let result = [...strains];

    // Filter by type
    if (filters.type) {
      result = result.filter((strain) => strain.type === filters.type);
    }

    // Filter by THC range
    result = result.filter(
      (strain) => 
        !strain.thc_level || 
        (strain.thc_level >= filters.thcRange[0] && 
         strain.thc_level <= filters.thcRange[1])
    );

    // Filter by effect
    if (filters.effect) {
      result = result.filter((strain) =>
        strain.effects.some(
          (effect) => effect.effect === filters.effect && effect.intensity > 0
        )
      );
    }

    // Filter by terpene
    if (filters.terpene) {
      result = result.filter((strain) =>
        strain.most_common_terpene === filters.terpene
      );
    }

    // Apply sorting
    if (filters.sort === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filters.sort === 'thc_high') {
      result.sort((a, b) => {
        // Handle nulls by putting them at the end
        if (a.thc_level === null) return 1;
        if (b.thc_level === null) return -1;
        return b.thc_level - a.thc_level;
      });
    } else if (filters.sort === 'thc_low') {
      result.sort((a, b) => {
        // Handle nulls by putting them at the end
        if (a.thc_level === null) return 1;
        if (b.thc_level === null) return -1;
        return a.thc_level - b.thc_level;
      });
    }

    setFilteredStrains(result);
  }, [filters, strains]);

  const handleFilterChange = (newFilters: StrainFiltersType) => {
    setFilters(newFilters);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const renderNoResults = () => (
    <Card className="bg-card p-8 rounded-xl text-center border border-gray-800">
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-2">No strains found</h3>
        <p className="text-gray-400">
          Try adjusting your filters to see more results.
        </p>
      </CardContent>
    </Card>
  );

  const renderLoader = () => (
    <div className="flex justify-center items-center h-64">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-t-primary rounded-full animate-spin mx-auto"></div>
        <p className="mt-2 text-gray-400">Loading strains...</p>
      </div>
    </div>
  );

  return (
    <div className="container px-4 py-6 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Strain Explorer</h1>
        <button
          onClick={toggleFilters}
          className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-secondary text-white text-sm"
        >
          <Filter size={16} /> 
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Section - Only visible on mobile when toggled */}
        <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
          <StrainFilters 
            filters={filters} 
            onFilterChange={handleFilterChange}
            totalStrains={strains.length}
            filteredCount={filteredStrains.length}
          />
        </div>

        {/* Strains Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            renderLoader()
          ) : filteredStrains.length > 0 ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-400">
                  Found {filteredStrains.length} strain{filteredStrains.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStrains.map((strain) => (
                  <StrainCard key={strain.id} strain={strain} />
                ))}
              </div>
            </div>
          ) : (
            renderNoResults()
          )}
        </div>
      </div>
    </div>
  );
};

export default StrainExplorer;
