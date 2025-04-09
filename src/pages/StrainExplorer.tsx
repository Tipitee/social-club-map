
import React, { useState, useEffect } from "react";
import { fetchStrains } from "@/services/strainService";
import { Strain, StrainFilters as StrainFiltersType } from "@/types/strain";
import StrainCard from "@/components/StrainCard";
import StrainFilters from "@/components/StrainFilters";
import { useToast } from "@/components/ui/use-toast";
import { Filter, ArrowDown, X, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConnectionHealthCheck } from "@/components/ConnectionHealthCheck";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const StrainExplorer: React.FC = () => {
  const [strains, setStrains] = useState<Strain[]>([]);
  const [filteredStrains, setFilteredStrains] = useState<Strain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [totalStrains, setTotalStrains] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();
  
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
    // Set document title
    document.title = "Strain Explorer";
    
    const loadStrains = async () => {
      try {
        setLoading(true);
        setError(null);
        const { strains: data, total } = await fetchStrains(
          filters.sort, 
          currentPage, 
          strainsPerPage
        );
        setStrains(data);
        setFilteredStrains(data);
        setTotalStrains(total);
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
  }, [filters.sort, currentPage, toast, t]);

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
    setCurrentPage(1); // Reset to first page when filters change
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
    if (loadingMore) return;
    
    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      
      const { strains: newStrains } = await fetchStrains(
        filters.sort,
        nextPage,
        strainsPerPage
      );
      
      if (newStrains.length > 0) {
        setStrains(prev => [...prev, ...newStrains]);
        setCurrentPage(nextPage);
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

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  };

  const renderNoResults = () => (
    <Card className="bg-card p-8 rounded-xl text-center border border-gray-800 shadow-lg">
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
        <Card key={index} className="overflow-hidden border border-gray-700">
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

  const renderPagination = () => {
    const totalPages = Math.ceil(totalStrains / strainsPerPage);
    if (totalPages <= 1) return null;

    return (
      <Pagination className="mt-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
              className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // Show pagination centered around current page
            let pageToShow: number;
            if (totalPages <= 5) {
              // If we have 5 or fewer pages, just show all of them
              pageToShow = i + 1;
            } else if (currentPage <= 3) {
              // If we're near the start
              pageToShow = i + 1;
            } else if (currentPage >= totalPages - 2) {
              // If we're near the end
              pageToShow = totalPages - 4 + i;
            } else {
              // We're in the middle, center the current page
              pageToShow = currentPage - 2 + i;
            }

            return (
              <PaginationItem key={pageToShow}>
                <PaginationLink
                  isActive={pageToShow === currentPage}
                  onClick={() => handlePageChange(pageToShow)}
                >
                  {pageToShow}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
              className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

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
          <ConnectionHealthCheck />
        </div>
        
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          
          <Button
            onClick={toggleFilters}
            className="flex items-center gap-1.5 py-2 px-4 bg-secondary hover:bg-secondary/90 text-white rounded-lg shadow-md"
            variant="secondary"
          >
            <Filter size={16} /> 
            {showFilters ? t("hideFilters") : t("showFilters")}
            {activeFilterCount > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 flex items-center justify-center p-0 rounded-full">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.type && (
            <Badge 
              variant="secondary"
              className="flex items-center gap-1 px-3 py-1.5 shadow-md"
            >
              {t("type")}: {filters.type}
              <X size={14} className="cursor-pointer ml-1" onClick={() => clearFilter('type')} />
            </Badge>
          )}
          {filters.effect && (
            <Badge 
              variant="secondary"
              className="flex items-center gap-1 px-3 py-1.5 shadow-md"
            >
              {t("dominantEffect")}: {filters.effect}
              <X size={14} className="cursor-pointer ml-1" onClick={() => clearFilter('effect')} />
            </Badge>
          )}
          {filters.terpene && (
            <Badge 
              variant="secondary"
              className="flex items-center gap-1 px-3 py-1.5 shadow-md"
            >
              {t("terpene")}: {filters.terpene}
              <X size={14} className="cursor-pointer ml-1" onClick={() => clearFilter('terpene')} />
            </Badge>
          )}
          {filters.search && (
            <Badge 
              variant="secondary"
              className="flex items-center gap-1 px-3 py-1.5 shadow-md"
            >
              {t("search")}: "{filters.search}"
              <X size={14} className="cursor-pointer ml-1" onClick={() => clearFilter('search')} />
            </Badge>
          )}
          {(filters.thcRange[0] > 0 || filters.thcRange[1] < 30) && (
            <Badge 
              variant="secondary"
              className="flex items-center gap-1 px-3 py-1.5 shadow-md"
            >
              {t("thc")}: {filters.thcRange[0]}% - {filters.thcRange[1]}%
              <X size={14} className="cursor-pointer ml-1" onClick={() => clearFilter('thcRange')} />
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
            <Card className="bg-card p-8 rounded-xl text-center border border-destructive shadow-lg">
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
                  {t("showing")} {filteredStrains.length} {t("of")} {totalStrains} {totalStrains !== 1 ? t("strains") : t("strain")}
                </p>
                <p className="text-sm text-gray-300">
                  {t("page")} {currentPage}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStrains.map((strain) => (
                  <Link to={`/strains/${strain.id}`} key={strain.id} className="block">
                    <StrainCard strain={strain} />
                  </Link>
                ))}
              </div>
              
              {renderPagination()}
              
              {currentPage * strainsPerPage < totalStrains && (
                <div className="mt-6 text-center">
                  <Button 
                    onClick={handleLoadMore} 
                    disabled={loadingMore}
                    variant="secondary"
                    className="px-8 py-2 bg-secondary hover:bg-secondary/90 text-white shadow-md"
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("loading")}
                      </>
                    ) : (
                      t("loadMore")
                    )}
                  </Button>
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
