'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award } from 'lucide-react';
import type { TahfidzData, Santri } from '@/lib/tahfidz-types';

interface TopRankingProps {
  data: TahfidzData;
}

export default function TopRanking({ data }: TopRankingProps) {
  const santriRanking = data.santri
    .filter((s) => s.status === 'Aktif')
    .map((santri: Santri) => {
      const setoranSantri = data.setoran.filter((st) => st.id_santri === santri.id);
      const totalSetoran = setoranSantri.length;
      const avgNilai = totalSetoran > 0
        ? setoranSantri.reduce((acc, s) => acc + s.nilai_kelancaran, 0) / totalSetoran
        : 0;

      return {
        ...santri,
        totalSetoran,
        avgNilai: Math.round(avgNilai),
      };
    })
    .sort((a, b) => {
      if (b.avgNilai !== a.avgNilai) return b.avgNilai - a.avgNilai;
      return b.totalSetoran - a.totalSetoran;
    })
    .slice(0, 10);

  const getRankIcon = (index: number): JSX.Element => {
    if (index === 0) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (index === 1) return <Medal className="h-5 w-5 text-gray-400" />;
    if (index === 2) return <Award className="h-5 w-5 text-amber-600" />;
    return <span className="text-emerald-700 font-bold">{index + 1}</span>;
  };

  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader>
        <CardTitle className="text-emerald-900 flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Top 10 Ranking Santri
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {santriRanking.map((santri, index) => (
            <div
              key={santri.id}
              className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-lime-50 rounded-lg border border-emerald-200"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center justify-center w-8">
                  {getRankIcon(index)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-emerald-900 truncate">
                    {santri.nama_santri}
                  </p>
                  <p className="text-sm text-emerald-600">
                    {santri.totalSetoran} setoran
                  </p>
                </div>
              </div>
              <Badge
                variant="secondary"
                className="bg-emerald-600 text-white hover:bg-emerald-700 ml-2"
              >
                {santri.avgNilai}
              </Badge>
            </div>
          ))}
          {santriRanking.length === 0 && (
            <p className="text-center text-gray-500 py-4">Belum ada data santri</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}