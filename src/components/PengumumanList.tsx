'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Megaphone, Heart } from 'lucide-react';
import type { TahfidzData, Pengumuman } from '@/lib/tahfidz-types';

interface PengumumanListProps {
  data: TahfidzData;
}

export default function PengumumanList({ data }: PengumumanListProps) {
  const sortedPengumuman = [...data.pengumuman].sort(
    (a, b) => new Date(b.tanggal_post).getTime() - new Date(a.tanggal_post).getTime()
  );

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="text-emerald-900 flex items-center gap-2">
          <Megaphone className="h-5 w-5" />
          Pengumuman & Motivasi
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {sortedPengumuman.map((pengumuman: Pengumuman) => {
              const author = data.users.find((u) => u.id === pengumuman.dibuat_oleh);
              return (
                <div
                  key={pengumuman.id}
                  className="p-4 bg-gradient-to-r from-emerald-50 to-lime-50 rounded-lg border border-emerald-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {pengumuman.kategori === 'Pengumuman' ? (
                        <Megaphone className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Heart className="h-4 w-4 text-rose-600" />
                      )}
                      <h3 className="font-semibold text-emerald-900">
                        {pengumuman.judul}
                      </h3>
                    </div>
                    <Badge
                      variant={pengumuman.kategori === 'Pengumuman' ? 'default' : 'secondary'}
                      className={
                        pengumuman.kategori === 'Pengumuman'
                          ? 'bg-emerald-600'
                          : 'bg-rose-500 text-white'
                      }
                    >
                      {pengumuman.kategori}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{pengumuman.isi}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Oleh: {author?.nama_lengkap || 'Unknown'}</span>
                    <span>{formatDate(pengumuman.tanggal_post)}</span>
                  </div>
                </div>
              );
            })}
            {sortedPengumuman.length === 0 && (
              <p className="text-center text-gray-500 py-8">Belum ada pengumuman</p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
