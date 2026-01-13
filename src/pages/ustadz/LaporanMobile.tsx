import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { 
  ArrowLeft, 
  FileText,
  BookOpen,
  Target,
  Award,
  TrendingUp,
  Calendar
} from "lucide-react";

interface LaporanStats {
  totalSetoran: number;
  totalPenilaian: number;
  santriAktif: number;
  rataRata: number;
}

export default function LaporanMobile() {
  const navigate = useNavigate();
  const [periode, setPeriode] = useState("minggu");
  const [filterHalaqoh, setFilterHalaqoh] = useState("all");
  const [halaqohList, setHalaqohList] = useState<{id: string; nama_halaqoh: string}[]>([]);
  const [stats, setStats] = useState<LaporanStats>({
    totalSetoran: 0,
    totalPenilaian: 0,
    santriAktif: 0,
    rataRata: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [halaqohRes, setoranRes, penilaianRes, santriRes] = await Promise.all([
          supabase.from("halaqoh").select("id, nama_halaqoh"),
          supabase.from("setoran").select("*"),
          supabase.from("penilaian").select("*"),
          supabase.from("santri").select("*").eq("status", "aktif")
        ]);

        if (halaqohRes.data) setHalaqohList(halaqohRes.data);
        
        setStats({
          totalSetoran: setoranRes.data?.length || 0,
          totalPenilaian: penilaianRes.data?.length || 0,
          santriAktif: santriRes.data?.length || 0,
          rataRata: 85.5 // Mock value
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const laporanItems = [
    {
      id: "setoran",
      label: "Laporan Setoran",
      description: "Rekap setoran hafalan santri",
      icon: BookOpen,
      color: "from-emerald-400 to-emerald-600",
      count: stats.totalSetoran
    },
    {
      id: "penilaian",
      label: "Laporan Penilaian",
      description: "Rekap nilai drill, tasmi', tahfidz",
      icon: Target,
      color: "from-cyan-400 to-cyan-600",
      count: stats.totalPenilaian
    },
    {
      id: "progress",
      label: "Laporan Progress",
      description: "Progress hafalan per santri",
      icon: TrendingUp,
      color: "from-amber-400 to-amber-600",
      count: stats.santriAktif
    },
    {
      id: "kehadiran",
      label: "Laporan Kehadiran",
      description: "Rekap absensi santri",
      icon: Calendar,
      color: "from-purple-400 to-purple-600",
      count: 0
    }
  ];

  return (
    <MobileLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-400 to-amber-400">
          <div className="px-4 pt-4 pb-14">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>

              <div className="flex-1">
                <h1 className="text-xl font-bold text-white">Laporan</h1>
                <p className="text-sm text-white/80">Rekap data & statistik</p>
              </div>

              <FileText className="w-8 h-8 text-white/60" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="-mt-8 bg-background rounded-t-3xl px-4 pt-6 pb-24 min-h-screen">
          {/* Filters */}
          <div className="flex gap-2 mb-4">
            <Select value={periode} onValueChange={setPeriode}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Periode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hari">Hari Ini</SelectItem>
                <SelectItem value="minggu">Minggu Ini</SelectItem>
                <SelectItem value="bulan">Bulan Ini</SelectItem>
                <SelectItem value="semester">Semester Ini</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterHalaqoh} onValueChange={setFilterHalaqoh}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Halaqoh" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Halaqoh</SelectItem>
                {halaqohList.map((h) => (
                  <SelectItem key={h.id} value={h.id}>{h.nama_halaqoh}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
              <CardContent className="p-3 text-center">
                <p className="text-2xl font-bold text-emerald-700">{stats.totalSetoran}</p>
                <p className="text-xs text-emerald-600">Total Setoran</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
              <CardContent className="p-3 text-center">
                <p className="text-2xl font-bold text-amber-700">{stats.rataRata}</p>
                <p className="text-xs text-amber-600">Rata-rata Nilai</p>
              </CardContent>
            </Card>
          </div>

          {/* Laporan List */}
          <h2 className="font-semibold text-foreground mb-3">Jenis Laporan</h2>

          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : (
            <div className="space-y-3">
              {laporanItems.map((item) => (
                <Card 
                  key={item.id} 
                  className="border border-border/50 cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-md`}>
                        <item.icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{item.label}</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">{item.description}</p>
                      </div>
                      <Badge variant="secondary">{item.count}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}
