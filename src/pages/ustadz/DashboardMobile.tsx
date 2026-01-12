import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  BookOpen, 
  ClipboardCheck,
  GraduationCap,
  BarChart3,
  User,
  UsersRound,
  FileText,
  Award,
  Megaphone,
  Bell,
  ChevronRight
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const mockPengumuman = [
  { 
    id: 1, 
    kategori: "Informasi",
    judul: "Panduan Lengkap Ujian & Penilaian Tahfidz", 
    tanggal: "24 Januari 2026",
  },
  { 
    id: 2, 
    kategori: "Pengumuman",
    judul: "Ujian Tahfidz Dimulai Tanggal 27 Januari 2026", 
    tanggal: "24 Januari 2026",
  },
  { 
    id: 3, 
    kategori: "Reminder",
    judul: "Deadline Rapor Semester Ganjil 30 Januari 2026", 
    tanggal: "23 Januari 2026",
  },
];

const penilaianOptions = [
  { id: "drill", label: "Drill", route: "/ustadz/drill" },
  { id: "tasmi1", label: "Tasmi' 1 Juz", route: "/ustadz/tasmi" },
  { id: "tasmi5", label: "Tasmi' 5 Juz", route: "/ustadz/tasmi" },
  { id: "ujian", label: "Ujian Tahfidz", route: "/ustadz/tahfidz" },
];

export default function DashboardMobile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ namaLengkap: string; email: string } | null>(null);
  const [showPenilaianDialog, setShowPenilaianDialog] = useState(false);

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("nama_lengkap")
          .eq("id", user.id)
          .maybeSingle();

        setProfile({
          namaLengkap: profileData?.nama_lengkap || user.user_metadata?.nama_lengkap || "Ustadz",
          email: user.email || "",
        });
      }
    };
    getProfile();
  }, []);

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  };

  const menuItems = [
  { icon: BookOpen, label: "Setoran", route: "/ustadz/setoran" },
  { icon: ClipboardCheck, label: "Drill", route: "/ustadz/drill" },
  { icon: GraduationCap, label: "Tasmi'", route: "/ustadz/tasmi" },
  { icon: Award, label: "Ujian Tahfidz", route: "/ustadz/tahfidz" },
  { icon: UsersRound, label: "Data Siswa", route: "/ustadz/data-siswa" },
  { icon: Users, label: "Halaqoh", route: "/ustadz/halaqoh" },
  { icon: FileText, label: "Laporan", route: "/ustadz/laporan" },
  { icon: BarChart3, label: "Rapor", route: "/ustadz/rapor" },
];

  const getCategoryColor = (kategori: string) => {
    switch (kategori) {
      case "Informasi":
        return "bg-purple-100 text-purple-700";
      case "Pengumuman":
        return "bg-amber-100 text-amber-700";
      case "Reminder":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <MobileLayout>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-400 to-amber-400 px-4 pt-4 pb-6 rounded-b-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-white" />
              <h1 className="text-xl font-bold text-white">Mantaf IMIS</h1>
            </div>
            <button className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="px-4 pb-4">
          <Card className="bg-white border border-border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 pb-3 border-b border-border/50">
                <Avatar className="h-12 w-12 ring-2 ring-emerald-500/30">
                  <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold">
                    {getInitials(profile?.namaLengkap || "U")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-bold text-foreground">{profile?.namaLengkap || "Ustadz"}</h2>
                  <p className="text-sm text-muted-foreground">Ustadz Pengampu</p>
                </div>
              </div>
              <div className="flex justify-between mt-3 text-center">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Jumlah Siswa</p>
                  <p className="font-bold text-lg text-foreground">16</p>
                </div>
                <div className="flex-1 border-x border-border/50">
                  <p className="text-xs text-muted-foreground">Jumlah Halaqoh</p>
                  <p className="font-bold text-lg text-foreground">2</p>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Jumlah Penilaian</p>
                  <p className="font-bold text-lg text-foreground">57</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Menu Icons Grid */}
        <div className="px-4 pb-4">
          <div className="grid grid-cols-4 gap-4">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => navigate(item.route)}
                className="
                  w-full
                  flex flex-col items-center
                  gap-1.5
                  px-2 py-3
                  rounded-xl
                  border border-emerald-300
                  bg-transparent
                  hover:bg-emerald-50
                  active:scale-95
                  transition
                "
              >
                <div className="
                  w-12 h-12
                  rounded-lg
                  bg-gradient-to-br from-emerald-500 to-lime-400
                  flex items-center justify-center
                  shadow-sm
                ">
                  <item.icon className="w-6 h-6 text-white" />
                </div>

                <span className="text-[11px] font-medium text-foreground text-center leading-tight">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Reminder Card */}
        <div className="px-4 pb-4">
          <Card className="bg-gradient-to-r from-amber-500 to-yellow-500 border-0 overflow-hidden">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">
                  Yuk biasakan untuk tidak lupa membuat laporan harian mengenai pekerjaanmu!
                </p>
                <button className="flex items-center gap-1 mt-2 text-white/90 text-sm font-medium">
                  Buat Laporan Harian
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="bg-background rounded-t-3xl min-h-[300px] px-4 pt-5 pb-24">
          {/* Pengumuman Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-emerald-600" />
                Informasi dan pengumuman!
              </h3>
              <button className="text-sm text-primary font-medium">Lihat Semua</button>
            </div>
            
            {mockPengumuman.map((item) => (
              <Card key={item.id} className="bg-card border border-border/50 shadow-sm">
                <CardContent className="p-4">
                  <Badge 
                    variant="secondary" 
                    className={`mb-2 text-xs font-medium ${getCategoryColor(item.kategori)}`}
                  >
                    {item.kategori}
                  </Badge>
                  <h4 className="font-semibold text-foreground text-sm leading-snug">
                    {item.judul}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-2">{item.tanggal}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Penilaian Dialog */}
      <Dialog open={showPenilaianDialog} onOpenChange={setShowPenilaianDialog}>
        <DialogContent className="max-w-[90%] rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-center">Pilih Jenis Penilaian</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 pt-2">
            {penilaianOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  setShowPenilaianDialog(false);
                  navigate(option.route);
                }}
                className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 hover:from-emerald-100 hover:to-teal-100 transition-all active:scale-95"
              >
                <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                  <ClipboardCheck className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm font-medium text-foreground">{option.label}</p>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
}
