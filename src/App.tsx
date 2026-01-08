import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { TahfidzProvider } from "@/contexts/TahfidzContext";
import { SidebarProvider } from "@/contexts/SidebarContext";

// Pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Santri from "./pages/Santri";
import Absensi from "./pages/Absensi";
import Laporan from "./pages/Laporan";
import Users from "./pages/Users";
import UjianTahapan from "./pages/UjianTahapan";
import Logs from "./pages/Logs";
import Profile from "./pages/Profile";
import SantriProgress from "./pages/SantriProgress";
import SantriAbsensi from "./pages/SantriAbsensi";
import SantriTasmi from "./pages/SantriTasmi";
import SantriRapor from "./pages/SantriRapor";
import SantriPengumuman from "./pages/SantriPengumuman";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TahfidzProvider>
        <SidebarProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                
                {/* Admin/Asatidz Routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/santri" element={<Santri />} />
                <Route path="/absensi" element={<Absensi />} />
                <Route path="/ujian" element={<UjianTahapan />} />
                <Route path="/laporan" element={<Laporan />} />
                <Route path="/users" element={<Users />} />
                <Route path="/logs" element={<Logs />} />
                <Route path="/profile" element={<Profile />} />
                
                {/* Santri/Wali Routes */}
                <Route path="/santri-progress" element={<SantriProgress />} />
                <Route path="/santri-absensi" element={<SantriAbsensi />} />
                <Route path="/santri-tasmi" element={<SantriTasmi />} />
                <Route path="/santri-rapor" element={<SantriRapor />} />
                <Route path="/santri-pengumuman" element={<SantriPengumuman />} />
                
                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </SidebarProvider>
      </TahfidzProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;