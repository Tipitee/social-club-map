
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { ClubResult } from "@/types/club";

interface ClubMapProps {
  club?: ClubResult;
  allClubs?: ClubResult[];
}

const ClubMap: React.FC<ClubMapProps> = ({ club, allClubs }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!mapContainer.current) return;
    
    // Using a free and reliable MapTiler style that doesn't require an API key
    const mapStyle = "https://demotiles.maplibre.org/style.json";
    
    // If this is a single club detail view and we have coordinates
    if (club && club.latitude && club.longitude) {
      const initMap = () => {
        if (map.current) return; // Already initialized
        
        // Initialize map centered on the club
        map.current = new maplibregl.Map({
          container: mapContainer.current!,
          style: mapStyle,
          center: [club.longitude, club.latitude],
          zoom: 15
        });
        
        // Add controls
        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
        
        // Add marker for the club
        const marker = new maplibregl.Marker({ color: "#2a9d90" })
          .setLngLat([club.longitude, club.latitude])
          .addTo(map.current);
        
        // Add popup with club details
        const popup = new maplibregl.Popup({ offset: 25, closeButton: false })
          .setHTML(`<div class="font-medium">${club.name}</div>${club.address || ''}`);
        
        marker.setPopup(popup);
      };
      
      initMap();
      
      return () => {
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      };
    }
    // If this is the clubs list view and we have multiple clubs
    else if (allClubs && allClubs.length > 0) {
      const initMap = () => {
        if (map.current) return; // Already initialized
        
        // Find the valid clubs with coordinates
        const validClubs = allClubs.filter(c => c.latitude && c.longitude);
        
        if (validClubs.length === 0) {
          // Default center if no clubs have coordinates - show Germany
          initializeDefaultMap();
          return;
        }
        
        // Initialize map
        map.current = new maplibregl.Map({
          container: mapContainer.current!,
          style: mapStyle,
          center: [10.45, 51.16], // Center of Germany
          zoom: 5
        });
        
        // Add controls
        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
        
        // Create bounds object to fit all markers
        const bounds = new maplibregl.LngLatBounds();
        
        // Add all club markers
        validClubs.forEach(club => {
          if (!club.latitude || !club.longitude) return;
          
          // Create custom marker element
          const el = document.createElement('div');
          el.className = 'club-marker';
          el.style.backgroundColor = '#2a9d90';
          el.style.width = '20px';
          el.style.height = '20px';
          el.style.borderRadius = '50%';
          el.style.cursor = 'pointer';
          el.style.border = '2px solid white';
          
          // Create marker
          const marker = new maplibregl.Marker(el)
            .setLngLat([club.longitude, club.latitude])
            .addTo(map.current!);
          
          // Add popup with club details and navigation link
          const popup = new maplibregl.Popup({ offset: 25, closeButton: false })
            .setHTML(`
              <div class="font-medium">${club.name}</div>
              <div>${club.address || ''}</div>
              <div class="text-teal text-sm cursor-pointer club-link" 
                   data-club-id="${encodeURIComponent(club.name)}">
                View details
              </div>
            `);
          
          marker.setPopup(popup);
          
          // Extend bounds
          bounds.extend([club.longitude, club.latitude]);
          
          // Add click handler to marker for navigation
          marker.getElement().addEventListener('click', () => {
            navigate(`/clubs/${encodeURIComponent(club.name)}`, { state: { fromSearch: true } });
          });
        });
        
        // Once map is loaded, fit bounds with padding
        map.current.on('load', () => {
          if (map.current && validClubs.length > 0) {
            map.current.fitBounds(bounds, {
              padding: 50,
              maxZoom: 12
            });
            
            // Add click handler for popup links
            map.current.on('click', () => {
              setTimeout(() => {
                const links = document.getElementsByClassName('club-link');
                for (let i = 0; i < links.length; i++) {
                  links[i].addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    const clubId = (event.target as HTMLElement).getAttribute('data-club-id');
                    if (clubId) {
                      navigate(`/clubs/${clubId}`, { state: { fromSearch: true } });
                    }
                  });
                }
              }, 100);
            });
          }
        });
      };
      
      initMap();
      
      return () => {
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      };
    }
    // Fallback for when we have no coordinates - show default map of Germany
    else {
      initializeDefaultMap();
      
      return () => {
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      };
    }
    
    // Helper function to initialize default map of Germany
    function initializeDefaultMap() {
      map.current = new maplibregl.Map({
        container: mapContainer.current!,
        style: mapStyle,
        center: [10.45, 51.16], // Center of Germany
        zoom: 5
      });
      
      // Add controls
      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    }
  }, [club, allClubs, navigate]);

  // Return proper component with required height
  return (
    <div className="w-full h-full rounded-lg overflow-hidden shadow-lg border border-navy-DEFAULT dark:border-navy-light">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default ClubMap;
