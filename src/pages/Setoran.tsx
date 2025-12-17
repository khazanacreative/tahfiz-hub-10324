'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTahfidz } from '@/contexts/TahfidzContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Plus, Edit, Trash2, Download, BookOpen, Calendar, User, TrendingUp, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { TablePagination } from '@/components/tahfidz/TablePagination';
import { toast } from 'sonner';
import type { Setoran, StatusHafalan } from '@/lib/tahfidz-types';
import { surahList, getSurahsByJuz, getSurahByNumber } from '@/lib/quran-data';

type SelectionMode = 'surah' | 'page';

interface SurahSelection {
  id: string;
  surah_number: number;
  ayat_dari: number;
  ayat_sampai: number;
}

export default function SetoranPage() {
  const { data, currentUser, addSetoran, updateSetoran, deleteSetoran } = useTahfidz();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editingSetoran, setEditingSetoran] = useState<Setoran | null>(null);
  const [filterJuz, setFilterJuz] = useState<string>('all');
  const [filterSantri, setFilterSantri] = useState<string>('all');
  const [filterHalaqoh, setFilterHalaqoh] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('surah');

  const [formData, setFormData] = useState<{
    id_santri: string;
    id_asatidz: string;
    tanggal_setoran: string;
    juz: number;
    nilai_kelancaran: number;
    status: StatusHafalan;
    catatan: string;
    page_dari?: number;
    page_sampai?: number;
  }>({
    id_santri: '',
    id_asatidz: currentUser?.id || '',
    tanggal_setoran: new Date().toISOString().split('T')[0],
    juz: 1,
    nilai_kelancaran: 0,
    status: 'Lancar',
    catatan: '',
  });

  const [surahSelections, setSurahSelections] = useState<SurahSelection[]>([
    {
      id: Math.random().toString(36).substr(2, 9),
      surah_number: 1,
      ayat_dari: 1,
      ayat_sampai: 1,
    }
  ]);

  const [totalAyat, setTotalAyat] = useState<number>(0);

  // Get surah list berdasarkan juz yang dipilih
  const availableSurahs = useMemo(() => {
    return getSurahsByJuz(formData.juz);
  }, [formData.juz]);

  // Reset surah ketika juz berubah
  useEffect(() => {
    if (availableSurahs.length > 0 && selectionMode === 'surah') {
      const firstSurah = availableSurahs[0];
      const anyInvalid = surahSelections.some(sel => 
        !availableSurahs.find(s => s.number === sel.surah_number)
      );
      
      if (anyInvalid) {
        setSurahSelections([{
          id: Math.random().toString(36).substr(2, 9),
          surah_number: firstSurah.number,
          ayat_dari: 1,
          ayat_sampai: 1,
        }]);
      }
    }
  }, [formData.juz, availableSurahs, selectionMode]);

  useEffect(() => {
    if (selectionMode === 'surah') {
      const total = surahSelections.reduce((sum, sel) => {
        const ayatCount = sel.ayat_sampai - sel.ayat_dari + 1;
        return sum + (ayatCount > 0 ? ayatCount : 0);
      }, 0);
      setTotalAyat(total);
    } else {
      // For page mode, approximate ayat count (pages have ~15 lines, ~10 ayat per page average)
      const pageCount = (formData.page_sampai || 1) - (formData.page_dari || 1) + 1;
      setTotalAyat(pageCount * 10); // Approximate
    }
  }, [surahSelections, formData.page_dari, formData.page_sampai, selectionMode]);

  const addSurahSelection = (): void => {
    const firstSurah = availableSurahs[0];
    setSurahSelections([
      ...surahSelections,
      {
        id: Math.random().toString(36).substr(2, 9),
        surah_number: firstSurah.number,
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!formData.id_santri || !formData.id_asatidz) {
      toast.error('Santri dan Ustadz harus dipilih');
      return;
    }

    // Validation for surah mode
    if (selectionMode === 'surah') {
      for (const sel of surahSelections) {
        if (sel.ayat_dari > sel.ayat_sampai) {
          toast.error('Ayat dari tidak boleh lebih besar dari ayat sampai');
          return;
        }

        const selectedSurah = getSurahByNumber(sel.surah_number);
        if (selectedSurah && sel.ayat_sampai > selectedSurah.numberOfAyahs) {
          toast.error(`Ayat sampai tidak boleh lebih dari ${selectedSurah.numberOfAyahs} (jumlah ayat ${selectedSurah.name})`);
          return;
        }
      }

      // Save each surah selection as separate setoran
      surahSelections.forEach(sel => {
        const setoranData = {
          id_santri: formData.id_santri,
          id_asatidz: formData.id_asatidz,
          tanggal_setoran: formData.tanggal_setoran,
          juz: formData.juz,
          surah_number: sel.surah_number,
          ayat_dari: sel.ayat_dari,
          ayat_sampai: sel.ayat_sampai,
          nilai_kelancaran: formData.nilai_kelancaran,
          status: formData.status,
          catatan: formData.catatan,
        };

        if (editingSetoran) {
          updateSetoran(editingSetoran.id, setoranData);
        } else {
          addSetoran(setoranData);
        }
      });
    } else {
      // Page mode - save with page info
      const setoranData = {
        id_santri: formData.id_santri,
        id_asatidz: formData.id_asatidz,
        tanggal_setoran: formData.tanggal_setoran,
        juz: formData.juz,
        surah_number: 1, // Default for page mode
        ayat_dari: 1,
        ayat_sampai: 1,
        nilai_kelancaran: formData.nilai_kelancaran,
        status: formData.status,
        catatan: `Halaman ${formData.page_dari}-${formData.page_sampai}. ${formData.catatan}`,
      };

      if (editingSetoran) {
        updateSetoran(editingSetoran.id, setoranData);
      } else {
        addSetoran(setoranData);
      }
    }

    toast.success(editingSetoran ? 'Setoran berhasil diupdate' : 'Setoran berhasil ditambahkan');
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (setoran: Setoran): void => {
    setEditingSetoran(setoran);
    setFormData({
      id_santri: setoran.id_santri,
      id_asatidz: setoran.id_asatidz,
      tanggal_setoran: setoran.tanggal_setoran,
      juz: setoran.juz,
      nilai_kelancaran: setoran.nilai_kelancaran,
      status: setoran.status,
      catatan: setoran.catatan,
    });
    setSurahSelections([{
      id: Math.random().toString(36).substr(2, 9),
      surah_number: setoran.surah_number || 1,
      ayat_dari: setoran.ayat_dari,
      ayat_sampai: setoran.ayat_sampai,
    }]);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string): void => {
    if (confirm('Yakin ingin menghapus setoran ini?')) {
      deleteSetoran(id);
      toast.success('Setoran berhasil dihapus');
    }
  };

  const resetForm = (): void => {
    setFormData({
      id_santri: '',
      id_asatidz: currentUser?.id || '',
      tanggal_setoran: new Date().toISOString().split('T')[0],
      juz: 1,
      nilai_kelancaran: 0,
      status: 'Lancar',
      catatan: '',
    });
    setSurahSelections([{
      id: Math.random().toString(36).substr(2, 9),
      surah_number: 1,
      ayat_dari: 1,
      ayat_sampai: 1,
    }]);
    setEditingSetoran(null);
    setSelectionMode('surah');
  };

  const filteredSetoran = useMemo(() => {
    let filtered = data.setoran
      .filter((s) => filterJuz === 'all' || s.juz === parseInt(filterJuz));
    
    // Filter for Asatidz role - only show setoran from their halaqoh santri
    if (currentUser && currentUser.role === 'Asatidz') {
      const ustadzHalaqoh = data.halaqoh.filter((h) => h.id_asatidz === currentUser.id);
      const halaqohIds = ustadzHalaqoh.map((h) => h.id);
      const santriIds = data.santri
        .filter((s) => halaqohIds.includes(s.id_halaqoh))
        .map((s) => s.id);
      filtered = filtered.filter((s) => santriIds.includes(s.id_santri));
    }
    
    if (filterSantri !== 'all') {
      filtered = filtered.filter((s) => s.id_santri === filterSantri);
    }
    
    if (filterHalaqoh !== 'all') {
      filtered = filtered.filter((s) => {
        const santri = data.santri.find((st) => st.id === s.id_santri);
        return santri?.id_halaqoh === filterHalaqoh;
      });
    }
    
    return filtered.sort((a, b) => new Date(b.tanggal_setoran).getTime() - new Date(a.tanggal_setoran).getTime());
  }, [data.setoran, data.santri, data.halaqoh, currentUser, filterJuz, filterSantri, filterHalaqoh]);

  const totalPages = Math.ceil(filteredSetoran.length / itemsPerPage);
  const paginatedSetoran = filteredSetoran.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExport = (): void => {
    toast.success('Export PDF/Excel (Simulasi)');
  };

  const getStatusColor = (status: StatusHafalan): string => {
    switch (status) {
      case 'Lancar':
        return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'Ulangi':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'Salah':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getNilaiColor = (nilai: number): string => {
    if (nilai >= 80) return 'text-emerald-600';
    if (nilai >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const selectedSantri = data.santri.find((s) => s.id === formData.id_santri);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">Setoran Hafalan</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Kelola dan catat setoran hafalan Al-Qur&apos;an santri
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-emerald-600 to-lime-600 hover:from-emerald-700 hover:to-lime-700">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Setoran
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-emerald-600" />
                  {editingSetoran ? 'Edit' : 'Tambah'} Setoran Hafalan
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Info Santri */}
                <Card className="border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5 text-emerald-600" />
                      Informasi Santri
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="id_santri" className="text-sm font-semibold">
                          Pilih Santri <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={formData.id_santri}
                          onValueChange={(value) => setFormData({ ...formData, id_santri: value })}
                        >
                          <SelectTrigger className="bg-white dark:bg-gray-950">
                            <SelectValue placeholder="-- Pilih santri --" />
                          </SelectTrigger>
                          <SelectContent>
                            {(() => {
                              let santriList = data.santri.filter((s) => s.status === 'Aktif');
                              if (currentUser && currentUser.role === 'Asatidz') {
                                const ustadzHalaqoh = data.halaqoh.filter((h) => h.id_asatidz === currentUser.id);
                                const halaqohIds = ustadzHalaqoh.map((h) => h.id);
                                santriList = santriList.filter((s) => halaqohIds.includes(s.id_halaqoh));
                              }
                              return santriList.map((s) => (
                                <SelectItem key={s.id} value={s.id}>
                                  {s.nama_santri} - {s.nis}
                                </SelectItem>
                              ));
                            })()}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tanggal_setoran" className="text-sm font-semibold flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Tanggal Setoran
                        </Label>
                        <Input
                          id="tanggal_setoran"
                          type="date"
                          value={formData.tanggal_setoran}
                          onChange={(e) => setFormData({ ...formData, tanggal_setoran: e.target.value })}
                          className="bg-white dark:bg-gray-950"
                        />
                      </div>
                    </div>
                    {selectedSantri && (
                      <div className="p-3 bg-white dark:bg-gray-950 rounded-lg border border-emerald-200">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Halaqoh: <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                            {data.halaqoh.find((h) => h.id === selectedSantri.id_halaqoh)?.nama_halaqoh || '-'}
                          </span>
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Detail Hafalan */}
                <Card className="border-lime-200 bg-lime-50/50 dark:bg-lime-950/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-lime-600" />
                      Detail Hafalan
                    </CardTitle>
                    <CardDescription>Pilih mode setoran dan detail hafalan</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Mode Selection */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Mode Pilihan</Label>
                      <Select value={selectionMode} onValueChange={(v) => setSelectionMode(v as SelectionMode)}>
                        <SelectTrigger className="bg-white dark:bg-gray-950">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="surah">📖 Pilih per Surah & Ayat</SelectItem>
                          <SelectItem value="page">📄 Pilih per Halaman</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Juz - Dropdown dengan Grid Layout */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">
                        Juz <span className="text-red-500">*</span>
                      </Label>
                      <Select value={formData.juz.toString()} onValueChange={(value) => setFormData({ ...formData, juz: parseInt(value) })}>
                        <SelectTrigger className="bg-white dark:bg-gray-950">
                          <SelectValue placeholder="Pilih Juz" />
                        </SelectTrigger>
                        <SelectContent className="border-0 shadow-none bg-transparent p-0">
                          <div className="grid grid-cols-5 md:grid-cols-6 gap-1 p-2 bg-white dark:bg-gray-950 rounded-lg border shadow-md">
                            {Array.from({ length: 30 }, (_, i) => {
                              const juzNumber = i + 1;
                              const isSelected = formData.juz === juzNumber;
                              return (
                                <SelectItem
                                  key={juzNumber}
                                  value={juzNumber.toString()}
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
                      <p className="text-xs text-muted-foreground mt-2">Pilih juz yang disetorkan</p>
                    </div>

                    {selectionMode === 'surah' ? (
                      <>
                        {/* Multiple Surah Selections */}
                        {surahSelections.map((selection, index) => {
                          const selectedSurah = getSurahByNumber(selection.surah_number);
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
                                {/* Surah - Dropdown dengan Grid Layout */}
                                <div className="space-y-2">
                                  <Label className="text-sm font-semibold">
                                    Nama Surah <span className="text-red-500">*</span>
                                  </Label>
                                  <Select 
                                    value={selection.surah_number.toString()} 
                                    onValueChange={(value) => updateSurahSelection(selection.id, { 
                                      surah_number: parseInt(value), 
                                      ayat_dari: 1, 
                                      ayat_sampai: 1 
                                    })}
                                  >
                                    <SelectTrigger className="bg-white dark:bg-gray-950">
                                      <SelectValue placeholder="Pilih Surah" />
                                    </SelectTrigger>
                                    <SelectContent className="border-0 shadow-none bg-transparent p-0">
                                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-2 bg-white dark:bg-gray-950 rounded-lg border shadow-md max-h-60 overflow-y-auto">
                                        {availableSurahs.map((surah) => {
                                          const isSelected = selection.surah_number === surah.number;
                                          return (
                                            <SelectItem
                                              key={surah.number}
                                              value={surah.number.toString()}
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
                                </div>

                                {selectedSurah && (
                                  <div className="p-3 bg-white dark:bg-gray-950 rounded-lg border border-lime-300">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      <span className="font-semibold text-lime-700 dark:text-lime-400">
                                        {selectedSurah.name} ({selectedSurah.arabicName})
                                      </span>
                                      {' • '}
                                      Jumlah ayat: <span className="font-bold">{selectedSurah.numberOfAyahs}</span>
                                    </p>
                                  </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={`ayat_dari_${selection.id}`} className="text-sm font-semibold">
                                      Ayat Dari
                                    </Label>
                                    <Input
                                      id={`ayat_dari_${selection.id}`}
                                      type="number"
                                      min="1"
                                      max={selectedSurah?.numberOfAyahs || 286}
                                      value={selection.ayat_dari}
                                      onChange={(e) => updateSurahSelection(selection.id, { ayat_dari: parseInt(e.target.value) || 1 })}
                                      className="bg-white dark:bg-gray-950"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`ayat_sampai_${selection.id}`} className="text-sm font-semibold">
                                      Ayat Sampai
                                    </Label>
                                    <Input
                                      id={`ayat_sampai_${selection.id}`}
                                      type="number"
                                      min="1"
                                      max={selectedSurah?.numberOfAyahs || 286}
                                      value={selection.ayat_sampai}
                                      onChange={(e) => updateSurahSelection(selection.id, { ayat_sampai: parseInt(e.target.value) || 1 })}
                                      className="bg-white dark:bg-gray-950"
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
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold">
                            Pilih Halaman <span className="text-red-500">*</span>
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Al-Qur&apos;an memiliki 604 halaman (Mushaf Utsmani)
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="page_dari" className="text-sm font-semibold">
                              Halaman Dari
                            </Label>
                            <Input
                              id="page_dari"
                              type="number"
                              min="1"
                              max="604"
                              value={formData.page_dari || ''}
                              onChange={(e) => setFormData({ ...formData, page_dari: parseInt(e.target.value) || 1 })}
                              placeholder="1"
                              className="bg-white dark:bg-gray-950"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="page_sampai" className="text-sm font-semibold">
                              Halaman Sampai
                            </Label>
                            <Input
                              id="page_sampai"
                              type="number"
                              min="1"
                              max="604"
                              value={formData.page_sampai || ''}
                              onChange={(e) => setFormData({ ...formData, page_sampai: parseInt(e.target.value) || 1 })}
                              placeholder="10"
                              className="bg-white dark:bg-gray-950"
                            />
                          </div>
                        </div>

                        <div className="p-3 bg-white dark:bg-gray-950 rounded-lg border border-lime-300">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Total Halaman: <span className="font-bold text-lime-700">
                              {((formData.page_sampai || 1) - (formData.page_dari || 1) + 1)} halaman
                            </span>
                          </p>
                        </div>
                      </>
                    )}

                    <div className="p-4 bg-white dark:bg-gray-950 rounded-lg border border-lime-300">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Ayat (Estimasi):</span>
                        <Badge className="bg-lime-600 text-white text-base px-3 py-1">
                          {totalAyat} Ayat
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Penilaian */}
                <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-amber-600" />
                      Penilaian Kelancaran
                    </CardTitle>
                    <CardDescription>Berikan penilaian berdasarkan kelancaran hafalan</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-semibold">Nilai Kelancaran (0-100)</Label>
                        <Badge className={`text-xl px-4 py-1 ${getNilaiColor(formData.nilai_kelancaran)}`}>
                          {formData.nilai_kelancaran}
                        </Badge>
                      </div>
                      <Slider
                        value={[formData.nilai_kelancaran]}
                        onValueChange={(value) => setFormData({ ...formData, nilai_kelancaran: value[0] })}
                        max={100}
                        step={5}
                        className="py-4"
                      />
                      <Progress value={formData.nilai_kelancaran} className="h-3" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Kurang</span>
                        <span>Cukup</span>
                        <span>Baik</span>
                        <span>Sangat Baik</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="status" className="text-sm font-semibold">
                        Status Hafalan
                      </Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => setFormData({ ...formData, status: value as StatusHafalan })}
                      >
                        <SelectTrigger className="bg-white dark:bg-gray-950">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Lancar">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                              Lancar
                            </div>
                          </SelectItem>
                          <SelectItem value="Ulangi">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-amber-600" />
                              Ulangi
                            </div>
                          </SelectItem>
                          <SelectItem value="Salah">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-red-600" />
                              Salah
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Catatan */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Catatan Ustadz</CardTitle>
                    <CardDescription>Tambahkan catatan atau komentar evaluasi</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      id="catatan"
                      value={formData.catatan}
                      onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                      placeholder="Contoh: Santri lancar dalam membaca, namun perlu memperbaiki tajwid pada beberapa ayat..."
                      rows={4}
                      className="resize-none"
                    />
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-emerald-600 to-lime-600 hover:from-emerald-700 hover:to-lime-700">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Simpan Setoran
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex-1">
              <CardTitle>Daftar Setoran</CardTitle>
              <CardDescription>Riwayat setoran hafalan santri</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-full sm:w-48">
                <Select value={filterJuz} onValueChange={(v) => { setFilterJuz(v); setCurrentPage(1); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter Juz" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Juz</SelectItem>
                    {Array.from({ length: 30 }, (_, i) => i + 1).map((j) => (
                      <SelectItem key={j} value={j.toString()}>
                        Juz {j}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full sm:w-64">
                <Select value={filterSantri} onValueChange={(v) => { setFilterSantri(v); setCurrentPage(1); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter Santri" />
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
                <Select value={filterHalaqoh} onValueChange={(v) => { setFilterHalaqoh(v); setCurrentPage(1); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter Halaqoh" />
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
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Santri</TableHead>
                  <TableHead>Ustadz</TableHead>
                  <TableHead>Juz</TableHead>
                  <TableHead>Ayat</TableHead>
                  <TableHead>Nilai</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Catatan</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSetoran.map((setoran) => {
                  const santri = data.santri.find((s) => s.id === setoran.id_santri);
                  const ustadz = data.users.find((u) => u.id === setoran.id_asatidz);
                  return (
                    <TableRow key={setoran.id}>
                      <TableCell className="font-medium">
                        {new Date(setoran.tanggal_setoran).toLocaleDateString('id-ID')}
                      </TableCell>
                      <TableCell>{santri?.nama_santri || '-'}</TableCell>
                      <TableCell>{ustadz?.nama_lengkap || '-'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-lime-50 text-lime-700 border-lime-300">
                          Juz {setoran.juz}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {setoran.ayat_dari}-{setoran.ayat_sampai}
                      </TableCell>
                      <TableCell>
                        <span className={`font-bold ${getNilaiColor(setoran.nilai_kelancaran)}`}>
                          {setoran.nilai_kelancaran}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(setoran.status)} border`}>
                          {setoran.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{setoran.catatan || '-'}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(setoran)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(setoran.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {paginatedSetoran.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-gray-500 py-8">
                      Tidak ada data setoran
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredSetoran.length}
            itemsPerPage={itemsPerPage}
          />
        </CardContent>
      </Card>
    </div>
  );
}