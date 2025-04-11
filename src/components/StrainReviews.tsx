
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, Plus, Upload, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import UsernamePrompt from './UsernamePrompt';

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

// Mock reviews data
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
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [userRating, setUserRating] = useState<number>(0);
  const [userReview, setUserReview] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isUsernamePromptOpen, setIsUsernamePromptOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Load user profile if user is logged in
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const averageRating = reviews.length > 0 
    ? Math.round(reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length * 10) / 10
    : 0;

  const handleStarClick = (rating: number) => {
    setUserRating(rating);
  };

  const handleAddReviewClick = () => {
    if (!user) {
      toast({
        title: t('strains.reviews.loginToReview'),
        description: "",
        variant: 'destructive'
      });
      return;
    }

    if (!profile?.username) {
      setIsUsernamePromptOpen(true);
      return;
    }

    setIsDialogOpen(true);
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
      userId: user?.id || 'anonymous',
      userName: profile?.username || t('strains.reviews.anonymous'),
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
      description: t('strains.reviews.reviewAdded')
    });
  };

  const handleUsernameSaved = (username: string) => {
    setProfile({ ...profile, username });
    setIsDialogOpen(true);
  };

  const renderStars = (rating: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'} ${interactive ? 'cursor-pointer' : ''} h-4 w-4`}
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
      {/* Reviews Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-foreground">Reviews</h2>
            {reviews.length > 0 && (
              <span className="flex items-center">
                <span className="flex text-yellow-400 mr-1">
                  {renderStars(Math.round(averageRating))}
                </span>
              </span>
            )}
          </div>
          {reviews.length > 0 && (
            <p className="text-muted-foreground text-sm mt-1">
              Average Rating: {averageRating} 
            </p>
          )}
        </div>
        
        <Button 
          className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto"
          onClick={handleAddReviewClick}
        >
          <Plus size={16} className="mr-1" />
          Add Review
        </Button>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-card text-foreground border-primary/20">
            <DialogHeader>
              <DialogTitle>Add Review: {strainName}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 pt-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Rating
                </label>
                <div className="flex space-x-1">
                  {renderStars(userRating, true)}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Write Review
                </label>
                <Textarea
                  value={userReview}
                  onChange={(e) => setUserReview(e.target.value)}
                  className="bg-background border-input text-foreground"
                  rows={4}
                  placeholder="Share your experience with this strain..."
                />
              </div>
              
              <div>
                <Button variant="outline" className="w-full">
                  <Upload size={16} className="mr-2" />
                  Add Photo (Optional)
                </Button>
              </div>
              
              <Button 
                onClick={handleSubmitReview} 
                disabled={userRating === 0}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                Submit Review
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Username Prompt Dialog */}
        <UsernamePrompt 
          isOpen={isUsernamePromptOpen} 
          onClose={() => setIsUsernamePromptOpen(false)}
          onUsernameSaved={handleUsernameSaved}
        />
      </div>
      
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="hover:border-primary/30 transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {review.userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base font-medium text-foreground">{review.userName}</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">
                      {formatDate(review.date)}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex mb-2">
                  {renderStars(review.rating)}
                </div>
                <p className="text-sm">{review.comment}</p>
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
        <Card className="text-center p-8 border-primary/20">
          <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
        </Card>
      )}
    </div>
  );
};

export default StrainReviews;
