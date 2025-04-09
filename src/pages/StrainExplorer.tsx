import React, { useState, useEffect } from "react";
import { fetchStrains } from "@/services/strainService";
import { Strain, StrainFilters as StrainFiltersType } from "@/types/strain";
import StrainCard from "@/components/StrainCard";
import StrainFilters from "@/components/StrainFilters";
import { useToast } from "@/components/ui/use-toast";
import { Filter, ArrowDown, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConnectionHealthCheck } from "@/components/ConnectionHealthCheck";
import { Skeleton } from "@/components/ui/skeleton";

const StrainExplorer: React.FC = () => {
  const [strains, setStrains] = useState<Strain[]>([]);
  const [filteredStrains, setFilteredStrains] = useState<Strain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();
  
  const [filters, setFilters] = useState<StrainFiltersType>({
    type: null,
    thcRange: [0, 30],
    effect: null,
    terpene: null,
    sort: 'name',
    search: '',
  });

  useEffect(() => {
    const loadStrains = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchStrains(filters.sort);
        setStrains(data);
        setFilteredStrains(data);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error loading strains";
        setError(message);
        toast({
          title: "Error loading strains",
          description: message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadStrains();
  }, [filters.sort, toast]);

  useEffect(() => {
    let result = [...strains];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(strain => 
        strain.name.toLowerCase().includes(searchTerm) ||
        (strain.description && strain.description.toLowerCase().includes(searchTerm))
      );
    }

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

    setFilteredStrains(result);
  }, [filters, strains]);

  const handleFilterChange = (newFilters: StrainFiltersType) => {
    setFilters(newFilters);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const clearFilter = (filterType: keyof StrainFiltersType) => {
    if (filterType === 'type') {
      setFilters(prev => ({ ...prev, type: null }));
    } else if (filterType === 'effect') {
      setFilters(prev => ({ ...prev, effect: null }));
    } else if (filterType === 'terpene') {
      setFilters(prev => ({ ...prev, terpene: null }));
    } else if (filterType === 'search') {
      setFilters(prev => ({ ...prev, search: '' }));
    } else if (filterType === 'thcRange') {
      setFilters(prev => ({ ...prev, thcRange: [0, 30] }));
    }
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

  const renderSkeletonLoader = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <div className="h-40 bg-gray-800">
            <Skeleton className="h-full w-full" />
          </div>
          <CardContent className="p-4">
            <Skeleton className="h-6 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-2" />
            <div className="mt-4">
              <Skeleton className="h-3 w-full mb-1" />
              <Skeleton className="h-2 w-full mb-3" />
              <Skeleton className="h-3 w-full mb-1" />
              <Skeleton className="h-2 w-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderLoader = () => (
    <div className="flex justify-center items-center h-64">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-t-primary rounded-full animate-spin mx-auto"></div>
        <p className="mt-2 text-gray-400">Loading strains...</p>
      </div>
    </div>
  );

  const activeFilterCount = [
    filters.type, 
    filters.effect, 
    filters.terpene, 
    filters.search, 
    filters.thcRange[0] > 0 || filters.thcRange[1] < 30 ? 'thc' : null
  ].filter(Boolean).length;

  return (
    <div className="container px-4 py-6 pb-20">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-white">Strain Explorer</h1>
          <ConnectionHealthCheck />
        </div>
        <button
          onClick={toggleFilters}
          className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-secondary text-white text-sm"
        >
          <Filter size={16} /> 
          {showFilters ? "Hide Filters" : "Show Filters"}
          {activeFilterCount > 0 && (
            <Badge variant="destructive" className="ml-1 h-5 w-5 flex items-center justify-center p-0 rounded-full">
              {activeFilterCount}
            </Badge>
          )}
        </button>
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.type && (
            <Badge 
              variant="secondary"
              className="flex items-center gap-1"
            >
              Type: {filters.type}
              <X size={14} className="cursor-pointer" onClick={() => clearFilter('type')} />
            </Badge>
          )}
          {filters.effect && (
            <Badge 
              variant="secondary"
              className="flex items-center gap-1"
            >
              Effect: {filters.effect}
              <X size={14} className="cursor-pointer" onClick={() => clearFilter('effect')} />
            </Badge>
          )}
          {filters.terpene && (
            <Badge 
              variant="secondary"
              className="flex items-center gap-1"
            >
              Terpene: {filters.terpene}
              <X size={14} className="cursor-pointer" onClick={() => clearFilter('terpene')} />
            </Badge>
          )}
          {filters.search && (
            <Badge 
              variant="secondary"
              className="flex items-center gap-1"
            >
              Search: "{filters.search}"
              <X size={14} className="cursor-pointer" onClick={() => clearFilter('search')} />
            </Badge>
          )}
          {(filters.thcRange[0] > 0 || filters.thcRange[1] < 30) && (
            <Badge 
              variant="secondary"
              className="flex items-center gap-1"
            >
              THC: {filters.thcRange[0]}% - {filters.thcRange[1]}%
              <X size={14} className="cursor-pointer" onClick={() => clearFilter('thcRange')} />
            </Badge>
          )}
        </div>
      )}

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
          {error ? (
            <Card className="bg-card p-8 rounded-xl text-center border border-destructive">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-2">Error Loading Strains</h3>
                <p className="text-gray-400 mb-4">{error}</p>
                <button 
                  onClick={() => fetchStrains(filters.sort).then(setStrains).catch(() => {})}
                  className="px-4 py-2 bg-primary rounded-md"
                >
                  Retry
                </button>
              </CardContent>
            </Card>
          ) : loading ? (
            renderSkeletonLoader()
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
