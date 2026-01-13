import { useState } from "react";
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
import { 
  ArrowLeft, 
  BookMarked,
  Search,
  Users,
  User,
  Clock
} from "lucide-react";

interface HalaqohData {
  id: string;
  nama_halaqoh: string;
  tingkat: string;
  jumlah_santri: number;
  jadwal: string;
  santriList: { id: string; nama: string; progress: number }[];
}

// Dummy data - halaqoh yang menjadi tanggung jawab ustadz
const myHalaqohData: HalaqohData[] = [
  {
    id: "1",
    nama_halaqoh: "Halaqoh Al-Fatih",
    tingkat: "Paket A",
    jumlah_santri: 12,
    jadwal: "Senin, Rabu, Jumat - 08:00",
    santriList: [
      { id: "s1", nama: "Ahmad Rizki", progress: 45 },
      { id: "s2", nama: "Muhammad Fauzi", progress: 60 },
      { id: "s3", nama: "Abdullah Hakim", progress: 35 },
      { id: "s4", nama: "Yusuf Ibrahim", progress: 75 },
      { id: "s5", nama: "Hasan Basri", progress: 50 },
    ]
  },
  {
    id: "2",
    nama_halaqoh: "Halaqoh An-Nur",
    tingkat: "Paket B",
    jumlah_santri: 10,
    jadwal: "Selasa, Kamis, Sabtu - 09:00",
    santriList: [
      { id: "s6", nama: "Umar Faruq", progress: 80 },
      { id: "s7", nama: "Ali Mukhtar", progress: 65 },
      { id: "s8", nama: "Bilal Ahmad", progress: 55 },
    ]
  },
  {
    id: "3",
    nama_halaqoh: "Halaqoh Al-Ikhlas",
    tingkat: "Paket C",
    jumlah_santri: 8,
    jadwal: "Senin - Jumat - 07:00",
    santriList: [
      { id: "s9", nama: "Khalid Walid", progress: 90 },
      { id: "s10", nama: "Hamza Yusuf", progress: 85 },
    ]
  }
];

export default function DataHalaqohMobile() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTingkat, setFilterTingkat] = useState("all");
  const [expandedHalaqoh, setExpandedHalaqoh] = useState<string | null>(null);

  const tingkatOptions = [...new Set(myHalaqohData.map(h => h.tingkat))];

  const filteredHalaqoh = myHalaqohData.filter(halaqoh => {
    const matchSearch = halaqoh.nama_halaqoh.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTingkat = filterTingkat === "all" || halaqoh.tingkat === filterTingkat;
    return matchSearch && matchTingkat;
  });

  const totalSantri = myHalaqohData.reduce((sum, h) => sum + h.jumlah_santri, 0);

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return "text-emerald-600";
    if (progress >= 50) return "text-amber-600";
    return "text-red-500";
  };

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
                <h1 className="text-xl font-bold text-white">Halaqoh Saya</h1>
                <p className="text-sm text-white/80">Kelompok dalam tanggung jawab Anda</p>
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
                  <SelectItem key={tingkat} value={tingkat}>{tingkat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
              <CardContent className="p-3 text-center">
                <p className="text-2xl font-bold text-emerald-700">{myHalaqohData.length}</p>
                <p className="text-xs text-emerald-600">Halaqoh Saya</p>
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

          <div className="space-y-3">
            {filteredHalaqoh.map((halaqoh) => (
              <Card 
                key={halaqoh.id} 
                className="border border-border/50 overflow-hidden"
              >
                <CardContent 
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedHalaqoh(
                    expandedHalaqoh === halaqoh.id ? null : halaqoh.id
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-400 flex items-center justify-center">
                      <BookMarked className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{halaqoh.nama_halaqoh}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Users className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {halaqoh.jumlah_santri} santri
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {halaqoh.jadwal}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline">{halaqoh.tingkat}</Badge>
                  </div>
                </CardContent>
                
                {/* Expanded santri list */}
                {expandedHalaqoh === halaqoh.id && (
                  <div className="border-t bg-muted/30 px-4 py-3">
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      Santri dalam halaqoh ini:
                    </p>
                    <div className="space-y-2">
                      {halaqoh.santriList.map((santri) => (
                        <div 
                          key={santri.id}
                          className="flex items-center gap-2 bg-background rounded-lg p-2"
                        >
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-300 to-teal-300 flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <span className="flex-1 text-sm font-medium">{santri.nama}</span>
                          <span className={`text-sm font-semibold ${getProgressColor(santri.progress)}`}>
                            {santri.progress}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
