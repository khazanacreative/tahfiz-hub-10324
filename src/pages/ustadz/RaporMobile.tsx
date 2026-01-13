import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  FileCheck,
  Search,
  User,
  BookOpen,
  Download,
  Star
} from "lucide-react";

interface Santri {
  id: string;
  nis: string;
  nama_santri: string;
  id_halaqoh: string | null;
  status: string | null;
}

interface Halaqoh {
  id: string;
  nama_halaqoh: string;
}

interface RaporData {
  santri: Santri;
  nilaiRata: number;
  totalSetoran: number;
  totalJuz: number;
  grade: string;
}

export default function RaporMobile() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterHalaqoh, setFilterHalaqoh] = useState("all");
  const [filterSemester, setFilterSemester] = useState("ganjil");
  const [santriList, setSantriList] = useState<Santri[]>([]);
  const [halaqohList, setHalaqohList] = useState<Halaqoh[]>([]);
  const [raporList, setRaporList] = useState<RaporData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [santriRes, halaqohRes] = await Promise.all([
          supabase.from("santri").select("*"),
          supabase.from("halaqoh").select("id, nama_halaqoh")
        ]);

        if (santriRes.data) {
          setSantriList(santriRes.data);
          // Generate mock rapor data
          const mockRapor: RaporData[] = santriRes.data.map(santri => ({
            santri,
            nilaiRata: Math.floor(Math.random() * 20) + 75,
            totalSetoran: Math.floor(Math.random() * 50) + 10,
            totalJuz: Math.floor(Math.random() * 10) + 1,
            grade: ["A", "A-", "B+", "B"][Math.floor(Math.random() * 4)]
          }));
          setRaporList(mockRapor);
        }
        if (halaqohRes.data) setHalaqohList(halaqohRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getHalaqohName = (id: string | null) => {
    if (!id) return "-";
    const halaqoh = halaqohList.find(h => h.id === id);
    return halaqoh?.nama_halaqoh || "-";
  };

  const getGradeColor = (grade: string) => {
    switch(grade) {
      case "A": return "from-emerald-400 to-emerald-600";
      case "A-": return "from-teal-400 to-teal-600";
      case "B+": return "from-amber-400 to-amber-600";
      default: return "from-blue-400 to-blue-600";
    }
  };

  const filteredRapor = raporList.filter(item => {
    const matchSearch = item.santri.nama_santri.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       item.santri.nis.toLowerCase().includes(searchQuery.toLowerCase());
    const matchHalaqoh = filterHalaqoh === "all" || item.santri.id_halaqoh === filterHalaqoh;
    return matchSearch && matchHalaqoh;
  });

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
                <h1 className="text-xl font-bold text-white">Rapor</h1>
                <p className="text-sm text-white/80">Nilai akhir santri</p>
              </div>

              <FileCheck className="w-8 h-8 text-white/60" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="-mt-8 bg-background rounded-t-3xl px-4 pt-6 pb-24 min-h-screen">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama atau NIS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-4">
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

            <Select value={filterSemester} onValueChange={setFilterSemester}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ganjil">Semester Ganjil</SelectItem>
                <SelectItem value="genap">Semester Genap</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
              <CardContent className="p-2 text-center">
                <p className="text-lg font-bold text-emerald-700">{raporList.filter(r => r.grade === "A" || r.grade === "A-").length}</p>
                <p className="text-[10px] text-emerald-600">Grade A</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
              <CardContent className="p-2 text-center">
                <p className="text-lg font-bold text-amber-700">{raporList.filter(r => r.grade.startsWith("B")).length}</p>
                <p className="text-[10px] text-amber-600">Grade B</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <CardContent className="p-2 text-center">
                <p className="text-lg font-bold text-blue-700">{raporList.length}</p>
                <p className="text-[10px] text-blue-600">Total</p>
              </CardContent>
            </Card>
          </div>

          {/* List */}
          <h2 className="font-semibold text-foreground mb-3">
            Daftar Rapor ({filteredRapor.length})
          </h2>

          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : filteredRapor.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Tidak ada data rapor
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRapor.map((item) => (
                <Card key={item.santri.id} className="border border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getGradeColor(item.grade)} flex items-center justify-center`}>
                        <span className="text-white font-bold text-lg">{item.grade}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{item.santri.nama_santri}</h3>
                        <p className="text-sm text-muted-foreground">NIS: {item.santri.nis}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Star className="w-3 h-3" /> {item.nilaiRata}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <BookOpen className="w-3 h-3" /> {item.totalJuz} Juz
                          </span>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Download className="w-4 h-4" />
                      </Button>
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
