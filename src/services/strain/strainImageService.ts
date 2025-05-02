
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

/**
 * Generates an image for a strain using the OpenAI API
 * @param strainId The ID of the strain
 * @param strainName The name of the strain
 */
export async function generateStrainImage(strainId: string, strainName: string): Promise<string | null> {
  try {
    // Step 1: Generate the image using our edge function
    const { data: generatedImage, error: genError } = await supabase.functions.invoke("generate-strain-image", {
      body: { strainId, strainName }
    });

    if (genError || !generatedImage || generatedImage.error) {
      console.error("Error generating strain image:", genError || generatedImage?.error);
      throw new Error(genError?.message || generatedImage?.error || "Failed to generate image");
    }

    // Step 2: Convert base64 to Blob
    const base64Data = generatedImage.image.split(',')[1];
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays.push(byteCharacters.charCodeAt(i));
    }
    
    const byteArray = new Uint8Array(byteArrays);
    const blob = new Blob([byteArray], { type: 'image/png' });

    // Step 3: Upload the image to Supabase Storage
    const fileName = `${strainId}.png`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('strain-images')
      .upload(fileName, blob, {
        contentType: 'image/png',
        upsert: true
      });

    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    // Step 4: Get the public URL for the uploaded image
    // Using a more direct approach to avoid type recursion issues
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://zvcqcgihydjscvrltkvz.supabase.co";
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/strain-images/${fileName}`;
    
    console.log("Generated public URL:", publicUrl);

    // Step 5: Update the strain record with the new image URL
    const { error: updateError } = await supabase
      .from('strains')
      .update({ img_url: publicUrl })
      .eq('id', strainId);

    if (updateError) {
      console.error("Error updating strain record:", updateError);
      throw new Error(`Failed to update strain record: ${updateError.message}`);
    }

    return publicUrl;
  } catch (error) {
    console.error("Error in generateStrainImage:", error);
    toast({
      title: "Image Generation Failed",
      description: "We couldn't generate the image at this time. Showing default strain image instead.",
      variant: "destructive",
      duration: 5000
    });
    return null;
  }
}
