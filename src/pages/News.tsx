
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import NewsCard from "@/components/news/NewsCard";
import NewsFilters from "@/components/news/NewsFilters";
import { newsItems } from "@/data/newsData";

const News: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("all");
  const [visibleCount, setVisibleCount] = useState(6);
  
  const filteredNews = activeTab === "all" 
    ? newsItems 
    : newsItems.filter(item => item.category === activeTab);
  
  const displayedNews = filteredNews.slice(0, visibleCount);
  const hasMore = displayedNews.length < filteredNews.length;
  
  const isGerman = i18n.language === 'de';
  
  const loadMore = () => {
    setVisibleCount(prev => prev + 4);
  };
  
  return (
    <div className="min-h-screen bg-linen dark:bg-navy-dark pb-28">
      <Navbar />
      <div className="container px-4 py-6 max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-navy-dark dark:text-white">
          {t('navigation.news')}
        </h1>
        
        <div className="mb-8">
          <NewsFilters activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <div className="mb-4">
            <p className="text-gray-600 dark:text-gray-300">
              {filteredNews.length} {t('news.results')}
            </p>
          </div>
          
          <div className="space-y-6">
            {displayedNews.map((item) => (
              <NewsCard key={item.id} item={item} isGerman={isGerman} />
            ))}
          </div>
          
          {hasMore && (
            <div className="mt-8 text-center">
              <Button 
                onClick={loadMore}
                variant="outline"
                className="border-navy-DEFAULT dark:border-navy-light text-navy-dark dark:text-white hover:bg-navy-DEFAULT/10 dark:hover:bg-white/10"
              >
                {t('news.loadMore')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default News;
