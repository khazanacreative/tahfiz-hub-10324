import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Award, 
  TrendingUp, 
  Calendar, 
  CheckCircle2, 
  Clock,
  Send,
  FileText,
  Megaphone 
} from 'lucide-react';
import type { TahfidzData, User, Santri, Setoran, Penilaian, Absensi, Pengumuman } from '@/lib/tahfidz-types';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface DashboardSantriProps {
  data: TahfidzData;
  currentUser: User;
}

export default function DashboardSantri({ data, currentUser }: DashboardSantriProps) {
  // Find santri by wali
  const santriList = data.santri.filter((s: Santri) => s.id_wali === currentUser.id);
  const selectedSantri = santriList[0];

  if (!selectedSantri) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-10 text-center">
            <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Data santri tidak ditemukan untuk akun Anda</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const halaqoh = data.halaqoh.find((h) => h.id === selectedSantri.id_halaqoh);
  const asatidz = halaqoh ? data.users.find((u) => u.id === halaqoh.id_asatidz) : null;

  // Get data for this santri
  const setorans = data.setoran.filter((s: Setoran) => s.id_santri === selectedSantri.id);
  const penilaians = data.penilaian.filter((p: Penilaian) => p.id_santri === selectedSantri.id);
  const absensis = data.absensi.filter((a: Absensi) => a.id_santri === selectedSantri.id);
  
  // Get recent pengumuman
  const recentPengumuman = data.pengumuman
    .sort((a: Pengumuman, b: Pengumuman) => new Date(b.tanggal_post).getTime() - new Date(a.tanggal_post).getTime())
    .slice(0, 3);

  // Calculate stats
  const totalSetoran = setorans.length;
  const avgNilai = setorans.length > 0
    ? Math.round(setorans.reduce((sum: number, s: Setoran) => sum + s.nilai_kelancaran, 0) / setorans.length)
    : 0;

  // Calculate juz completed
  const juzProgress: { [key: number]: number } = {};
  setorans.forEach((setoran: Setoran) => {
    if (!juzProgress[setoran.juz]) {
      juzProgress[setoran.juz] = 0;
    }
    juzProgress[setoran.juz] += setoran.nilai_kelancaran;
  });
  const juzCompleted = Object.values(juzProgress).filter((avg) => avg >= 80).length;

  // Absensi stats
  const totalAbsensi = absensis.length;
  const hadir = absensis.filter((a: Absensi) => a.status_kehadiran === 'Hadir').length;
  const persentaseKehadiran = totalAbsensi > 0 ? Math.round((hadir / totalAbsensi) * 100) : 0;

  // Chart data - last 7 days setoran
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0];
    const count = setorans.filter((s: Setoran) => s.tanggal_setoran === dateStr).length;
    return {
      date: date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      setoran: count,
    };
  });

  // Recent setorans
  const recentSetorans = setorans
    .sort((a: Setoran, b: Setoran) => new Date(b.tanggal_setoran).getTime() - new Date(a.tanggal_setoran).getTime())
    .slice(0, 3);

  // Today's absensi
  const today = new Date().toISOString().split('T')[0];
  const todayAbsensi = absensis.find((a: Absensi) => a.tanggal === today);

  return (
    <div className="space-y-6">
      {/* Header with Santri Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
            Dashboard Santri
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Assalamu&apos;alaikum, {selectedSantri.nama_santri}
          </p>
        </div>
        <Link to="/santri/setoran">
          <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
            <Send className="h-4 w-4 mr-2" />
            Kirim Setoran
          </Button>
        </Link>
      </div>

      {/* Santri Profile Card */}
      <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-lime-50 dark:from-emerald-950 dark:to-lime-950">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">NIS</p>
              <p className="font-semibold text-emerald-800 dark:text-emerald-400">{selectedSantri.nis}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Halaqoh</p>
              <p className="font-semibold text-emerald-800 dark:text-emerald-400">{halaqoh?.nama_halaqoh}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ustadz</p>
              <p className="font-semibold text-emerald-800 dark:text-emerald-400">{asatidz?.nama_lengkap}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Status Hari Ini</p>
              {todayAbsensi ? (
                <Badge variant={todayAbsensi.status_kehadiran === 'Hadir' ? 'default' : 'secondary'}>
                  {todayAbsensi.status_kehadiran}
                </Badge>
              ) : (
                <Badge variant="secondary">Belum Absen</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-emerald-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Hafalan</p>
                <p className="text-3xl font-bold text-emerald-600">{juzCompleted} Juz</p>
                <p className="text-xs text-gray-500 mt-1">dari 30 juz</p>
              </div>
              <CheckCircle2 className="h-12 w-12 text-emerald-600 opacity-20" />
            </div>
            <Progress value={(juzCompleted / 30) * 100} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Setoran</p>
                <p className="text-3xl font-bold text-blue-600">{totalSetoran}</p>
                <p className="text-xs text-gray-500 mt-1">setoran hafalan</p>
              </div>
              <BookOpen className="h-12 w-12 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Rata-rata Nilai</p>
                <p className="text-3xl font-bold text-amber-600">{avgNilai}</p>
                <p className="text-xs text-gray-500 mt-1">dari 100</p>
              </div>
              <Award className="h-12 w-12 text-amber-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Kehadiran</p>
                <p className="text-3xl font-bold text-purple-600">{persentaseKehadiran}%</p>
                <p className="text-xs text-gray-500 mt-1">{hadir}/{totalAbsensi} hari</p>
              </div>
              <Calendar className="h-12 w-12 text-purple-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              Aktivitas Setoran 7 Hari Terakhir
            </CardTitle>
            <CardDescription>Grafik setoran hafalan minggu ini</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={last7Days}>
                <defs>
                  <linearGradient id="colorSetoran" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="setoran"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorSetoran)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Setorans */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-emerald-600" />
              Setoran Terakhir
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentSetorans.length === 0 ? (
              <p className="text-center text-gray-500 py-4">Belum ada setoran</p>
            ) : (
              <div className="space-y-3">
                {recentSetorans.map((setoran: Setoran) => (
                  <div key={setoran.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-sm">Juz {setoran.juz}</p>
                      <Badge variant={setoran.status === 'Lancar' ? 'default' : 'secondary'}>
                        {setoran.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(setoran.tanggal_setoran).toLocaleDateString('id-ID')}
                    </p>
                    {setoran.nilai_kelancaran > 0 && (
                      <p className="text-xs text-gray-600 mt-1">Nilai: {setoran.nilai_kelancaran}/100</p>
                    )}
                  </div>
                ))}
              </div>
            )}
            <Link to="/santri/progress">
              <Button variant="outline" className="w-full mt-4" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Lihat Semua Progress
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Pengumuman */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-emerald-600" />
            Pengumuman & Motivasi Terbaru
          </CardTitle>
          <CardDescription>Informasi dari pengurus dan ustadz</CardDescription>
        </CardHeader>
        <CardContent>
          {recentPengumuman.length === 0 ? (
            <p className="text-center text-gray-500 py-4">Belum ada pengumuman</p>
          ) : (
            <div className="space-y-3">
              {recentPengumuman.map((pengumuman: Pengumuman) => (
                <div key={pengumuman.id} className="border-l-4 border-l-emerald-500 pl-4 py-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-semibold">{pengumuman.judul}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                        {pengumuman.isi}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(pengumuman.tanggal_post).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <Badge variant={pengumuman.kategori === 'Pengumuman' ? 'default' : 'secondary'}>
                      {pengumuman.kategori}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Link to="/santri/pengumuman">
            <Button variant="outline" className="w-full mt-4" size="sm">
              <Megaphone className="h-4 w-4 mr-2" />
              Lihat Semua Pengumuman
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
