
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { ClubResult } from "@/types/club";
import { Capacitor } from "@capacitor/core";
import { Geolocation, Position } from '@capacitor/geolocation';
import { toast } from "@/hooks/use-toast";
import { MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Google Maps API key
const GOOGLE_MAPS_API_KEY = "AIzaSyBEkQ4_EZZEE6kRr9SvuIqS8coD9Igt67A";

// Map container styles
const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem'
};

// Default center of Germany
const DEFAULT_CENTER = {
  lat: 51.16,
  lng: 10.45
};

interface ClubMapProps {
  club?: ClubResult;
  allClubs?: ClubResult[];
}

const ClubMap: React.FC<ClubMapProps> = ({ club, allClubs }) => {
  const navigate = useNavigate();
  const [selectedClub, setSelectedClub] = useState<ClubResult | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  
  // Load the Google Maps JS API
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  });
  
  // Ref for the map instance
  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);
  
  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Get user's current location
  const getCurrentLocation = useCallback(async () => {
    if (!Capacitor.isNativePlatform() && !navigator.geolocation) {
      toast({
        title: "Location not available",
        description: "Geolocation is not supported by your browser",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoadingLocation(true);
      
      let position: Position | GeolocationPosition;
      
      // Use Capacitor Geolocation plugin if on native platform
      if (Capacitor.isNativePlatform()) {
        const permissionStatus = await Geolocation.checkPermissions();
        
        if (permissionStatus.location !== 'granted') {
          const requestStatus = await Geolocation.requestPermissions();
          if (requestStatus.location !== 'granted') {
            throw new Error("Location permission denied");
          }
        }
        
        position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000
        });
      } else {
        // Use browser's geolocation API if not on native platform
        position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          });
        });
      }
      
      const { latitude, longitude } = position.coords;
      setUserLocation({ lat: latitude, lng: longitude });
      
      if (map) {
        map.panTo({ lat: latitude, lng: longitude });
        map.setZoom(13);
      }

      toast({
        title: "Location found",
        description: "Showing your current location",
      });
    } catch (error) {
      console.error("Error getting location:", error);
      toast({
        title: "Location error",
        description: error instanceof Error ? error.message : "Could not get your location",
        variant: "destructive"
      });
    } finally {
      setIsLoadingLocation(false);
    }
  }, [map]);
  
  useEffect(() => {
    if (!isLoaded || !map) return;
    
    // If this is a single club view and we have coordinates
    if (club && club.latitude && club.longitude) {
      map.setCenter({ 
        lat: club.latitude, 
        lng: club.longitude 
      });
      map.setZoom(15);
    } 
    // If this is the clubs list view and we have multiple clubs
    else if (allClubs && allClubs.length > 0) {
      const validClubs = allClubs.filter(c => c.latitude && c.longitude);
      
      if (validClubs.length === 0) return;
      
      // Create bounds object to fit all markers
      const bounds = new google.maps.LatLngBounds();
      
      // Extend bounds for each club
      validClubs.forEach(club => {
        if (club.latitude && club.longitude) {
          bounds.extend({
            lat: club.latitude,
            lng: club.longitude
          });
        }
      });
      
      // Fit bounds with padding
      map.fitBounds(bounds, 50);
    }
  }, [isLoaded, map, club, allClubs]);
  
  // Handle click on club marker
  const handleMarkerClick = (club: ClubResult) => {
    setSelectedClub(club);
  };
  
  // Navigate to club detail page
  const navigateToClub = (club: ClubResult) => {
    navigate(`/clubs/${encodeURIComponent(club.name)}`, { 
      state: { fromSearch: true } 
    });
  };
  
  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-navy-400 rounded-lg">
        <div className="text-center p-4">
          <p className="text-navy-dark dark:text-white">Error loading map.</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Please try again later.</p>
        </div>
      </div>
    );
  }
  
  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-navy-400 rounded-lg">
        <div className="animate-spin h-10 w-10 border-4 border-teal rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  return (
    <>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={DEFAULT_CENTER}
        zoom={5}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT
          },
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        }}
      >
        {/* Display user's location marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              url: `data:image/svg+xml;charset=UTF-8,
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="%232A9D90" stroke="%23ffffff" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="4" fill="%23ffffff"></circle>
              </svg>`,
              scaledSize: new google.maps.Size(24, 24),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(12, 12)
            }}
          />
        )}

        {/* Display markers for clubs */}
        {club && club.latitude && club.longitude && (
          <Marker
            position={{ lat: club.latitude, lng: club.longitude }}
            icon={{
              url: `data:image/svg+xml;charset=UTF-8,
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="%2314b8a6" stroke="%23ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>`,
              scaledSize: new google.maps.Size(32, 32),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(16, 32)
            }}
            onClick={() => handleMarkerClick(club)}
          />
        )}
        
        {allClubs && allClubs.map((club, index) => {
          if (!club.latitude || !club.longitude) return null;
          
          return (
            <Marker
              key={`${club.id}-${index}`}
              position={{ lat: club.latitude, lng: club.longitude }}
              icon={{
                url: `data:image/svg+xml;charset=UTF-8,
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="%2314b8a6" stroke="%23ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>`,
                scaledSize: new google.maps.Size(28, 28),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(14, 28)
              }}
              onClick={() => handleMarkerClick(club)}
            />
          );
        })}
        
        {/* Show info window for selected club */}
        {selectedClub && (
          <InfoWindow
            position={{ 
              lat: selectedClub.latitude!, 
              lng: selectedClub.longitude! 
            }}
            onCloseClick={() => setSelectedClub(null)}
          >
            <div className="p-2 max-w-xs">
              <div className="font-medium text-navy-dark">{selectedClub.name}</div>
              <div className="text-sm text-gray-700">{selectedClub.address || ''}</div>
              <div 
                className="text-teal text-sm mt-1 cursor-pointer"
                onClick={() => navigateToClub(selectedClub)}
              >
                View details
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Location button (floating) */}
      <div className="absolute right-4 bottom-4 z-10">
        <Button 
          onClick={getCurrentLocation}
          disabled={isLoadingLocation}
          variant="secondary"
          size="icon"
          className="h-10 w-10 rounded-full shadow-lg bg-white dark:bg-navy-400 hover:bg-gray-100 dark:hover:bg-navy-300"
        >
          {isLoadingLocation ? (
            <Loader2 className="h-5 w-5 text-teal dark:text-teal-light animate-spin" />
          ) : (
            <MapPin className="h-5 w-5 text-teal dark:text-teal-light" />
          )}
        </Button>
      </div>
    </>
  );
};

export default ClubMap;
