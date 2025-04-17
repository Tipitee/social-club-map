
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { ClubResult } from "@/types/club";

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
  );
};

export default ClubMap;
