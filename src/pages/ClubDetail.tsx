
import React from "react";
import Navbar from "@/components/Navbar";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { MapPin, Clock, Users, Phone, Globe, Calendar, Star, Check, AlertCircle, Info } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock data - in a real app, this would come from an API call based on ID
const mockClubDetails = {
  "1": {
    id: "1",
    name: "Green Valley Club",
    address: "Hauptstraße 123, Berlin",
    coordinates: { lat: 52.52, lng: 13.405 },
    phone: "+49 30 1234567",
    website: "https://greenvalleyclub.de",
    hours: "Mon-Fri: 12:00-20:00, Sat: 14:00-22:00, Sun: Closed",
    memberCount: 152,
    membershipFee: "€50 per year",
    foundedDate: "April 2023",
    status: "verified",
    description: "Green Valley Club is one of Berlin's premier cannabis social clubs, offering a relaxed atmosphere for members to enjoy quality cannabis products. The club focuses on organic cultivation and educational events about responsible consumption.",
    amenities: ["Member Lounge", "Grow Room Tours", "Educational Workshops", "Monthly Events"],
    rating: 4.7,
    reviewCount: 89,
    strainSpecialties: ["Gelato", "Northern Lights", "Amnesia Haze"],
    photos: ["club1.jpg", "club2.jpg", "club3.jpg"]
  },
  "2": {
    id: "2",
    name: "Cannabis Social Berlin",
    address: "Friedrichstraße 45, Berlin",
    coordinates: { lat: 52.51, lng: 13.39 },
    phone: "+49 30 9876543",
    website: "https://cannabissocial.berlin",
    hours: "Mon-Thu: 14:00-22:00, Fri-Sat: 14:00-00:00, Sun: 16:00-22:00",
    memberCount: 203,
    membershipFee: "€60 per year",
    foundedDate: "January 2023",
    status: "verified",
    description: "Cannabis Social Berlin is a community-focused cannabis club in the heart of Berlin. With a diverse membership and central location, the club offers various cannabis varieties and regular social events for members to connect and learn.",
    amenities: ["Consumption Area", "Cannabis Library", "Community Garden", "Weekly Meetups"],
    rating: 4.5,
    reviewCount: 124,
    strainSpecialties: ["White Widow", "Durban Poison", "Girl Scout Cookies"],
    photos: ["club1.jpg", "club2.jpg", "club3.jpg"]
  },
  "3": {
    id: "3",
    name: "Hanf Freunde e.V.",
    address: "Torstraße 78, Berlin",
    coordinates: { lat: 52.53, lng: 13.41 },
    phone: "+49 30 5432198",
    website: "https://hanffreunde.de",
    hours: "Tue-Sun: 15:00-21:00, Mon: Closed",
    memberCount: 87,
    membershipFee: "€40 per year",
    foundedDate: "June 2023",
    status: "pending",
    description: "Hanf Freunde is a newer cannabis club still growing its membership base. The club emphasizes education about cannabis culture and responsible use, with a focus on creating a tight-knit community of enthusiasts.",
    amenities: ["Small Lounge", "Educational Events"],
    rating: 4.2,
    reviewCount: 35,
    strainSpecialties: ["Blue Dream", "AK-47"],
    photos: ["club1.jpg", "club2.jpg", "club3.jpg"]
  }
};

const ClubDetail: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  
  // In a real app, we would fetch club details from an API
  const club = mockClubDetails[id as keyof typeof mockClubDetails];
  
  if (!club) {
    return (
      <div className="min-h-screen bg-linen dark:bg-navy-dark pb-28">
        <Navbar />
        <div className="container px-4 py-6 max-w-7xl mx-auto text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-navy-dark dark:text-white">
            {t('clubs.notFound')}
          </h1>
          <p className="text-navy-dark dark:text-gray-200">
            {t('clubs.clubNotFoundMessage')}
          </p>
        </div>
      </div>
    );
  }
  
  const handleJoinRequest = () => {
    toast({
      title: "Membership Request Sent",
      description: `Your request to join ${club.name} has been submitted.`,
    });
  };
  
  return (
    <div className="min-h-screen bg-linen dark:bg-navy-dark pb-28">
      <Navbar />
      <div className="container px-4 py-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-navy-dark dark:text-white">
              {club.name}
            </h1>
            {club.status === "verified" && (
              <Badge className="bg-teal text-white">Verified</Badge>
            )}
            {club.status === "pending" && (
              <Badge className="bg-amber-500 text-white">Pending Verification</Badge>
            )}
          </div>
          
          <div className="flex items-center text-navy-dark/70 dark:text-gray-300 mb-4">
            <MapPin size={16} className="mr-1" />
            <span>{club.address}</span>
          </div>
        </div>
        
        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2">
            {/* Club photos */}
            <Card className="mb-6 bg-white dark:bg-navy-light border-navy-DEFAULT dark:border-navy-light">
              <CardContent className="p-0 overflow-hidden">
                <div className="aspect-video bg-gray-100 dark:bg-navy-DEFAULT flex items-center justify-center">
                  <img 
                    src="/placeholder.svg"
                    alt={club.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* About */}
            <Card className="mb-6 bg-white dark:bg-navy-light border-navy-DEFAULT dark:border-navy-light">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-navy-dark dark:text-white">
                  About
                </h2>
                <p className="text-navy-dark dark:text-gray-200 mb-4">
                  {club.description}
                </p>
                
                <h3 className="text-lg font-semibold mt-6 mb-3 text-navy-dark dark:text-white">
                  Strain Specialties
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {club.strainSpecialties.map(strain => (
                    <Badge 
                      key={strain} 
                      variant="outline"
                      className="bg-linen dark:bg-navy-DEFAULT text-navy-dark dark:text-white border-navy-DEFAULT/30 dark:border-navy-light/30"
                    >
                      {strain}
                    </Badge>
                  ))}
                </div>
                
                <h3 className="text-lg font-semibold mt-6 mb-3 text-navy-dark dark:text-white">
                  Amenities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {club.amenities.map(amenity => (
                    <div key={amenity} className="flex items-center">
                      <Check size={16} className="mr-2 text-teal dark:text-teal-light" />
                      <span className="text-navy-dark dark:text-gray-200">{amenity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right column */}
          <div>
            {/* Membership details */}
            <Card className="mb-6 bg-white dark:bg-navy-light border-navy-DEFAULT dark:border-navy-light">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-navy-dark dark:text-white">
                  Membership
                </h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-navy-dark dark:text-gray-200">
                      <Users size={18} className="mr-2 text-navy-dark/70 dark:text-gray-400" />
                      <span>Members</span>
                    </div>
                    <span className="font-medium text-navy-dark dark:text-white">{club.memberCount}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-navy-dark dark:text-gray-200">
                      <Calendar size={18} className="mr-2 text-navy-dark/70 dark:text-gray-400" />
                      <span>Founded</span>
                    </div>
                    <span className="font-medium text-navy-dark dark:text-white">{club.foundedDate}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-navy-dark dark:text-gray-200">
                      <Info size={18} className="mr-2 text-navy-dark/70 dark:text-gray-400" />
                      <span>Fee</span>
                    </div>
                    <span className="font-medium text-navy-dark dark:text-white">{club.membershipFee}</span>
                  </div>
                </div>
                
                <Button
                  onClick={handleJoinRequest}
                  className="w-full mt-6 bg-teal dark:bg-teal-dark hover:bg-teal-dark text-white"
                >
                  Request Membership
                </Button>
              </CardContent>
            </Card>
            
            {/* Contact information */}
            <Card className="mb-6 bg-white dark:bg-navy-light border-navy-DEFAULT dark:border-navy-light">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-navy-dark dark:text-white">
                  Contact & Hours
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center text-navy-dark dark:text-gray-200 mb-1">
                      <Phone size={16} className="mr-2 text-navy-dark/70 dark:text-gray-400" />
                      <span>Phone</span>
                    </div>
                    <a href={`tel:${club.phone}`} className="text-teal dark:text-teal-light hover:underline">
                      {club.phone}
                    </a>
                  </div>
                  
                  <div>
                    <div className="flex items-center text-navy-dark dark:text-gray-200 mb-1">
                      <Globe size={16} className="mr-2 text-navy-dark/70 dark:text-gray-400" />
                      <span>Website</span>
                    </div>
                    <a href={club.website} target="_blank" rel="noopener noreferrer" className="text-teal dark:text-teal-light hover:underline">
                      {club.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                  
                  <div>
                    <div className="flex items-center text-navy-dark dark:text-gray-200 mb-1">
                      <Clock size={16} className="mr-2 text-navy-dark/70 dark:text-gray-400" />
                      <span>Hours</span>
                    </div>
                    <div className="text-navy-dark dark:text-gray-200">
                      {club.hours.split(', ').map((day, index) => (
                        <div key={index}>{day}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Rating */}
            <Card className="bg-white dark:bg-navy-light border-navy-DEFAULT dark:border-navy-light">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold text-navy-dark dark:text-white">
                    Rating
                  </h2>
                  <div className="flex items-center">
                    <span className="text-lg font-bold text-navy-dark dark:text-white mr-1">{club.rating}</span>
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  </div>
                </div>
                <p className="text-navy-dark/70 dark:text-gray-400">
                  Based on {club.reviewCount} reviews
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDetail;
