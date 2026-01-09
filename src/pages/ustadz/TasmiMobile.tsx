import { useState } from "react";
import { MobileLayout } from "@/components/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Award, CheckCircle2, XCircle, ChevronUp, ChevronDown, Layers } from "lucide-react";
import { toast } from "sonner";
import { JuzSelector } from "@/components/JuzSelector";
import { MobileFilters, FilterValues } from "@/components/MobileFilters";
import { getJuzName } from "@/lib/quran-data";

const mockSantri = [
  { id: "1", nama: "Muhammad Faiz", nis: "S001" },
  { id: "2", nama: "Fatimah Zahra", nis: "S003" },
  { id: "3", nama: "Aisyah Nur", nis: "S002" },
];

const mockHistory = [
  { id: 1, tanggal: "15/01/2025", santri: "Muhammad Faiz", santriId: "1", halaqohId: "1", juz: 30, nilai: 92, predikat: "Mumtaz", lulus: true, type: "1juz" },
  { id: 2, tanggal: "14/01/2025", santri: "Fatimah Zahra", santriId: "2", halaqohId: "2", juz: 30, nilai: 68, predikat: "Tidak Lulus", lulus: false, type: "1juz" },
  { id: 3, tanggal: "13/01/2025", santri: "Aisyah Nur", santriId: "3", halaqohId: "1", juz: 29, nilai: 85, predikat: "Jayyid Jiddan", lulus: true, type: "5juz" },
];

const getPredikat = (nilai: number) => {
  if (nilai >= 96) return { label: "Mumtaz Murtafi'", color: "bg-emerald-500" };
  if (nilai >= 90) return { label: "Mumtaz", color: "bg-green-500" };
  if (nilai >= 76) return { label: "Jayyid Jiddan", color: "bg-blue-500" };
  if (nilai >= 70) return { label: "Jayyid", color: "bg-amber-500" };
  return { label: "Tidak Lulus", color: "bg-red-500" };
};

interface PenilaianHalaman {
  halaman: number;
  pancingan: number;
}

export default function TasmiMobile() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [is5JuzDialogOpen, setIs5JuzDialogOpen] = useState(false);
  const [selectedSantri, setSelectedSantri] = useState("");
  const [selectedJuz, setSelectedJuz] = useState("");
  const [selectedJuzDari, setSelectedJuzDari] = useState("");
  const [selectedJuzSampai, setSelectedJuzSampai] = useState("");
  const [catatanUmum, setCatatanUmum] = useState("");
  const [penilaianHalaman, setPenilaianHalaman] = useState<PenilaianHalaman[]>(
    Array.from({ length: 20 }, (_, i) => ({ halaman: i + 1, pancingan: 0 }))
  );
  const [filters, setFilters] = useState<FilterValues>({ periode: "all", halaqoh: "all", santri: "all" });

  const hitungNilaiTotal = () => 
    penilaianHalaman.reduce((t, h) => t + Math.max(0, 5 - h.pancingan), 0);

  const nilaiTotal = hitungNilaiTotal();
  const predikat = getPredikat(nilaiTotal);

  const handlePancingan = (index: number, delta: number) => {
    const newPenilaian = [...penilaianHalaman];
    newPenilaian[index].pancingan = Math.max(0, Math.min(5, newPenilaian[index].pancingan + delta));
    setPenilaianHalaman(newPenilaian);
  };

  const handleSubmit = () => {
    if (!selectedSantri || !selectedJuz) return;

    toast.success(
      nilaiTotal >= 70
        ? `Ujian Tasmi' lulus dengan predikat ${predikat.label}! 🎉`
        : "Ujian perlu diulang, semangat! 💪"
    );
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSubmit5Juz = () => {
    if (!selectedSantri || !selectedJuzDari || !selectedJuzSampai) return;

    toast.success("Ujian Tasmi' 5 Juz berhasil disimpan! 🎉");
    setIs5JuzDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedSantri("");
    setSelectedJuz("");
    setSelectedJuzDari("");
    setSelectedJuzSampai("");
    setCatatanUmum("");
    setPenilaianHalaman(Array.from({ length: 20 }, (_, i) => ({ halaman: i + 1, pancingan: 0 })));
  };

  const filteredHistory = mockHistory.filter(item => {
    if (filters.santri !== "all" && item.santriId !== filters.santri) return false;
    if (filters.halaqoh !== "all" && item.halaqohId !== filters.halaqoh) return false;
    return true;
  });

  return (
    <MobileLayout>
      <div className="p-4 space-y-4">
        {/* Header Card */}
        <Card className="bg-gradient-to-r from-amber-500 to-orange-500 border-0 text-white">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Ujian Tasmi'</h2>
                <p className="text-sm text-white/80">Ujian hafalan 1 juz</p>
              </div>
              <Award className="w-10 h-10 opacity-50" />
            </div>
          </CardContent>
        </Card>

        {/* Add Buttons */}
        <div className="space-y-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full h-12 bg-amber-600 hover:bg-amber-700">
                <Plus className="w-5 h-5 mr-2" />
                Ujian Baru
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] max-h-[85vh] overflow-y-auto rounded-xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  Form Ujian Tasmi'
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

                {/* Juz */}
                <JuzSelector value={selectedJuz} onValueChange={setSelectedJuz} required />

                {/* Nilai Total */}
                <Card className={nilaiTotal >= 70 ? "border-green-500/50 bg-green-500/5" : "border-red-500/50 bg-red-500/5"}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Nilai Total</p>
                        <p className="text-3xl font-bold">{nilaiTotal}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Predikat</p>
                        <Badge className={`${predikat.color} text-white`}>
                          {predikat.label}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Penilaian Per Halaman */}
                <div className="space-y-2">
                  <Label className="font-semibold">Penilaian Per Halaman</Label>
                  <p className="text-xs text-muted-foreground">
                    Nilai per halaman: 5 poin. Kurangi sesuai jumlah pancingan.
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {penilaianHalaman.map((h, idx) => (
                      <div key={idx} className="flex flex-col items-center p-2 border rounded-lg bg-card">
                        <span className="text-xs font-medium mb-1">Hal {h.halaman}</span>
                        <span className="text-sm font-bold text-primary mb-1">
                          {Math.max(0, 5 - h.pancingan)}
                        </span>
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handlePancingan(idx, -1)}
                          >
                            <ChevronDown className="h-3 w-3" />
                          </Button>
                          <span className="w-4 text-center text-xs">{h.pancingan}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handlePancingan(idx, 1)}
                          >
                            <ChevronUp className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Catatan */}
                <div className="space-y-2">
                  <Label>Catatan Tajwid</Label>
                  <Textarea
                    placeholder="Catatan perbaikan..."
                    value={catatanUmum}
                    onChange={(e) => setCatatanUmum(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button onClick={handleSubmit} className="w-full h-12 bg-amber-600 hover:bg-amber-700">
                  Simpan Hasil Ujian
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Tasmi' 5 Juz Button */}
          <Dialog open={is5JuzDialogOpen} onOpenChange={setIs5JuzDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full h-12 border-amber-600 text-amber-600 hover:bg-amber-50">
                <Layers className="w-5 h-5 mr-2" />
                Tasmi' 5 Juz
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] max-h-[85vh] overflow-y-auto rounded-xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-500" />
                  Form Tasmi' 5 Juz
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

                {/* Juz Range */}
                <div className="grid grid-cols-2 gap-4">
                  <JuzSelector value={selectedJuzDari} onValueChange={setSelectedJuzDari} label="Dari Juz" required />
                  <JuzSelector value={selectedJuzSampai} onValueChange={setSelectedJuzSampai} label="Sampai Juz" required />
                </div>

                {/* Catatan */}
                <div className="space-y-2">
                  <Label>Catatan</Label>
                  <Textarea
                    placeholder="Catatan ujian..."
                    value={catatanUmum}
                    onChange={(e) => setCatatanUmum(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button onClick={handleSubmit5Juz} className="w-full h-12 bg-amber-600 hover:bg-amber-700">
                  Simpan Hasil Ujian
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <MobileFilters onFilterChange={setFilters} />

        {/* Recent History */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground">Riwayat Ujian</h3>
          {filteredHistory.map((ujian) => {
            const pred = getPredikat(ujian.nilai);
            return (
              <Card key={ujian.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-semibold">{ujian.santri}</p>
                      <p className="text-sm text-muted-foreground">
                        {ujian.type === "5juz" ? "5 Juz" : getJuzName(ujian.juz)}
                      </p>
                      <p className="text-xs text-muted-foreground">{ujian.tanggal}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{ujian.nilai}</p>
                      <Badge className={`${pred.color} text-white`}>
                        {ujian.lulus ? (
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                        ) : (
                          <XCircle className="w-3 h-3 mr-1" />
                        )}
                        {ujian.predikat}
                      </Badge>
                    </div>
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
