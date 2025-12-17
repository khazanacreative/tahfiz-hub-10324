'use client';

import React, { useMemo } from 'react';
import { useTahfidz } from '@/contexts/TahfidzContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import type { Santri, Setoran, Penilaian } from '@/lib/tahfidz-types';

export default function ProgressSantriPage(): React.JSX.Element {
  const { data, currentUser } = useTahfidz();

  // Get santri data yang terkait dengan user yang login
  const mySantri = useMemo<Santri | undefined>(() => {
    if (!currentUser) return undefined;
    return data.santri.find((s: Santri) => s.id_wali === currentUser.id);
  }, [data.santri, currentUser]);

  // Get setoran untuk santri ini saja
  const mySetoran = useMemo<Setoran[]>(() => {
    if (!mySantri) return [];
    return data.setoran.filter((s: Setoran) => s.id_santri === mySantri.id);
  }, [data.setoran, mySantri]);

  // Get penilaian untuk santri ini saja
  const myPenilaian = useMemo<Penilaian[]>(() => {
    if (!mySantri) return [];
    return data.penilaian.filter((p: Penilaian) => p.id_santri === mySantri.id);
  }, [data.penilaian, mySantri]);

  // Calculate stats
  const stats = useMemo(() => {
    const juzProgress: Record<number, { setoran: number; avgNilai: number; status: string }> = {};
    
    // Group setoran by juz
    mySetoran.forEach((setoran) => {
      if (!juzProgress[setoran.juz]) {
        juzProgress[setoran.juz] = { setoran: 0, avgNilai: 0, status: 'Belum Dimulai' };
      }
      juzProgress[setoran.juz].setoran += 1;
      juzProgress[setoran.juz].avgNilai += setoran.nilai_kelancaran;
    });

    // Calculate average
    Object.keys(juzProgress).forEach((juz) => {
      const juzNum = parseInt(juz);
      const count = juzProgress[juzNum].setoran;
      juzProgress[juzNum].avgNilai = Math.round(juzProgress[juzNum].avgNilai / count);
      
      // Determine status
      if (juzProgress[juzNum].avgNilai >= 85 && count >= 3) {
        juzProgress[juzNum].status = 'Lulus';
      } else if (count > 0) {
        juzProgress[juzNum].status = 'Sedang Proses';
      }
    });

    const juzSelesai = Object.values(juzProgress).filter((j) => j.status === 'Lulus').length;
    const totalSetoran = mySetoran.length;
    const avgNilai = mySetoran.length > 0 
      ? Math.round(mySetoran.reduce((sum: number, s: Setoran) => sum + s.nilai_kelancaran, 0) / mySetoran.length)
      : 0;
    
    // Kehadiran (menggunakan data absensi)
    const myAbsensi = data.absensi.filter((a) => mySantri && a.id_santri === mySantri.id);
    const hadirCount = myAbsensi.filter((a) => a.status_kehadiran === 'Hadir').length;
    const kehadiran = myAbsensi.length > 0 ? Math.round((hadirCount / myAbsensi.length) * 100) : 0;

    return { juzProgress, juzSelesai, totalSetoran, avgNilai, kehadiran };
  }, [mySetoran, data.absensi, mySantri]);

  if (!mySantri) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-green-900">Progress Hafalan</h1>
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

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Lulus':
        return 'bg-green-500';
      case 'Sedang Proses':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getStatusIcon = (status: string): React.JSX.Element => {
    switch (status) {
      case 'Lulus':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'Sedang Proses':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <BookOpen className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-900">Progress Hafalan</h1>
          <p className="text-muted-foreground">Pantau perkembangan hafalan Anda per juz</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Juz Selesai</CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.juzSelesai}/30</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={(stats.juzSelesai / 30) * 100} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Setoran</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{stats.totalSetoran}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              <TrendingUp className="mr-1 inline h-4 w-4" />
              Terus semangat!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Rata-rata Nilai</CardDescription>
            <CardTitle className="text-3xl text-amber-600">{stats.avgNilai}</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={stats.avgNilai} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Kehadiran</CardDescription>
            <CardTitle className="text-3xl text-purple-600">{stats.kehadiran}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={stats.kehadiran} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Progress per Juz */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Progress Per Juz (1-30)
          </CardTitle>
          <CardDescription>Klik pada card untuk melihat detail</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => {
              const progress = stats.juzProgress[juz] || { setoran: 0, avgNilai: 0, status: 'Belum Dimulai' };
              const statusColor = getStatusColor(progress.status);
              const statusIcon = getStatusIcon(progress.status);

              return (
                <Card
                  key={juz}
                  className={`cursor-pointer transition-all hover:scale-105 hover:shadow-lg ${
                    progress.status === 'Lulus' ? 'border-green-500 bg-green-50' : 
                    progress.status === 'Sedang Proses' ? 'border-yellow-500 bg-yellow-50' : 
                    'border-gray-200'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold text-gray-900">Juz {juz}</span>
                      {statusIcon}
                    </div>
                    
                    <div className="space-y-1">
                      <Badge variant="outline" className="text-xs">
                        {progress.setoran} setoran
                      </Badge>
                      {progress.avgNilai > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground mb-1">Nilai Rata-rata</p>
                          <div className="flex items-center gap-2">
                            <Progress value={progress.avgNilai} className="h-2 flex-1" />
                            <span className="text-xs font-semibold">{progress.avgNilai}</span>
                          </div>
                        </div>
                      )}
                      <div className={`mt-2 rounded px-2 py-1 text-center text-xs font-medium text-white ${statusColor}`}>
                        {progress.status}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Keterangan */}
      <Card>
        <CardHeader>
          <CardTitle>Keterangan Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Lulus</p>
                <p className="text-xs text-muted-foreground">Nilai rata-rata ≥ 85 & minimal 3 setoran</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium">Sedang Proses</p>
                <p className="text-xs text-muted-foreground">Sudah ada setoran tapi belum lulus</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium">Belum Dimulai</p>
                <p className="text-xs text-muted-foreground">Belum ada setoran sama sekali</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
