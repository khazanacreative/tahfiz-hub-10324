import { useState } from "react";
import { MobileLayout } from "@/components/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, GraduationCap, CheckCircle2, XCircle, ChevronUp, ChevronDown, Info } from "lucide-react";
import { toast } from "sonner";
import { JuzSelector } from "@/components/JuzSelector";
import { MobileFilters, FilterValues } from "@/components/MobileFilters";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const mockSantri = [
  { id: "1", nama: "Muhammad Faiz", nis: "S001" },
  { id: "2", nama: "Fatimah Zahra", nis: "S003" },
  { id: "3", nama: "Aisyah Nur", nis: "S002" },
];

const mockHistory = [
  { id: 1, tanggal: "15/01/2025", santri: "Muhammad Faiz", santriId: "1", halaqohId: "1", materi: "Juz 1-2", nilai: 85, lulus: true },
  { id: 2, tanggal: "14/01/2025", santri: "Fatimah Zahra", santriId: "2", halaqohId: "2", materi: "Juz 1-2", nilai: 65, lulus: false },
  { id: 3, tanggal: "13/01/2025", santri: "Aisyah Nur", santriId: "3", halaqohId: "1", materi: "Juz 1-3", nilai: 78, lulus: true },
];

const KKM = 70;

interface SoalData {
  halaman: string;
  pengurangan: number;
}

export default function TahfidzMobile() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSantri, setSelectedSantri] = useState("");
  const [materiDari, setMateriDari] = useState("");
  const [materiSampai, setMateriSampai] = useState("");
  const [catatan, setCatatan] = useState("");
  const [soalData, setSoalData] = useState<SoalData[]>(
    Array.from({ length: 10 }, () => ({ halaman: "", pengurangan: 0 }))
  );
  const [filters, setFilters] = useState<FilterValues>({ periode: "all", halaqoh: "all", santri: "all" });

  const getNilaiSoal = (index: number) => 10 - soalData[index].pengurangan;
  const getTotalNilai = () => soalData.reduce((total, soal) => total + (10 - soal.pengurangan), 0);
  const isLulus = () => getTotalNilai() >= KKM;

  const handlePengurangan = (index: number, delta: number) => {
    const newSoalData = [...soalData];
    newSoalData[index].pengurangan = Math.max(0, Math.min(10, newSoalData[index].pengurangan + delta));
    setSoalData(newSoalData);
  };

  const handleHalamanChange = (index: number, value: string) => {
    const newSoalData = [...soalData];
    newSoalData[index].halaman = value;
    setSoalData(newSoalData);
  };

  const handleSubmit = () => {
    if (!selectedSantri || !materiDari || !materiSampai) return;

    toast.success(
      isLulus()
        ? `Ujian Tahfidz lulus dengan nilai ${getTotalNilai()}! 🎉`
        : "Ujian tidak lulus, perlu mengulang 💪"
    );
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedSantri("");
    setMateriDari("");
    setMateriSampai("");
    setCatatan("");
    setSoalData(Array.from({ length: 10 }, () => ({ halaman: "", pengurangan: 0 })));
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
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 border-0 text-white">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Ujian Tahfidz</h2>
                <p className="text-sm text-white/80">10 soal sambung ayat</p>
              </div>
              <GraduationCap className="w-10 h-10 opacity-50" />
            </div>
          </CardContent>
        </Card>

        {/* Add Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full h-12 bg-purple-600 hover:bg-purple-700">
              <Plus className="w-5 h-5 mr-2" />
              Ujian Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] max-h-[85vh] overflow-y-auto rounded-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-500" />
                Form Ujian Tahfidz
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              {/* Aturan */}
              <Card className="bg-purple-50 dark:bg-purple-950/30 border-purple-200">
                <CardContent className="pt-3 pb-3">
                  <div className="flex gap-2">
                    <Info className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-purple-800 dark:text-purple-200 space-y-1">
                      <p className="font-medium">Aturan Penilaian:</p>
                      <ul className="list-disc list-inside space-y-0.5">
                        <li>10 soal × 10 poin = 100 poin</li>
                        <li>Tiap baris sempurna = 2 poin</li>
                        <li>KKM = {KKM}</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

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

              {/* Materi Juz */}
              <div className="grid grid-cols-2 gap-4">
                <JuzSelector value={materiDari} onValueChange={setMateriDari} label="Dari Juz" />
                <JuzSelector value={materiSampai} onValueChange={setMateriSampai} label="Sampai Juz" />
              </div>

              {/* Nilai Total */}
              <Card className={isLulus() ? "border-green-500/50 bg-green-500/5" : "border-red-500/50 bg-red-500/5"}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Nilai</p>
                      <p className="text-3xl font-bold">{getTotalNilai()}</p>
                    </div>
                    <Badge className={isLulus() ? "bg-green-600" : "bg-red-600"}>
                      {isLulus() ? "LULUS" : "TIDAK LULUS"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* 10 Soal Accordion */}
              <div className="space-y-2">
                <Label className="font-semibold">Penilaian 10 Soal</Label>
                <Accordion type="multiple" className="space-y-2">
                  {soalData.map((soal, index) => (
                    <AccordionItem
                      key={index}
                      value={`soal-${index}`}
                      className="border rounded-lg px-3"
                    >
                      <AccordionTrigger className="hover:no-underline py-3">
                        <div className="flex items-center justify-between w-full pr-2">
                          <span className="font-medium text-sm">Soal {index + 1}</span>
                          <Badge
                            className={
                              getNilaiSoal(index) === 10
                                ? "bg-green-600"
                                : getNilaiSoal(index) >= 7
                                ? "bg-yellow-600"
                                : "bg-red-600"
                            }
                          >
                            {getNilaiSoal(index)}/10
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-4">
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <Label className="text-xs">Halaman</Label>
                            <Input
                              placeholder="Cth: 5"
                              value={soal.halaman}
                              onChange={(e) => handleHalamanChange(index, e.target.value)}
                              className="h-10"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Pengurangan Nilai</Label>
                            <div className="flex items-center gap-3">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handlePengurangan(index, -1)}
                              >
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                              <span className="w-10 text-center font-mono">
                                -{soal.pengurangan}
                              </span>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handlePengurangan(index, 1)}
                              >
                                <ChevronUp className="h-4 w-4" />
                              </Button>
                              <span className="text-sm text-muted-foreground">
                                = {getNilaiSoal(index)}/10
                              </span>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              {/* Catatan */}
              <div className="space-y-2">
                <Label>Catatan</Label>
                <Textarea
                  placeholder="Catatan umum..."
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  rows={3}
                />
              </div>

              <Button onClick={handleSubmit} className="w-full h-12 bg-purple-600 hover:bg-purple-700">
                Simpan Hasil Ujian
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Filters */}
        <MobileFilters onFilterChange={setFilters} />

        {/* Recent History */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground">Riwayat Ujian</h3>
          {filteredHistory.map((ujian) => (
            <Card key={ujian.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-semibold">{ujian.santri}</p>
                    <p className="text-sm text-muted-foreground">{ujian.materi}</p>
                    <p className="text-xs text-muted-foreground">{ujian.tanggal}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">{ujian.nilai}</p>
                    <Badge className={ujian.lulus ? "bg-green-600" : "bg-red-600"}>
                      {ujian.lulus ? (
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                      ) : (
                        <XCircle className="w-3 h-3 mr-1" />
                      )}
                      {ujian.lulus ? "Lulus" : "Tidak Lulus"}
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
