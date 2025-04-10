
import React, { useState, useEffect, useRef } from "react";
import { fetchStrains } from "@/services/strainService";
import { Strain, StrainFilters as StrainFiltersType } from "@/types/strain";
import StrainCard from "@/components/StrainCard";
import StrainFilters from "@/components/StrainFilters";
import { useToast } from "@/components/ui/use-toast";
import { Filter, Loader2, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const StrainExplorer: React.FC = () => {
  const [strains, setStrains] = useState<Strain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [totalStrains, setTotalStrains] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const [filters, setFilters] = useState<StrainFiltersType>({
    type: null,
    thcRange: [0, 30],
    effect: null,
    terpene: null,
    sort: 'name',
    search: '',
  });

  const strainsPerPage = 20;

  useEffect(() => {
    const loadStrains = async () => {
      try {
        setLoading(true);
        setError(null);
        const { strains: data, total } = await fetchStrains(
          filters.sort, 
          1, // Reset to first page when filters change
          strainsPerPage,
          filters.search
        );
        
        let filteredData = [...data];
        
        // Apply client-side filtering for other filters
        if (filters.type) {
          filteredData = filteredData.filter(strain => strain.type === filters.type);
        }

        if (filters.thcRange[0] > 0 || filters.thcRange[1] < 30) {
          filteredData = filteredData.filter(
            strain => 
              strain.thc_level !== null && 
              strain.thc_level >= filters.thcRange[0] && 
              strain.thc_level <= filters.thcRange[1]
          );
        }

        if (filters.effect) {
          filteredData = filteredData.filter(strain =>
            strain.effects.some(
              effect => effect.effect === filters.effect && effect.intensity > 0
            )
          );
          
          // Sort by effect intensity
          filteredData.sort((a, b) => {
            const aEffect = a.effects.find(e => e.effect === filters.effect);
            const bEffect = b.effects.find(e => e.effect === filters.effect);
            
            const aIntensity = aEffect?.intensity || 0;
            const bIntensity = bEffect?.intensity || 0;
            
            return bIntensity - aIntensity; // Sort from highest to lowest
          });
        }

        if (filters.terpene) {
          filteredData = filteredData.filter(
            strain => strain.most_common_terpene === filters.terpene
          );
        }
        
        setStrains(filteredData);
        setTotalStrains(total);
        setCurrentPage(1);
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
  }, [filters, toast]);

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && !loadingMore && strains.length < totalStrains) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 }
    );
    
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    
    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [loadingMore, loading, strains, totalStrains]);

  const handleFilterChange = (newFilters: StrainFiltersType) => {
    setFilters(newFilters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const handleLoadMore = async () => {
    if (loadingMore || currentPage * strainsPerPage >= totalStrains) return;
    
    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      
      const { strains: newStrains } = await fetchStrains(
        filters.sort,
        nextPage,
        strainsPerPage,
        filters.search
      );
      
      // Apply the same filters as initial load
      let filteredData = [...newStrains];
      
      if (filters.type) {
        filteredData = filteredData.filter(strain => strain.type === filters.type);
      }

      if (filters.thcRange[0] > 0 || filters.thcRange[1] < 30) {
        filteredData = filteredData.filter(
          strain => 
            strain.thc_level !== null && 
            strain.thc_level >= filters.thcRange[0] && 
            strain.thc_level <= filters.thcRange[1]
        );
      }

      if (filters.effect) {
        filteredData = filteredData.filter(strain =>
          strain.effects.some(
            effect => effect.effect === filters.effect && effect.intensity > 0
          )
        );
      }

      if (filters.terpene) {
        filteredData = filteredData.filter(
          strain => strain.most_common_terpene === filters.terpene
        );
      }
      
      if (filteredData.length > 0) {
        setStrains(prev => [...prev, ...filteredData]);
        setCurrentPage(nextPage);
      }
    } catch (error) {
      console.error("Error loading more strains:", error);
      toast({
        title: "Error loading more strains",
        description: "Could not load additional strains. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingMore(false);
    }
  };

  const renderSkeletonLoader = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <Card key={index} className="overflow-hidden bg-gray-900 border-gray-700">
          <div className="h-40 bg-gray-800">
            <Skeleton className="h-full w-full bg-gray-800" />
          </div>
          <CardContent className="p-4">
            <Skeleton className="h-6 w-3/4 mb-4 bg-gray-800" />
            <Skeleton className="h-4 w-full mb-2 bg-gray-800" />
            <Skeleton className="h-4 w-2/3 mb-2 bg-gray-800" />
            <div className="mt-4">
              <Skeleton className="h-3 w-full mb-1 bg-gray-800" />
              <Skeleton className="h-2 w-full mb-3 bg-gray-800" />
              <Skeleton className="h-3 w-full mb-1 bg-gray-800" />
              <Skeleton className="h-2 w-full bg-gray-800" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const activeFilterCount = [
    filters.type, 
    filters.effect, 
    filters.terpene, 
    filters.search, 
    filters.thcRange[0] > 0 || filters.thcRange[1] < 30 ? 'thc' : null
  ].filter(Boolean).length;

  const remainingStrains = totalStrains - (currentPage * strainsPerPage);

  return (
    <div className="container px-4 py-6 pb-20">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-bold text-white">Strain Explorer</h1>
        </div>
        <Button
          onClick={toggleFilters}
          variant="secondary"
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
        >
          <Filter size={18} /> 
          {showFilters ? "Hide Filters" : "Filters"}
          {activeFilterCount > 0 && (
            <Badge variant="destructive" className="ml-1 h-5 w-5 flex items-center justify-center p-0 rounded-full">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>

      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-6 bg-gray-800/50 p-3 rounded-lg">
          {filters.type && (
            <Badge 
              variant="secondary"
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-700"
            >
              Type: {filters.type}
              <X size={14} className="cursor-pointer ml-1" onClick={() => clearFilter('type')} />
            </Badge>
          )}
          {filters.effect && (
            <Badge 
              variant="secondary"
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-700"
            >
              Effect: {filters.effect}
              <X size={14} className="cursor-pointer ml-1" onClick={() => clearFilter('effect')} />
            </Badge>
          )}
          {filters.terpene && (
            <Badge 
              variant="secondary"
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-700"
            >
              Terpene: {filters.terpene}
              <X size={14} className="cursor-pointer ml-1" onClick={() => clearFilter('terpene')} />
            </Badge>
          )}
          {filters.search && (
            <Badge 
              variant="secondary"
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-700"
            >
              Search: "{filters.search}"
              <X size={14} className="cursor-pointer ml-1" onClick={() => clearFilter('search')} />
            </Badge>
          )}
          {(filters.thcRange[0] > 0 || filters.thcRange[1] < 30) && (
            <Badge 
              variant="secondary"
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-700"
            >
              THC: {filters.thcRange[0]}% - {filters.thcRange[1]}%
              <X size={14} className="cursor-pointer ml-1" onClick={() => clearFilter('thcRange')} />
            </Badge>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
          <StrainFilters 
            filters={filters} 
            onFilterChange={handleFilterChange}
            totalStrains={totalStrains}
            filteredCount={strains.length}
          />
        </div>

        <div className="lg:col-span-3">
          {error ? (
            <Card className="bg-gray-900 p-8 rounded-xl text-center border border-destructive">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-2 text-white">Error Loading Strains</h3>
                <p className="text-gray-400 mb-4">{error}</p>
                <Button 
                  onClick={() => {
                    setCurrentPage(1);
                    fetchStrains(filters.sort, 1, strainsPerPage)
                      .then(({strains}) => setStrains(strains))
                      .catch(() => {});
                  }}
                  variant="default"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Retry
                </Button>
              </CardContent>
            </Card>
          ) : loading ? (
            renderSkeletonLoader()
          ) : strains.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-6 bg-gray-800/50 p-3 rounded-lg">
                <p className="text-sm text-gray-300">
                  Showing {strains.length} strain{strains.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {strains.map((strain) => (
                  <Link to={`/strains/${strain.id}`} key={strain.id} className="block">
                    <StrainCard strain={strain} />
                  </Link>
                ))}
              </div>
              
              {remainingStrains > 0 && (
                <div 
                  ref={loadMoreRef} 
                  className="mt-8 text-center py-8" 
                  aria-hidden="true"
                >
                  {loadingMore && (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-emerald-500 mr-2" />
                      <span className="text-gray-400">Loading more strains...</span>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <Card className="bg-gray-900 p-8 rounded-xl text-center border border-gray-700">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-2 text-white">No strains found</h3>
                <p className="text-gray-400">
                  Try adjusting your filters to see more results.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default StrainExplorer;
