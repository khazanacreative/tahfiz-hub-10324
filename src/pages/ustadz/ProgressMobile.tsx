import { useState } from "react";
import MobileLayout from "@/components/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, User, BookOpen, TrendingUp } from "lucide-react";

const dummySantriProgress = [
  {
    id: "1",
    nama: "Ahmad Fauzi",
    halaqoh: "Al-Fatih",
    totalJuz: 30,
    juzSelesai: 8,
    juzSedangDihafal: 9,
  },
  {
    id: "2",
    nama: "Muhammad Rizki",
    halaqoh: "Al-Fatih",
    totalJuz: 30,
    juzSelesai: 5,
    juzSedangDihafal: 6,
  },
  {
    id: "3",
    nama: "Abdullah Hakim",
    halaqoh: "An-Nur",
    totalJuz: 30,
    juzSelesai: 12,
    juzSedangDihafal: 13,
  },
  {
    id: "4",
    nama: "Bilal Rahman",
    halaqoh: "Al-Fatih",
    totalJuz: 30,
    juzSelesai: 3,
    juzSedangDihafal: 4,
  },
];

export default function ProgressMobile() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = dummySantriProgress.filter((item) =>
    item.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-emerald-500";
    if (percentage >= 50) return "bg-blue-500";
    if (percentage >= 25) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <MobileLayout title="Progress Hafalan">
      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cari santri..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-card"
          />
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/20">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Santri</p>
                  <p className="text-xl font-bold text-foreground">{dummySantriProgress.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/20">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Rata-rata</p>
                  <p className="text-xl font-bold text-foreground">
                    {Math.round(
                      dummySantriProgress.reduce((acc, s) => acc + (s.juzSelesai / s.totalJuz) * 100, 0) /
                        dummySantriProgress.length
                    )}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress List */}
        <div className="space-y-3">
          {filteredData.map((item) => {
            const percentage = Math.round((item.juzSelesai / item.totalJuz) * 100);
            return (
              <Card key={item.id} className="hover:border-primary/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{item.nama}</h4>
                        <p className="text-xs text-muted-foreground">Halaqoh {item.halaqoh}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      <BookOpen className="w-3 h-3 mr-1" />
                      Juz {item.juzSedangDihafal}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress Hafalan</span>
                      <span className="font-semibold text-foreground">
                        {item.juzSelesai}/{item.totalJuz} Juz
                      </span>
                    </div>
                    <div className="relative">
                      <Progress value={percentage} className="h-2.5" />
                      <div
                        className={`absolute top-0 left-0 h-full rounded-full transition-all ${getProgressColor(percentage)}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-right text-xs text-muted-foreground">
                      {percentage}% selesai
                    </p>
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
