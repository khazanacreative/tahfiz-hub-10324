'use client';

import { useState, useMemo } from 'react';
import { useTahfidz } from '@/contexts/TahfidzContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  Plus, 
  Eye, 
  Calendar, 
  User, 
  Award, 
  BookOpen, 
  CheckCircle,
  TrendingUp,
  Users,
  Trash2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { TablePagination } from '@/components/tahfidz/TablePagination';
import { toast } from 'sonner';
import { generateRapor } from '@/lib/rapor-helper';
import { formatManzilShort } from '@/lib/ujian-helper';
import type { RaporSemester, Semester, TasmiMarhalah } from '@/lib/tahfidz-types';

export default function RaporPage() {
  const { data, currentUser, addRapor, deleteRapor, isLoading } = useTahfidz();
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState<boolean>(false);
  const [isBulkGenerateDialogOpen, setIsBulkGenerateDialogOpen] = useState<boolean>(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState<boolean>(false);
  const [selectedRapor, setSelectedRapor] = useState<RaporSemester | null>(null);
  const [isBulkGenerating, setIsBulkGenerating] = useState<boolean>(false);
  
  // Filter state
  const [selectedSantri, setSelectedSantri] = useState<string>('');
  const [tahunAjaran, setTahunAjaran] = useState<string>('2024/2025');
  const [semester, setSemester] = useState<Semester>('Ganjil');
  
  // Bulk generate state
  const [bulkTahunAjaran, setBulkTahunAjaran] = useState<string>('2024/2025');
  const [bulkSemester, setBulkSemester] = useState<Semester>('Ganjil');
  
  // Pagination & filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterSemester, setFilterSemester] = useState<string>('all');
  const [filterHalaqoh, setFilterHalaqoh] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  // Get filtered rapor
  const filteredRapor = useMemo(() => {
    let filtered = data.rapor;
    
    // Filter for Asatidz role - only show rapor from their halaqoh
    if (currentUser && currentUser.role === 'Asatidz') {
      const ustadzHalaqoh = data.halaqoh.filter((h) => h.id_asatidz === currentUser.id);
      const halaqohIds = ustadzHalaqoh.map((h) => h.id);
      const santriIds = data.santri
        .filter((s) => halaqohIds.includes(s.id_halaqoh))
        .map((s) => s.id);
      filtered = filtered.filter((r) => santriIds.includes(r.id_santri));
    }
    
    if (searchQuery) {
      filtered = filtered.filter((r) => 
        r.nama_santri.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.nis.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (filterSemester !== 'all') {
      filtered = filtered.filter((r) => r.semester === filterSemester);
    }
    
    if (filterHalaqoh !== 'all') {
      filtered = filtered.filter((r) => {
        const santri = data.santri.find((s) => s.id === r.id_santri);
        return santri?.id_halaqoh === filterHalaqoh;
      });
    }
    
    return filtered.sort((a, b) => 
      new Date(b.tanggal_dibuat).getTime() - new Date(a.tanggal_dibuat).getTime()
    );
  }, [data.rapor, data.santri, searchQuery, filterSemester, filterHalaqoh]);

  const totalPages = Math.ceil(filteredRapor.length / itemsPerPage);
  const paginatedRapor = filteredRapor.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get statistics
  const stats = useMemo(() => {
    return {
      totalRapor: data.rapor.length,
      ganjil: data.rapor.filter((r) => r.semester === 'Ganjil').length,
      genap: data.rapor.filter((r) => r.semester === 'Genap').length,
      tahunAjaranAktif: '2024/2025',
    };
  }, [data.rapor]);

  // Handle generate rapor
  const handleGenerateRapor = (): void => {
    if (!selectedSantri) {
      toast.error('Pilih santri terlebih dahulu');
      return;
    }

    const santri = data.santri.find((s) => s.id === selectedSantri);
    if (!santri) {
      toast.error('Data santri tidak ditemukan');
      return;
    }

    // Check if rapor already exists
    const existingRapor = data.rapor.find(
      (r) => r.id_santri === selectedSantri && 
             r.tahun_ajaran === tahunAjaran && 
             r.semester === semester
    );

    if (existingRapor) {
      toast.error(`Rapor untuk ${santri.nama_santri} semester ${semester} ${tahunAjaran} sudah ada`);
      return;
    }

    const halaqoh = data.halaqoh.find((h) => h.id === santri.id_halaqoh);
    const ustadz = data.users.find((u) => u.id === halaqoh?.id_asatidz);

    const raporData = generateRapor(
      santri,
      tahunAjaran,
      semester,
      data.penilaian,
      data.tasmi_marhalah,
      data.absensi,
      halaqoh?.nama_halaqoh || '-',
      ustadz?.nama_lengkap || '-',
      currentUser.id
    );

    addRapor(raporData);
    toast.success(`Rapor berhasil di-generate untuk ${santri.nama_santri}`);
    setIsGenerateDialogOpen(false);
    setSelectedSantri('');
  };

  // Handle bulk generate rapor for all students
  const handleBulkGenerateRapor = async (): Promise<void> => {
    setIsBulkGenerating(true);
    
    const activeSantri = data.santri.filter((s) => s.status === 'Aktif');
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const santri of activeSantri) {
      try {
        // Check if rapor already exists
        const existingRapor = data.rapor.find(
          (r) => r.id_santri === santri.id && 
                 r.tahun_ajaran === bulkTahunAjaran && 
                 r.semester === bulkSemester
        );

        if (existingRapor) {
          skipCount++;
          continue;
        }

        const halaqoh = data.halaqoh.find((h) => h.id === santri.id_halaqoh);
        const ustadz = data.users.find((u) => u.id === halaqoh?.id_asatidz);

        const raporData = generateRapor(
          santri,
          bulkTahunAjaran,
          bulkSemester,
          data.penilaian,
          data.tasmi_marhalah,
          data.absensi,
          halaqoh?.nama_halaqoh || '-',
          ustadz?.nama_lengkap || '-',
          currentUser.id
        );

        addRapor(raporData);
        successCount++;
        
        // Small delay to prevent overwhelming the system
        await new Promise((resolve) => setTimeout(resolve, 50));
      } catch (error) {
        errorCount++;
        console.error(`Error generating rapor for ${santri.nama_santri}:`, error);
      }
    }

    setIsBulkGenerating(false);
    setIsBulkGenerateDialogOpen(false);
    
    // Show summary toast
    if (successCount > 0) {
      toast.success(
        `Berhasil generate ${successCount} rapor. ${skipCount > 0 ? `${skipCount} sudah ada.` : ''} ${errorCount > 0 ? `${errorCount} gagal.` : ''}`
      );
    } else if (skipCount > 0) {
      toast.info(`Semua rapor (${skipCount}) sudah ada untuk periode ini.`);
    } else {
      toast.error('Tidak ada rapor yang di-generate.');
    }
  };

  // Handle view rapor
  const handleViewRapor = (rapor: RaporSemester): void => {
    setSelectedRapor(rapor);
    setIsViewDialogOpen(true);
  };

  // Handle export PDF (simulasi)
  const handleExportPDF = (rapor: RaporSemester): void => {
    toast.info('Fitur export PDF akan segera hadir!');
    // TODO: Implement PDF export using jsPDF or similar
  };

  // Handle delete
  const handleDelete = (id: string): void => {
    if (confirm('Yakin ingin menghapus rapor ini?')) {
      deleteRapor(id);
      toast.success('Rapor berhasil dihapus');
    }
  };

  // Get tasmi marhalah details from rapor (already stored)
  const getTasmiDetailsForRapor = (raporData: RaporSemester): TasmiMarhalah[] => {
    // Return the stored detail_tasmi_marhalah
    return raporData.detail_tasmi_marhalah || [];
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Memuat data...</p>
        </div>
      </div>
    );
  }

  // Check if user is logged in
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Akses Ditolak</CardTitle>
            <CardDescription>Silakan login terlebih dahulu</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
            Rapor Semester Tahfidz
          </h1>
          <p className="text-muted-foreground mt-1">
            Kelola rapor semester untuk setiap santri
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsBulkGenerateDialogOpen(true)}
            variant="outline"
            className="border-emerald-600 text-emerald-700 hover:bg-emerald-50"
          >
            <Users className="h-4 w-4 mr-2" />
            Generate Semua Siswa
          </Button>
          <Button
            onClick={() => setIsGenerateDialogOpen(true)}
            className="bg-gradient-to-r from-emerald-600 to-lime-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Generate Rapor
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-emerald-200">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Total Rapor
            </CardDescription>
            <CardTitle className="text-3xl text-emerald-700">{stats.totalRapor}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-lime-200">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Semester Ganjil
            </CardDescription>
            <CardTitle className="text-3xl text-lime-700">{stats.ganjil}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-yellow-200">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Semester Genap
            </CardDescription>
            <CardTitle className="text-3xl text-yellow-700">{stats.genap}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Tahun Ajaran
            </CardDescription>
            <CardTitle className="text-2xl text-blue-700">{stats.tahunAjaranAktif}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label>Cari Santri</Label>
              <Input
                placeholder="Cari nama atau NIS..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="mt-2"
              />
            </div>
            <div className="w-full md:w-48">
              <Label>Filter Semester</Label>
              <Select value={filterSemester} onValueChange={(v) => { setFilterSemester(v); setCurrentPage(1); }}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Semester</SelectItem>
                  <SelectItem value="Ganjil">Semester Ganjil</SelectItem>
                  <SelectItem value="Genap">Semester Genap</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48">
              <Label>Filter Halaqoh</Label>
              <Select value={filterHalaqoh} onValueChange={(v) => { setFilterHalaqoh(v); setCurrentPage(1); }}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Halaqoh</SelectItem>
                  {(() => {
                    let halaqohList = data.halaqoh;
                    if (currentUser && currentUser.role === 'Asatidz') {
                      halaqohList = data.halaqoh.filter((h) => h.id_asatidz === currentUser.id);
                    }
                    return halaqohList.map((h) => (
                      <SelectItem key={h.id} value={h.id}>
                        {h.nama_halaqoh}
                      </SelectItem>
                    ));
                  })()}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rapor List */}
      <div className="space-y-4">
        {paginatedRapor.length > 0 ? (
          <>
            {paginatedRapor.map((rapor) => (
            <Card key={rapor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{rapor.nama_santri}</CardTitle>
                      <Badge variant="outline">{rapor.nis}</Badge>
                      <Badge className="bg-emerald-600">{rapor.halaqoh}</Badge>
                    </div>
                    <CardDescription className="flex items-center gap-4 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {rapor.semester} {rapor.tahun_ajaran}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {rapor.ustadz_pembimbing}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {rapor.total_juz} Juz
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        {rapor.rata_rata_kelancaran}/100
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewRapor(rapor)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Lihat
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportPDF(rapor)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(rapor.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Total Tasmi':</span>
                    <span className="ml-2 font-semibold text-emerald-700">
                      {rapor.manzil_1_lulus + rapor.manzil_2_lulus + rapor.manzil_3_lulus + rapor.manzil_4_lulus + rapor.manzil_5_lulus} ujian
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Progress:</span>
                    <span className="ml-2 font-semibold text-lime-700">
                      Manzil 1-5 (✓ {Math.max(rapor.manzil_1_lulus, rapor.manzil_2_lulus, rapor.manzil_3_lulus, rapor.manzil_4_lulus, rapor.manzil_5_lulus) > 0 ? 'Ada' : 'Belum'})
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            ))}
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredRapor.length}
              itemsPerPage={itemsPerPage}
            />
          </>
        ) : (
          <Card className="border-2 border-dashed">
            <CardContent className="py-10 text-center">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchQuery || filterSemester !== 'all' 
                  ? 'Tidak ada rapor yang sesuai dengan filter'
                  : 'Belum ada rapor. Klik tombol "Generate Rapor" untuk membuat rapor baru.'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialog Generate Rapor */}
      <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Rapor Semester</DialogTitle>
            <DialogDescription>
              Pilih santri dan periode untuk membuat rapor otomatis
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Pilih Santri */}
            <div>
              <Label>Pilih Santri *</Label>
              <Select value={selectedSantri} onValueChange={setSelectedSantri}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Pilih santri" />
                </SelectTrigger>
                <SelectContent>
                  {data.santri
                    .filter((s) => s.status === 'Aktif')
                    .map((s) => {
                      const halaqoh = data.halaqoh.find((h) => h.id === s.id_halaqoh);
                      return (
                        <SelectItem key={s.id} value={s.id}>
                          {s.nama_santri} - {halaqoh?.nama_halaqoh}
                        </SelectItem>
                      );
                    })}
                </SelectContent>
              </Select>
            </div>

            {/* Tahun Ajaran */}
            <div>
              <Label>Tahun Ajaran *</Label>
              <Input
                value={tahunAjaran}
                onChange={(e) => setTahunAjaran(e.target.value)}
                placeholder="2024/2025"
                className="mt-2"
              />
            </div>

            {/* Semester */}
            <div>
              <Label>Semester *</Label>
              <Select value={semester} onValueChange={(v) => setSemester(v as Semester)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ganjil">Semester Ganjil</SelectItem>
                  <SelectItem value="Genap">Semester Genap</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                ℹ️ Rapor akan di-generate otomatis dari data setoran, tasmi&apos; marhalah, 
                penilaian, dan absensi santri pada periode yang dipilih.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGenerateDialogOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={handleGenerateRapor}
              className="bg-gradient-to-r from-emerald-600 to-lime-600"
            >
              <FileText className="h-4 w-4 mr-2" />
              Generate Rapor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Bulk Generate Rapor */}
      <Dialog open={isBulkGenerateDialogOpen} onOpenChange={setIsBulkGenerateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Generate Rapor untuk Semua Siswa
            </DialogTitle>
            <DialogDescription>
              Generate rapor untuk semua santri aktif sekaligus
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Tahun Ajaran */}
            <div>
              <Label>Tahun Ajaran *</Label>
              <Input
                value={bulkTahunAjaran}
                onChange={(e) => setBulkTahunAjaran(e.target.value)}
                placeholder="2024/2025"
                className="mt-2"
              />
            </div>

            {/* Semester */}
            <div>
              <Label>Semester *</Label>
              <Select value={bulkSemester} onValueChange={(v) => setBulkSemester(v as Semester)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ganjil">Semester Ganjil</SelectItem>
                  <SelectItem value="Genap">Semester Genap</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-800 dark:text-amber-300">
                ⚠️ Proses ini akan membuat rapor untuk <strong>{data.santri.filter((s) => s.status === 'Aktif').length} santri aktif</strong>. 
                Rapor yang sudah ada akan dilewati.
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                ℹ️ Setiap rapor akan di-generate berdasarkan data tasmi&apos; marhalah, 
                penilaian, dan absensi masing-masing santri pada periode yang dipilih.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsBulkGenerateDialogOpen(false)}
              disabled={isBulkGenerating}
            >
              Batal
            </Button>
            <Button
              onClick={handleBulkGenerateRapor}
              className="bg-gradient-to-r from-emerald-600 to-lime-600"
              disabled={isBulkGenerating}
            >
              {isBulkGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <Users className="h-4 w-4 mr-2" />
                  Generate Semua
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog View Rapor Detail */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Rapor Semester Tahfidz
            </DialogTitle>
          </DialogHeader>

          {selectedRapor && (() => {
            const tasmiDetails = getTasmiDetailsForRapor(selectedRapor);
            const groupedByManzil = {
              'Manzil1_3to5Baris': tasmiDetails.filter((t) => t.manzil === 'Manzil1_3to5Baris'),
              'Manzil2_PerHalaman': tasmiDetails.filter((t) => t.manzil === 'Manzil2_PerHalaman'),
              'Manzil3_Per5Halaman': tasmiDetails.filter((t) => t.manzil === 'Manzil3_Per5Halaman'),
              'Manzil4_PerSetengahJuz': tasmiDetails.filter((t) => t.manzil === 'Manzil4_PerSetengahJuz'),
              'Manzil5_PerJuz': tasmiDetails.filter((t) => t.manzil === 'Manzil5_PerJuz'),
            };

            return (
              <div className="space-y-6">
                {/* Header Info */}
                <Card className="bg-gradient-to-br from-emerald-50 to-lime-50 dark:from-emerald-950/20 dark:to-lime-950/20">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Nama Santri</p>
                        <p className="font-bold text-lg">{selectedRapor.nama_santri}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">NIS</p>
                        <p className="font-bold">{selectedRapor.nis}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Halaqoh</p>
                        <p className="font-semibold">{selectedRapor.halaqoh}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Ustadz Pembimbing</p>
                        <p className="font-semibold">{selectedRapor.ustadz_pembimbing}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Periode</p>
                        <p className="font-semibold">{selectedRapor.semester} {selectedRapor.tahun_ajaran}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Tanggal Dibuat</p>
                        <p className="font-semibold">
                          {new Date(selectedRapor.tanggal_dibuat).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Tabs defaultValue="hafalan" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="hafalan">Hafalan</TabsTrigger>
                    <TabsTrigger value="penilaian">Penilaian</TabsTrigger>
                    <TabsTrigger value="kehadiran">Kehadiran</TabsTrigger>
                    <TabsTrigger value="catatan">Catatan</TabsTrigger>
                  </TabsList>

                  {/* Tab Hafalan */}
                  <TabsContent value="hafalan" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Statistik Hafalan</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">Total Juz</p>
                            <p className="text-3xl font-bold text-emerald-700">{selectedRapor.total_juz}</p>
                          </div>
                          <div className="text-center p-4 bg-lime-50 dark:bg-lime-950/20 rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">Total Halaman</p>
                            <p className="text-3xl font-bold text-lime-700">{selectedRapor.total_halaman}</p>
                          </div>
                          <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">Total Ayat</p>
                            <p className="text-3xl font-bold text-yellow-700">{selectedRapor.total_ayat}</p>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h4 className="font-semibold mb-3">Progress Manzil</h4>
                          <div className="grid grid-cols-5 gap-3">
                            {[
                              { label: 'Manzil 1', value: selectedRapor.manzil_1_lulus, color: 'bg-emerald-100' },
                              { label: 'Manzil 2', value: selectedRapor.manzil_2_lulus, color: 'bg-lime-100' },
                              { label: 'Manzil 3', value: selectedRapor.manzil_3_lulus, color: 'bg-yellow-100' },
                              { label: 'Manzil 4', value: selectedRapor.manzil_4_lulus, color: 'bg-orange-100' },
                              { label: 'Manzil 5', value: selectedRapor.manzil_5_lulus, color: 'bg-red-100' },
                            ].map((m) => (
                              <div key={m.label} className={`${m.color} p-3 rounded-lg text-center`}>
                                <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                                <p className="text-2xl font-bold">{m.value}</p>
                                <CheckCircle className="h-4 w-4 mx-auto mt-1 text-emerald-600" />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Detail Tasmi per Manzil */}
                        <Separator />
                        <div className="space-y-3">
                          <h4 className="font-semibold">Detail Tasmi&apos; per Manzil</h4>
                          {Object.entries(groupedByManzil).map(([manzil, tasmiList]) => {
                            if (tasmiList.length === 0) return null;
                            const manzilColors: Record<string, string> = {
                              'Manzil1_3to5Baris': 'border-emerald-200 bg-emerald-50/30 dark:bg-emerald-950/30',
                              'Manzil2_PerHalaman': 'border-lime-200 bg-lime-50/30 dark:bg-lime-950/30',
                              'Manzil3_Per5Halaman': 'border-yellow-200 bg-yellow-50/30 dark:bg-yellow-950/30',
                              'Manzil4_PerSetengahJuz': 'border-orange-200 bg-orange-50/30 dark:bg-orange-950/30',
                              'Manzil5_PerJuz': 'border-red-200 bg-red-50/30 dark:bg-red-950/30',
                            };
                            return (
                              <Card key={manzil} className={manzilColors[manzil]}>
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-sm font-semibold flex items-center justify-between">
                                    <span>{formatManzilShort(manzil as any)}</span>
                                    <Badge variant="secondary">{tasmiList.length} tasmi&apos;</Badge>
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                                  {tasmiList.map((tasmi) => (
                                    <div key={tasmi.id} className="flex items-start justify-between text-xs border-b pb-3 last:border-0 gap-3">
                                      <div className="flex-1">
                                        <p className="font-semibold text-sm">{tasmi.surah}</p>
                                        <p className="text-muted-foreground mt-0.5">
                                          Ayat {tasmi.ayat_dari}-{tasmi.ayat_sampai}
                                        </p>
                                        <p className="text-muted-foreground text-xs mt-0.5">
                                          {new Date(tasmi.tanggal_tasmi).toLocaleDateString('id-ID', { 
                                            weekday: 'short', 
                                            year: 'numeric', 
                                            month: 'short', 
                                            day: 'numeric' 
                                          })}
                                        </p>
                                        <div className="mt-2 space-y-1">
                                          <p className="text-xs">
                                            <span className="font-medium">Kelancaran:</span> {tasmi.kelancaran}/100
                                          </p>
                                          <p className="text-xs">
                                            <span className="font-medium">Kesalahan:</span> {tasmi.jumlah_kesalahan}
                                          </p>
                                          {tasmi.catatan_tajwid && (
                                            <p className="text-xs">
                                              <span className="font-medium">Tajwid:</span> {tasmi.catatan_tajwid}
                                            </p>
                                          )}
                                          {tasmi.catatan_fashahah && (
                                            <p className="text-xs">
                                              <span className="font-medium">Fashahah:</span> {tasmi.catatan_fashahah}
                                            </p>
                                          )}
                                          {tasmi.catatan_umum && (
                                            <p className="text-xs italic text-muted-foreground mt-1">
                                              {tasmi.catatan_umum}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                      <div className="text-right flex-shrink-0">
                                        <Badge variant={tasmi.status === 'Lulus' ? 'default' : 'destructive'} className="text-xs">
                                          {tasmi.status}
                                        </Badge>
                                        <p className="text-muted-foreground mt-2 text-xs">
                                          {tasmi.total_ayat} ayat
                                        </p>
                                        <p className="text-muted-foreground text-xs">
                                          {tasmi.total_halaman} hal
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                  {tasmiList.length === 0 && (
                                    <p className="text-xs text-muted-foreground text-center py-4">
                                      Belum ada tasmi&apos; di manzil ini
                                    </p>
                                  )}
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>

                        {selectedRapor.juz_dikuasai.length > 0 && (
                          <>
                            <Separator />
                            <div>
                              <h4 className="font-semibold mb-2">Juz yang Dikuasai</h4>
                              <div className="flex flex-wrap gap-2">
                                {selectedRapor.juz_dikuasai.map((juz) => (
                                  <Badge key={juz} className="bg-emerald-600">
                                    Juz {juz}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Tab Penilaian */}
                  <TabsContent value="penilaian" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Kelancaran Rata-rata</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-muted-foreground">Nilai</span>
                          <span className="text-3xl font-bold text-emerald-700">
                            {selectedRapor.rata_rata_kelancaran}/100
                          </span>
                        </div>
                        <Progress value={selectedRapor.rata_rata_kelancaran} className="h-3" />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Analisis Tajwid</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {selectedRapor.poin_kuat_tajwid.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-emerald-700 mb-2">✓ Poin Kuat</h4>
                            <ul className="space-y-1">
                              {selectedRapor.poin_kuat_tajwid.map((poin, i) => (
                                <li key={i} className="text-sm flex items-start gap-2">
                                  <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                  <span>{poin}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {selectedRapor.poin_perlu_perbaikan_tajwid.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-amber-700 mb-2">⚠ Perlu Perbaikan</h4>
                            <ul className="space-y-1">
                              {selectedRapor.poin_perlu_perbaikan_tajwid.map((poin, i) => (
                                <li key={i} className="text-sm flex items-start gap-2">
                                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                  <span>{poin}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Analisis Fashahah (Makharijul Huruf)</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {selectedRapor.poin_kuat_fashahah.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-emerald-700 mb-2">✓ Poin Kuat</h4>
                            <ul className="space-y-1">
                              {selectedRapor.poin_kuat_fashahah.map((poin, i) => (
                                <li key={i} className="text-sm flex items-start gap-2">
                                  <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                  <span>{poin}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {selectedRapor.poin_perlu_perbaikan_fashahah.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-amber-700 mb-2">⚠ Perlu Perbaikan</h4>
                            <ul className="space-y-1">
                              {selectedRapor.poin_perlu_perbaikan_fashahah.map((poin, i) => (
                                <li key={i} className="text-sm flex items-start gap-2">
                                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                  <span>{poin}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Tab Kehadiran */}
                  <TabsContent value="kehadiran" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Statistik Kehadiran</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-muted-foreground">Persentase Kehadiran</span>
                          <span className="text-3xl font-bold text-emerald-700">
                            {selectedRapor.persentase_kehadiran}%
                          </span>
                        </div>
                        <Progress value={selectedRapor.persentase_kehadiran} className="h-3" />

                        <Separator />

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">Hadir</p>
                            <p className="text-2xl font-bold text-emerald-700">{selectedRapor.total_hadir}</p>
                          </div>
                          <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">Izin</p>
                            <p className="text-2xl font-bold text-blue-700">{selectedRapor.total_izin}</p>
                          </div>
                          <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">Sakit</p>
                            <p className="text-2xl font-bold text-yellow-700">{selectedRapor.total_sakit}</p>
                          </div>
                          <div className="text-center p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">Alfa</p>
                            <p className="text-2xl font-bold text-red-700">{selectedRapor.total_alfa}</p>
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                          <p className="text-sm">
                            <span className="font-semibold">Total Pertemuan:</span> {selectedRapor.total_pertemuan} hari
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Tab Catatan */}
                  <TabsContent value="catatan" className="space-y-4">
                    {selectedRapor.prestasi && selectedRapor.prestasi.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Award className="h-5 w-5 text-yellow-600" />
                            Prestasi
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {selectedRapor.prestasi.map((p, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-yellow-600">⭐</span>
                                <span>{p}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {selectedRapor.catatan_ustadz && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Catatan Ustadz</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm leading-relaxed">{selectedRapor.catatan_ustadz}</p>
                        </CardContent>
                      </Card>
                    )}

                    {selectedRapor.rekomendasi && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Rekomendasi</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm leading-relaxed">{selectedRapor.rekomendasi}</p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                    Tutup
                  </Button>
                  <Button
                    onClick={() => handleExportPDF(selectedRapor)}
                    className="bg-gradient-to-r from-emerald-600 to-lime-600"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
