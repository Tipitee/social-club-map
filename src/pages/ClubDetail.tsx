
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { 
  Clock, MapPin, Phone, Globe, Mail, Users, Calendar, 
  Leaf, Scale, Shield, ArrowLeft, Info, Camera, Tag, Building 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";

// Mock club data with more comprehensive information
const clubs = [
  {
    id: 1,
    name: "Green Harmony e.V.",
    address: "Eisenacher Str. 70, 10823 Berlin",
    district: "Schöneberg",
    city: "Berlin",
    postalCode: "10823",
    latitude: 52.4895,
    longitude: 13.3624,
    contactPhone: "+49 30 98765432",
    contactEmail: "info@green-harmony.de",
    website: "https://green-harmony.de",
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
    description: "Green Harmony e.V. is one of Berlin's first cannabis social clubs, established shortly after the legalization framework was introduced. Our mission is to provide members with high-quality cannabis in a safe, transparent, and educational environment.",
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
    ],
    images: [
      "/assets/club-images/green-harmony-1.jpg", 
      "/assets/club-images/green-harmony-2.jpg",
      "/assets/club-images/green-harmony-3.jpg"
    ],
    status: "active",
    registrationOpen: true
  },
  {
    id: 2,
    name: "Grüner Kreis München",
    address: "Lindwurmstraße 88, 80337 München",
    district: "Ludwigsvorstadt-Isarvorstadt",
    city: "München",
    postalCode: "80337",
    latitude: 48.1291,
    longitude: 11.5600,
    contactPhone: "+49 89 76543210",
    contactEmail: "kontakt@gruenerkreis-muenchen.de",
    website: "https://gruenerkreis-muenchen.de",
    openingHours: [
      { day: "Monday", hours: "14:00 - 19:00" },
      { day: "Tuesday", hours: "14:00 - 19:00" },
      { day: "Wednesday", hours: "Closed" },
      { day: "Thursday", hours: "14:00 - 19:00" },
      { day: "Friday", hours: "14:00 - 20:00" },
      { day: "Saturday", hours: "12:00 - 16:00" },
      { day: "Sunday", hours: "Closed" }
    ],
    memberCount: 186,
    foundingDate: "15.07.2023",
    description: "Grüner Kreis München is committed to providing Bavarian cannabis enthusiasts with high-quality, locally grown products in strict compliance with state regulations. Our club emphasizes education, responsible use, and community.",
    specialties: ["High-altitude growing", "Traditional Bavarian strains", "Consumption safety courses"],
    membershipFee: "€20/month + initial registration fee €60",
    membershipWaitTime: "Approximately 1-2 months",
    strains: [
      { name: "Alpen Gold", thc: "19%", cbd: "1%", type: "Indica" },
      { name: "Isar Breeze", thc: "16%", cbd: "3%", type: "Hybrid" },
      { name: "Bavarian Forest", thc: "22%", cbd: "<0.5%", type: "Indica" }
    ],
    facilities: ["Indoor growing area", "Member consultation rooms", "Quality testing lab"],
    events: [
      { name: "Introduction to Cannabis Varieties", date: "10.06.2025", description: "Educational session for new members" },
      { name: "Responsible Consumption Workshop", date: "22.06.2025", description: "Safety and best practices" }
    ],
    images: [
      "/assets/club-images/gruener-kreis-1.jpg", 
      "/assets/club-images/gruener-kreis-2.jpg"
    ],
    status: "active",
    registrationOpen: true
  },
  {
    id: 3,
    name: "Hanf Freunde Hamburg",
    address: "Schulterblatt 58, 20357 Hamburg",
    district: "Sternschanze",
    city: "Hamburg",
    postalCode: "20357",
    latitude: 53.5597,
    longitude: 9.9667,
    contactPhone: "+49 40 54321098",
    contactEmail: "info@hanffreunde-hh.de",
    website: "https://hanffreunde-hh.de",
    openingHours: [
      { day: "Monday", hours: "Closed" },
      { day: "Tuesday", hours: "15:00 - 20:00" },
      { day: "Wednesday", hours: "15:00 - 20:00" },
      { day: "Thursday", hours: "15:00 - 20:00" },
      { day: "Friday", hours: "15:00 - 22:00" },
      { day: "Saturday", hours: "13:00 - 22:00" },
      { day: "Sunday", hours: "13:00 - 18:00" }
    ],
    memberCount: 245,
    foundingDate: "23.04.2023",
    description: "Hanf Freunde Hamburg is a community-driven cannabis social club located in the vibrant Sternschanze district. We focus on sustainable practices and maritime-influenced cultivation methods.",
    specialties: ["Sustainable growing", "Harbor-inspired strains", "Maritime growing methods"],
    membershipFee: "€15/month + initial registration fee €45",
    membershipWaitTime: "Approximately 3-4 months",
    strains: [
      { name: "Harbor Haze", thc: "17%", cbd: "2%", type: "Sativa" },
      { name: "Elbe Express", thc: "21%", cbd: "<0.5%", type: "Hybrid" },
      { name: "St. Pauli Purple", thc: "19%", cbd: "1%", type: "Indica" },
      { name: "Reeperbahn Gold", thc: "20%", cbd: "0.5%", type: "Sativa" }
    ],
    facilities: ["Rooftop garden", "Member lounge", "Education center"],
    events: [
      { name: "Urban Growing Workshop", date: "18.06.2025", description: "Tips for small-space cultivation" },
      { name: "Cannabis and Music Festival", date: "02.07.2025", description: "Celebrating Hamburg's cannabis culture" }
    ],
    images: [
      "/assets/club-images/hanf-freunde-1.jpg", 
      "/assets/club-images/hanf-freunde-2.jpg",
      "/assets/club-images/hanf-freunde-3.jpg"
    ],
    status: "active",
    registrationOpen: false
  }
];

const ClubDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("info");

  // Find the club based on the ID from the URL
  const clubId = parseInt(id || "1");
  const club = clubs.find(c => c.id === clubId) || clubs[0];
  
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
                  {club.name}
                </h1>
                <div className="flex items-center mt-1 text-gray-600 dark:text-gray-300">
                  <MapPin size={16} className="mr-1 flex-shrink-0" />
                  <span>{club.address}</span>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0">
                <Badge variant={club.registrationOpen ? "success" : "warning"} className="mb-2">
                  {club.registrationOpen ? "Accepting Members" : "Waiting List"}
                </Badge>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <Users size={14} className="mr-1" />
                  <span>{club.memberCount} members</span>
                </div>
              </div>
            </div>
            
            {/* Quick info pills */}
            <div className="flex flex-wrap gap-3 mt-4">
              <div className="bg-gray-100 dark:bg-navy-DEFAULT px-3 py-1 rounded-full flex items-center text-xs text-navy-dark dark:text-gray-200">
                <Clock size={12} className="mr-1" />
                Open today: {club.openingHours[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1].hours}
              </div>
              
              <div className="bg-gray-100 dark:bg-navy-DEFAULT px-3 py-1 rounded-full flex items-center text-xs text-navy-dark dark:text-gray-200">
                <Calendar size={12} className="mr-1" />
                Founded: {club.foundingDate}
              </div>
              
              <div className="bg-gray-100 dark:bg-navy-DEFAULT px-3 py-1 rounded-full flex items-center text-xs text-navy-dark dark:text-gray-200">
                <Building size={12} className="mr-1" />
                {club.city}
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
                      {club.description}
                    </p>
                    
                    <h4 className="font-semibold mb-2 text-navy-dark dark:text-white">Specialties</h4>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {club.specialties.map((specialty, index) => (
                        <Badge key={index} variant="outline" className="bg-gray-50 dark:bg-navy-DEFAULT">
                          <Tag size={12} className="mr-1" />
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                    
                    <h4 className="font-semibold mb-2 text-navy-dark dark:text-white">Facilities</h4>
                    <div className="flex flex-wrap gap-2">
                      {club.facilities.map((facility, index) => (
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
                        <p className="text-gray-700 dark:text-gray-300">{club.membershipFee}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-navy-dark dark:text-white">Expected Wait Time</h4>
                        <p className="text-gray-700 dark:text-gray-300">{club.membershipWaitTime}</p>
                      </div>
                      
                      <div className="pt-4">
                        <Button className="w-full sm:w-auto bg-teal hover:bg-teal/90 text-white">
                          Request Membership Information
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Right column - Contact & Hours */}
              <div className="space-y-6">
                <Card className="border-navy-DEFAULT dark:border-navy-light bg-white dark:bg-navy-light">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-navy-dark dark:text-white">Contact</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <Phone size={18} className="mr-3 mt-0.5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                        <div>
                          <p className="text-gray-700 dark:text-gray-300">{club.contactPhone}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Mail size={18} className="mr-3 mt-0.5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                        <div>
                          <a href={`mailto:${club.contactEmail}`} className="text-teal dark:text-teal-light hover:underline">
                            {club.contactEmail}
                          </a>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Globe size={18} className="mr-3 mt-0.5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                        <div>
                          <a href={club.website} target="_blank" rel="noopener noreferrer" className="text-teal dark:text-teal-light hover:underline">
                            {club.website.replace('https://', '')}
                          </a>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-navy-DEFAULT dark:border-navy-light bg-white dark:bg-navy-light">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-navy-dark dark:text-white">Opening Hours</h3>
                    
                    <div className="space-y-2">
                      {club.openingHours.map((item, index) => (
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
              </div>
            </div>
          </TabsContent>
          
          {/* Strains Tab */}
          <TabsContent value="strains" className="mt-0">
            <Card className="border-navy-DEFAULT dark:border-navy-light bg-white dark:bg-navy-light">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-navy-dark dark:text-white">Available Strains</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {club.strains.map((strain, index) => (
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
                
                {club.events && club.events.length > 0 ? (
                  <div className="space-y-4">
                    {club.events.map((event, index) => (
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
