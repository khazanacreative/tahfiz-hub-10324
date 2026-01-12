import { useState } from "react";
import MobileLayout from "@/components/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Plus, Star, Calendar, User } from "lucide-react";

const dummyPenilaian = [
  {
    id: "1",
    santriNama: "Ahmad Fauzi",
    juz: 30,
    tanggal: "2026-01-24",
    tajwid: 85,
    kelancaran: 90,
    makharij: 88,
  },
  {
    id: "2",
    santriNama: "Muhammad Rizki",
    juz: 29,
    tanggal: "2026-01-23",
    tajwid: 92,
    kelancaran: 88,
    makharij: 90,
  },
  {
    id: "3",
    santriNama: "Abdullah Hakim",
    juz: 30,
    tanggal: "2026-01-22",
    tajwid: 78,
    kelancaran: 82,
    makharij: 80,
  },
];

export default function PenilaianMobile() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = dummyPenilaian.filter((item) =>
    item.santriNama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRataRata = (item: typeof dummyPenilaian[0]) => {
    return Math.round((item.tajwid + item.kelancaran + item.makharij) / 3);
  };

  const getPredikat = (nilai: number) => {
    if (nilai >= 90) return { label: "Mumtaz", color: "bg-emerald-500" };
    if (nilai >= 80) return { label: "Jayyid Jiddan", color: "bg-blue-500" };
    if (nilai >= 70) return { label: "Jayyid", color: "bg-amber-500" };
    return { label: "Maqbul", color: "bg-red-500" };
  };

  return (
    <MobileLayout title="Penilaian">
      <div className="p-4 space-y-4">
        {/* Search & Add */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari santri..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-card"
            />
          </div>
          <Button size="icon" className="shrink-0">
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        {/* Stats Card */}
        <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Penilaian</p>
                <p className="text-2xl font-bold text-foreground">{dummyPenilaian.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/20">
                <Star className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Penilaian List */}
        <div className="space-y-3">
          {filteredData.map((item) => {
            const rataRata = getRataRata(item);
            const predikat = getPredikat(rataRata);
            return (
              <Card key={item.id} className="hover:border-primary/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{item.santriNama}</h4>
                        <p className="text-xs text-muted-foreground">Juz {item.juz}</p>
                      </div>
                    </div>
                    <Badge className={`${predikat.color} text-white text-xs`}>
                      {predikat.label}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="text-center p-2 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Tajwid</p>
                      <p className="font-semibold text-foreground">{item.tajwid}</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Kelancaran</p>
                      <p className="font-semibold text-foreground">{item.kelancaran}</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Makharij</p>
                      <p className="font-semibold text-foreground">{item.makharij}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(item.tanggal).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                    <p className="text-sm font-bold text-primary">Rata: {rataRata}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </MobileLayout>
  );
}
