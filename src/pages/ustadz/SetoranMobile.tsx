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
import { Plus, BookOpen, CalendarIcon, CheckCircle, XCircle } from "lucide-react";
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

const mockSetoran = [
  { id: 1, tanggal: "15/01/2025", santri: "Muhammad Faiz", santriId: "1", halaqohId: "1", juz: 30, nilai: 95, status: "Lancar" },
  { id: 2, tanggal: "14/01/2025", santri: "Fatimah Zahra", santriId: "2", halaqohId: "2", juz: 30, nilai: 78, status: "Kurang" },
  { id: 3, tanggal: "13/01/2025", santri: "Aisyah Nur", santriId: "3", halaqohId: "1", juz: 29, nilai: 92, status: "Lancar" },
];

const BATAS_LANCAR = 80;

export default function SetoranMobile() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSantri, setSelectedSantri] = useState("");
  const [tanggalSetoran, setTanggalSetoran] = useState<Date>();
  const [juz, setJuz] = useState("");
  const [surah, setSurah] = useState("");
  const [ayatDari, setAyatDari] = useState("1");
  const [ayatSampai, setAyatSampai] = useState("7");
  const [jumlahKesalahan, setJumlahKesalahan] = useState("0");
  const [catatanTajwid, setCatatanTajwid] = useState("");
  const [filters, setFilters] = useState<FilterValues>({ periode: "all", halaqoh: "all", santri: "all" });

  const surahByJuz: Surah[] = useMemo(() => {
    if (!juz) return [];
    return getSurahsByJuz(Number(juz));
  }, [juz]);

  const nilaiKelancaran = Math.max(0, 100 - parseInt(jumlahKesalahan || "0"));

  const handleSubmit = () => {
    if (!tanggalSetoran || !selectedSantri) return;

    toast.success(
      nilaiKelancaran >= BATAS_LANCAR
        ? "Setoran lancar! ✨"
        : "Setoran dicatat, perlu perbaikan 📝"
    );
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedSantri("");
    setTanggalSetoran(undefined);
    setJuz("");
    setSurah("");
    setAyatDari("1");
    setAyatSampai("7");
    setJumlahKesalahan("0");
    setCatatanTajwid("");
  };

  const filteredSetoran = mockSetoran.filter(item => {
    if (filters.santri !== "all" && item.santriId !== filters.santri) return false;
    if (filters.halaqoh !== "all" && item.halaqohId !== filters.halaqoh) return false;
    return true;
  });

  return (
    <MobileLayout>
      <div className="p-4 space-y-4">
        {/* Header Card */}
        <Card className="bg-gradient-to-r from-green-500 to-lime-500 border-0 text-white">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Setoran Hafalan</h2>
                <p className="text-sm text-white/80">Input setoran santri</p>
              </div>
              <BookOpen className="w-10 h-10 opacity-50" />
            </div>
          </CardContent>
        </Card>

        {/* Add Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full h-12 bg-primary hover:bg-primary/90">
              <Plus className="w-5 h-5 mr-2" />
              Tambah Setoran
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] max-h-[85vh] overflow-y-auto rounded-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Tambah Setoran
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
                        !tanggalSetoran && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {tanggalSetoran ? format(tanggalSetoran, "dd/MM/yyyy") : "Pilih tanggal"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={tanggalSetoran}
                      onSelect={setTanggalSetoran}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Juz */}
              <JuzSelector value={juz} onValueChange={setJuz} required />

              {/* Surah */}
              <div className="space-y-2">
                <Label>Surah *</Label>
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

              {/* Ayat */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Ayat Dari</Label>
                  <Input
                    type="number"
                    value={ayatDari}
                    onChange={(e) => setAyatDari(e.target.value)}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ayat Sampai</Label>
                  <Input
                    type="number"
                    value={ayatSampai}
                    onChange={(e) => setAyatSampai(e.target.value)}
                    className="h-12"
                  />
                </div>
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

              {/* Nilai */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <span className="font-medium">Nilai Kelancaran</span>
                <span className={cn(
                  "text-2xl font-bold",
                  nilaiKelancaran >= BATAS_LANCAR ? "text-green-600" : "text-amber-600"
                )}>
                  {nilaiKelancaran}
                </span>
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

              <Button onClick={handleSubmit} className="w-full h-12">
                Simpan Setoran
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Filters */}
        <MobileFilters onFilterChange={setFilters} />

        {/* Recent Setoran List */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground">Setoran Terbaru</h3>
          {filteredSetoran.map((setoran) => (
            <Card key={setoran.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-semibold">{setoran.santri}</p>
                    <p className="text-sm text-muted-foreground">
                      Juz {setoran.juz} • {setoran.tanggal}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">{setoran.nilai}</p>
                    <Badge variant={setoran.status === "Lancar" ? "default" : "secondary"} className={setoran.status === "Lancar" ? "bg-green-500" : "bg-amber-500"}>
                      {setoran.status === "Lancar" ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <XCircle className="w-3 h-3 mr-1" />
                      )}
                      {setoran.status}
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
