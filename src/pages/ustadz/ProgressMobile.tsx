import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, User, BookOpen, TrendingUp, ArrowLeft } from "lucide-react";

export default function ProgressMobile() {
  const navigate = useNavigate();
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
    <MobileLayout>
      {/* HEADER */}
      <div className="bg-gradient-to-r from-emerald-400 to-amber-400 pt-4 pb-20 rounded-b-3xl">
        <div className="px-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>

          <div>
            <h1 className="text-xl font-bold text-white">Progress Hafalan</h1>
            <p className="text-sm text-white/80">Pantauan capaian santri</p>
          </div>
        </div>
      </div>

      {/* SHEET */}
      <div className="-mt-12 bg-background rounded-t-3xl px-4 pt-6 pb-24 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cari santri..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border-blue-200">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/20">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Santri</p>
                <p className="text-xl font-bold">{dummySantriProgress.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border-emerald-200">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Rata-rata</p>
                <p className="text-xl font-bold">
                  {Math.round(
                    dummySantriProgress.reduce(
                      (acc, s) => acc + (s.juzSelesai / s.totalJuz) * 100,
                      0
                    ) / dummySantriProgress.length
                  )}%
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* List */}
        <div className="space-y-3">
          {filteredData.map((item) => {
            const percentage = Math.round((item.juzSelesai / item.totalJuz) * 100);
            return (
              <Card key={item.id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{item.nama}</h4>
                        <p className="text-xs text-muted-foreground">
                          Halaqoh {item.halaqoh}
                        </p>
                      </div>
                    </div>

                    <Badge variant="outline" className="text-xs">
                      <BookOpen className="w-3 h-3 mr-1" />
                      Juz {item.juzSedangDihafal}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">
                        {item.juzSelesai}/{item.totalJuz} Juz
                      </span>
                    </div>

                    <div className="relative">
                      <Progress value={percentage} className="h-2.5" />
                      <div
                        className={`absolute inset-y-0 left-0 rounded-full ${getProgressColor(
                          percentage
                        )}`}
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
