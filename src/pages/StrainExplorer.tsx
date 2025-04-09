import React, { useState, useEffect, useRef, useCallback } from "react";
import { fetchStrains } from "@/services/strainService";
import { Strain, StrainFilters as StrainFiltersType } from "@/types/strain";
import StrainCard from "@/components/StrainCard";
import StrainFilters from "@/components/StrainFilters";
import { useToast } from "@/components/ui/use-toast";
import { Filter, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const StrainExplorer: React.FC = () => {
  const [strains, setStrains] = useState<Strain[]>([]);
  const [filteredStrains, setFilteredStrains] = useState<Strain[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [totalStrains, setTotalStrains] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();
  const { t } = useLanguage();
  const observer = useRef<IntersectionObserver | null>(null);
  const lastStrainElementRef = useRef<HTMLDivElement | null>(null);
  
  const [filters, setFilters] = useState<StrainFiltersType>({
    type: null,
    thcRange: [0, 30],
    effect: null,
    terpene: null,
    sort: 'name',
    search: '',
  });

  const strainsPerPage = 20;

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && hasMore && !loading && !loadingMore) {
      loadMoreStrains();
    }
  }, [hasMore, loading, loadingMore]);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(handleIntersection, {
      rootMargin: '100px',
      threshold: 0.1,
    });
    
    if (lastStrainElementRef.current && hasMore) {
      observer.current.observe(lastStrainElementRef.current);
    }
    
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [handleIntersection, filteredStrains, hasMore]);

  useEffect(() => {
    document.title = t("strainExplorer");
    
    const loadStrains = async () => {
      try {
        setLoading(true);
        setError(null);
        const { strains: data, total } = await fetchStrains(
          filters.sort, 
          1, // Start from first page
          strainsPerPage
        );
        setStrains(data);
        setFilteredStrains(data);
        setTotalStrains(total);
        setCurrentPage(1);
        setHasMore(data.length < total);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error loading strains";
        setError(message);
        toast({
          title: t("errorLoadingStrains"),
          description: message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadStrains();
  }, [filters.sort, toast, t]);

  useEffect(() => {
    let result = [...strains];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(strain => 
        strain.name.toLowerCase().includes(searchTerm) ||
        (strain.description && strain.description.toLowerCase().includes(searchTerm))
      );
    }

    if (filters.type) {
      result = result.filter((strain) => strain.type === filters.type);
    }

    result = result.filter(
      (strain) => 
        !strain.thc_level || 
        (strain.thc_level >= filters.thcRange[0] && 
         strain.thc_level <= filters.thcRange[1])
    );

    if (filters.effect) {
      result = result.filter((strain) =>
        strain.effects.some(
          (effect) => effect.effect === filters.effect && effect.intensity > 0
        )
      );
    }

    if (filters.terpene) {
      result = result.filter((strain) =>
        strain.most_common_terpene === filters.terpene
      );
    }

    setFilteredStrains(result);
  }, [filters, strains]);

  const handleFilterChange = (newFilters: StrainFiltersType) => {
    setFilters(newFilters);
    setCurrentPage(1);
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

  const loadMoreStrains = async () => {
    if (loadingMore || !hasMore) return;
    
    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      
      const { strains: newStrains, total } = await fetchStrains(
        filters.sort,
        nextPage,
        strainsPerPage
      );
      
      if (newStrains.length > 0) {
        setStrains(prev => [...prev, ...newStrains]);
        setCurrentPage(nextPage);
        setHasMore(strains.length + newStrains.length < total);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more strains:", error);
      toast({
        title: t("errorLoadingStrains"),
        description: "Could not load additional strains. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingMore(false);
    }
  };

  const renderNoResults = () => (
    <Card className="bg-gray-800 p-8 rounded-xl text-center border border-gray-700 shadow-lg">
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-2 text-white">{t("noStrainsFound")}</h3>
        <p className="text-gray-400">
          {t("tryAdjusting")}
        </p>
      </CardContent>
    </Card>
  );

  const renderSkeletonLoader = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="overflow-hidden border border-gray-700 bg-gray-800">
          <div className="h-40 bg-gray-700">
            <Skeleton className="h-full w-full bg-gray-700" />
          </div>
          <CardContent className="p-4">
            <Skeleton className="h-6 w-3/4 mb-4 bg-gray-700" />
            <Skeleton className="h-4 w-full mb-2 bg-gray-700" />
            <Skeleton className="h-4 w-2/3 mb-2 bg-gray-700" />
            <div className="mt-4">
              <Skeleton className="h-3 w-full mb-1 bg-gray-700" />
              <Skeleton className="h-2 w-full mb-3 bg-gray-700" />
              <Skeleton className="h-3 w-full mb-1 bg-gray-700" />
              <Skeleton className="h-2 w-full bg-gray-700" />
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

  return (
    <div className="container px-4 py-6 pb-20">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-white">{t("strainExplorer")}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          
          <Button
            onClick={toggleFilters}
            className="flex items-center gap-2 py-2 px-4 bg-secondary hover:bg-secondary/90 text-white font-semibold rounded-xl shadow-md transition-all duration-300"
            variant="secondary"
          >
            <Filter size={18} /> 
            {showFilters ? t("hideFilters") : t("showFilters")}
            {activeFilterCount > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 flex items-center justify-center p-0 rounded-full">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.type && (
            <Badge 
              variant="secondary"
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-purple-800 text-white shadow-md"
            >
              {t("type")}: {filters.type}
              <button 
                className="ml-2 hover:text-gray-200"
                onClick={() => clearFilter('type')}
                aria-label="Clear type filter"
              >
                ×
              </button>
            </Badge>
          )}
          {filters.effect && (
            <Badge 
              variant="secondary"
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-800 text-white shadow-md"
            >
              {t("dominantEffect")}: {filters.effect}
              <button
                className="ml-2 hover:text-gray-200"
                onClick={() => clearFilter('effect')}
                aria-label="Clear effect filter"
              >
                ×
              </button>
            </Badge>
          )}
          {filters.terpene && (
            <Badge 
              variant="secondary"
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-800 text-white shadow-md"
            >
              {t("terpene")}: {filters.terpene}
              <button
                className="ml-2 hover:text-gray-200"
                onClick={() => clearFilter('terpene')}
                aria-label="Clear terpene filter"
              >
                ×
              </button>
            </Badge>
          )}
          {filters.search && (
            <Badge 
              variant="secondary"
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-amber-700 text-white shadow-md"
            >
              {t("search")}: "{filters.search}"
              <button
                className="ml-2 hover:text-gray-200"
                onClick={() => clearFilter('search')}
                aria-label="Clear search filter"
              >
                ×
              </button>
            </Badge>
          )}
          {(filters.thcRange[0] > 0 || filters.thcRange[1] < 30) && (
            <Badge 
              variant="secondary"
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-800 text-white shadow-md"
            >
              {t("thc")}: {filters.thcRange[0]}% - {filters.thcRange[1]}%
              <button
                className="ml-2 hover:text-gray-200"
                onClick={() => clearFilter('thcRange')}
                aria-label="Clear THC range filter"
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div 
          className={`${showFilters ? "block" : "hidden"} lg:block bg-gray-800 rounded-xl p-4 border border-gray-700 h-fit sticky top-4`}
        >
          <StrainFilters 
            filters={filters} 
            onFilterChange={handleFilterChange}
            totalStrains={strains.length}
            filteredCount={filteredStrains.length}
          />
        </div>

        <div className="lg:col-span-3">
          {error ? (
            <Card className="bg-gray-800 p-8 rounded-xl text-center border border-red-800 shadow-lg">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-2 text-white">{t("errorLoadingStrains")}</h3>
                <p className="text-gray-400 mb-4">{error}</p>
                <Button 
                  onClick={() => {
                    setCurrentPage(1);
                    fetchStrains(filters.sort, 1, strainsPerPage)
                      .then(({strains}) => setStrains(strains))
                      .catch(() => {});
                  }}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  {t("retry")}
                </Button>
              </CardContent>
            </Card>
          ) : loading ? (
            renderSkeletonLoader()
          ) : filteredStrains.length > 0 ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-300">
                  {t("showing")} {filteredStrains.length} {t("of")} {totalStrains} {totalStrains !== 1 ? t("strains_count") : t("strain_singular")}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStrains.map((strain, index) => {
                  if (index === filteredStrains.length - 1) {
                    return (
                      <div ref={lastStrainElementRef} key={strain.id}>
                        <Link to={`/strains/${strain.id}`}>
                          <StrainCard strain={strain} />
                        </Link>
                      </div>
                    );
                  } else {
                    return (
                      <Link to={`/strains/${strain.id}`} key={strain.id}>
                        <StrainCard strain={strain} />
                      </Link>
                    );
                  }
                })}
              </div>
              
              {loadingMore && (
                <div className="mt-6 flex justify-center">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg border border-gray-700">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span className="text-gray-300">{t("loading")}</span>
                  </div>
                </div>
              )}
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
