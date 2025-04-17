
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ArrowRight, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NewsItem } from "@/types/news";

interface NewsCardProps {
  item: NewsItem;
  isGerman: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ item, isGerman }) => {
  const { t } = useTranslation();
  
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "federal": return t('news.federal');
      case "state": return t('news.state');
      case "medical": return t('news.medical');
      case "recreational": return t('news.recreational');
      case "business": return t('news.business');
      default: return category;
    }
  };
  
  const getCategoryColor = (category: string): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "error" => {
    switch (category) {
      case "federal": return "default";
      case "state": return "secondary";
      case "medical": return "success";
      case "recreational": return "warning";
      case "business": return "outline";
      default: return "default";
    }
  };

  return (
    <Card className="border-navy-DEFAULT dark:border-navy-light bg-white dark:bg-navy-light shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
          <div className="flex items-center mb-2 md:mb-0">
            <Calendar size={16} className="mr-1.5 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {t('news.postedOn')} {item.date}
            </span>
          </div>
          
          <Badge className="self-start md:self-auto" variant={getCategoryColor(item.category)}>
            {getCategoryLabel(item.category)}
          </Badge>
        </div>
        
        <h3 className="text-xl font-semibold mb-3 text-navy-dark dark:text-white">
          {isGerman ? item.title : item.titleEn}
        </h3>
        
        <p className="text-navy-dark dark:text-gray-200 mb-4">
          {isGerman ? item.summary : item.summaryEn}
        </p>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between pt-3 border-t border-navy-DEFAULT/20 dark:border-navy-light/20">
          <div className="mb-3 md:mb-0">
            <Button variant="link" className="px-0 py-0 h-auto text-teal dark:text-teal-light flex items-center">
              {t('news.readMore')}
              <ArrowRight size={16} className="ml-1" />
            </Button>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {t('news.source')}: {item.source}
            </span>
            
            <a 
              href={item.sourceUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-teal dark:text-teal-light hover:underline"
            >
              <Globe size={14} className="mr-1" />
              {t('news.visitSource')}
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsCard;
