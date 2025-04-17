
import React from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface NewsFiltersProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const NewsFilters: React.FC<NewsFiltersProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useTranslation();
  
  const categories = [
    { id: 'all', label: 'strains.all' },
    { id: 'federal', label: 'news.federal' },
    { id: 'state', label: 'news.state' },
    { id: 'medical', label: 'news.medical' },
    { id: 'recreational', label: 'news.recreational' },
    { id: 'business', label: 'news.business' },
  ];

  return (
    <div className="flex flex-wrap gap-2 justify-center mb-6">
      {categories.map(category => (
        <Button
          key={category.id}
          variant={activeTab === category.id ? "default" : "outline"}
          className={`rounded-md px-4 py-2 text-sm ${
            activeTab === category.id
              ? 'bg-teal text-white dark:bg-teal'
              : 'bg-white dark:bg-navy-400 text-navy-dark dark:text-white border-navy-DEFAULT/30 dark:border-navy-light/30'
          }`}
          onClick={() => setActiveTab(category.id)}
        >
          {t(category.label)}
        </Button>
      ))}
    </div>
  );
};

export default NewsFilters;
