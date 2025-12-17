'use client';

import { useTahfidz } from '@/contexts/TahfidzContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import ProgressTahapan from '@/components/tahfidz/ProgressTahapan';
import { formatTahapLabel } from '@/lib/ujian-helper';
import { Calendar, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import type { TahapPenilaian } from '@/lib/tahfidz-types';

export default function UjianSayaPage() {
  const { data, currentUser } = useTahfidz();

  // Get santri data for current wali
  const santri = data.santri.find((s) => s.id_wali === currentUser?.id);

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

  // Get ujian tahapan for this santri
  const ujianSantri = data.ujian_tahapan.filter((u) => u.id_santri === santri.id);

  // Prepare data for progress stepper
  const tahapanProgress = ujianSantri.map((u) => ({
    tahap: u.tahap,
    status: u.status,
    kelancaran: u.kelancaran,
  }));

  // Get stats
  const totalUjian = ujianSantri.length;
  const totalLulus = ujianSantri.filter((u) => u.status === 'Lulus').length;
  const rataRataKelancaran =
    ujianSantri.length > 0
      ? ujianSantri.reduce((acc, u) => acc + u.kelancaran, 0) / ujianSantri.length
      : 0;

  // Sort ujian by tahap number
  const sortedUjian = [...ujianSantri].sort((a, b) => {
    const tahapOrder: Record<TahapPenilaian, number> = {
      'Tahap1_5Halaman': 1,
      'Tahap2_10Halaman': 2,
      'Tahap3_1Juz': 3,
      'Tahap4_UjianTasmi': 4,
    };
    return tahapOrder[a.tahap] - tahapOrder[b.tahap];
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
          Ujian Tahapan Saya
        </h1>
        <p className="text-muted-foreground mt-1">
          Pantau progress ujian tahapan hafalan Anda
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-emerald-200 dark:border-emerald-900">
          <CardHeader className="pb-3">
            <CardDescription>Total Ujian</CardDescription>
            <CardTitle className="text-3xl text-emerald-700">{totalUjian}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-emerald-200 dark:border-emerald-900">
          <CardHeader className="pb-3">
            <CardDescription>Lulus</CardDescription>
            <CardTitle className="text-3xl text-emerald-700">{totalLulus}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-emerald-200 dark:border-emerald-900">
          <CardHeader className="pb-3">
            <CardDescription>Rata-rata Kelancaran</CardDescription>
            <CardTitle className="text-3xl text-emerald-700">
              {rataRataKelancaran.toFixed(0)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Progress Stepper */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Progress Ujian Tahapan</CardTitle>
          <CardDescription className="text-center">
            {totalLulus} dari 4 tahap selesai
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProgressTahapan tahapan={tahapanProgress} />
        </CardContent>
      </Card>

      {/* Detail Each Tahap */}
      {sortedUjian.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Detail Ujian</h2>
          {sortedUjian.map((ujian) => {
            const asatidz = data.users.find((u) => u.id === ujian.id_asatidz);

            return (
              <Card key={ujian.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {formatTahapLabel(ujian.tahap)}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(ujian.tanggal_ujian).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {asatidz?.nama_lengkap || 'N/A'}
                        </span>
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        ujian.status === 'Lulus'
                          ? 'default'
                          : ujian.status === 'Tidak Lulus'
                          ? 'destructive'
                          : 'secondary'
                      }
                      className={
                        ujian.status === 'Lulus'
                          ? 'bg-emerald-600'
                          : ujian.status === 'Sedang Proses'
                          ? 'bg-yellow-500'
                          : ''
                      }
                    >
                      {ujian.status === 'Lulus' ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : ujian.status === 'Tidak Lulus' ? (
                        <XCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <AlertCircle className="h-3 w-3 mr-1" />
                      )}
                      {ujian.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Nilai Kelancaran */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Nilai Kelancaran</span>
                      <span className="text-2xl font-bold text-emerald-700">
                        {ujian.kelancaran}/100
                      </span>
                    </div>
                    <Progress value={ujian.kelancaran} className="h-3" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Jumlah kesalahan: {ujian.jumlah_kesalahan}
                    </p>
                  </div>

                  <Separator />

                  {/* Catatan Tajwid */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Catatan Tajwid</h4>
                    <p className="text-sm text-muted-foreground bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200 dark:border-amber-900">
                      {ujian.catatan_tajwid}
                    </p>
                  </div>

                  {/* Catatan Fashahah */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Catatan Fashahah (Makhroj Huruf)</h4>
                    <p className="text-sm text-muted-foreground bg-lime-50 dark:bg-lime-950/20 p-3 rounded-lg border border-lime-200 dark:border-lime-900">
                      {ujian.catatan_fashahah}
                    </p>
                  </div>

                  {/* Catatan Umum */}
                  {ujian.catatan_umum && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Catatan Umum</h4>
                      <p className="text-sm text-muted-foreground bg-emerald-50 dark:bg-emerald-950/20 p-3 rounded-lg border border-emerald-200 dark:border-emerald-900">
                        {ujian.catatan_umum}
                      </p>
                    </div>
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
              Belum ada ujian tahapan yang tercatat. Terus semangat menghafal!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}