'use client';

import { useTahfidz } from '@/contexts/TahfidzContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Megaphone, Lightbulb, Calendar, User } from 'lucide-react';
import type { Pengumuman } from '@/lib/tahfidz-types';

export default function PengumumanSantriPage() {
  const { data } = useTahfidz();

  // Get all pengumumans sorted by date
  const pengumumans = data.pengumuman
    .sort((a: Pengumuman, b: Pengumuman) => new Date(b.tanggal_post).getTime() - new Date(a.tanggal_post).getTime());

  const getIcon = (kategori: string): JSX.Element => {
    return kategori === 'Pengumuman' ? (
      <Megaphone className="h-5 w-5 text-emerald-600" />
    ) : (
      <Lightbulb className="h-5 w-5 text-amber-600" />
    );
  };

  const getBadgeVariant = (kategori: string): 'default' | 'secondary' => {
    return kategori === 'Pengumuman' ? 'default' : 'secondary';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-emerald-800 dark:text-emerald-400">
          Pengumuman & Motivasi
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Informasi terbaru dari pengurus dan ustadz tahfidz
        </p>
      </div>

      {/* Pengumuman List */}
      {pengumumans.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <Megaphone className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Belum ada pengumuman atau motivasi</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pengumumans.map((pengumuman: Pengumuman) => {
            const author = data.users.find((u) => u.id === pengumuman.dibuat_oleh);
            
            return (
              <Card
                key={pengumuman.id}
                className={`border-l-4 ${
                  pengumuman.kategori === 'Pengumuman'
                    ? 'border-l-emerald-500'
                    : 'border-l-amber-500'
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      {getIcon(pengumuman.kategori)}
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{pengumuman.judul}</CardTitle>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(pengumuman.tanggal_post).toLocaleDateString('id-ID', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{author?.nama_lengkap}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Badge variant={getBadgeVariant(pengumuman.kategori)}>
                      {pengumuman.kategori}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {pengumuman.isi}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Info Box */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-blue-600 mt-1" />
            <div>
              <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Tips Menghafal Al-Quran
              </p>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                <li>Istiqomah dalam menambah hafalan setiap hari</li>
                <li>Muroja&apos;ah hafalan lama secara rutin</li>
                <li>Pahami makna ayat yang dihafal</li>
                <li>Perbanyak tilawah di luar waktu setoran</li>
                <li>Berdoa kepada Allah untuk kemudahan menghafal</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
