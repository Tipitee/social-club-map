
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
    setStatus({ ...status, isLoading: true });
    try {
      const result = await testStrainsConnection();
      setStatus({
        isLoading: false,
        success: result.success,
        message: result.message,
        count: result.count
      });
    } catch (error) {
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
            <Badge 
              variant={status.success ? "success" : status.success === false ? "destructive" : "secondary"}
              className="cursor-pointer"
            >
              {status.isLoading ? (
                <RefreshCw className="h-3 w-3 animate-spin mr-1" />
              ) : status.success ? (
                <CheckCircle2 className="h-3 w-3 mr-1" />
              ) : (
                <AlertCircle className="h-3 w-3 mr-1" />
              )}
              {status.success ? `DB (${status.count} strains)` : "DB Connection"}
            </Badge>
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
