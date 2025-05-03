
import React from "react";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { generateStrainImage } from "@/services/strain/strainImageService";
import { toast } from "@/hooks/use-toast";

interface StrainItem {
  name: string;
  thc: string;
  cbd: string;
  type: string;
  id?: string;
  img_url?: string;
}

interface ClubStrainsProps {
  strains: StrainItem[];
}

const ClubStrains: React.FC<ClubStrainsProps> = ({ strains }) => {
  const [generatingImageFor, setGeneratingImageFor] = React.useState<string | null>(null);

  if (!strains || strains.length === 0) {
    return (
      <div className="text-center py-8">
        <Loader2 className="h-8 w-8 mx-auto mb-4 text-muted-foreground animate-spin" />
        <p className="text-muted-foreground">Loading strain information...</p>
      </div>
    );
  }

  const handleGenerateImage = async (strain: StrainItem) => {
    if (!strain.id) {
      toast({
        title: "Error",
        description: "Cannot generate image: strain ID is missing",
        variant: "destructive"
      });
      return;
    }
    
    setGeneratingImageFor(strain.id);
    try {
      await generateStrainImage(strain.id, strain.name);
      toast({
        title: "Success",
        description: `Image generated for ${strain.name}`,
        duration: 3000
      });
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setGeneratingImageFor(null);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4 text-card-foreground">Available Strains</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {strains.map((strain, index) => (
          <div 
            key={index} 
            className="border border-border rounded-lg overflow-hidden shadow-sm bg-card"
          >
            <div 
              className={`p-3 text-white font-medium ${
                strain.type === 'Indica' ? 'bg-strain-indica' : 
                strain.type === 'Sativa' ? 'bg-strain-sativa' : 
                'bg-strain-hybrid'
              }`}
            >
              {strain.name} - {strain.type}
            </div>
            
            <div className="p-4">
              {strain.id && !strain.img_url && (
                <div className="flex justify-end mb-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleGenerateImage(strain)}
                    disabled={generatingImageFor === strain.id}
                    className="flex items-center gap-1 text-xs"
                  >
                    {generatingImageFor === strain.id ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-3 w-3" />
                        <span>Generate Image</span>
                      </>
                    )}
                  </Button>
                </div>
              )}
              
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">THC:</span>
                <span className="text-sm font-medium text-card-foreground">{strain.thc}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">CBD:</span>
                <span className="text-sm font-medium text-card-foreground">{strain.cbd}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClubStrains;
