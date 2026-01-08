import { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import { useTahfidz } from '@/contexts/TahfidzContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, Plus, Calendar, User, CheckCircle, XCircle, AlertCircle, Trash2, X } from 'lucide-react';
import { TablePagination } from '@/components/tahfidz/TablePagination';
import { toast } from 'sonner';
import { formatManzilLabel, formatManzilShort, hitungNilaiKelancaran, cekSyaratManzil } from '@/lib/ujian-helper';
import type { ManzilTahfidz, StatusManzil, Santri, TasmiMarhalah } from '@/lib/tahfidz-types';
import { surahList, getSurahByNumber } from '@/lib/quran-data';

type SelectionMode = 'surah' | 'page';

interface SurahSelection {
  id: string;
  surah: string;
  ayat_dari: number;
  ayat_sampai: number;
}

export default function UjianTahapanPage() {
  const { data, currentUser, addTasmiMarhalah, deleteTasmiMarhalah, isLoading } = useTahfidz();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedManzil, setSelectedManzil] = useState<ManzilTahfidz>('Manzil1_3to5Baris');
  const [selectedSantri, setSelectedSantri] = useState<string>('');
  const [filterHalaqoh, setFilterHalaqoh] = useState<string>('all');
  const [filterSantri, setFilterSantri] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('surah');
  const [selectedTasmiForDetail, setSelectedTasmiForDetail] = useState<TasmiMarhalah | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState<boolean>(false);

  // Form state
  const [formData, setFormData] = useState({
    juz: '1',
    total_halaman: '5',
    jumlah_kesalahan: '0',
    kelancaran: '100',
    catatan_tajwid: '',
    catatan_fashahah: '',
    total_ayat: '',
    total_baris: '35',
    status: 'Lulus' as StatusManzil,
    perlu_murajaah: false,
    ayat_yang_perlu_diulang: '',
    catatan_umum: '',
    page_dari: 1,
    page_sampai: 1,
  });

  const [surahSelections, setSurahSelections] = useState<SurahSelection[]>([
    {
      id: Math.random().toString(36).substr(2, 9),
      surah: 'Al-Fatihah',
      ayat_dari: 1,
      ayat_sampai: 7,
    }
  ]);

  // Get santri filtered by halaqoh
  const filteredSantri = useMemo(() => {
    let santriList = data.santri.filter((s) => s.status === 'Aktif');
    
    // Filter for Asatidz role - only show their assigned santri
    if (currentUser && currentUser.role === 'Asatidz') {
      const ustadzHalaqoh = data.halaqoh.filter((h) => h.id_asatidz === currentUser.id);
      const halaqohIds = ustadzHalaqoh.map((h) => h.id);
      santriList = santriList.filter((s) => halaqohIds.includes(s.id_halaqoh));
    }
    
    if (filterHalaqoh !== 'all') {
      santriList = santriList.filter((s) => s.id_halaqoh === filterHalaqoh);
    }
    return santriList;
  }, [data.santri, data.halaqoh, currentUser, filterHalaqoh]);

  // Get ujian tahapan stats
  const stats = useMemo(() => {
    const allTasmi = data.tasmi_marhalah;
    return {
      total: allTasmi.length,
      manzil1Lulus: allTasmi.filter((t) => t.manzil === 'Manzil1_3to5Baris' && t.status === 'Lulus').length,
      manzil2Lulus: allTasmi.filter((t) => t.manzil === 'Manzil2_PerHalaman' && t.status === 'Lulus').length,
      manzil3Lulus: allTasmi.filter((t) => t.manzil === 'Manzil3_Per5Halaman' && t.status === 'Lulus').length,
      manzil4Lulus: allTasmi.filter((t) => t.manzil === 'Manzil4_PerSetengahJuz' && t.status === 'Lulus').length,
      manzil5Lulus: allTasmi.filter((t) => t.manzil === 'Manzil5_PerJuz' && t.status === 'Lulus').length,
    };
  }, [data.tasmi_marhalah]);

  // Get ujian by tab, halaqoh, and santri filter
  const getTasmiByTab = (tab: string): TasmiMarhalah[] => {
    let filtered = data.tasmi_marhalah;
    
    // Filter for Asatidz role - only show tasmi from their halaqoh santri
    if (currentUser && currentUser.role === 'Asatidz') {
      const ustadzHalaqoh = data.halaqoh.filter((h) => h.id_asatidz === currentUser.id);
      const halaqohIds = ustadzHalaqoh.map((h) => h.id);
      const santriIds = data.santri
        .filter((s) => halaqohIds.includes(s.id_halaqoh))
        .map((s) => s.id);
      filtered = filtered.filter((t) => santriIds.includes(t.id_santri));
    }
    
    // Filter by tab
    if (tab !== 'all') {
      filtered = filtered.filter((t) => t.manzil === tab);
    }
    
    // Filter by halaqoh
    if (filterHalaqoh !== 'all') {
      filtered = filtered.filter((t) => {
        const santri = data.santri.find((s) => s.id === t.id_santri);
        return santri?.id_halaqoh === filterHalaqoh;
      });
    }
    
    // Filter by santri
    if (filterSantri !== 'all') {
      filtered = filtered.filter((t) => t.id_santri === filterSantri);
    }
    
    // Sort by date descending (newest first)
    filtered.sort((a, b) => {
      const dateA = new Date(a.tanggal_tasmi).getTime();
      const dateB = new Date(b.tanggal_tasmi).getTime();
      return dateB - dateA;
    });
    
    return filtered;
  };

  // Pagination
  const getPaginatedTasmi = (tasmiList: TasmiMarhalah[]) => {
    const totalPages = Math.ceil(tasmiList.length / itemsPerPage);
    const paginatedList = tasmiList.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
    return { paginatedList, totalPages, totalItems: tasmiList.length };
  };

  // Get available surahs by juz
  const availableSurahs = useMemo(() => {
    return surahList.filter(s => 
      s.juzStart <= parseInt(formData.juz) && s.juzEnd >= parseInt(formData.juz)
    );
  }, [formData.juz]);

  // Handle kesalahan change
  const handleKesalahanChange = (value: string): void => {
    const kesalahan = parseInt(value) || 0;
    const kelancaran = hitungNilaiKelancaran(100, kesalahan);
    setFormData({
      ...formData,
      jumlah_kesalahan: kesalahan.toString(),
      kelancaran: kelancaran.toString(),
    });
  };

  const addSurahSelection = (): void => {
    const firstSurah = availableSurahs[0];
    setSurahSelections([
      ...surahSelections,
      {
        id: Math.random().toString(36).substr(2, 9),
        surah: firstSurah?.name || 'Al-Fatihah',
        ayat_dari: 1,
        ayat_sampai: 1,
      }
    ]);
  };

  const removeSurahSelection = (id: string): void => {
    if (surahSelections.length > 1) {
      setSurahSelections(surahSelections.filter(s => s.id !== id));
    }
  };

  const updateSurahSelection = (id: string, updates: Partial<SurahSelection>): void => {
    setSurahSelections(surahSelections.map(s => 
      s.id === id ? { ...s, ...updates } : s
    ));
  };

  // Handle submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!selectedSantri) {
      toast.error('Pilih santri terlebih dahulu');
      return;
    }

    // Calculate total ayat
    let totalAyatCalculated = 0;
    if (selectionMode === 'surah') {
      totalAyatCalculated = surahSelections.reduce((sum, sel) => {
        return sum + (sel.ayat_sampai - sel.ayat_dari + 1);
      }, 0);
    } else {
      totalAyatCalculated = (formData.page_sampai - formData.page_dari + 1) * 10; // Approximate
    }

    // Combine surah info
    const surahInfo = selectionMode === 'surah' 
      ? surahSelections.map(s => `${s.surah} (${s.ayat_dari}-${s.ayat_sampai})`).join(', ')
      : `Halaman ${formData.page_dari}-${formData.page_sampai}`;

    const newTasmi: Omit<TasmiMarhalah, 'id'> = {
      id_santri: selectedSantri,
      id_asatidz: currentUser.id,
      manzil: selectedManzil,
      tanggal_tasmi: new Date().toISOString().split('T')[0],
      juz: parseInt(formData.juz),
      surah: surahInfo,
      ayat_dari: surahSelections[0].ayat_dari,
      ayat_sampai: surahSelections[surahSelections.length - 1].ayat_sampai,
      total_ayat: totalAyatCalculated,
      total_halaman: parseInt(formData.total_halaman),
      total_baris: formData.total_baris ? parseInt(formData.total_baris) : undefined,
      kelancaran: parseInt(formData.kelancaran),
      jumlah_kesalahan: parseInt(formData.jumlah_kesalahan),
      catatan_tajwid: formData.catatan_tajwid,
      catatan_fashahah: formData.catatan_fashahah,
      status: formData.status,
      perlu_murajaah: formData.perlu_murajaah,
      ayat_yang_perlu_diulang: formData.ayat_yang_perlu_diulang,
      catatan_umum: formData.catatan_umum,
      tanggal_selesai: new Date().toISOString().split('T')[0],
    };

    addTasmiMarhalah(newTasmi);
    toast.success('Tasmi\' marhalah berhasil ditambahkan');
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = (): void => {
    setSelectedSantri('');
    setSelectionMode('surah');
    setFormData({
      juz: '1',
      total_halaman: '5',
      total_baris: '35',
      jumlah_kesalahan: '0',
      kelancaran: '100',
      catatan_tajwid: '',
      catatan_fashahah: '',
      total_ayat: '',
      status: 'Lulus',
      perlu_murajaah: false,
      ayat_yang_perlu_diulang: '',
      catatan_umum: '',
      page_dari: 1,
      page_sampai: 1,
    });
    setSurahSelections([{
      id: Math.random().toString(36).substr(2, 9),
      surah: 'Al-Fatihah',
      ayat_dari: 1,
      ayat_sampai: 7,
    }]);
  };

  const handleDelete = (id: string): void => {
    if (confirm('Yakin ingin menghapus data tasmi\' ini?')) {
      deleteTasmiMarhalah(id);
      toast.success('Tasmi\' marhalah berhasil dihapus');
    }
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
    <Layout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
            Tasmi' Marhalah
          </h1>
          <p className="text-muted-foreground mt-1">
            Kelola tasmi' marhalah (ujian tahapan hafalan) santri
          </p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-gradient-to-r from-emerald-600 to-lime-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Tasmi'
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="border-emerald-200">
          <CardHeader className="pb-3">
            <CardDescription>Total Tasmi'</CardDescription>
            <CardTitle className="text-2xl text-emerald-700">{stats.total}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-lime-200">
          <CardHeader className="pb-3">
            <CardDescription>Manzil 1</CardDescription>
            <CardTitle className="text-2xl text-lime-700">{stats.manzil1Lulus}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-yellow-200">
          <CardHeader className="pb-3">
            <CardDescription>Manzil 2</CardDescription>
            <CardTitle className="text-2xl text-yellow-700">{stats.manzil2Lulus}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-orange-200">
          <CardHeader className="pb-3">
            <CardDescription>Manzil 3</CardDescription>
            <CardTitle className="text-2xl text-orange-700">{stats.manzil3Lulus}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-amber-200">
          <CardHeader className="pb-3">
            <CardDescription>Manzil 4</CardDescription>
            <CardTitle className="text-2xl text-amber-700">{stats.manzil4Lulus}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-red-200">
          <CardHeader className="pb-3">
            <CardDescription>Manzil 5</CardDescription>
            <CardTitle className="text-2xl text-red-700">{stats.manzil5Lulus}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full sm:w-64">
              <Label>Filter Santri</Label>
              <Select value={filterSantri} onValueChange={(v) => { setFilterSantri(v); setCurrentPage(1); }}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Pilih Santri" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Santri</SelectItem>
                  {(() => {
                    let santriList = data.santri.filter((s) => s.status === 'Aktif');
                    if (currentUser && currentUser.role === 'Asatidz') {
                      const ustadzHalaqoh = data.halaqoh.filter((h) => h.id_asatidz === currentUser.id);
                      const halaqohIds = ustadzHalaqoh.map((h) => h.id);
                      santriList = santriList.filter((s) => halaqohIds.includes(s.id_halaqoh));
                    }
                    return santriList.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.nama_santri}
                      </SelectItem>
                    ));
                  })()}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-64">
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

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="all">Semua</TabsTrigger>
          <TabsTrigger value="Manzil1_3to5Baris">Manzil 1</TabsTrigger>
          <TabsTrigger value="Manzil2_PerHalaman">Manzil 2</TabsTrigger>
          <TabsTrigger value="Manzil3_Per5Halaman">Manzil 3</TabsTrigger>
          <TabsTrigger value="Manzil4_PerSetengahJuz">Manzil 4</TabsTrigger>
          <TabsTrigger value="Manzil5_PerJuz">Manzil 5</TabsTrigger>
        </TabsList>

        {['all', 'Manzil1_3to5Baris', 'Manzil2_PerHalaman', 'Manzil3_Per5Halaman', 'Manzil4_PerSetengahJuz', 'Manzil5_PerJuz'].map((tab) => {
          const tasmiForTab = getTasmiByTab(tab);
          const { paginatedList, totalPages, totalItems } = getPaginatedTasmi(tasmiForTab);
          
          return (
            <TabsContent key={tab} value={tab} className="space-y-4 mt-4">
              {paginatedList.length > 0 ? (
                <>
                  {paginatedList.map((tasmi) => {
                const santri = data.santri.find((s) => s.id === tasmi.id_santri);
                const asatidz = data.users.find((u) => u.id === tasmi.id_asatidz);
                const halaqoh = data.halaqoh.find((h) => h.id === santri?.id_halaqoh);

                return (
                  <Card 
                    key={tasmi.id} 
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => {
                      setSelectedTasmiForDetail(tasmi);
                      setIsDetailDialogOpen(true);
                    }}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <CardTitle className="text-lg">
                              {santri?.nama_santri || 'N/A'}
                            </CardTitle>
                            <Badge variant="outline">{santri?.nis}</Badge>
                            <Badge className="bg-emerald-600">{halaqoh?.nama_halaqoh}</Badge>
                          </div>
                          <CardDescription className="flex items-center gap-4 mt-2">
                            <span className="flex items-center gap-1">
                              <Award className="h-4 w-4" />
                              {formatManzilShort(tasmi.manzil)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(tasmi.tanggal_tasmi).toLocaleDateString('id-ID')}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {asatidz?.nama_lengkap}
                            </span>
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              tasmi.status === 'Lulus'
                                ? 'default'
                                : tasmi.status === 'Tidak Lulus'
                                ? 'destructive'
                                : 'secondary'
                            }
                            className={tasmi.status === 'Lulus' ? 'bg-emerald-600' : ''}
                          >
                            {tasmi.status === 'Lulus' ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : tasmi.status === 'Tidak Lulus' ? (
                              <XCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <AlertCircle className="h-3 w-3 mr-1" />
                            )}
                            {tasmi.status}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(tasmi.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Kelancaran</span>
                        <span className="text-xl font-bold text-emerald-700">
                          {tasmi.kelancaran}/100
                        </span>
                      </div>
                      <Progress value={tasmi.kelancaran} className="h-2" />
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Kesalahan: </span>
                          <span className="font-semibold">{tasmi.jumlah_kesalahan}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Juz: </span>
                          <span className="font-semibold">{tasmi.juz}</span>
                        </div>
                      </div>
                      {tasmi.catatan_umum && (
                        <p className="text-sm text-muted-foreground italic">
                          &quot;{tasmi.catatan_umum}&quot;
                        </p>
                      )}
                    </CardContent>
                  </Card>
                  );
                  })}
                  <TablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                  />
                </>
              ) : (
              <Card>
                <CardContent className="py-10 text-center">
                  <p className="text-muted-foreground">Belum ada data tasmi' untuk manzil ini.</p>
                </CardContent>
              </Card>
              )}
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Dialog Form */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Tasmi' Marhalah</DialogTitle>
            <DialogDescription>
              Masukkan penilaian tasmi' marhalah untuk santri
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Pilih Santri */}
            <div>
              <Label>Pilih Santri *</Label>
              <Select value={selectedSantri} onValueChange={setSelectedSantri}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih santri" />
                </SelectTrigger>
                <SelectContent>
                  {filteredSantri.map((s) => {
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

            {/* Pilih Manzil */}
            <div>
              <Label>Manzil *</Label>
              <Select value={selectedManzil} onValueChange={(v) => setSelectedManzil(v as ManzilTahfidz)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manzil1_3to5Baris">Manzil 1 - Per 3-5 Baris</SelectItem>
                  <SelectItem value="Manzil2_PerHalaman">Manzil 2 - Per Halaman</SelectItem>
                  <SelectItem value="Manzil3_Per5Halaman">Manzil 3 - Per 5 Halaman</SelectItem>
                  <SelectItem value="Manzil4_PerSetengahJuz">Manzil 4 - Per ½ Juz</SelectItem>
                  <SelectItem value="Manzil5_PerJuz">Manzil 5 - Per 1 Juz (Tasmi')</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mode Selection */}
            <div>
              <Label>Mode Pilihan *</Label>
              <Select value={selectionMode} onValueChange={(v) => setSelectionMode(v as SelectionMode)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="surah">📖 Pilih per Surah & Ayat</SelectItem>
                  <SelectItem value="page">📄 Pilih per Halaman</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Juz - Dropdown dengan Grid Layout */}
            <div>
              <Label>Juz *</Label>
              <Select value={formData.juz} onValueChange={(value) => setFormData({ ...formData, juz: value })}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Pilih Juz" />
                </SelectTrigger>
                <SelectContent className="border-0 shadow-none bg-transparent p-0">
                  <div className="grid grid-cols-5 md:grid-cols-6 gap-1 p-2 bg-white dark:bg-gray-950 rounded-lg border shadow-md">
                    {Array.from({ length: 30 }, (_, i) => {
                      const juzNumber = (i + 1).toString();
                      const isSelected = formData.juz === juzNumber;
                      return (
                        <SelectItem 
                          key={juzNumber} 
                          value={juzNumber}
                          className={`px-2 py-0.5 m-0 border border-gray-200 dark:border-gray-700 rounded cursor-pointer text-center font-semibold text-sm ${
                            isSelected ? 'bg-emerald-600 text-white' : 'hover:border-emerald-400'
                          }`}
                        >
                          {juzNumber}
                        </SelectItem>
                      );
                    })}
                  </div>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">Pilih juz yang diujikan</p>
            </div>

            {selectionMode === 'surah' ? (
              <>
                {/* Multiple Surah Selections */}
                {surahSelections.map((selection, index) => {
                  const selectedSurahData = surahList.find(s => s.name === selection.surah);
                  return (
                    <Card key={selection.id} className="border-amber-200 bg-amber-50/30 dark:bg-amber-950/30">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">Surah #{index + 1}</CardTitle>
                          {surahSelections.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSurahSelection(selection.id)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Pilih Surah - Dropdown dengan Grid Layout */}
                        <div>
                          <Label>Nama Surah *</Label>
                          <Select 
                            value={selection.surah} 
                            onValueChange={(value) => updateSurahSelection(selection.id, { surah: value, ayat_dari: 1, ayat_sampai: 1 })}
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Pilih Surah" />
                            </SelectTrigger>
                            <SelectContent className="border-0 shadow-none bg-transparent p-0">
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-2 bg-white dark:bg-gray-950 rounded-lg border shadow-md max-h-60 overflow-y-auto">
                                {availableSurahs.map((surah) => {
                                  const isSelected = selection.surah === surah.name;
                                  return (
                                    <SelectItem
                                      key={surah.number}
                                      value={surah.name}
                                      className={`px-4 py-3 m-0 border border-gray-200 dark:border-gray-700 rounded cursor-pointer text-left ${
                                        isSelected ? 'bg-emerald-600 text-white' : 'hover:border-emerald-400'
                                      }`}
                                    >
                                      <div className="font-semibold text-sm">
                                        {surah.number}. {surah.name}
                                      </div>
                                      <div className={`text-xs mt-1 ${
                                        isSelected ? 'text-emerald-100' : 'text-muted-foreground'
                                      }`}>
                                        {surah.arabicName} • {surah.numberOfAyahs} ayat
                                      </div>
                                    </SelectItem>
                                  );
                                })}
                              </div>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground mt-2">
                            Menampilkan surah dalam Juz {formData.juz}
                          </p>
                        </div>

                        {selectedSurahData && (
                          <div className="p-3 bg-white dark:bg-gray-950 rounded-lg border border-lime-300">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              <span className="font-semibold text-lime-700 dark:text-lime-400">
                                {selectedSurahData.name} ({selectedSurahData.arabicName})
                              </span>
                              {' • '}
                              Jumlah ayat: <span className="font-bold">{selectedSurahData.numberOfAyahs}</span>
                            </p>
                          </div>
                        )}

                        {/* Range Ayat */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Ayat Dari *</Label>
                            <Input
                              type="number"
                              min="1"
                              max={selectedSurahData?.numberOfAyahs || 286}
                              value={selection.ayat_dari}
                              onChange={(e) => updateSurahSelection(selection.id, { ayat_dari: parseInt(e.target.value) || 1 })}
                              placeholder="1"
                              className="mt-2"
                            />
                          </div>
                          <div>
                            <Label>Ayat Sampai *</Label>
                            <Input
                              type="number"
                              min="1"
                              max={selectedSurahData?.numberOfAyahs || 286}
                              value={selection.ayat_sampai}
                              onChange={(e) => updateSurahSelection(selection.id, { ayat_sampai: parseInt(e.target.value) || 1 })}
                              placeholder="10"
                              className="mt-2"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addSurahSelection}
                  className="w-full border-dashed border-2 hover:bg-emerald-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Surah Lain
                </Button>
              </>
            ) : (
              <>
                {/* Page Selection Mode */}
                <div>
                  <Label>Pilih Halaman *</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Al-Qur&apos;an memiliki 604 halaman (Mushaf Utsmani)
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Halaman Dari *</Label>
                    <Input
                      type="number"
                      min="1"
                      max="604"
                      value={formData.page_dari}
                      onChange={(e) => setFormData({ ...formData, page_dari: parseInt(e.target.value) || 1 })}
                      placeholder="1"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Halaman Sampai *</Label>
                    <Input
                      type="number"
                      min="1"
                      max="604"
                      value={formData.page_sampai}
                      onChange={(e) => setFormData({ ...formData, page_sampai: parseInt(e.target.value) || 1 })}
                      placeholder="10"
                      className="mt-2"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Separator - Penilaian Section */}
            <div className="pt-4">
              <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-4">
                Penilaian
              </h3>
            </div>

            {/* Jumlah Kesalahan */}
            <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-900">
              <Label>Jumlah Kesalahan *</Label>
              <Input
                type="number"
                min="0"
                value={formData.jumlah_kesalahan}
                onChange={(e) => handleKesalahanChange(e.target.value)}
                placeholder="0"
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Setiap kesalahan mengurangi 1 poin dari nilai 100
              </p>
            </div>

            {/* Nilai Kelancaran */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Nilai Kelancaran</Label>
                <span className="text-2xl font-bold text-emerald-700">
                  {formData.kelancaran}
                </span>
              </div>
              <Progress value={parseInt(formData.kelancaran)} className="h-3" />
            </div>

            {/* Catatan Tajwid */}
            <div>
              <Label>Catatan Tajwid *</Label>
              <Textarea
                value={formData.catatan_tajwid}
                onChange={(e) => setFormData({ ...formData, catatan_tajwid: e.target.value })}
                placeholder="Contoh: Bacaan ikhfa perlu diperbaiki, mad wajib sudah baik..."
                rows={3}
                className="mt-2"
              />
            </div>

            {/* Catatan Fashahah */}
            <div>
              <Label>Catatan Fashahah (Makharijul Huruf) *</Label>
              <Textarea
                value={formData.catatan_fashahah}
                onChange={(e) => setFormData({ ...formData, catatan_fashahah: e.target.value })}
                placeholder="Contoh: Huruf ث dan س perlu dibedakan, huruf ع sudah bagus..."
                rows={3}
                className="mt-2"
              />
            </div>

            {/* Status Kelulusan */}
            <div>
              <Label>Status Kelulusan *</Label>
              <RadioGroup
                value={formData.status}
                onValueChange={(v) => setFormData({ ...formData, status: v as StatusManzil })}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Lulus" id="lulus" />
                  <Label htmlFor="lulus" className="font-normal cursor-pointer">
                    ✓ Lulus (bisa lanjut tahap berikutnya)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Tidak Lulus" id="tidak-lulus" />
                  <Label htmlFor="tidak-lulus" className="font-normal cursor-pointer">
                    ✗ Tidak Lulus (perlu ujian ulang)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Catatan Umum */}
            <div>
              <Label>Catatan Umum</Label>
              <Textarea
                value={formData.catatan_umum}
                onChange={(e) => setFormData({ ...formData, catatan_umum: e.target.value })}
                placeholder="Catatan tambahan untuk santri..."
                rows={2}
                className="mt-2"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-emerald-600 to-lime-600">
                Simpan Penilaian
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedTasmiForDetail && (() => {
            const santri = data.santri.find((s) => s.id === selectedTasmiForDetail.id_santri);
            const asatidz = data.users.find((u) => u.id === selectedTasmiForDetail.id_asatidz);
            const halaqoh = data.halaqoh.find((h) => h.id === santri?.id_halaqoh);

            return (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl text-emerald-900 dark:text-emerald-100">
                    Detail Penilaian Tasmi' Marhalah
                  </DialogTitle>
                  <DialogDescription>
                    Informasi lengkap penilaian tasmi' marhalah
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Informasi Santri */}
                  <Card className="border-emerald-200 bg-emerald-50/30 dark:bg-emerald-950/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Informasi Santri
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Nama Lengkap:</span>
                        <span className="font-semibold">{santri?.nama_santri || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">NIS:</span>
                        <Badge variant="outline">{santri?.nis}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Halaqoh:</span>
                        <Badge className="bg-emerald-600">{halaqoh?.nama_halaqoh}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Penguji:</span>
                        <span className="font-medium">{asatidz?.nama_lengkap}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Detail Tasmi' */}
                  <Card className="border-lime-200 bg-lime-50/30 dark:bg-lime-950/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Detail Tasmi'
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Manzil:</span>
                        <Badge variant="secondary" className="bg-lime-600 text-white">
                          {formatManzilShort(selectedTasmiForDetail.manzil)}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Tanggal Tasmi':</span>
                        <span className="font-medium">
                          {new Date(selectedTasmiForDetail.tanggal_tasmi).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Juz:</span>
                        <span className="font-semibold">Juz {selectedTasmiForDetail.juz}</span>
                      </div>
                      <div className="flex items-start justify-between">
                        <span className="text-sm text-muted-foreground">Surah & Ayat:</span>
                        <span className="font-medium text-right max-w-xs">
                          {selectedTasmiForDetail.surah}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Ayat:</span>
                        <span className="font-semibold">{selectedTasmiForDetail.total_ayat} ayat</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Halaman:</span>
                        <span className="font-semibold">{selectedTasmiForDetail.total_halaman} halaman</span>
                      </div>
                      {selectedTasmiForDetail.total_baris && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Total Baris:</span>
                          <span className="font-semibold">{selectedTasmiForDetail.total_baris} baris</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Nilai & Penilaian */}
                  <Card className="border-amber-200 bg-amber-50/30 dark:bg-amber-950/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Nilai & Penilaian
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Kelancaran Progress */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Nilai Kelancaran</span>
                          <span className="text-3xl font-bold text-emerald-700">
                            {selectedTasmiForDetail.kelancaran}/100
                          </span>
                        </div>
                        <Progress value={selectedTasmiForDetail.kelancaran} className="h-3" />
                      </div>

                      {/* Jumlah Kesalahan */}
                      <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-red-900 dark:text-red-100">
                            Jumlah Kesalahan:
                          </span>
                          <span className="text-2xl font-bold text-red-700 dark:text-red-400">
                            {selectedTasmiForDetail.jumlah_kesalahan}
                          </span>
                        </div>
                      </div>

                      {/* Status Kelulusan */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Status Kelulusan:</span>
                        <Badge
                          variant={
                            selectedTasmiForDetail.status === 'Lulus'
                              ? 'default'
                              : 'destructive'
                          }
                          className={`text-base px-4 py-1 ${
                            selectedTasmiForDetail.status === 'Lulus' ? 'bg-emerald-600' : ''
                          }`}
                        >
                          {selectedTasmiForDetail.status === 'Lulus' ? (
                            <CheckCircle className="h-4 w-4 mr-1" />
                          ) : (
                            <XCircle className="h-4 w-4 mr-1" />
                          )}
                          {selectedTasmiForDetail.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Catatan Tajwid */}
                  {selectedTasmiForDetail.catatan_tajwid && (
                    <Card className="border-blue-200 bg-blue-50/30 dark:bg-blue-950/30">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold text-blue-900 dark:text-blue-100">
                          📖 Catatan Tajwid
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm leading-relaxed">
                          {selectedTasmiForDetail.catatan_tajwid}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Catatan Fashahah */}
                  {selectedTasmiForDetail.catatan_fashahah && (
                    <Card className="border-purple-200 bg-purple-50/30 dark:bg-purple-950/30">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold text-purple-900 dark:text-purple-100">
                          🗣️ Catatan Fashahah (Makharijul Huruf)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm leading-relaxed">
                          {selectedTasmiForDetail.catatan_fashahah}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Ayat yang Perlu Diulang */}
                  {selectedTasmiForDetail.ayat_yang_perlu_diulang && (
                    <Card className="border-orange-200 bg-orange-50/30 dark:bg-orange-950/30">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold text-orange-900 dark:text-orange-100 flex items-center gap-2">
                          <AlertCircle className="h-5 w-5" />
                          Ayat yang Perlu Diulang
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm leading-relaxed font-medium">
                          {selectedTasmiForDetail.ayat_yang_perlu_diulang}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Catatan Umum */}
                  {selectedTasmiForDetail.catatan_umum && (
                    <Card className="border-gray-200 bg-gray-50/30 dark:bg-gray-950/30">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">
                          💬 Catatan Umum
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm leading-relaxed italic">
                          &quot;{selectedTasmiForDetail.catatan_umum}&quot;
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <DialogFooter className="mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setIsDetailDialogOpen(false)}
                  >
                    Tutup
                  </Button>
                </DialogFooter>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
      </div>
    </Layout>
  );
}
