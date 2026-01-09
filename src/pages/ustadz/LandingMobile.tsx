import { useNavigate } from "react-router-dom";
import { BookOpen, Users, Award, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingMobile() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col bg-white overflow-hidden">

      {/* Rounded Gradient Accent */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 
        w-[420px] h-[420px] rounded-full 
        bg-gradient-to-br from-lime-200/40 via-emerald-200/30 to-transparent 
        blur-3xl"
      />

      {/* Hero Section */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        {/* Logo */}
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-6 border border-emerald-100 shadow-sm">
          <BookOpen className="w-12 h-12 text-emerald-600" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tahfiz Hub
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Aplikasi Manajemen Tahfidz
        </p>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mb-10 w-full max-w-sm">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center shadow-sm">
            <Users className="w-7 h-7 text-emerald-600 mx-auto mb-2" />
            <span className="text-xs text-gray-700">Data Santri</span>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center shadow-sm">
            <BookOpen className="w-7 h-7 text-emerald-600 mx-auto mb-2" />
            <span className="text-xs text-gray-700">Setoran</span>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center shadow-sm">
            <Award className="w-7 h-7 text-emerald-600 mx-auto mb-2" />
            <span className="text-xs text-gray-700">Penilaian</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm max-w-xs">
          Kelola hafalan santri dengan mudah. Catat setoran, drill, dan pantau
          progress tahfidz secara real-time.
        </p>
      </div>

      {/* Bottom Section */}
      <div className="relative z-10 px-6 pb-10 space-y-3">
        <Button
          onClick={() => navigate("/auth")}
          className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-semibold rounded-2xl shadow-md"
        >
          Masuk
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>

        <p className="text-center text-gray-400 text-xs">
          Versi 1.0.0 • Tahfiz Management System
        </p>
      </div>
    </div>
  );
}
