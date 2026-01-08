import { useMemo, useState } from 'react';
import Layout from '@/components/Layout';
import { useTahfidz } from '@/contexts/TahfidzContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, User, CheckCircle, XCircle, AlertCircle, Award, BookOpen } from 'lucide-react';
import { formatManzilShort } from '@/lib/ujian-helper';
import type { TasmiMarhalah } from '@/lib/tahfidz-types';

export default function TasmiSayaPage() {
  const { data, currentUser } = useTahfidz();
  const [selectedTasmi, setSelectedTasmi] = useState<TasmiMarhalah | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState<boolean>(false);

  // Get santri data for current wali
  const santri = data.santri.find((s) => s.id_wali === currentUser?.id);

  // Get tasmi' marhalah for this santri
  const tasmiSantri = useMemo(() => {
    if (!santri) return [];
    return data.tasmi_marhalah
      .filter((t) => t.id_santri === santri.id)
      .sort((a, b) => new Date(b.tanggal_tasmi).getTime() - new Date(a.tanggal_tasmi).getTime());
  }, [data.tasmi_marhalah, santri]);

  if (!santri) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">Data santri tidak ditemukan.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get stats
  const stats = useMemo(() => {
    return {
      total: tasmiSantri.length,
      lulus: tasmiSantri.filter((t) => t.status === 'Lulus').length,
      tidakLulus: tasmiSantri.filter((t) => t.status === 'Tidak Lulus').length,
      rataRataKelancaran: tasmiSantri.length > 0
        ? Math.round(tasmiSantri.reduce((acc, t) => acc + t.kelancaran, 0) / tasmiSantri.length)
        : 0,
      manzil1: tasmiSantri.filter((t) => t.manzil === 'Manzil1_3to5Baris' && t.status === 'Lulus').length,
      manzil2: tasmiSantri.filter((t) => t.manzil === 'Manzil2_PerHalaman' && t.status === 'Lulus').length,
      manzil3: tasmiSantri.filter((t) => t.manzil === 'Manzil3_Per5Halaman' && t.status === 'Lulus').length,
      manzil4: tasmiSantri.filter((t) => t.manzil === 'Manzil4_PerSetengahJuz' && t.status === 'Lulus').length,
      manzil5: tasmiSantri.filter((t) => t.manzil === 'Manzil5_PerJuz' && t.status === 'Lulus').length,
    };
  }, [tasmiSantri]);

  const handleViewDetail = (tasmi: TasmiMarhalah): void => {
    setSelectedTasmi(tasmi);
    setIsDetailDialogOpen(true);
  };

  return (
    <Layout>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
          Tasmi' Marhalah Saya
        </h1>
        <p className="text-muted-foreground mt-1">
          Pantau progress tasmi' marhalah (ujian tahapan) hafalan Anda
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-emerald-200 dark:border-emerald-900">
          <CardHeader className="pb-3">
            <CardDescription>Total Tasmi'</CardDescription>
            <CardTitle className="text-3xl text-emerald-700">{stats.total}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-emerald-200 dark:border-emerald-900">
          <CardHeader className="pb-3">
            <CardDescription>Lulus</CardDescription>
            <CardTitle className="text-3xl text-emerald-700">{stats.lulus}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-red-200 dark:border-red-900">
          <CardHeader className="pb-3">
            <CardDescription>Tidak Lulus</CardDescription>
            <CardTitle className="text-3xl text-red-700">{stats.tidakLulus}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-emerald-200 dark:border-emerald-900">
          <CardHeader className="pb-3">
            <CardDescription>Rata-rata Kelancaran</CardDescription>
            <CardTitle className="text-3xl text-emerald-700">
              {stats.rataRataKelancaran}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Progress per Manzil */}
      <Card>
        <CardHeader>
          <CardTitle>Progress per Manzil</CardTitle>
          <CardDescription>Jumlah tasmi' yang lulus per manzil</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-3">
            {[
              { label: 'Manzil 1', value: stats.manzil1, color: 'bg-emerald-100 dark:bg-emerald-950/50' },
              { label: 'Manzil 2', value: stats.manzil2, color: 'bg-lime-100 dark:bg-lime-950/50' },
              { label: 'Manzil 3', value: stats.manzil3, color: 'bg-yellow-100 dark:bg-yellow-950/50' },
              { label: 'Manzil 4', value: stats.manzil4, color: 'bg-orange-100 dark:bg-orange-950/50' },
              { label: 'Manzil 5', value: stats.manzil5, color: 'bg-red-100 dark:bg-red-950/50' },
            ].map((m) => (
              <div key={m.label} className={`${m.color} p-4 rounded-lg text-center`}>
                <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                <p className="text-3xl font-bold">{m.value}</p>
                {m.value > 0 && <CheckCircle className="h-4 w-4 mx-auto mt-1 text-emerald-600" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detail Each Tasmi */}
      {tasmiSantri.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Riwayat Tasmi'</h2>
          {tasmiSantri.map((tasmi) => {
            const asatidz = data.users.find((u) => u.id === tasmi.id_asatidz);
            const halaqoh = data.halaqoh.find((h) => h.id === santri.id_halaqoh);

            return (
              <Card 
                key={tasmi.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleViewDetail(tasmi)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-lg">
                          {formatManzilShort(tasmi.manzil)}
                        </CardTitle>
                        <Badge className="bg-emerald-600">{halaqoh?.nama_halaqoh}</Badge>
                      </div>
                      <CardDescription className="flex items-center gap-4 mt-2 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(tasmi.tanggal_tasmi).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {asatidz?.nama_lengkap || 'N/A'}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {tasmi.surah}
                        </span>
                      </CardDescription>
                    </div>
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
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Nilai Kelancaran */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Nilai Kelancaran</span>
                      <span className="text-xl font-bold text-emerald-700">
                        {tasmi.kelancaran}/100
                      </span>
                    </div>
                    <Progress value={tasmi.kelancaran} className="h-2" />
                  </div>

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
                    <p className="text-sm text-muted-foreground italic mt-2">
                      &quot;{tasmi.catatan_umum}&quot;
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">
              Belum ada tasmi' yang tercatat. Terus semangat menghafal!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedTasmi && (() => {
            const asatidz = data.users.find((u) => u.id === selectedTasmi.id_asatidz);
            const halaqoh = data.halaqoh.find((h) => h.id === santri.id_halaqoh);

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
                        Informasi
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
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
                          {formatManzilShort(selectedTasmi.manzil)}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Tanggal Tasmi':</span>
                        <span className="font-medium">
                          {new Date(selectedTasmi.tanggal_tasmi).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Juz:</span>
                        <span className="font-semibold">Juz {selectedTasmi.juz}</span>
                      </div>
                      <div className="flex items-start justify-between">
                        <span className="text-sm text-muted-foreground">Surah & Ayat:</span>
                        <span className="font-medium text-right max-w-xs">
                          {selectedTasmi.surah}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Ayat:</span>
                        <span className="font-semibold">{selectedTasmi.total_ayat} ayat</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Halaman:</span>
                        <span className="font-semibold">{selectedTasmi.total_halaman} halaman</span>
                      </div>
                      {selectedTasmi.total_baris && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Total Baris:</span>
                          <span className="font-semibold">{selectedTasmi.total_baris} baris</span>
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
                            {selectedTasmi.kelancaran}/100
                          </span>
                        </div>
                        <Progress value={selectedTasmi.kelancaran} className="h-3" />
                      </div>

                      {/* Jumlah Kesalahan */}
                      <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-red-900 dark:text-red-100">
                            Jumlah Kesalahan:
                          </span>
                          <span className="text-2xl font-bold text-red-700 dark:text-red-400">
                            {selectedTasmi.jumlah_kesalahan}
                          </span>
                        </div>
                      </div>

                      {/* Status Kelulusan */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Status Kelulusan:</span>
                        <Badge
                          variant={
                            selectedTasmi.status === 'Lulus'
                              ? 'default'
                              : 'destructive'
                          }
                          className={`text-base px-4 py-1 ${
                            selectedTasmi.status === 'Lulus' ? 'bg-emerald-600' : ''
                          }`}
                        >
                          {selectedTasmi.status === 'Lulus' ? (
                            <CheckCircle className="h-4 w-4 mr-1" />
                          ) : (
                            <XCircle className="h-4 w-4 mr-1" />
                          )}
                          {selectedTasmi.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Catatan Tajwid */}
                  {selectedTasmi.catatan_tajwid && (
                    <Card className="border-blue-200 bg-blue-50/30 dark:bg-blue-950/30">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold text-blue-900 dark:text-blue-100">
                          📖 Catatan Tajwid
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm leading-relaxed">
                          {selectedTasmi.catatan_tajwid}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Catatan Fashahah */}
                  {selectedTasmi.catatan_fashahah && (
                    <Card className="border-purple-200 bg-purple-50/30 dark:bg-purple-950/30">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold text-purple-900 dark:text-purple-100">
                          🗣️ Catatan Fashahah (Makharijul Huruf)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm leading-relaxed">
                          {selectedTasmi.catatan_fashahah}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Ayat yang Perlu Diulang */}
                  {selectedTasmi.ayat_yang_perlu_diulang && (
                    <Card className="border-orange-200 bg-orange-50/30 dark:bg-orange-950/30">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold text-orange-900 dark:text-orange-100 flex items-center gap-2">
                          <AlertCircle className="h-5 w-5" />
                          Ayat yang Perlu Diulang
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm leading-relaxed font-medium">
                          {selectedTasmi.ayat_yang_perlu_diulang}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Catatan Umum */}
                  {selectedTasmi.catatan_umum && (
                    <Card className="border-gray-200 bg-gray-50/30 dark:bg-gray-950/30">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">
                          💬 Catatan Umum
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm leading-relaxed italic">
                          &quot;{selectedTasmi.catatan_umum}&quot;
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
