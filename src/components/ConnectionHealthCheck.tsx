
import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { testStrainsConnection } from "@/services/strainService";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
      });
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <TooltipProvider>
      <div className="flex items-center space-x-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
              status.success 
                ? "border-transparent bg-green-500 text-white hover:bg-green-600" 
                : status.success === false 
                  ? "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80"
                  : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
            } cursor-pointer`}>
              {status.isLoading ? (
                <RefreshCw className="h-3 w-3 animate-spin mr-1" />
              ) : status.success ? (
                <CheckCircle2 className="h-3 w-3 mr-1" />
              ) : (
                <AlertCircle className="h-3 w-3 mr-1" />
              )}
              {status.success 
                ? `DB (${status.count || 0} strains)` 
                : "DB Connection"}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{status.message}</p>
            {!status.isLoading && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full mt-2" 
                onClick={checkConnection}
              >
                Retry connection
              </Button>
            )}
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default ConnectionHealthCheck;
