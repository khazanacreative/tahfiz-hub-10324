'use client';

import React, { useState, useMemo } from 'react';
import { useTahfidz } from '@/contexts/TahfidzContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileDown, TrendingUp, Calendar, Award, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Santri, Setoran, Penilaian } from '@/lib/tahfidz-types';

export default function LaporanSantriPage(): React.JSX.Element {
  const { data, currentUser } = useTahfidz();
  const [period, setPeriod] = useState<string>('all');

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

  // Filter by period
  const filteredSetoran = useMemo(() => {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case '3months':
        startDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case '6months':
        startDate = new Date(now.setMonth(now.getMonth() - 6));
        break;
      default:
        return mySetoran;
    }

    return mySetoran.filter((s) => new Date(s.tanggal_setoran) >= startDate);
  }, [mySetoran, period]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalSetoran = filteredSetoran.length;
    const avgNilai = totalSetoran > 0 
      ? Math.round(filteredSetoran.reduce((sum: number, s: Setoran) => sum + s.nilai_kelancaran, 0) / totalSetoran)
      : 0;
    const lancar = filteredSetoran.filter((s: Setoran) => s.status === 'Lancar').length;
    const persenLancar = totalSetoran > 0 ? Math.round((lancar / totalSetoran) * 100) : 0;
    
    // Kehadiran (menggunakan data absensi)
    const myAbsensi = data.absensi.filter((a) => mySantri && a.id_santri === mySantri.id);
    const hadirCount = myAbsensi.filter((a) => a.status_kehadiran === 'Hadir').length;
    const kehadiran = myAbsensi.length > 0 ? Math.round((hadirCount / myAbsensi.length) * 100) : 0;

    return { totalSetoran, avgNilai, persenLancar, kehadiran };
  }, [filteredSetoran, data.absensi, mySantri]);

  // Chart data - distribusi setoran per juz
  const chartData = useMemo(() => {
    const juzCount: Record<number, number> = {};
    
    filteredSetoran.forEach((setoran) => {
      juzCount[setoran.juz] = (juzCount[setoran.juz] || 0) + 1;
    });

    return Object.entries(juzCount).map(([juz, count]) => ({
      juz: `Juz ${juz}`,
      setoran: count,
    }));
  }, [filteredSetoran]);

  const handleExportPDF = (): void => {
    toast.success('Laporan PDF sedang diunduh...');
    // Simulasi download
  };

  const handleExportExcel = (): void => {
    toast.success('Laporan Excel sedang diunduh...');
    // Simulasi download
  };

  if (!mySantri) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-green-900">Laporan & Rekapan</h1>
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-900">Laporan & Rekapan</h1>
          <p className="text-muted-foreground">Rekapitulasi hafalan dan perkembangan</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportPDF} variant="outline" className="gap-2">
            <FileDown className="h-4 w-4" />
            PDF
          </Button>
          <Button onClick={handleExportExcel} variant="outline" className="gap-2">
            <FileDown className="h-4 w-4" />
            Excel
          </Button>
        </div>
      </div>

      {/* Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Filter Periode
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Minggu Ini</SelectItem>
              <SelectItem value="month">Bulan Ini</SelectItem>
              <SelectItem value="3months">3 Bulan Terakhir</SelectItem>
              <SelectItem value="6months">6 Bulan Terakhir</SelectItem>
              <SelectItem value="all">Semua Waktu</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="pb-3">
            <CardDescription>Total Setoran</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{stats.totalSetoran}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Periode terpilih
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
          <CardHeader className="pb-3">
            <CardDescription>Rata-rata Nilai</CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.avgNilai}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Award className="h-4 w-4" />
              Dari semua setoran
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-white">
          <CardHeader className="pb-3">
            <CardDescription>% Lancar</CardDescription>
            <CardTitle className="text-3xl text-amber-600">{stats.persenLancar}%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" />
              Status lancar
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
          <CardHeader className="pb-3">
            <CardDescription>% Kehadiran</CardDescription>
            <CardTitle className="text-3xl text-purple-600">{stats.kehadiran}%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" />
              Total kehadiran
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Setoran Per Juz</CardTitle>
            <CardDescription>Grafik jumlah setoran untuk setiap juz</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="juz" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="setoran" fill="#10b981" name="Jumlah Setoran" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Setoran Terakhir */}
      <Card>
        <CardHeader>
          <CardTitle>Setoran Terakhir</CardTitle>
          <CardDescription>5 setoran terbaru dalam periode terpilih</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredSetoran.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Tidak ada setoran dalam periode ini</p>
          ) : (
            <div className="space-y-3">
              {filteredSetoran.slice(0, 5).map((setoran) => (
                <div
                  key={setoran.id}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {new Date(setoran.tanggal_setoran).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    <p className="mt-1 font-semibold">
                      Juz {setoran.juz} • Ayat {setoran.ayat_dari}-{setoran.ayat_sampai}
                    </p>
                    <p className="text-sm text-muted-foreground">Nilai: {setoran.nilai_kelancaran}</p>
                  </div>
                  <div className={`rounded px-3 py-1 text-xs font-semibold text-white ${
                    setoran.status === 'Lancar' ? 'bg-green-500' : 
                    setoran.status === 'Ulangi' ? 'bg-yellow-500' : 
                    'bg-red-500'
                  }`}>
                    {setoran.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Penilaian Terakhir */}
      <Card>
        <CardHeader>
          <CardTitle>Penilaian Terakhir</CardTitle>
          <CardDescription>5 penilaian terbaru</CardDescription>
        </CardHeader>
        <CardContent>
          {myPenilaian.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Belum ada penilaian</p>
          ) : (
            <div className="space-y-3">
              {myPenilaian.slice(0, 5).map((penilaian) => {
                const avg = Math.round((penilaian.tajwid + penilaian.makharij + penilaian.kelancaran) / 3);
                return (
                  <div
                    key={penilaian.id}
                    className="rounded-lg border p-4 hover:bg-accent"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {new Date(penilaian.tanggal_penilaian).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-green-700">{avg}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Tajwid:</span>{' '}
                        <span className="font-semibold">{penilaian.tajwid}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Makharij:</span>{' '}
                        <span className="font-semibold">{penilaian.makharij}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Kelancaran:</span>{' '}
                        <span className="font-semibold">{penilaian.kelancaran}</span>
                      </div>
                    </div>
                    {penilaian.catatan && (
                      <p className="mt-2 text-sm text-muted-foreground italic">{penilaian.catatan}</p>
                    )}
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
