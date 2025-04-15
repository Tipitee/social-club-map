
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, MapPin, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

const GeocodingTool: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const runGeocoding = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      console.log('Starting geocoding process');
      // Call the Supabase Edge Function to run the geocoding process
      const response = await fetch('https://zvcqcgihydjscvrltkvz.supabase.co/functions/v1/geocode-clubs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Geocoding error response:', errorData);
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Geocoding completed successfully:', data);
      setResults(data);
      
      toast({
        title: "Geocoding Complete",
        description: `Successfully processed ${data.results?.success || 0} clubs`,
      });
    } catch (error) {
      console.error('Error running geocoding:', error);
      setError(error instanceof Error ? error.message : 'Failed to run geocoding');
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
    <Card className="w-full shadow-md border-gray-200 dark:border-navy-500">
      <CardHeader className="bg-gradient-to-r from-teal-50 to-teal-100/30 dark:from-navy-500 dark:to-navy-400 rounded-t-lg border-b border-gray-200 dark:border-navy-500">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-teal dark:text-teal-light" />
          <CardTitle>Club Geocoding Tool</CardTitle>
        </div>
        <CardDescription className="text-navy-dark/70 dark:text-white/70">
          Run this tool to enhance club data with accurate location information using Google Maps API.
          This process will update address, city, postal code, district, latitude, and longitude fields.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p>Processing clubs... This may take a few minutes.</p>
          </div>
        ) : results ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-100 dark:border-green-800">
                <div className="text-sm text-muted-foreground">Successful updates</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{results.results.success}</div>
              </div>
              
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-100 dark:border-red-800">
                <div className="text-sm text-muted-foreground">Failed updates</div>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{results.results.failed}</div>
              </div>
            </div>
            
            {results.results.details && results.results.details.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Processing Details:</h4>
                <div className="max-h-60 overflow-y-auto border rounded-md">
                  {results.results.details.map((detail: any, index: number) => (
                    <div 
                      key={index}
                      className={`p-2 text-sm ${index % 2 === 0 ? 'bg-muted/50' : ''} ${
                        detail.error ? 'text-destructive' : 'text-green-600 dark:text-green-400'
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
            <MapPin className="mx-auto h-12 w-12 text-muted-foreground/50 mb-2" />
            Click the button below to start the geocoding process.
            <p className="mt-2 text-sm">This will enhance club data with location information.</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t border-gray-200 dark:border-navy-500 bg-gray-50/50 dark:bg-navy-dark/50 rounded-b-lg pt-4">
        <Button 
          onClick={runGeocoding} 
          disabled={isProcessing}
          className="w-full bg-teal hover:bg-teal-dark text-white"
        >
          {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isProcessing ? 'Processing...' : results ? 'Run Again' : 'Run Geocoding Process'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GeocodingTool;
