import { useState, useMemo } from "react";
import { MobileLayout } from "@/components/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Plus, Target, CalendarIcon, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { JuzSelector } from "@/components/JuzSelector";
import { MobileFilters, FilterValues } from "@/components/MobileFilters";
import { getSurahsByJuz, Surah } from "@/lib/quran-data";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const mockSantri = [
  { id: "1", nama: "Muhammad Faiz", nis: "S001", halaqoh: "Halaqoh Al-Azhary" },
  { id: "2", nama: "Fatimah Zahra", nis: "S003", halaqoh: "Halaqoh Al-Furqon" },
  { id: "3", nama: "Aisyah Nur", nis: "S002", halaqoh: "Halaqoh Al-Azhary" },
];

const mockDrillHistory = [
  { id: 1, tanggal: "15/01/2025", santri: "Muhammad Faiz", santriId: "1", halaqohId: "1", juz: 30, level: "Drill 1", nilai: 95, lulus: true },
  { id: 2, tanggal: "14/01/2025", santri: "Fatimah Zahra", santriId: "2", halaqohId: "2", juz: 30, level: "Drill 1", nilai: 85, lulus: false },
  { id: 3, tanggal: "13/01/2025", santri: "Aisyah Nur", santriId: "3", halaqohId: "1", juz: 29, level: "Drill 2", nilai: 92, lulus: true },
];

const drillLevels = [
  { id: "drill1", name: "Drill 1", desc: "5 Halaman / 5 Surat", icon: "📘" },
  { id: "drill2", name: "Drill 2", desc: "5 Halaman berikutnya", icon: "📗" },
  { id: "drillHalfJuz", name: "Drill ½ Juz", desc: "10 Halaman", icon: "📙" },
  { id: "drillFirstHalf", name: "½ Juz Pertama", desc: "Setengah juz awal", icon: "📕" },
  { id: "drillSecondHalf", name: "½ Juz Kedua", desc: "Setengah juz akhir", icon: "📓" },
  { id: "tasmi1Juz", name: "Tasmi' 1 Juz", desc: "Ujian lengkap 1 juz", icon: "🏆" },
];

const BATAS_LULUS = 88;

export default function DrillMobile() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSantri, setSelectedSantri] = useState("");
  const [tanggalDrill, setTanggalDrill] = useState<Date>();
  const [juz, setJuz] = useState("");
  const [drillLevel, setDrillLevel] = useState("");
  const [surah, setSurah] = useState("");
  const [jumlahKesalahan, setJumlahKesalahan] = useState("0");
  const [catatanTajwid, setCatatanTajwid] = useState("");
  const [filters, setFilters] = useState<FilterValues>({ periode: "all", halaqoh: "all", santri: "all" });

  const surahByJuz: Surah[] = useMemo(() => {
    if (!juz) return [];
    return getSurahsByJuz(Number(juz));
  }, [juz]);

  const nilaiKelancaran = Math.max(0, 100 - parseInt(jumlahKesalahan || "0"));
  const lulus = nilaiKelancaran >= BATAS_LULUS;

  const handleSubmit = () => {
    if (!tanggalDrill || !selectedSantri) return;

    toast.success(
      lulus
        ? "Drill lulus! Lanjut ke tahap berikutnya 🎉"
        : "Drill perlu diulang, semangat! 💪"
    );
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedSantri("");
    setTanggalDrill(undefined);
    setJuz("");
    setDrillLevel("");
    setSurah("");
    setJumlahKesalahan("0");
    setCatatanTajwid("");
  };

  const filteredHistory = mockDrillHistory.filter(item => {
    if (filters.santri !== "all" && item.santriId !== filters.santri) return false;
    if (filters.halaqoh !== "all" && item.halaqohId !== filters.halaqoh) return false;
    return true;
  });

  return (
    <MobileLayout>
      <div className="p-4 space-y-4">
        {/* Header Card */}
        <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 border-0 text-white">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Drill Hafalan</h2>
                <p className="text-sm text-white/80">Tahapan drill santri</p>
              </div>
              <Target className="w-10 h-10 opacity-50" />
            </div>
          </CardContent>
        </Card>

        {/* Add Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700">
              <Plus className="w-5 h-5 mr-2" />
              Tambah Drill
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] max-h-[85vh] overflow-y-auto rounded-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Tambah Drill
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              {/* Santri */}
              <div className="space-y-2">
                <Label>Santri *</Label>
                <Select value={selectedSantri} onValueChange={setSelectedSantri}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Pilih santri" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockSantri.map(santri => (
                      <SelectItem key={santri.id} value={santri.id}>
                        {santri.nama} - {santri.nis}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tanggal */}
              <div className="space-y-2">
                <Label>Tanggal *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-12 justify-start text-left font-normal",
                        !tanggalDrill && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {tanggalDrill ? format(tanggalDrill, "dd/MM/yyyy") : "Pilih tanggal"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={tanggalDrill}
                      onSelect={setTanggalDrill}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Juz */}
              <JuzSelector value={juz} onValueChange={setJuz} required />

              {/* Level Drill */}
              <div className="space-y-2">
                <Label>Level Drill *</Label>
                <Select value={drillLevel} onValueChange={setDrillLevel}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Pilih level" />
                  </SelectTrigger>
                  <SelectContent>
                    {drillLevels.map(level => (
                      <SelectItem key={level.id} value={level.id}>
                        <span className="flex items-center gap-2">
                          <span>{level.icon}</span>
                          <span>{level.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Surah */}
              <div className="space-y-2">
                <Label>Surah</Label>
                <Select value={surah} onValueChange={setSurah} disabled={!juz}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder={juz ? "Pilih surah" : "Pilih juz dulu"} />
                  </SelectTrigger>
                  <SelectContent>
                    {surahByJuz.map((s) => (
                      <SelectItem key={s.number} value={String(s.number)}>
                        {s.number}. {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Kesalahan */}
              <div className="space-y-2">
                <Label>Jumlah Kesalahan</Label>
                <Input
                  type="number"
                  value={jumlahKesalahan}
                  onChange={(e) => setJumlahKesalahan(e.target.value)}
                  min="0"
                  className="h-12"
                />
              </div>

              {/* Nilai & Status */}
              <div className={cn(
                "p-4 rounded-lg",
                lulus ? "bg-green-50 dark:bg-green-950/30" : "bg-amber-50 dark:bg-amber-950/30"
              )}>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Nilai Kelancaran</span>
                  <span className={cn(
                    "text-2xl font-bold",
                    lulus ? "text-green-600" : "text-amber-600"
                  )}>
                    {nilaiKelancaran}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className={lulus ? "bg-green-500" : "bg-amber-500"}>
                    {lulus ? "LULUS" : "PERLU ULANG"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Batas lulus: ≥ {BATAS_LULUS} (maks {100 - BATAS_LULUS} kesalahan)
                </p>
              </div>

              {/* Catatan */}
              <div className="space-y-2">
                <Label>Catatan Tajwid</Label>
                <Textarea
                  placeholder="Catatan perbaikan..."
                  value={catatanTajwid}
                  onChange={(e) => setCatatanTajwid(e.target.value)}
                  rows={3}
                />
              </div>

              <Button onClick={handleSubmit} className="w-full h-12 bg-blue-600 hover:bg-blue-700">
                Simpan Drill
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Filters */}
        <MobileFilters onFilterChange={setFilters} />

        {/* Recent Drill List */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground">Riwayat Drill</h3>
          {filteredHistory.map((drill) => (
            <Card key={drill.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-semibold">{drill.santri}</p>
                    <p className="text-sm text-muted-foreground">
                      Juz {drill.juz} • {drill.level}
                    </p>
                    <p className="text-xs text-muted-foreground">{drill.tanggal}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">{drill.nilai}</p>
                    <Badge className={drill.lulus ? "bg-green-500" : "bg-amber-500"}>
                      {drill.lulus ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <XCircle className="w-3 h-3 mr-1" />
                      )}
                      {drill.lulus ? "Lulus" : "Ulang"}
                    </Badge>
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
