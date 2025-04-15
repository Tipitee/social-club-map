
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, ShieldAlert } from "lucide-react";
import GeocodingTool from "@/components/admin/GeocodingTool";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const AdminTools: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth", { replace: true });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linen dark:bg-navy-dark flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-teal rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-linen dark:bg-navy-dark pb-28">
      <Navbar />
      <div className="container px-4 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <ShieldAlert className="h-6 w-6 text-amber-500" />
          <h1 className="text-2xl md:text-3xl font-bold text-navy-dark dark:text-white">
            Admin Tools
          </h1>
        </div>
        
        <Alert className="mb-6 border-amber-500/50 bg-amber-500/10">
          <InfoIcon className="h-4 w-4 text-amber-500" />
          <AlertTitle className="text-amber-600 dark:text-amber-400">Admin Access Only</AlertTitle>
          <AlertDescription className="text-navy-dark/80 dark:text-white/80">
            These tools are intended for administrators to manage application data.
            Please use them with caution as they can make permanent changes to the database.
          </AlertDescription>
        </Alert>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-navy-dark dark:text-white">
              Club Data Enhancement
            </h2>
            <GeocodingTool />
          </div>
          
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4 text-navy-dark dark:text-white">
              Admin Resources
            </h2>
            <div className="bg-white dark:bg-navy-400 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-navy-500">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resource</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Google Maps API</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Connected
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Geocoding Function</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Active
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Logged in as</TableCell>
                    <TableCell className="font-mono text-xs">
                      {user?.email}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTools;
