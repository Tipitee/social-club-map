
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('GOOGLE_MAPS_API_KEY');
    if (!apiKey) {
      throw new Error('Missing Google Maps API key');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase credentials');
    }

    // Initialize Supabase client with service role key for admin access
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get all clubs with missing location data but have descriptions
    const { data: clubs, error: fetchError } = await supabase
      .from('clubs')
      .select('*')
      .or('latitude.is.null,longitude.is.null')
      .not('description', 'is', null);
    
    if (fetchError) {
      throw new Error(`Error fetching clubs: ${fetchError.message}`);
    }
    
    console.log(`Found ${clubs?.length || 0} clubs that need geocoding`);
    
    const results = {
      success: 0,
      failed: 0,
      details: []
    };
    
    // Process each club
    if (clubs && clubs.length > 0) {
      for (const club of clubs) {
        try {
          // Prepare the search text: use various fields to maximize chances of finding a match
          let searchText = club.name || '';
          
          if (club.description) {
            // Look for address-like information in the description
            searchText += ', ' + club.description;
          }
          
          if (club.address) {
            searchText += ', ' + club.address;
          }
          
          if (club.city) {
            searchText += ', ' + club.city;
          }
          
          if (club.postal_code) {
            searchText += ', ' + club.postal_code;
          }
          
          if (club.district) {
            searchText += ', ' + club.district;
          }
          
          // Add "Germany" to improve geocoding accuracy
          if (!searchText.toLowerCase().includes('germany')) {
            searchText += ', Germany';
          }
          
          console.log(`Geocoding club "${club.name}" with search text: ${searchText}`);
          
          // Call Google Maps Geocoding API
          const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchText)}&key=${apiKey}`;
          const geocodeResponse = await fetch(geocodeUrl);
          const geocodeData = await geocodeResponse.json();
          
          if (geocodeData.status === 'OK' && geocodeData.results && geocodeData.results.length > 0) {
            const result = geocodeData.results[0];
            const location = result.geometry.location;
            const addressComponents = result.address_components;
            
            // Extract components from the geocoding result
            let updatedAddress = result.formatted_address || '';
            let updatedCity = '';
            let updatedPostalCode = '';
            let updatedDistrict = '';
            
            for (const component of addressComponents) {
              if (component.types.includes('locality')) {
                updatedCity = component.long_name;
              } else if (component.types.includes('postal_code')) {
                updatedPostalCode = component.long_name;
              } else if (component.types.includes('sublocality') || component.types.includes('sublocality_level_1')) {
                updatedDistrict = component.long_name;
              }
            }
            
            // Update the club record
            const { error: updateError } = await supabase
              .from('clubs')
              .update({
                latitude: location.lat,
                longitude: location.lng,
                address: updatedAddress || club.address,
                city: updatedCity || club.city,
                postal_code: updatedPostalCode || club.postal_code,
                district: updatedDistrict || club.district
              })
              .eq('name', club.name);
            
            if (updateError) {
              console.error(`Error updating club "${club.name}": ${updateError.message}`);
              results.failed++;
              results.details.push({
                clubName: club.name,
                error: updateError.message
              });
            } else {
              console.log(`Successfully updated club "${club.name}" with geocoded data`);
              results.success++;
              results.details.push({
                clubName: club.name,
                status: 'success',
                latitude: location.lat,
                longitude: location.lng
              });
            }
          } else {
            console.error(`Geocoding failed for club "${club.name}": ${geocodeData.status}`);
            results.failed++;
            results.details.push({
              clubName: club.name,
              error: `Geocoding failed: ${geocodeData.status}`
            });
          }
          
          // Add a small delay to avoid hitting API rate limits
          await new Promise(resolve => setTimeout(resolve, 200));
          
        } catch (error) {
          console.error(`Error processing club "${club.name}": ${error.message}`);
          results.failed++;
          results.details.push({
            clubName: club.name,
            error: error.message
          });
        }
      }
    }
    
    return new Response(
      JSON.stringify({
        status: 'completed',
        results
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
    
  } catch (error) {
    console.error('Error in geocode-clubs function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
