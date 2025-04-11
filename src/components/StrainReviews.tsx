
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, Plus, Upload, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  photoUrl?: string;
}

interface StrainReviewsProps {
  strainId: string;
  strainName: string;
}

// Mock reviews data with updated names as requested
const mockReviews: Review[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Mhd Bsl',
    rating: 5,
    comment: 'Excellent strain for relaxation. Great body high without being too sedating. Helped with my anxiety and back pain.',
    date: '2025-03-15',
    photoUrl: undefined
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Sal Mtb',
    rating: 4,
    comment: 'Nice flavor profile with hints of citrus. Good for daytime use as it doesn\'t cause too much drowsiness.',
    date: '2025-03-01',
    photoUrl: undefined
  }
];

const StrainReviews: React.FC<StrainReviewsProps> = ({ strainId, strainName }) => {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [userRating, setUserRating] = useState<number>(0);
  const [userReview, setUserReview] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const averageRating = reviews.length > 0 
    ? Math.round(reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length * 10) / 10
    : 0;

  const handleStarClick = (rating: number) => {
    setUserRating(rating);
  };

  const handleSubmitReview = () => {
    if (userRating === 0) {
      toast({
        title: t('strains.reviews.ratingRequired'),
        description: t('strains.reviews.pleaseProvideRating'),
        variant: 'destructive'
      });
      return;
    }

    const newReview: Review = {
      id: `review-${Date.now()}`,
      userId: 'current-user',
      userName: t('strains.reviews.anonymous'),
      rating: userRating,
      comment: userReview,
      date: new Date().toISOString().split('T')[0]
    };

    setReviews([newReview, ...reviews]);
    setUserRating(0);
    setUserReview('');
    setIsDialogOpen(false);

    toast({
      title: t('strains.reviews.thankYou'),
      description: t('strains.reviews.reviewSubmitted')
    });
  };

  const renderStars = (rating: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'} ${interactive ? 'cursor-pointer' : ''}`}
        onClick={interactive ? () => handleStarClick(i + 1) : undefined}
        onMouseEnter={interactive ? () => setUserRating(i + 1) : undefined}
        onMouseLeave={interactive ? () => userRating === 0 && setUserRating(0) : undefined}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(t('language.select') === 'English' ? 'en-US' : 'de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">{t('strains.reviews.title')}</h2>
          {reviews.length > 0 && (
            <p className="text-gray-400 flex items-center mt-1">
              {averageRating} 
              <span className="flex ml-1 text-yellow-400">
                <Star className={`h-4 w-4 ${averageRating >= 1 ? 'fill-yellow-400' : ''}`} />
                <Star className={`h-4 w-4 ${averageRating >= 2 ? 'fill-yellow-400' : ''}`} />
                <Star className={`h-4 w-4 ${averageRating >= 3 ? 'fill-yellow-400' : ''}`} />
                <Star className={`h-4 w-4 ${averageRating >= 4 ? 'fill-yellow-400' : ''}`} />
                <Star className={`h-4 w-4 ${averageRating >= 5 ? 'fill-yellow-400' : ''}`} />
              </span>
              <span className="ml-1">({reviews.length})</span>
            </p>
          )}
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#3A7D89] hover:bg-[#2A5D69]">
              <Plus size={16} className="mr-1" />
              {t('strains.reviews.addReview')}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1A3A47] text-white border-[#215366]">
            <DialogHeader>
              <DialogTitle>{t('strains.reviews.addReview')}: {strainName}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 pt-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('strains.reviews.yourRating')}
                </label>
                <div className="flex space-x-1">
                  {renderStars(userRating, true)}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('strains.reviews.writeReview')}
                </label>
                <Textarea
                  value={userReview}
                  onChange={(e) => setUserReview(e.target.value)}
                  className="bg-[#152B35] border-[#215366] text-white"
                  rows={4}
                />
              </div>
              
              <div>
                <Button variant="outline" className="bg-[#152B35] text-white border-[#215366] w-full">
                  <Upload size={16} className="mr-2" />
                  {t('strains.reviews.photoUpload')}
                </Button>
              </div>
              
              <Button 
                onClick={handleSubmitReview} 
                disabled={userRating === 0}
                className="w-full bg-[#3A7D89] hover:bg-[#2A5D69]"
              >
                {t('strains.reviews.submitReview')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="bg-[#1A3A47] border-[#215366] hover:border-[#3A7D89] transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2 bg-[#152B35]">
                    <AvatarFallback className="bg-[#152B35] text-[#AED3D9]">
                      <User size={16} />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base font-medium text-white">{review.userName}</CardTitle>
                    <CardDescription className="text-xs text-gray-400">
                      {formatDate(review.date)}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex mb-2">
                  {renderStars(review.rating)}
                </div>
                <p className="text-gray-300 text-sm">{review.comment}</p>
                {review.photoUrl && (
                  <div className="mt-3">
                    <img 
                      src={review.photoUrl} 
                      alt="Review" 
                      className="rounded-md max-h-40 object-cover" 
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-[#1A3A47] border-[#215366] text-center p-8">
          <p className="text-gray-400">{t('strains.reviews.noReviews')}</p>
        </Card>
      )}
    </div>
  );
};

export default StrainReviews;
