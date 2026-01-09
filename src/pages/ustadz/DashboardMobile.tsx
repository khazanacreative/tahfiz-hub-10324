import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  BookOpen, 
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Megaphone,
  Info
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Mock data - akan diganti dengan data dari Supabase
const mockHalaqoh = [
  { 
    id: "1", 
    nama: "Halaqoh Al-Azhary", 
    jumlahSantri: 8, 
    jadwal: "Senin, Rabu, Jumat",
    santri: [
      { id: "1", nama: "Muhammad Faiz", nis: "S001", juzTerakhir: 30 },
      { id: "2", nama: "Aisyah Nur", nis: "S002", juzTerakhir: 29 },
      { id: "5", nama: "Abdullah Rahman", nis: "S005", juzTerakhir: 28 },
      { id: "6", nama: "Khadijah Sari", nis: "S006", juzTerakhir: 27 },
    ]
  },
  { 
    id: "2", 
    nama: "Halaqoh Al-Furqon", 
    jumlahSantri: 6, 
    jadwal: "Selasa, Kamis, Sabtu",
    santri: [
      { id: "3", nama: "Fatimah Zahra", nis: "S003", juzTerakhir: 30 },
      { id: "4", nama: "Ahmad Fauzi", nis: "S004", juzTerakhir: 28 },
      { id: "7", nama: "Umar Hasan", nis: "S007", juzTerakhir: 26 },
    ]
  },
];

const mockPengumuman = [
  { id: 1, judul: "Libur Tahun Baru", tanggal: "01/01/2025", isi: "Kegiatan halaqoh diliburkan tanggal 1 Januari 2025" },
  { id: 2, judul: "Ujian Tasmi' Semester", tanggal: "15/01/2025", isi: "Ujian tasmi' semester akan dilaksanakan mulai 15 Januari" },
  { id: 3, judul: "Pembagian Rapor", tanggal: "20/01/2025", isi: "Pembagian rapor semester ganjil di aula utama" },
];

export default function DashboardMobile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ namaLengkap: string; email: string } | null>(null);
  const [expandedHalaqoh, setExpandedHalaqoh] = useState<string[]>([]);

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("user_id", user.id)
          .single();

        setProfile({
          namaLengkap: profileData?.full_name || user.user_metadata?.nama_lengkap || "Ustadz",
          email: user.email || "",
        });
      }
    };
    getProfile();
  }, []);

  const toggleHalaqoh = (id: string) => {
    setExpandedHalaqoh(prev => 
      prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]
    );
  };

  const totalSantri = mockHalaqoh.reduce((acc, h) => acc + h.santri.length, 0);
  const totalHalaqoh = mockHalaqoh.length;

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  };

  return (
    <MobileLayout>
      <div className="p-4 space-y-4">
        {/* Welcome Card with Profile Button */}
        <Card className="bg-gradient-to-br from-emerald-500 to-teal-500 border-0 text-white">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-white/80">Assalamu'alaikum,</p>
                <h2 className="text-xl font-bold">{profile?.namaLengkap || "Ustadz"}</h2>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{totalSantri} Santri</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-sm">{totalHalaqoh} Halaqoh</span>
                  </div>
                </div>
              </div>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full h-12 w-12 bg-white/20 hover:bg-white/30 border-2 border-white/50"
                onClick={() => navigate("/ustadz/profil")}
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-white text-emerald-700 font-bold">
                    {getInitials(profile?.namaLengkap || "U")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Halaqoh Section - Clickable */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Halaqoh Saya</h3>
            <Badge variant="outline">{totalHalaqoh} halaqoh</Badge>
          </div>
          {mockHalaqoh.map((halaqoh) => (
            <Collapsible 
              key={halaqoh.id} 
              open={expandedHalaqoh.includes(halaqoh.id)}
              onOpenChange={() => toggleHalaqoh(halaqoh.id)}
            >
              <Card>
                <CollapsibleTrigger asChild>
                  <CardContent className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-semibold">{halaqoh.nama}</p>
                        <p className="text-sm text-muted-foreground">{halaqoh.jadwal}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-emerald-500">
                          <Users className="w-3 h-3 mr-1" />
                          {halaqoh.santri.length} santri
                        </Badge>
                        {expandedHalaqoh.includes(halaqoh.id) ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-4 pb-4 space-y-2 border-t pt-3">
                    {halaqoh.santri.map((santri) => (
                      <div key={santri.id} className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs">
                            {getInitials(santri.nama)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{santri.nama}</p>
                          <p className="text-xs text-muted-foreground">{santri.nis}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          <GraduationCap className="w-3 h-3 mr-1" />
                          Juz {santri.juzTerakhir}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>

        {/* Pengumuman Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <Megaphone className="w-4 h-4" />
              Pengumuman
            </h3>
            <Badge variant="outline">{mockPengumuman.length} baru</Badge>
          </div>
          {mockPengumuman.map((pengumuman) => (
            <Card key={pengumuman.id}>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Info className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{pengumuman.judul}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{pengumuman.isi}</p>
                    <p className="text-xs text-muted-foreground mt-2">{pengumuman.tanggal}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
}
