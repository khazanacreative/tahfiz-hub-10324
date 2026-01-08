import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';

export default function RaporSayaPage() {
  return (
    <Layout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
            Rapor Tahfidz Saya
          </h1>
          <p className="text-muted-foreground mt-1">
            Lihat perkembangan hafalan Anda setiap semester
          </p>
        </div>
      </div>

      <Card className="border-2 border-dashed border-emerald-200">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="h-20 w-20 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
              <FileText className="h-10 w-10 text-emerald-600" />
            </div>
          </div>
          <CardTitle className="text-center">Rapor Semester Tahfidz</CardTitle>
          <CardDescription className="text-center">
            Rapor semester Anda akan tersedia di sini
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-lg">
            <h3 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
              Rapor akan menampilkan:
            </h3>
            <ul className="space-y-2 text-sm text-emerald-700 dark:text-emerald-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600">•</span>
                Statistik hafalan (total juz, halaman, ayat)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600">•</span>
                Progress 5 manzil tahfidz
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600">•</span>
                Nilai kelancaran rata-rata
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600">•</span>
                Catatan tajwid dan fashahah dari ustadz
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600">•</span>
                Rekap kehadiran
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600">•</span>
                Prestasi dan rekomendasi
              </li>
            </ul>
          </div>

          <div className="flex justify-center pt-4">
            <Button disabled className="gap-2">
              <Download className="h-4 w-4" />
              Download Rapor PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monitoring Real-time</CardTitle>
          <CardDescription>Pantau perkembangan hafalan Anda melalui menu lain</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-emerald-50 to-lime-50 dark:from-emerald-950/20 dark:to-lime-950/20">
              <CardHeader>
                <CardTitle className="text-sm">Progress Hafalan</CardTitle>
                <CardDescription className="text-xs">Lihat per juz</CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-gradient-to-br from-lime-50 to-yellow-50 dark:from-lime-950/20 dark:to-yellow-950/20">
              <CardHeader>
                <CardTitle className="text-sm">Tasmi\' Saya</CardTitle>
                <CardDescription className="text-xs">Riwayat ujian</CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20">
              <CardHeader>
                <CardTitle className="text-sm">Penilaian</CardTitle>
                <CardDescription className="text-xs">Feedback ustadz</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
}
