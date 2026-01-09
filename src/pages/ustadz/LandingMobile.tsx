import { useNavigate } from "react-router-dom";
import { BookOpen, Users, Award, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingMobile() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        {/* Logo/Icon */}
        <div className="w-24 h-24 bg-emerald-50 rounded-3xl flex items-center justify-center mb-6 border border-emerald-100">
          <BookOpen className="w-12 h-12 text-emerald-600" />
        </div>

        {/* App Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tahfiz Hub
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Aplikasi Manajemen Tahfidz
        </p>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mb-10 w-full max-w-sm">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center">
            <Users className="w-7 h-7 text-emerald-600 mx-auto mb-2" />
            <span className="text-xs text-gray-700">Data Santri</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center">
            <BookOpen className="w-7 h-7 text-emerald-600 mx-auto mb-2" />
            <span className="text-xs text-gray-700">Setoran</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center">
            <Award className="w-7 h-7 text-emerald-600 mx-auto mb-2" />
            <span className="text-xs text-gray-700">Penilaian</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm max-w-xs mb-8">
          Kelola hafalan santri dengan mudah. Catat setoran, drill, dan pantau
          progress tahfidz secara real-time.
        </p>
      </div>

      {/* Bottom Section */}
      <div className="px-6 pb-10 space-y-3">
        <Button
          onClick={() => navigate("/auth")}
          className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-semibold rounded-2xl shadow"
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
