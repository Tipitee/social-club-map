
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
    
    // Using a satellite style map with more modern look
    const mapStyle = "https://api.maptiler.com/maps/hybrid/style.json?key=get_your_own_OpIi9ZULNHzrESv6T6JL";
    
    // If this is a single club detail view and we have coordinates
    if (club && club.latitude && club.longitude) {
      const initMap = () => {
        if (map.current) return; // Already initialized
        
        try {
          // Initialize map centered on the club
          map.current = new maplibregl.Map({
            container: mapContainer.current!,
            style: mapStyle,
            center: [club.longitude, club.latitude],
            zoom: 15
          });
          
          // Add controls
          map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
          
          // Add marker for the club with improved styling
          const markerElement = document.createElement('div');
          markerElement.className = 'flex items-center justify-center w-8 h-8 bg-teal rounded-full shadow-lg border-2 border-white';
          markerElement.innerHTML = `<div class="w-3 h-3 bg-white rounded-full"></div>`;
          
          const marker = new maplibregl.Marker({ element: markerElement })
            .setLngLat([club.longitude, club.latitude])
            .addTo(map.current);
          
          // Add popup with club details
          const popup = new maplibregl.Popup({ 
            offset: 25, 
            closeButton: false,
            className: 'club-popup',
            maxWidth: '300px'
          })
            .setHTML(
              `<div class="p-2">
                <div class="font-medium text-navy-dark">${club.name}</div>
                <div class="text-sm text-gray-700">${club.address || ''}</div>
              </div>`
            );
          
          marker.setPopup(popup);
          
          // Add error handling for the map
          map.current.on('error', (e) => {
            console.error('Map error:', e);
          });
        } catch (err) {
          console.error("Error initializing map:", err);
        }
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
        
        try {
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
            
            // Create custom marker element with improved styling
            const el = document.createElement('div');
            el.className = 'club-marker flex items-center justify-center w-7 h-7 bg-teal rounded-full cursor-pointer shadow-lg border-2 border-white';
            el.innerHTML = `<div class="w-2 h-2 bg-white rounded-full"></div>`;
            
            // Create marker
            const marker = new maplibregl.Marker({ element: el })
              .setLngLat([club.longitude, club.latitude])
              .addTo(map.current!);
            
            // Add popup with club details and navigation link
            const popup = new maplibregl.Popup({ 
              offset: 25, 
              closeButton: false,
              className: 'club-popup',
              maxWidth: '300px'
            })
              .setHTML(`
                <div class="p-2">
                  <div class="font-medium text-navy-dark">${club.name}</div>
                  <div class="text-sm text-gray-600">${club.address || ''}</div>
                  <div class="text-teal text-sm mt-1 cursor-pointer club-link" 
                       data-club-id="${encodeURIComponent(club.name)}">
                    View details
                  </div>
                </div>
              `);
            
            marker.setPopup(popup);
            
            // Extend bounds
            bounds.extend([club.longitude, club.latitude]);
            
            // Add click handler to marker for navigation
            el.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate(`/clubs/${encodeURIComponent(club.name)}`, { 
                state: { fromSearch: true } 
              });
            });
          });
          
          // Once map is loaded, fit bounds with padding
          map.current.on('load', () => {
            if (map.current && validClubs.length > 0) {
              map.current.fitBounds(bounds, {
                padding: { top: 50, bottom: 50, left: 50, right: 50 },
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
          
          // Add error handling
          map.current.on('error', (e) => {
            console.error('Map error:', e);
          });
          
        } catch (err) {
          console.error("Error initializing map:", err);
          initializeDefaultMap();
        }
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
      try {
        map.current = new maplibregl.Map({
          container: mapContainer.current!,
          style: mapStyle,
          center: [10.45, 51.16], // Center of Germany
          zoom: 5
        });
        
        // Add controls
        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
        
        // Add error handling
        map.current.on('error', (e) => {
          console.error('Map error:', e);
        });
      } catch (err) {
        console.error("Error initializing default map:", err);
        // Add fallback display when map fails completely
        if (mapContainer.current) {
          mapContainer.current.innerHTML = `
            <div class="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-navy-400 rounded-lg">
              <div class="text-center p-4">
                <p class="text-navy-dark dark:text-white">Map could not be loaded.</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Please try again later.</p>
              </div>
            </div>
          `;
        }
      }
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
