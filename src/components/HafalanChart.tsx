'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { TahfidzData } from '@/lib/tahfidz-types';

interface HafalanChartProps {
  data: TahfidzData;
}

export default function HafalanChart({ data }: HafalanChartProps) {
  const juzData = Array.from({ length: 30 }, (_, i) => {
    const juzNumber = i + 1;
    const setoranCount = data.setoran.filter((s) => s.juz === juzNumber).length;
    const avgNilai = data.setoran
      .filter((s) => s.juz === juzNumber)
      .reduce((acc, s) => acc + s.nilai_kelancaran, 0) / (setoranCount || 1);

    return {
      juz: `Juz ${juzNumber}`,
      setoran: setoranCount,
      nilai: Math.round(avgNilai),
    };
  });

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-emerald-900">Grafik Perkembangan Hafalan per Juz</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={juzData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="juz"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="setoran" fill="#10b981" name="Jumlah Setoran" radius={[8, 8, 0, 0]} />
            <Bar dataKey="nilai" fill="#f59e0b" name="Rata-rata Nilai" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}