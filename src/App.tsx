
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import StrainExplorer from "./pages/StrainExplorer";
import StrainDetail from "./pages/StrainDetail";
import ClubMap from "./pages/ClubMap";
import NotFound from "./pages/NotFound";
import Journal from "./pages/Journal";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import LegalUpdates from "./pages/LegalUpdates";
import CannabisGuide from "./pages/CannabisGuide";
import OfflineAccess from "./pages/OfflineAccess";
import BottomNav from "./components/BottomNav";
import "./i18n";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <BrowserRouter>
          <TooltipProvider>
            <div className="min-h-screen bg-[#121212] text-white">
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/strains" element={<StrainExplorer />} />
                  <Route path="/strains/:id" element={<StrainDetail />} />
                  <Route path="/clubs" element={<ClubMap />} />
                  <Route path="/journal" element={<Journal />} />
                  <Route path="/legal" element={<LegalUpdates />} />
                  <Route path="/guide" element={<CannabisGuide />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/profile/offline" element={<OfflineAccess />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <BottomNav />
            </div>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </BrowserRouter>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
