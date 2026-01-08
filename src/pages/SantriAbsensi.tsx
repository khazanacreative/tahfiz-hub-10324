import React, { useMemo } from 'react';
import Layout from '@/components/Layout';
import { useTahfidz } from '@/contexts/TahfidzContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle2, XCircle, AlertCircle, HelpCircle, TrendingUp } from 'lucide-react';
import type { Santri, Absensi } from '@/lib/tahfidz-types';

export default function AbsensiSantriPage(): React.JSX.Element {
  const { data, currentUser } = useTahfidz();

  // Get santri data yang terkait dengan user yang login
  const mySantri = useMemo<Santri | undefined>(() => {
    if (!currentUser) return undefined;
    return data.santri.find((s: Santri) => s.id_wali === currentUser.id);
  }, [data.santri, currentUser]);

  // Get absensi untuk santri ini saja
  const myAbsensi = useMemo<Absensi[]>(() => {
    if (!mySantri) return [];
    return data.absensi
      .filter((a: Absensi) => a.id_santri === mySantri.id)
      .sort((a: Absensi, b: Absensi) => 
        new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
      );
  }, [data.absensi, mySantri]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = myAbsensi.length;
    const hadir = myAbsensi.filter((a: Absensi) => a.status_kehadiran === 'Hadir').length;
    const izin = myAbsensi.filter((a: Absensi) => a.status_kehadiran === 'Izin').length;
    const sakit = myAbsensi.filter((a: Absensi) => a.status_kehadiran === 'Sakit').length;
    const alfa = myAbsensi.filter((a: Absensi) => a.status_kehadiran === 'Alfa').length;
    const persentase = total > 0 ? Math.round((hadir / total) * 100) : 0;

    return { total, hadir, izin, sakit, alfa, persentase };
  }, [myAbsensi]);

  const getStatusIcon = (status: string): React.JSX.Element => {
    switch (status) {
      case 'Hadir':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'Izin':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'Sakit':
        return <HelpCircle className="h-5 w-5 text-orange-600" />;
      case 'Alfa':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <HelpCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string): React.JSX.Element => {
    const config: Record<string, { className: string }> = {
      'Hadir': { className: 'bg-green-500' },
      'Izin': { className: 'bg-yellow-500' },
      'Sakit': { className: 'bg-orange-500' },
      'Alfa': { className: 'bg-red-500' },
    };
    const { className } = config[status] || { className: 'bg-gray-500' };
    return <Badge className={className}>{status}</Badge>;
  };

  if (!mySantri) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-green-900">Absensi Tahfidz</h1>
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
    <Layout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-900">Absensi Tahfidz</h1>
          <p className="text-muted-foreground">Rekap kehadiran di halaqoh</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Total</CardDescription>
            <CardTitle className="text-2xl text-blue-600">{stats.total}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Hadir</CardDescription>
            <CardTitle className="text-2xl text-green-600">{stats.hadir}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-white">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Izin</CardDescription>
            <CardTitle className="text-2xl text-yellow-600">{stats.izin}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Sakit</CardDescription>
            <CardTitle className="text-2xl text-orange-600">{stats.sakit}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-red-200 bg-gradient-to-br from-red-50 to-white">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Alfa</CardDescription>
            <CardTitle className="text-2xl text-red-600">{stats.alfa}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Kehadiran</CardDescription>
            <CardTitle className="text-2xl text-purple-600">{stats.persentase}%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Riwayat Absensi */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Riwayat Absensi
          </CardTitle>
          <CardDescription>Daftar kehadiran harian</CardDescription>
        </CardHeader>
        <CardContent>
          {myAbsensi.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Belum ada data absensi</p>
          ) : (
            <div className="space-y-3">
              {myAbsensi.map((absensi) => (
                <div
                  key={absensi.id}
                  className="flex items-center justify-between rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-lime-50 p-4 transition-all hover:shadow-md"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {getStatusIcon(absensi.status_kehadiran)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-900">
                          {new Date(absensi.tanggal).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      {absensi.keterangan && (
                        <p className="text-sm text-muted-foreground ml-6">{absensi.keterangan}</p>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(absensi.status_kehadiran)}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Persentase Kehadiran */}
      {stats.persentase > 0 && (
        <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-900">
              <TrendingUp className="h-5 w-5" />
              Persentase Kehadiran
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-purple-900">Tingkat Kehadiran</span>
                <span className="text-2xl font-bold text-purple-700">{stats.persentase}%</span>
              </div>
              <div className="h-4 overflow-hidden rounded-full bg-purple-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                  style={{ width: `${stats.persentase}%` }}
                />
              </div>
              <p className="text-sm text-purple-700">
                {stats.persentase >= 90 ? '🌟 Masya Allah! Kehadiran sangat baik!' :
                 stats.persentase >= 80 ? '👍 Alhamdulillah, kehadiran baik!' :
                 stats.persentase >= 70 ? '💪 Terus tingkatkan kehadiran!' :
                 '⚠️ Perlu lebih rajin hadir!'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Keterangan Status */}
      <Card>
        <CardHeader>
          <CardTitle>Keterangan Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-sm">Hadir</p>
                <p className="text-xs text-muted-foreground">Mengikuti halaqoh</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-sm">Izin</p>
                <p className="text-xs text-muted-foreground">Izin dengan keterangan</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium text-sm">Sakit</p>
                <p className="text-xs text-muted-foreground">Tidak hadir karena sakit</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium text-sm">Alfa</p>
                <p className="text-xs text-muted-foreground">Tanpa keterangan</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
}
