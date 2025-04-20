import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import { Suspense, lazy, useEffect } from "react";
import { Capacitor } from "@capacitor/core";

// Eager loading critical routes
import StrainExplorer from "./pages/StrainExplorer";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import News from "./pages/News"; // Directly import News to avoid dynamic import issues

// Lazy load non-critical routes for performance optimization
const StrainDetail = lazy(() => import("./pages/StrainDetail"));
const ClubMap = lazy(() => import("./pages/ClubMap"));
const ClubDetail = lazy(() => import("./pages/ClubDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Journal = lazy(() => import("./pages/Journal"));
const Settings = lazy(() => import("./pages/Settings"));
const Profile = lazy(() => import("./pages/Profile"));
const CannabisGuide = lazy(() => import("./pages/CannabisGuide"));
const AdminTools = lazy(() => import("./pages/AdminTools"));
const BottomNav = lazy(() => import("./components/BottomNav"));
const Navbar = lazy(() => import("./components/Navbar"));

// Loading fallback component
const PageLoading = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="animate-spin h-10 w-10 border-4 border-primary rounded-full border-t-transparent"></div>
  </div>
);

// Configure React Query client with optimized settings for production
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  // Set up proper viewport meta for iOS
  useEffect(() => {
    if (Capacitor.getPlatform() === 'ios') {
      // Update viewport meta tag for iOS
      const existingMeta = document.querySelector('meta[name="viewport"]');
      if (existingMeta) {
        existingMeta.remove();
      }
      
      // Create new viewport meta with safe-area viewport fit
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no';
      document.head.appendChild(meta);
      
      // Add specific iOS styling
      document.documentElement.classList.add('ios-device');
      document.documentElement.setAttribute('data-platform', 'ios');
      
      // Add iOS status bar color
      const statusBarMeta = document.createElement('meta');
      statusBarMeta.name = 'apple-mobile-web-app-status-bar-style';
      statusBarMeta.content = 'black-translucent';
      document.head.appendChild(statusBarMeta);
      
      console.log("iOS viewport meta configured for safe area");
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <LanguageProvider>
          <ThemeProvider defaultTheme="system" storageKey="ui-theme">
            <AuthProvider>
              <TooltipProvider>
                <div className="min-h-screen bg-background text-foreground">
                  <Suspense fallback={null}>
                    <Navbar />
                  </Suspense>
                  
                  <main>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/strains" element={<StrainExplorer />} />
                      <Route 
                        path="/strains/:id" 
                        element={
                          <Suspense fallback={<PageLoading />}>
                            <StrainDetail />
                          </Suspense>
                        } 
                      />
                      <Route 
                        path="/clubs" 
                        element={
                          <Suspense fallback={<PageLoading />}>
                            <ClubMap />
                          </Suspense>
                        } 
                      />
                      <Route 
                        path="/clubs/:id" 
                        element={
                          <Suspense fallback={<PageLoading />}>
                            <ClubDetail />
                          </Suspense>
                        } 
                      />
                      <Route 
                        path="/journal" 
                        element={
                          <Suspense fallback={<PageLoading />}>
                            <Journal />
                          </Suspense>
                        } 
                      />
                      {/* Load the News component directly without lazy loading to fix the import issue */}
                      <Route path="/news" element={<News />} />
                      <Route 
                        path="/guide" 
                        element={
                          <Suspense fallback={<PageLoading />}>
                            <CannabisGuide />
                          </Suspense>
                        } 
                      />
                      <Route 
                        path="/profile" 
                        element={
                          <Suspense fallback={<PageLoading />}>
                            <Profile />
                          </Suspense>
                        } 
                      />
                      <Route 
                        path="/settings" 
                        element={
                          <Suspense fallback={<PageLoading />}>
                            <Settings />
                          </Suspense>
                        } 
                      />
                      <Route path="/auth" element={<Auth />} />
                      <Route 
                        path="/admin-tools" 
                        element={
                          <Suspense fallback={<PageLoading />}>
                            <AdminTools />
                          </Suspense>
                        } 
                      />
                      <Route path="/admin" element={<Navigate to="/admin-tools" replace />} />
                      <Route 
                        path="*" 
                        element={
                          <Suspense fallback={<PageLoading />}>
                            <NotFound />
                          </Suspense>
                        } 
                      />
                    </Routes>
                  </main>
                  
                  {/* Bottom Navigation Bar - visible on all pages except Auth */}
                  <Routes>
                    <Route path="/auth" element={null} />
                    <Route path="*" element={
                      <Suspense fallback={null}>
                        <BottomNav />
                      </Suspense>
                    } />
                  </Routes>
                </div>
                <Toaster />
                <Sonner />
              </TooltipProvider>
            </AuthProvider>
          </ThemeProvider>
        </LanguageProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
