import React, { useState, useEffect, useRef } from "react";
import { fetchStrains } from "@/services/strainService";
import { Strain, StrainFilters as StrainFiltersType } from "@/types/strain";
import StrainCard from "@/components/StrainCard";
import StrainFilters from "@/components/StrainFilters";
import { useToast } from "@/hooks/use-toast";
import { Filter, Loader2, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
const LAST_VIEWED_STRAIN_KEY = "last-viewed-strain";
const LAST_SCROLL_POSITION_KEY = "last-scroll-position";
const StrainExplorer: React.FC = () => {
  const {
    t
  } = useTranslation();
  const [strains, setStrains] = useState<Strain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [totalStrains, setTotalStrains] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const strainListRef = useRef<HTMLDivElement>(null);
  const {
    toast
  } = useToast();
  const [filters, setFilters] = useState<StrainFiltersType>({
    type: null,
    thcRange: [0, 30],
    effect: null,
    terpene: null,
    sort: 'name',
    search: ''
  });
  const strainsPerPage = 20;
  useEffect(() => {
    return () => {
      if (strainListRef.current) {
        sessionStorage.setItem(LAST_SCROLL_POSITION_KEY, window.scrollY.toString());
      }
    };
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      const savedPosition = sessionStorage.getItem(LAST_SCROLL_POSITION_KEY);
      const lastViewedStrainId = sessionStorage.getItem(LAST_VIEWED_STRAIN_KEY);
      if (savedPosition && lastViewedStrainId && !loading) {
        const position = parseInt(savedPosition, 10);
        window.scrollTo({
          top: position
        });
        const strainElement = document.getElementById(`strain-${lastViewedStrainId}`);
        if (strainElement) {
          strainElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
          strainElement.classList.add('ring-2', 'ring-secondary');
          setTimeout(() => {
            strainElement.classList.remove('ring-2', 'ring-secondary');
          }, 2000);
        }
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [loading, strains]);
  useEffect(() => {
    const loadStrains = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchStrains(filters.sort, 1, strainsPerPage, filters.search);
        if (!response) {
          throw new Error('Failed to fetch strains data');
        }
        const {
          strains: data,
          total
        } = response;
        if (!data || !Array.isArray(data)) {
          throw new Error('Invalid strains data received');
        }
        let filteredData = [...data];
        if (filters.type) {
          filteredData = filteredData.filter(strain => strain.type === filters.type);
        }
        if (filters.thcRange[0] > 0 || filters.thcRange[1] < 30) {
          filteredData = filteredData.filter(strain => strain.thc_level !== null && strain.thc_level >= filters.thcRange[0] && strain.thc_level <= filters.thcRange[1]);
        }
        if (filters.effect) {
          filteredData = filteredData.filter(strain => strain.effects.some(effect => effect.effect === filters.effect && effect.intensity > 0));
          filteredData.sort((a, b) => {
            const aEffect = a.effects.find(e => e.effect === filters.effect);
            const bEffect = b.effects.find(e => e.effect === filters.effect);
            const aIntensity = aEffect?.intensity || 0;
            const bIntensity = bEffect?.intensity || 0;
            return bIntensity - aIntensity;
          });
        }
        if (filters.terpene) {
          filteredData = filteredData.filter(strain => strain.most_common_terpene === filters.terpene);
        }
        filteredData.sort((a, b) => {
          const aHasImage = Boolean(a.img_url && a.img_url.trim() !== '');
          const bHasImage = Boolean(b.img_url && b.img_url.trim() !== '');
          if (aHasImage && !bHasImage) return -1;
          if (!aHasImage && bHasImage) return 1;
          return a.name.localeCompare(b.name);
        });
        setStrains(filteredData);
        setTotalStrains(total);
        setCurrentPage(1);
      } catch (error) {
        console.error('Error loading strains:', error);
        const message = error instanceof Error ? error.message : "Unknown error loading strains";
        setError(message);
        toast({
          title: t('strains.errorLoading'),
          description: message,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    loadStrains();
  }, [filters, toast, t]);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !loading && !loadingMore && strains.length < totalStrains) {
        handleLoadMore();
      }
    }, {
      threshold: 0.1
    });
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
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    sessionStorage.removeItem(LAST_VIEWED_STRAIN_KEY);
    sessionStorage.removeItem(LAST_SCROLL_POSITION_KEY);
  };
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  const clearFilter = (filterType: keyof StrainFiltersType) => {
    if (filterType === 'type') {
      setFilters(prev => ({
        ...prev,
        type: null
      }));
    } else if (filterType === 'effect') {
      setFilters(prev => ({
        ...prev,
        effect: null
      }));
    } else if (filterType === 'terpene') {
      setFilters(prev => ({
        ...prev,
        terpene: null
      }));
    } else if (filterType === 'search') {
      setFilters(prev => ({
        ...prev,
        search: ''
      }));
    } else if (filterType === 'thcRange') {
      setFilters(prev => ({
        ...prev,
        thcRange: [0, 30]
      }));
    }
  };
  const handleLoadMore = async () => {
    if (loadingMore || currentPage * strainsPerPage >= totalStrains) return;
    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      const {
        strains: newStrains
      } = await fetchStrains(filters.sort, nextPage, strainsPerPage, filters.search);
      let filteredData = [...newStrains];
      if (filters.type) {
        filteredData = filteredData.filter(strain => strain.type === filters.type);
      }
      if (filters.thcRange[0] > 0 || filters.thcRange[1] < 30) {
        filteredData = filteredData.filter(strain => strain.thc_level !== null && strain.thc_level >= filters.thcRange[0] && strain.thc_level <= filters.thcRange[1]);
      }
      if (filters.effect) {
        filteredData = filteredData.filter(strain => strain.effects.some(effect => effect.effect === filters.effect && effect.intensity > 0));
      }
      if (filters.terpene) {
        filteredData = filteredData.filter(strain => strain.most_common_terpene === filters.terpene);
      }
      filteredData.sort((a, b) => {
        const aHasImage = Boolean(a.img_url && a.img_url.trim() !== '');
        const bHasImage = Boolean(b.img_url && b.img_url.trim() !== '');
        if (aHasImage && !bHasImage) return -1;
        if (!aHasImage && bHasImage) return 1;
        return a.name.localeCompare(b.name);
      });
      if (filteredData.length > 0) {
        setStrains(prev => [...prev, ...filteredData]);
        setCurrentPage(nextPage);
      }
    } catch (error) {
      console.error("Error loading more strains:", error);
      toast({
        title: t('strains.errorLoadingMore'),
        description: t('strains.couldNotLoadAdditional'),
        variant: "destructive"
      });
    } finally {
      setLoadingMore(false);
    }
  };
  const renderSkeletonLoader = () => <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {Array.from({
      length: 8
    }).map((_, index) => <Card key={index} className="overflow-hidden dark:bg-navy-light border-navy-DEFAULT light:bg-sand-light light:border-sand-DEFAULT">
          <div className="h-40 dark:bg-navy-DEFAULT bg-sand-DEFAULT/30">
            <Skeleton className="h-full w-full dark:bg-navy-DEFAULT/70 bg-sand-DEFAULT/10" />
          </div>
          <CardContent className="p-4">
            <Skeleton className="h-6 w-3/4 mb-4 dark:bg-navy-DEFAULT/70 bg-sand-DEFAULT/10" />
            <Skeleton className="h-4 w-full mb-2 dark:bg-navy-DEFAULT/70 bg-sand-DEFAULT/10" />
            <Skeleton className="h-4 w-2/3 mb-2 dark:bg-navy-DEFAULT/70 bg-sand-DEFAULT/10" />
            <div className="mt-4">
              <Skeleton className="h-3 w-full mb-1 dark:bg-navy-DEFAULT/70 bg-sand-DEFAULT/10" />
              <Skeleton className="h-2 w-full mb-3 dark:bg-navy-DEFAULT/70 bg-sand-DEFAULT/10" />
              <Skeleton className="h-3 w-full mb-1 dark:bg-navy-DEFAULT/70 bg-sand-DEFAULT/10" />
              <Skeleton className="h-2 w-full dark:bg-navy-DEFAULT/70 bg-sand-DEFAULT/10" />
            </div>
          </CardContent>
        </Card>)}
    </div>;
  const handleStrainClick = (strainId: string) => {
    sessionStorage.setItem(LAST_VIEWED_STRAIN_KEY, strainId);
    sessionStorage.setItem(LAST_SCROLL_POSITION_KEY, window.scrollY.toString());
  };
  const activeFilterCount = [filters.type, filters.effect, filters.terpene, filters.search, filters.thcRange[0] > 0 || filters.thcRange[1] < 30 ? 'thc' : null].filter(Boolean).length;
  const remainingStrains = totalStrains - currentPage * strainsPerPage;
  return <div className="min-h-screen bg-linen dark:bg-navy-dark pb-28">
      <Navbar />
      <div className="container px-4 max-w-7xl mx-auto py-[77px]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold text-navy-dark dark:text-white">{t('strains.strainsExplorer')}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={toggleFilters} variant="default" className="flex items-center gap-2 filter-toggle-button h-9 px-3">
              <Filter size={16} />
              {showFilters ? t('strains.hideFilters') : t('strains.showFilters')}
              {activeFilterCount > 0 && <Badge variant="secondary" className="ml-1 h-5 w-5 flex items-center justify-center p-0 rounded-full bg-white text-teal-DEFAULT">
                  {activeFilterCount}
                </Badge>}
            </Button>
          </div>
        </div>

        {activeFilterCount > 0 && <div className="flex flex-wrap gap-2 mb-6 dark:bg-navy-light/50 bg-sand-DEFAULT/10 p-3 rounded-lg">
            {filters.type && <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1 text-sm dark:bg-navy-DEFAULT bg-sand-DEFAULT/30">
                {t('strains.filters.type')}: {filters.type}
                <X size={14} className="cursor-pointer ml-1" onClick={() => clearFilter('type')} />
              </Badge>}
            {filters.effect && <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1 text-sm dark:bg-navy-DEFAULT bg-sand-DEFAULT/30">
                {t('strains.filters.effects')}: {filters.effect}
                <X size={14} className="cursor-pointer ml-1" onClick={() => clearFilter('effect')} />
              </Badge>}
            {filters.terpene && <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1 text-sm dark:bg-navy-DEFAULT bg-sand-DEFAULT/30">
                {t('strains.terpenes')}: {filters.terpene}
                <X size={14} className="cursor-pointer ml-1" onClick={() => clearFilter('terpene')} />
              </Badge>}
            {filters.search && <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1 text-sm dark:bg-navy-DEFAULT bg-sand-DEFAULT/30">
                {t('strains.filters.search')}: "{filters.search}"
                <X size={14} className="cursor-pointer ml-1" onClick={() => clearFilter('search')} />
              </Badge>}
            {(filters.thcRange[0] > 0 || filters.thcRange[1] < 30) && <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1 text-sm dark:bg-navy-DEFAULT bg-sand-DEFAULT/30">
                {t('strains.thcLevel')}: {filters.thcRange[0]}% - {filters.thcRange[1]}%
                <X size={14} className="cursor-pointer ml-1" onClick={() => clearFilter('thcRange')} />
              </Badge>}
          </div>}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className={`${showFilters ? "block" : "hidden"} lg:block lg:col-span-1`}>
            <StrainFilters filters={filters} onFilterChange={handleFilterChange} />
          </div>

          <div className={`${showFilters ? "col-span-4" : "col-span-4"} lg:col-span-3`} ref={strainListRef}>
            {error ? <Card className="dark:bg-navy-light p-8 rounded-xl text-center border border-destructive bg-sand-light">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2 dark:text-white text-navy-dark">{t('strains.errorLoadingStrains')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                  <Button onClick={() => {
                setCurrentPage(1);
                fetchStrains(filters.sort, 1, strainsPerPage).then(({
                  strains
                }) => setStrains(strains)).catch(() => {});
              }} variant="default" className="px-4 py-2 bg-teal-DEFAULT hover:bg-teal-dark text-white">
                    {t('strains.retry')}
                  </Button>
                </CardContent>
              </Card> : loading ? renderSkeletonLoader() : strains.length > 0 ? <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                  {strains.map(strain => <Link to={`/strains/${strain.id}`} key={strain.id} id={`strain-${strain.id}`} className="block" onClick={() => handleStrainClick(strain.id)}>
                      <StrainCard strain={strain} />
                    </Link>)}
                </div>
                
                {remainingStrains > 0 && <div ref={loadMoreRef} className="mt-8 text-center py-8" aria-hidden="true">
                    {loadingMore && <div className="flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-teal-DEFAULT mr-2" />
                        <span className="text-gray-600 dark:text-gray-400">{t('strains.loadingMore')}</span>
                      </div>}
                  </div>}
              </> : <Card className="dark:bg-navy-light p-8 rounded-xl text-center border dark:border-navy-DEFAULT border-sand-DEFAULT bg-sand-light">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2 dark:text-white text-navy-dark">{t('strains.noStrainsFound')}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('strains.tryAdjustingFilters')}
                  </p>
                </CardContent>
              </Card>}
          </div>
        </div>
      </div>
    </div>;
};
export default StrainExplorer;