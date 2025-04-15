
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { StrainFilters as StrainFiltersType } from "@/types/strain";
import { Filter } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

interface StrainFiltersProps {
  filters: StrainFiltersType;
  onFilterChange: (filters: StrainFiltersType) => void;
}

const StrainFilters: React.FC<StrainFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const { t } = useTranslation();
  const [localFilters, setLocalFilters] = useState<StrainFiltersType>(filters);
  const debouncedSearchTerm = useDebounce(localFilters.search, 500);

  const handleChange = (key: keyof StrainFiltersType, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    
    // If search field is changed, don't apply filters immediately
    // The debounce effect below will handle that
    if (key !== 'search') {
      onFilterChange(newFilters);
    }
  };

  // Use effect to auto-apply search filters after debouncing
  useEffect(() => {
    if (debouncedSearchTerm !== filters.search) {
      onFilterChange({ ...localFilters, search: debouncedSearchTerm });
    }
  }, [debouncedSearchTerm, filters.search, localFilters, onFilterChange]);

  const applyFilters = () => {
    onFilterChange(localFilters);
  };

  const resetFilters = () => {
    const resetFilters: StrainFiltersType = {
      type: null,
      thcRange: [0, 30],
      effect: null,
      terpene: null,
      sort: 'name',
      search: ''
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-linen dark:bg-navy-light p-4 rounded-lg border border-sand-DEFAULT dark:border-navy-DEFAULT shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">{t('filters.filter')}</h3>
        <button onClick={resetFilters} className="text-xs text-teal-DEFAULT hover:text-teal-dark">
          {t('filters.reset')}
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="search" className="mb-2 block">{t('filters.search')}</Label>
          <Input
            id="search"
            placeholder={t('strains.searchStrains')}
            value={localFilters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="w-full search-input"
          />
        </div>

        <div>
          <Label htmlFor="type" className="mb-2 block">{t('filters.type')}</Label>
          <Select
            value={localFilters.type || 'all'}
            onValueChange={(value) => handleChange('type', value === 'all' ? null : value)}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder={t('strains.selectType')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t('strains.all')}
              </SelectItem>
              <SelectItem value="Indica">{t('strains.types.indica')}</SelectItem>
              <SelectItem value="Sativa">{t('strains.types.sativa')}</SelectItem>
              <SelectItem value="Hybrid">{t('strains.types.hybrid')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="effect" className="mb-2 block">{t('filters.effects')}</Label>
          <Select
            value={localFilters.effect || 'all'}
            onValueChange={(value) => handleChange('effect', value === 'all' ? null : value)}
          >
            <SelectTrigger id="effect">
              <SelectValue placeholder={t('strains.selectEffect')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('strains.all')}</SelectItem>
              <SelectItem value="relaxed">{t('strains.effects.relaxed')}</SelectItem>
              <SelectItem value="happy">{t('strains.effects.happy')}</SelectItem>
              <SelectItem value="euphoric">{t('strains.effects.euphoric')}</SelectItem>
              <SelectItem value="uplifted">{t('strains.effects.uplifted')}</SelectItem>
              <SelectItem value="creative">{t('strains.effects.creative')}</SelectItem>
              <SelectItem value="focused">{t('strains.effects.focused')}</SelectItem>
              <SelectItem value="energetic">{t('strains.effects.energetic')}</SelectItem>
              <SelectItem value="hungry">{t('strains.effects.hungry')}</SelectItem>
              <SelectItem value="talkative">{t('strains.effects.talkative')}</SelectItem>
              <SelectItem value="tingly">{t('strains.effects.tingly')}</SelectItem>
              <SelectItem value="pain">{t('strains.effects.pain')}</SelectItem>
              <SelectItem value="sleepy">{t('strains.effects.sleepy')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="terpene" className="mb-2 block">Terpenes</Label>
          <Select
            value={localFilters.terpene || 'all'}
            onValueChange={(value) => handleChange('terpene', value === 'all' ? null : value)}
          >
            <SelectTrigger id="terpene">
              <SelectValue placeholder={t('strains.selectTerpene')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('strains.all')}</SelectItem>
              <SelectItem value="Myrcene">{t('strains.terpenes.myrcene')}</SelectItem>
              <SelectItem value="Caryophyllene">{t('strains.terpenes.caryophyllene')}</SelectItem>
              <SelectItem value="Limonene">{t('strains.terpenes.limonene')}</SelectItem>
              <SelectItem value="Pinene">{t('strains.terpenes.pinene')}</SelectItem>
              <SelectItem value="Terpinolene">{t('strains.terpenes.terpinolene')}</SelectItem>
              <SelectItem value="Ocimene">{t('strains.terpenes.ocimene')}</SelectItem>
              <SelectItem value="Linalool">{t('strains.terpenes.linalool')}</SelectItem>
              <SelectItem value="Humulene">{t('strains.terpenes.humulene')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <Label htmlFor="thcRange">{t('filters.thc')}</Label>
            <span className="text-xs font-medium">
              {localFilters.thcRange[0]}% - {localFilters.thcRange[1]}%
            </span>
          </div>
          <Slider
            id="thcRange"
            min={0}
            max={30}
            step={1}
            value={[localFilters.thcRange[0], localFilters.thcRange[1]]}
            onValueChange={(value) => handleChange('thcRange', value as [number, number])}
            className="my-4"
          />
        </div>

        <div>
          <Label htmlFor="sort" className="mb-2 block">{t('filters.sort')}</Label>
          <Select
            value={localFilters.sort}
            onValueChange={(value) => handleChange('sort', value)}
          >
            <SelectTrigger id="sort">
              <SelectValue placeholder={t('strains.selectSortOrder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">{t('strains.sortOptions.nameAZ')}</SelectItem>
              <SelectItem value="name-desc">{t('strains.sortOptions.nameZA')}</SelectItem>
              <SelectItem value="thc-desc">{t('strains.sortOptions.thcHighLow')}</SelectItem>
              <SelectItem value="thc">{t('strains.sortOptions.thcLowHigh')}</SelectItem>
              <SelectItem value="rating-desc">{t('strains.sortOptions.ratingHighLow')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={applyFilters} 
          variant="filter"
          className="w-full"
        >
          <Filter size={16} className="mr-2" />
          {t('filters.apply')}
        </Button>
      </div>
    </div>
  );
};

export default StrainFilters;
