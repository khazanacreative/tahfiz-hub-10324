'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useTahfidz } from '@/contexts/TahfidzContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Upload, FileAudio, FileVideo, BookOpen, TrendingUp, Calendar, MessageSquare, User } from 'lucide-react';
import type { Santri, Halaqoh, User as UserType, Setoran } from '@/lib/tahfidz-types';
import { surahList, getSurahsByJuz, getSurahByNumber } from '@/lib/quran-data';

export default function SetoranSantriPage(): React.JSX.Element {
  const { data, currentUser, addSetoran } = useTahfidz();
  const [loading, setLoading] = useState<boolean>(false);

  // Get santri data yang terkait dengan user yang login
  const mySantri = useMemo<Santri | undefined>(() => {
    if (!currentUser) return undefined;
    return data.santri.find((s: Santri) => s.id_wali === currentUser.id);
  }, [data.santri, currentUser]);

  const myHalaqoh = useMemo<Halaqoh | undefined>(() => {
    if (!mySantri) return undefined;
    return data.halaqoh.find((h: Halaqoh) => h.id === mySantri.id_halaqoh);
  }, [data.halaqoh, mySantri]);

  const myUstadz = useMemo<UserType | undefined>(() => {
    if (!myHalaqoh) return undefined;
    return data.users.find((u: UserType) => u.id === myHalaqoh.id_asatidz);
  }, [data.users, myHalaqoh]);

  // Get setoran history untuk santri ini saja
  const mySetoran = useMemo<Setoran[]>(() => {
    if (!mySantri) return [];
    return data.setoran
      .filter((s: Setoran) => s.id_santri === mySantri.id)
      .sort((a: Setoran, b: Setoran) => new Date(b.tanggal_setoran).getTime() - new Date(a.tanggal_setoran).getTime())
      .slice(0, 5);
  }, [data.setoran, mySantri]);

  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    juz: '1',
    surah_number: '1',
    ayat_dari: '',
    ayat_sampai: '',
    fileType: 'audio',
    file: null as File | null,
    catatan: '',
  });

  // Get surah list berdasarkan juz yang dipilih
  const availableSurahs = useMemo(() => {
    return getSurahsByJuz(parseInt(formData.juz));
  }, [formData.juz]);

  // Get surah yang dipilih
  const selectedSurah = useMemo(() => {
    return getSurahByNumber(parseInt(formData.surah_number));
  }, [formData.surah_number]);

  // Reset surah ketika juz berubah
  useEffect(() => {
    if (availableSurahs.length > 0) {
      const firstSurah = availableSurahs[0];
      if (!availableSurahs.find(s => s.number === parseInt(formData.surah_number))) {
        setFormData(prev => ({
          ...prev,
          surah_number: firstSurah.number.toString(),
          ayat_dari: '',
          ayat_sampai: '',
        }));
      }
    }
  }, [formData.juz, availableSurahs, formData.surah_number]);

  const totalAyat = useMemo<number>(() => {
    const dari = parseInt(formData.ayat_dari) || 0;
    const sampai = parseInt(formData.ayat_sampai) || 0;
    return sampai >= dari ? sampai - dari + 1 : 0;
  }, [formData.ayat_dari, formData.ayat_sampai]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!mySantri || !myHalaqoh) {
      toast.error('Data santri tidak ditemukan');
      return;
    }

    if (!formData.ayat_dari || !formData.ayat_sampai) {
      toast.error('Harap isi ayat dari dan sampai');
      return;
    }

    const ayatDari = parseInt(formData.ayat_dari);
    const ayatSampai = parseInt(formData.ayat_sampai);

    if (ayatDari > ayatSampai) {
      toast.error('Ayat dari tidak boleh lebih besar dari ayat sampai');
      return;
    }

    if (selectedSurah && ayatSampai > selectedSurah.numberOfAyahs) {
      toast.error(`Ayat sampai tidak boleh lebih dari ${selectedSurah.numberOfAyahs} (jumlah ayat ${selectedSurah.name})`);
      return;
    }

    if (!formData.file) {
      toast.error('Harap upload file audio/video setoran');
      return;
    }

    setLoading(true);
    
    // Simulasi upload
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newSetoran = {
      id_santri: mySantri.id,
      id_asatidz: myHalaqoh.id_asatidz,
      tanggal_setoran: formData.tanggal,
      juz: parseInt(formData.juz),
      ayat_dari: ayatDari,
      ayat_sampai: ayatSampai,
      nilai_kelancaran: 0,
      status: 'Ulangi' as const,
      catatan: `[Pending] ${formData.catatan}`,
    };

    addSetoran(newSetoran);
    
    toast.success('Setoran berhasil dikirim! Menunggu verifikasi ustadz');
    
    // Reset form
    setFormData({
      tanggal: new Date().toISOString().split('T')[0],
      juz: '1',
      surah_number: '1',
      ayat_dari: '',
      ayat_sampai: '',
      fileType: 'audio',
      file: null,
      catatan: '',
    });
    setLoading(false);
  };

  if (!mySantri) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-green-900">Setoran Hafalan</h1>
            <p className="text-muted-foreground">Data santri tidak ditemukan</p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Akun Anda belum terhubung dengan data santri. Silakan hubungi admin.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string): React.JSX.Element => {
    const statusConfig: Record<string, { variant: 'default' | 'destructive' | 'outline' | 'secondary', className: string }> = {
      'Lancar': { variant: 'default', className: 'bg-green-500' },
      'Ulangi': { variant: 'secondary', className: 'bg-yellow-500' },
      'Salah': { variant: 'destructive', className: 'bg-red-500' },
    };
    const config = statusConfig[status] || statusConfig['Ulangi'];
    return <Badge variant={config.variant} className={config.className}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-900">Setoran Hafalan</h1>
          <p className="text-muted-foreground">Kirim setoran hafalan Anda</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Info Santri */}
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-green-900">
              <User className="h-5 w-5" />
              Informasi Santri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Nama Santri</p>
                <p className="font-semibold text-green-900">{mySantri.nama_santri}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">NIS</p>
                <p className="font-semibold text-green-900">{mySantri.nis}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Halaqoh</p>
                <p className="font-semibold text-green-900">{myHalaqoh?.nama_halaqoh}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ustadz Pembimbing</p>
                <p className="font-semibold text-green-900">{myUstadz?.nama_lengkap}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detail Hafalan */}
        <Card className="border-lime-200 bg-gradient-to-br from-lime-50 to-white">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lime-900">
              <BookOpen className="h-5 w-5" />
              Detail Hafalan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="tanggal">Tanggal Setoran</Label>
                <Input
                  id="tanggal"
                  type="date"
                  value={formData.tanggal}
                  onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="juz">Juz</Label>
                <Select value={formData.juz} onValueChange={(value) => setFormData({ ...formData, juz: value })}>
                  <SelectTrigger id="juz">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => (
                      <SelectItem key={juz} value={juz.toString()}>
                        Juz {juz}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="surah">Surah</Label>
                <Select 
                  value={formData.surah_number} 
                  onValueChange={(value) => setFormData({ ...formData, surah_number: value, ayat_dari: '', ayat_sampai: '' })}
                >
                  <SelectTrigger id="surah">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSurahs.map((surah) => (
                      <SelectItem key={surah.number} value={surah.number.toString()}>
                        {surah.number}. {surah.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedSurah && (
              <div className="rounded-lg bg-lime-100 p-3">
                <p className="text-sm font-medium text-lime-900">
                  <span className="font-bold">{selectedSurah.name} ({selectedSurah.arabicName})</span>
                  {' • '}
                  Jumlah ayat: <span className="font-bold">{selectedSurah.numberOfAyahs}</span>
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ayat_dari">Ayat Dari</Label>
                <Input
                  id="ayat_dari"
                  type="number"
                  placeholder="1"
                  min="1"
                  max={selectedSurah?.numberOfAyahs || 286}
                  value={formData.ayat_dari}
                  onChange={(e) => setFormData({ ...formData, ayat_dari: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="ayat_sampai">Ayat Sampai</Label>
                <Input
                  id="ayat_sampai"
                  type="number"
                  placeholder="10"
                  min="1"
                  max={selectedSurah?.numberOfAyahs || 286}
                  value={formData.ayat_sampai}
                  onChange={(e) => setFormData({ ...formData, ayat_sampai: e.target.value })}
                  required
                />
              </div>
            </div>

            {totalAyat > 0 && (
              <div className="rounded-lg bg-lime-100 p-3">
                <p className="text-sm font-medium text-lime-900">
                  Total: <span className="text-lg font-bold">{totalAyat}</span> ayat
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upload File */}
        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-white">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-amber-900">
              <Upload className="h-5 w-5" />
              Upload Rekaman
            </CardTitle>
            <CardDescription>Upload rekaman audio atau video setoran Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                type="button"
                variant={formData.fileType === 'audio' ? 'default' : 'outline'}
                onClick={() => setFormData({ ...formData, fileType: 'audio', file: null })}
                className="flex-1"
              >
                <FileAudio className="mr-2 h-4 w-4" />
                Audio
              </Button>
              <Button
                type="button"
                variant={formData.fileType === 'video' ? 'default' : 'outline'}
                onClick={() => setFormData({ ...formData, fileType: 'video', file: null })}
                className="flex-1"
              >
                <FileVideo className="mr-2 h-4 w-4" />
                Video
              </Button>
            </div>

            <div className="rounded-lg border-2 border-dashed border-amber-300 bg-amber-50 p-6 text-center">
              <Input
                id="file"
                type="file"
                accept={formData.fileType === 'audio' ? 'audio/*' : 'video/*'}
                onChange={handleFileChange}
                className="hidden"
                required
              />
              <label htmlFor="file" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-amber-500" />
                <p className="mt-2 text-sm font-medium text-amber-900">
                  {formData.file ? formData.file.name : 'Klik untuk upload file'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formData.fileType === 'audio' ? 'Format: MP3, WAV, M4A' : 'Format: MP4, AVI, MOV'}
                </p>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Catatan */}
        <Card className="border-slate-200 bg-gradient-to-br from-slate-50 to-white">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <MessageSquare className="h-5 w-5" />
              Catatan untuk Ustadz
            </CardTitle>
            <CardDescription>Tambahkan catatan atau pertanyaan untuk ustadz (opsional)</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Contoh: Mohon koreksi pada ayat 5-7, saya masih ragu dengan bacaannya..."
              value={formData.catatan}
              onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
              rows={4}
            />
          </CardContent>
        </Card>

        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-600 to-lime-600 text-lg font-semibold hover:from-green-700 hover:to-lime-700"
        >
          {loading ? 'Mengirim...' : 'Kirim Setoran'}
        </Button>
      </form>

      {/* Riwayat Setoran */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Riwayat Setoran Terakhir
          </CardTitle>
          <CardDescription>5 setoran terakhir Anda</CardDescription>
        </CardHeader>
        <CardContent>
          {mySetoran.length === 0 ? (
            <p className="text-center text-muted-foreground">Belum ada setoran</p>
          ) : (
            <div className="space-y-3">
              {mySetoran.map((setoran) => {
                const surah = getSurahByNumber(1);
                return (
                  <div
                    key={setoran.id}
                    className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {new Date(setoran.tanggal_setoran).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <p className="mt-1 font-semibold">
                        Juz {setoran.juz} • Ayat {setoran.ayat_dari}-{setoran.ayat_sampai}
                      </p>
                      {setoran.catatan && setoran.catatan.includes('[Pending]') ? (
                        <p className="text-sm text-amber-600">⏳ Menunggu verifikasi ustadz</p>
                      ) : (
                        <>
                          {setoran.nilai_kelancaran > 0 && (
                            <p className="text-sm text-muted-foreground">Nilai: {setoran.nilai_kelancaran}</p>
                          )}
                          {setoran.catatan && !setoran.catatan.includes('[Pending]') && (
                            <p className="text-sm text-muted-foreground">{setoran.catatan}</p>
                          )}
                        </>
                      )}
                    </div>
                    <div>{getStatusBadge(setoran.status)}</div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
