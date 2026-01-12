import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";

import LandingMobile from "./pages/ustadz/LandingMobile";
import AuthUstadz from "./pages/ustadz/AuthUstadz";
import DashboardMobile from "./pages/ustadz/DashboardMobile";
import SetoranMobile from "./pages/ustadz/SetoranMobile";
import DrillMobile from "./pages/ustadz/DrillMobile";
import TahfidzMobile from "./pages/ustadz/TahfidzMobile";
import TasmiMobile from "./pages/ustadz/TasmiMobile";
import ProfilMobile from "./pages/ustadz/ProfilMobile";
import PenilaianMobile from "./pages/ustadz/PenilaianMobile";
import ProgressMobile from "./pages/ustadz/ProgressMobile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Mobile Landing & Auth */}
            <Route path="/" element={<LandingMobile />} />
            <Route path="/auth" element={<AuthUstadz />} />

            {/* Ustadz Mobile */}
            <Route path="/ustadz" element={<DashboardMobile />} />
            <Route path="/ustadz/setoran" element={<SetoranMobile />} />
            <Route path="/ustadz/drill" element={<DrillMobile />} />
            <Route path="/ustadz/tahfidz" element={<TahfidzMobile />} />
            <Route path="/ustadz/tasmi" element={<TasmiMobile />} />
            <Route path="/ustadz/profil" element={<ProfilMobile />} />
            <Route path="/ustadz/penilaian" element={<PenilaianMobile />} />
            <Route path="/ustadz/progress" element={<ProgressMobile />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
