
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const GeocodingTool: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runGeocoding = async () => {
    setIsProcessing(true);
    try {
      // Call the Supabase Edge Function to run the geocoding process
      const response = await fetch('https://zvcqcgihydjscvrltkvz.supabase.co/functions/v1/geocode-clubs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setResults(data);
      
      toast({
        title: "Geocoding Complete",
        description: `Successfully processed ${data.results?.success || 0} clubs`,
      });
    } catch (error) {
      console.error('Error running geocoding:', error);
      toast({
        title: "Geocoding Error",
        description: error instanceof Error ? error.message : 'Failed to run geocoding',
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Club Geocoding Tool</CardTitle>
        <CardDescription>
          Run this tool to enhance club data with accurate location information using Google Maps API.
          This process will update address, city, postal code, district, latitude, and longitude fields.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p>Processing clubs... This may take a few minutes.</p>
          </div>
        ) : results ? (
          <div className="space-y-4">
            <div className="flex justify-between p-4 bg-muted rounded-md">
              <span>Successful updates:</span>
              <span className="font-bold">{results.results.success}</span>
            </div>
            <div className="flex justify-between p-4 bg-muted rounded-md">
              <span>Failed updates:</span>
              <span className="font-bold">{results.results.failed}</span>
            </div>
            {results.results.details && results.results.details.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Processing Details:</h4>
                <div className="max-h-60 overflow-y-auto border rounded-md">
                  {results.results.details.map((detail: any, index: number) => (
                    <div 
                      key={index}
                      className={`p-2 text-sm ${index % 2 === 0 ? 'bg-muted/50' : ''} ${
                        detail.error ? 'text-destructive' : 'text-green-600'
                      }`}
                    >
                      <strong>{detail.clubName}</strong>: {detail.error || 'Successfully updated'}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            Click the button below to start the geocoding process.
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={runGeocoding} 
          disabled={isProcessing}
          className="w-full"
        >
          {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isProcessing ? 'Processing...' : 'Run Geocoding Process'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GeocodingTool;
