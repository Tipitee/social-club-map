
import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, RefreshCw, Database } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { testStrainsConnection } from "@/services/strainService";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";

export const ConnectionHealthCheck: React.FC = () => {
  const [status, setStatus] = useState<{
    isLoading: boolean;
    success: boolean | null;
    message: string;
    count?: number;
  }>({
    isLoading: true,
    success: null,
    message: "Checking connection...",
  });

  const checkConnection = async () => {
    setStatus({ ...status, isLoading: true, message: "Checking connection..." });
    try {
      console.log("[DEBUG] Starting connection health check");
      
      // Test raw connection first
      const isConnected = await testRawConnection();
      
      if (!isConnected) {
        setStatus({
          isLoading: false,
          success: false,
          message: "Supabase API connection failed",
          count: 0
        });
        return;
      }
      
      // If basic connection works, test the strains table
      const result = await testStrainsConnection();
      console.log("[DEBUG] Health check result:", result);
      
      setStatus({
        isLoading: false,
        success: result.success,
        message: result.message,
        count: result.count || 0
      });
    } catch (error) {
      console.error("[DEBUG] Health check exception:", error);
      setStatus({
        isLoading: false,
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred",
        count: 0
      });
    }
  };
  
  // Helper function to test raw connection
  const testRawConnection = async (): Promise<boolean> => {
    try {
      // Simple health check to see if we can reach Supabase
      const { error } = await supabase.from('strains').select('name', { count: 'exact', head: true });
      return !error;
    } catch (e) {
      console.error('[DEBUG] Raw connection test failed:', e);
      return false;
    }
  };

  useEffect(() => {
    checkConnection();
    
    // Set up periodic checks in development
    if (import.meta.env.DEV) {
      const interval = setInterval(checkConnection, 60000); // Every minute in dev
      return () => clearInterval(interval);
    }
  }, []);

  const getBadgeColor = () => {
    if (status.isLoading) return "bg-secondary text-secondary-foreground";
    if (!status.success) return "bg-destructive text-destructive-foreground";
    return status.count && status.count > 0 
      ? "bg-green-500 text-white" 
      : "bg-yellow-500 text-white";
  };

  return (
    <TooltipProvider>
      <div className="flex items-center space-x-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${getBadgeColor()} cursor-pointer`}>
              {status.isLoading ? (
                <RefreshCw className="h-3 w-3 animate-spin mr-1" />
              ) : status.success ? (
                <CheckCircle2 className="h-3 w-3 mr-1" />
              ) : (
                <AlertCircle className="h-3 w-3 mr-1" />
              )}
              {status.success 
                ? `DB (${status.count || 0} strain${status.count === 1 ? '' : 's'})` 
                : "DB Connection"}
            </span>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <div className="space-y-2">
              <p className="font-medium">{status.message}</p>
              
              {status.success && status.count === 0 && (
                <p className="text-xs text-amber-300">
                  Connected to database but no strain records found.
                  You may need to add data to the strains table.
                </p>
              )}
              
              {!status.success && (
                <p className="text-xs">
                  Check your Supabase credentials and network connection.
                </p>
              )}
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full mt-2" 
                onClick={checkConnection}
                disabled={status.isLoading}
              >
                {status.isLoading ? (
                  <>Checking... <RefreshCw className="ml-2 h-3 w-3 animate-spin" /></>
                ) : (
                  <>Retry connection <Database className="ml-2 h-3 w-3" /></>
                )}
              </Button>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default ConnectionHealthCheck;
