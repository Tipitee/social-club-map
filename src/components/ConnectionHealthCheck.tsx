
import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, RefreshCw, Database, Bug } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { testStrainsConnection } from "@/services/strainService";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { fetchRawStrains, getSupabaseInfo } from "@/services/debugStrainService";

export const ConnectionHealthCheck: React.FC = () => {
  const [status, setStatus] = useState<{
    isLoading: boolean;
    success: boolean | null;
    message: string;
    count?: number;
    rawData?: any;
    debugMode: boolean;
  }>({
    isLoading: true,
    success: null,
    message: "Checking connection...",
    debugMode: false
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
          count: 0,
          debugMode: status.debugMode
        });
        return;
      }
      
      // Get raw data for debugging
      const rawResult = await fetchRawStrains();
      
      // If basic connection works, test the strains table
      const result = await testStrainsConnection();
      console.log("[DEBUG] Health check result:", result);
      
      setStatus({
        isLoading: false,
        success: result.success,
        message: result.message,
        count: result.count || 0,
        rawData: rawResult,
        debugMode: status.debugMode
      });
    } catch (error) {
      console.error("[DEBUG] Health check exception:", error);
      setStatus({
        isLoading: false,
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred",
        count: 0,
        debugMode: status.debugMode
      });
    }
  };
  
  // Helper function to test raw connection
  const testRawConnection = async (): Promise<boolean> => {
    try {
      console.log('[DEBUG] Testing raw Supabase connection');
      // Simple health check to see if we can reach Supabase
      const { error } = await supabase.from('strains').select('name', { count: 'exact', head: true });
      
      if (error) {
        console.error('[DEBUG] Raw connection test failed with error:', error);
      } else {
        console.log('[DEBUG] Raw connection test succeeded');
      }
      
      return !error;
    } catch (e) {
      console.error('[DEBUG] Raw connection test failed with exception:', e);
      return false;
    }
  };
  
  // Toggle debug mode
  const toggleDebugMode = () => {
    setStatus(prev => ({
      ...prev,
      debugMode: !prev.debugMode
    }));
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
    if (status.isLoading) return "loading";
    if (!status.success) return "error";
    return status.count && status.count > 0 ? "success" : "warning";
  };

  return (
    <div className="flex items-center space-x-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-pointer">
            <Badge variant={getBadgeColor()}>
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
            </Badge>
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
            
            {status.debugMode && (
              <div className="mt-2 space-y-1 text-xs">
                <p className="font-semibold">Debug Info:</p>
                <p>Connection Config: Present</p>
                <p>Auth Status: {supabase.auth ? 'Initialized' : 'Not initialized'}</p>
                <p>Raw Data: {status.rawData?.success ? `Found ${status.rawData.data?.length || 0} records` : 'No raw data'}</p>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex-1" 
                onClick={checkConnection}
                disabled={status.isLoading}
              >
                {status.isLoading ? (
                  <>Checking... <RefreshCw className="ml-2 h-3 w-3 animate-spin" /></>
                ) : (
                  <>Retry <Database className="ml-2 h-3 w-3" /></>
                )}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={toggleDebugMode}
                className="flex-none"
              >
                <Bug className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default ConnectionHealthCheck;
