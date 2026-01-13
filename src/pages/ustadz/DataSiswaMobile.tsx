import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  Users,
  Search,
  Filter,
  User,
  BookOpen
} from "lucide-react";

interface Santri {
  id: string;
  nis: string;
  nama_santri: string;
  id_halaqoh: string | null;
  status: string | null;
  tanggal_masuk: string | null;
}

interface Halaqoh {
  id: string;
  nama_halaqoh: string;
}

export default function DataSiswaMobile() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterHalaqoh, setFilterHalaqoh] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [santriList, setSantriList] = useState<Santri[]>([]);
  const [halaqohList, setHalaqohList] = useState<Halaqoh[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [santriRes, halaqohRes] = await Promise.all([
          supabase.from("santri").select("*"),
          supabase.from("halaqoh").select("id, nama_halaqoh")
        ]);

        if (santriRes.data) setSantriList(santriRes.data);
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

  const filteredSantri = santriList.filter(santri => {
    const matchSearch = santri.nama_santri.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       santri.nis.toLowerCase().includes(searchQuery.toLowerCase());
    const matchHalaqoh = filterHalaqoh === "all" || santri.id_halaqoh === filterHalaqoh;
    const matchStatus = filterStatus === "all" || santri.status === filterStatus;
    return matchSearch && matchHalaqoh && matchStatus;
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
                <h1 className="text-xl font-bold text-white">Data Siswa</h1>
                <p className="text-sm text-white/80">Kelola data santri</p>
              </div>

              <Users className="w-8 h-8 text-white/60" />
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

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="aktif">Aktif</SelectItem>
                <SelectItem value="non-aktif">Non-Aktif</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
              <CardContent className="p-3 text-center">
                <p className="text-2xl font-bold text-emerald-700">{santriList.length}</p>
                <p className="text-xs text-emerald-600">Total Siswa</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
              <CardContent className="p-3 text-center">
                <p className="text-2xl font-bold text-amber-700">
                  {santriList.filter(s => s.status === "aktif").length}
                </p>
                <p className="text-xs text-amber-600">Siswa Aktif</p>
              </CardContent>
            </Card>
          </div>

          {/* List */}
          <h2 className="font-semibold text-foreground mb-3">
            Daftar Siswa ({filteredSantri.length})
          </h2>

          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : filteredSantri.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Tidak ada data siswa
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSantri.map((santri) => (
                <Card key={santri.id} className="border border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{santri.nama_santri}</h3>
                        <p className="text-sm text-muted-foreground">NIS: {santri.nis}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <BookOpen className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {getHalaqohName(santri.id_halaqoh)}
                          </span>
                        </div>
                      </div>
                      <Badge variant={santri.status === "aktif" ? "default" : "secondary"}>
                        {santri.status || "aktif"}
                      </Badge>
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
