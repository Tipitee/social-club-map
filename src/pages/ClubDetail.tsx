
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { 
  Clock, MapPin, Phone, Globe, Mail, Users, Calendar, 
  Leaf, ArrowLeft, Info, Building, Loader2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { ClubResult } from "@/hooks/use-clubs-search";

// Mock data for aspects of clubs we don't yet have in the database
const mockClubDetails = {
  openingHours: [
    { day: "Monday", hours: "13:00 - 20:00" },
    { day: "Tuesday", hours: "13:00 - 20:00" },
    { day: "Wednesday", hours: "13:00 - 20:00" },
    { day: "Thursday", hours: "13:00 - 20:00" },
    { day: "Friday", hours: "13:00 - 21:00" },
    { day: "Saturday", hours: "12:00 - 18:00" },
    { day: "Sunday", hours: "Closed" }
  ],
  memberCount: 312,
  foundingDate: "02.05.2023",
  specialties: ["Organic cultivation", "CBD-rich strains", "Educational workshops"],
  membershipFee: "€15/month + initial registration fee €50",
  membershipWaitTime: "Approximately 2-3 months",
  strains: [
    { name: "Berlin Haze", thc: "18%", cbd: "0.5%", type: "Sativa" },
    { name: "Brandenburg Kush", thc: "22%", cbd: "1%", type: "Indica" },
    { name: "Spree Balance", thc: "15%", cbd: "8%", type: "Hybrid" },
    { name: "Tiergarten Dream", thc: "20%", cbd: "<0.5%", type: "Sativa" }
  ],
  facilities: ["Indoor growing area", "Member lounge", "Educational space", "Laboratory testing"],
  events: [
    { name: "Cannabis Cultivation Workshop", date: "15.06.2025", description: "Learn about organic growing techniques" },
    { name: "Medical Cannabis Info Session", date: "28.06.2025", description: "Discussion with medical professionals" },
    { name: "Members General Meeting", date: "10.07.2025", description: "Quarterly association meeting" }
  ]
};

const ClubDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("info");
  const [club, setClub] = useState<ClubResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClub = async () => {
      if (!id) {
        setError("No club ID provided");
        setLoading(false);
        return;
      }

      try {
        // Fetch club data from Supabase
        const { data, error: fetchError } = await supabase
          .from('clubs')
          .select('*')
          .eq('id', id)
          .single();
        
        if (fetchError) {
          throw new Error(fetchError.message);
        }

        if (data) {
          // Use any to avoid type instantiation issues
          const clubData = data as any;
          
          // Ensure the data conforms to our ClubResult interface
          const clubResult: ClubResult = {
            id: id,
            name: clubData.name || "Unnamed Club",
            address: clubData.address || null,
            city: clubData.city || null,
            postal_code: clubData.postal_code || null,
            status: (clubData.status as "verified" | "pending" | "unverified") || "unverified",
            latitude: clubData.latitude || null,
            longitude: clubData.longitude || null,
            membership_status: Boolean(clubData.membership_status),
            district: clubData.district || null,
            website: clubData.website || null,
            contact_email: clubData.contact_email || null,
            contact_phone: clubData.contact_phone || null,
            description: clubData.description || null,
            additional_info: clubData.additional_info || null,
          };
          setClub(clubResult);
        } else {
          setError("Club not found");
        }
      } catch (err) {
        console.error("Error fetching club:", err);
        setError(err instanceof Error ? err.message : "Failed to load club details");
      } finally {
        setLoading(false);
      }
    };

    fetchClub();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-linen dark:bg-navy-dark flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-teal mx-auto mb-4" />
          <p className="text-navy-dark dark:text-white">Loading club details...</p>
        </div>
      </div>
    );
  }

  if (error || !club) {
    return (
      <div className="min-h-screen bg-linen dark:bg-navy-dark">
        <Navbar />
        <div className="container px-4 py-6 max-w-7xl mx-auto">
          <div className="mb-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="text-teal dark:text-teal-light hover:bg-transparent hover:text-teal-dark p-0"
            >
              <ArrowLeft size={16} className="mr-1" />
              Back to Club Map
            </Button>
          </div>
          
          <Card className="border-navy-DEFAULT dark:border-navy-light bg-white dark:bg-navy-light shadow-md p-8">
            <h1 className="text-2xl font-bold text-navy-dark dark:text-white mb-4">
              {t('clubs.clubNotFound')}
            </h1>
            <p className="text-navy-dark/70 dark:text-white/70 mb-6">
              {error || t('clubs.unableToLoadClub')}
            </p>
            <Button 
              onClick={() => navigate('/clubs')}
              className="bg-teal hover:bg-teal/90 text-white"
            >
              {t('clubs.returnToClubMap')}
            </Button>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-linen dark:bg-navy-dark pb-28">
      <Navbar />
      
      <div className="container px-4 py-6 max-w-7xl mx-auto">
        {/* Back button */}
        <div className="mb-4">
          <Link to="/clubs" className="inline-flex items-center text-teal dark:text-teal-light hover:underline">
            <ArrowLeft size={16} className="mr-1" />
            Back to Club Map
          </Link>
        </div>
        
        {/* Club header section */}
        <div className="bg-white dark:bg-navy-light rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-navy-dark dark:text-white">
                  {club?.name}
                </h1>
                <div className="flex items-center mt-1 text-gray-600 dark:text-gray-300">
                  <MapPin size={16} className="mr-1 flex-shrink-0" />
                  <span>{club?.address}</span>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0">
                <Badge variant={club?.membership_status ? "success" : "warning"} className="mb-2">
                  {club?.membership_status ? "Accepting Members" : "Waiting List"}
                </Badge>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <Users size={14} className="mr-1" />
                  <span>{mockClubDetails.memberCount} members</span>
                </div>
              </div>
            </div>
            
            {/* Quick info pills */}
            <div className="flex flex-wrap gap-3 mt-4">
              <div className="bg-gray-100 dark:bg-navy-DEFAULT px-3 py-1 rounded-full flex items-center text-xs text-navy-dark dark:text-gray-200">
                <Clock size={12} className="mr-1" />
                Open today: {mockClubDetails.openingHours[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1].hours}
              </div>
              
              <div className="bg-gray-100 dark:bg-navy-DEFAULT px-3 py-1 rounded-full flex items-center text-xs text-navy-dark dark:text-gray-200">
                <Calendar size={12} className="mr-1" />
                Founded: {mockClubDetails.foundingDate}
              </div>
              
              <div className="bg-gray-100 dark:bg-navy-DEFAULT px-3 py-1 rounded-full flex items-center text-xs text-navy-dark dark:text-gray-200">
                <Building size={12} className="mr-1" />
                {club?.city || "Unknown Location"}
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs for different sections */}
        <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="bg-white dark:bg-navy-DEFAULT border border-navy-DEFAULT/20 dark:border-navy-light/20 mb-6">
            <TabsTrigger 
              value="info" 
              className="text-navy-dark dark:text-white data-[state=active]:bg-teal data-[state=active]:text-white"
            >
              <Info size={16} className="mr-2" />
              Information
            </TabsTrigger>
            <TabsTrigger 
              value="strains" 
              className="text-navy-dark dark:text-white data-[state=active]:bg-teal data-[state=active]:text-white"
            >
              <Leaf size={16} className="mr-2" />
              Strains
            </TabsTrigger>
            <TabsTrigger 
              value="events" 
              className="text-navy-dark dark:text-white data-[state=active]:bg-teal data-[state=active]:text-white"
            >
              <Calendar size={16} className="mr-2" />
              Events
            </TabsTrigger>
          </TabsList>
          
          {/* Information Tab */}
          <TabsContent value="info" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column - About & Details */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-navy-DEFAULT dark:border-navy-light bg-white dark:bg-navy-light">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-navy-dark dark:text-white">About</h3>
                    <p className="text-navy-dark dark:text-gray-200 mb-6">
                      {club?.description || "No description available for this club."}
                    </p>
                    
                    <h4 className="font-semibold mb-2 text-navy-dark dark:text-white">Specialties</h4>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {mockClubDetails.specialties.map((specialty, index) => (
                        <Badge key={index} variant="outline" className="bg-gray-50 dark:bg-navy-DEFAULT">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                    
                    <h4 className="font-semibold mb-2 text-navy-dark dark:text-white">Facilities</h4>
                    <div className="flex flex-wrap gap-2">
                      {mockClubDetails.facilities.map((facility, index) => (
                        <Badge key={index} variant="outline" className="bg-gray-50 dark:bg-navy-DEFAULT">
                          {facility}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-navy-DEFAULT dark:border-navy-light bg-white dark:bg-navy-light">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-navy-dark dark:text-white">Membership Information</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-navy-dark dark:text-white">Fees</h4>
                        <p className="text-gray-700 dark:text-gray-300">{mockClubDetails.membershipFee}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-navy-dark dark:text-white">Expected Wait Time</h4>
                        <p className="text-gray-700 dark:text-gray-300">{mockClubDetails.membershipWaitTime}</p>
                      </div>
                      
                      <div className="pt-4">
                        <Button className="w-full sm:w-auto bg-teal hover:bg-teal/90 text-white">
                          Request Membership Information
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {club?.additional_info && (
                  <Card className="border-navy-DEFAULT dark:border-navy-light bg-white dark:bg-navy-light">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-4 text-navy-dark dark:text-white">Additional Information</h3>
                      <p className="text-navy-dark dark:text-gray-200">{club.additional_info}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              {/* Right column - Contact & Hours */}
              <div className="space-y-6">
                <Card className="border-navy-DEFAULT dark:border-navy-light bg-white dark:bg-navy-light">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-navy-dark dark:text-white">Contact</h3>
                    
                    <div className="space-y-3">
                      {club?.contact_phone && (
                        <div className="flex items-start">
                          <Phone size={18} className="mr-3 mt-0.5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                          <div>
                            <p className="text-gray-700 dark:text-gray-300">{club.contact_phone}</p>
                          </div>
                        </div>
                      )}
                      
                      {club?.contact_email && (
                        <div className="flex items-start">
                          <Mail size={18} className="mr-3 mt-0.5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                          <div>
                            <a href={`mailto:${club.contact_email}`} className="text-teal dark:text-teal-light hover:underline">
                              {club.contact_email}
                            </a>
                          </div>
                        </div>
                      )}
                      
                      {club?.website && (
                        <div className="flex items-start">
                          <Globe size={18} className="mr-3 mt-0.5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                          <div>
                            <a href={club.website} target="_blank" rel="noopener noreferrer" className="text-teal dark:text-teal-light hover:underline">
                              {club.website.replace(/^https?:\/\//, '')}
                            </a>
                          </div>
                        </div>
                      )}
                      
                      {!club?.contact_phone && !club?.contact_email && !club?.website && (
                        <p className="text-gray-500 dark:text-gray-400 italic">No contact information available</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-navy-DEFAULT dark:border-navy-light bg-white dark:bg-navy-light">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-navy-dark dark:text-white">Opening Hours</h3>
                    
                    <div className="space-y-2">
                      {mockClubDetails.openingHours.map((item, index) => (
                        <div 
                          key={index} 
                          className={`flex justify-between ${
                            new Date().getDay() === 0 ? 
                              index === 6 ? 'font-bold text-teal dark:text-teal-light' : '' 
                              : 
                              index === new Date().getDay() - 1 ? 'font-bold text-teal dark:text-teal-light' : ''
                          }`}
                        >
                          <span className="text-navy-dark dark:text-gray-200">{item.day}</span>
                          <span className="text-navy-dark dark:text-gray-200">{item.hours}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {club?.latitude && club?.longitude && (
                  <Card className="border-navy-DEFAULT dark:border-navy-light bg-white dark:bg-navy-light overflow-hidden">
                    <iframe 
                      src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAv_1hk3mQJ9JWbSyKMM1YYJ1sAUkfgjfk&q=${club.latitude},${club.longitude}`}
                      width="100%" 
                      height="200" 
                      style={{ border: 0 }} 
                      allowFullScreen={true}
                      loading="lazy"
                      title={`Location of ${club.name}`}
                      className="w-full"
                    />
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* Strains Tab */}
          <TabsContent value="strains" className="mt-0">
            <Card className="border-navy-DEFAULT dark:border-navy-light bg-white dark:bg-navy-light">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-navy-dark dark:text-white">Available Strains</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockClubDetails.strains.map((strain, index) => (
                    <div 
                      key={index} 
                      className="border border-gray-200 dark:border-navy-DEFAULT rounded-lg p-4 bg-gray-50 dark:bg-navy-DEFAULT"
                    >
                      <h4 className="font-bold text-navy-dark dark:text-white">{strain.name}</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className="bg-gray-100 dark:bg-navy-light">
                          {strain.type}
                        </Badge>
                        <Badge variant="outline" className="bg-gray-100 dark:bg-navy-light">
                          THC: {strain.thc}
                        </Badge>
                        <Badge variant="outline" className="bg-gray-100 dark:bg-navy-light">
                          CBD: {strain.cbd}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
                  <p>* Strain availability is subject to change. Please contact the club for current inventory.</p>
                  <p>* All strains are tested for quality and potency in compliance with German regulations.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Events Tab */}
          <TabsContent value="events" className="mt-0">
            <Card className="border-navy-DEFAULT dark:border-navy-light bg-white dark:bg-navy-light">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-navy-dark dark:text-white">Upcoming Events</h3>
                
                {mockClubDetails.events && mockClubDetails.events.length > 0 ? (
                  <div className="space-y-4">
                    {mockClubDetails.events.map((event, index) => (
                      <div 
                        key={index} 
                        className="border-l-4 border-teal pl-4 py-2"
                      >
                        <div className="flex justify-between flex-wrap">
                          <h4 className="font-bold text-navy-dark dark:text-white">{event.name}</h4>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{event.date}</span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mt-1">
                          {event.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-700 dark:text-gray-300">No upcoming events at this time.</p>
                )}
                
                <div className="mt-6">
                  <Accordion type="single" collapsible>
                    <AccordionItem value="events-info">
                      <AccordionTrigger className="text-navy-dark dark:text-white">
                        About Club Events
                      </AccordionTrigger>
                      <AccordionContent className="text-navy-dark dark:text-gray-300">
                        <p className="mb-2">
                          Our events are open to registered members only and are designed to educate, inform, and build community around responsible cannabis use.
                        </p>
                        <p>
                          Event registration is typically required. Please contact the club for more information about attending upcoming events.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClubDetail;
