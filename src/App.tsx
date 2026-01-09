import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";

// Landing & Auth
import LandingMobile from "./pages/ustadz/LandingMobile";
import AuthUstadz from "./pages/ustadz/AuthUstadz";

// Ustadz Mobile Pages
import DashboardMobile from "./pages/ustadz/DashboardMobile";
import SetoranMobile from "./pages/ustadz/SetoranMobile";
import DrillMobile from "./pages/ustadz/DrillMobile";
import TahfidzMobile from "./pages/ustadz/TahfidzMobile";
import TasmiMobile from "./pages/ustadz/TasmiMobile";
import ProfilMobile from "./pages/ustadz/ProfilMobile";

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
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/setoran" element={<SetoranHafalan />} />
            <Route path="/drill" element={<DrillHafalan />} />
            <Route path="/ujian-tasmi" element={<UjianTasmi />} />
            <Route path="/ujian-tahfidz" element={<UjianTahfidz />} />
            <Route path="/santri" element={<DataSantri />} />
            <Route path="/halaqoh" element={<DataHalaqoh />} />
            <Route path="/kelas" element={<DataKelas />} />
            <Route path="/ustadz" element={<DataUstadz />} />
            <Route path="/users" element={<DataUsers />} />
            {/* Profil & Pengaturan */}
            <Route path="/profil" element={<Profil />} />
            <Route path="/pengaturan" element={<Pengaturan />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            {/* Landing & Auth */}
            <Route path="/" element={<LandingMobile />} />
            <Route path="/auth" element={<AuthUstadz />} />            
            {/* Ustadz Mobile Routes */}
            <Route path="/ustadz" element={<DashboardMobile />} />
            <Route path="/ustadz/setoran" element={<SetoranMobile />} />
            <Route path="/ustadz/drill" element={<DrillMobile />} />
            <Route path="/ustadz/tahfidz" element={<TahfidzMobile />} />
            <Route path="/ustadz/tasmi" element={<TasmiMobile />} />
            <Route path="/ustadz/profil" element={<ProfilMobile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
