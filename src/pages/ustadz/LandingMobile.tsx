import { useNavigate } from "react-router-dom";
import { BookOpen, Users, Award, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingMobile() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col bg-background overflow-hidden">
      {/* Soft Gradient Background */}
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 
        w-[500px] h-[500px] rounded-full 
        bg-gradient-to-br from-primary/20 via-primary/10 to-transparent 
        blur-3xl pointer-events-none"
      />
      <div
        className="absolute bottom-0 right-0 
        w-[300px] h-[300px] rounded-full 
        bg-gradient-to-tl from-secondary/15 via-transparent to-transparent 
        blur-2xl pointer-events-none"
      />

      {/* Hero Section */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        {/* Logo */}
        <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/25">
          <BookOpen className="w-10 h-10 text-primary-foreground" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Tahfiz Hub
        </h1>
        <p className="text-muted-foreground text-base mb-10">
          Aplikasi Manajemen Tahfidz
        </p>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mb-10 w-full max-w-xs">
          <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground font-medium">Data Santri</span>
          </div>

          <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground font-medium">Setoran</span>
          </div>

          <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground font-medium">Penilaian</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
          Kelola hafalan santri dengan mudah. Catat setoran, drill, dan pantau
          progress tahfidz secara real-time.
        </p>
      </div>

      {/* Bottom Section */}
      <div className="relative z-10 px-6 pb-10 space-y-4">
        <Button
          onClick={() => navigate("/auth")}
          className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground text-base font-semibold rounded-2xl shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
        >
          Masuk
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>

        <p className="text-center text-muted-foreground text-xs">
          Versi 1.0.0 • Tahfiz Hub
        </p>
      </div>
    </div>
  );
}
