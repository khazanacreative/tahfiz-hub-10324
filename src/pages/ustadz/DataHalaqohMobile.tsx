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
  BookMarked,
  Search,
  Users,
  GraduationCap
} from "lucide-react";

interface Halaqoh {
  id: string;
  nama_halaqoh: string;
  tingkat: string | null;
  jumlah_santri: number | null;
  id_asatidz: string | null;
}

export default function DataHalaqohMobile() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTingkat, setFilterTingkat] = useState("all");
  const [halaqohList, setHalaqohList] = useState<Halaqoh[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.from("halaqoh").select("*");
        if (data) setHalaqohList(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const tingkatOptions = [...new Set(halaqohList.map(h => h.tingkat).filter(Boolean))];

  const filteredHalaqoh = halaqohList.filter(halaqoh => {
    const matchSearch = halaqoh.nama_halaqoh.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTingkat = filterTingkat === "all" || halaqoh.tingkat === filterTingkat;
    return matchSearch && matchTingkat;
  });

  const totalSantri = halaqohList.reduce((sum, h) => sum + (h.jumlah_santri || 0), 0);

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
                <h1 className="text-xl font-bold text-white">Data Halaqoh</h1>
                <p className="text-sm text-white/80">Kelola kelompok belajar</p>
              </div>

              <BookMarked className="w-8 h-8 text-white/60" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="-mt-8 bg-background rounded-t-3xl px-4 pt-6 pb-24 min-h-screen">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari halaqoh..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter */}
          <div className="mb-4">
            <Select value={filterTingkat} onValueChange={setFilterTingkat}>
              <SelectTrigger>
                <SelectValue placeholder="Filter Tingkat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tingkat</SelectItem>
                {tingkatOptions.map((tingkat) => (
                  <SelectItem key={tingkat} value={tingkat!}>{tingkat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
              <CardContent className="p-3 text-center">
                <p className="text-2xl font-bold text-emerald-700">{halaqohList.length}</p>
                <p className="text-xs text-emerald-600">Total Halaqoh</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
              <CardContent className="p-3 text-center">
                <p className="text-2xl font-bold text-amber-700">{totalSantri}</p>
                <p className="text-xs text-amber-600">Total Santri</p>
              </CardContent>
            </Card>
          </div>

          {/* List */}
          <h2 className="font-semibold text-foreground mb-3">
            Daftar Halaqoh ({filteredHalaqoh.length})
          </h2>

          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : filteredHalaqoh.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Tidak ada data halaqoh
            </div>
          ) : (
            <div className="space-y-3">
              {filteredHalaqoh.map((halaqoh) => (
                <Card key={halaqoh.id} className="border border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-400 flex items-center justify-center">
                        <BookMarked className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{halaqoh.nama_halaqoh}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Users className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {halaqoh.jumlah_santri || 0} santri
                          </span>
                        </div>
                      </div>
                      {halaqoh.tingkat && (
                        <Badge variant="outline">{halaqoh.tingkat}</Badge>
                      )}
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
