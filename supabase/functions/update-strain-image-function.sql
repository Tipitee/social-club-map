
-- Function to update strain image URL
-- This helps prevent TypeScript recursion issues when used from the client
CREATE OR REPLACE FUNCTION public.update_strain_image(strain_id text, image_url text)
RETURNS void AS $$
BEGIN
  UPDATE public.strains
  SET img_url = image_url
  WHERE unique_identifier = strain_id;
END;
$$ LANGUAGE plpgsql;
