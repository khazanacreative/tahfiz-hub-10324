'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award } from 'lucide-react';

interface GradingLegendProps {
  className?: string;
}

export function GradingLegend({ className }: GradingLegendProps) {
  const grades = [
    { range: '91-100', label: 'Sangat Baik', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { range: '81-90', label: 'Baik', color: 'bg-blue-100 text-blue-800 border-blue-300' },
    { range: '71-80', label: 'Cukup', color: 'bg-amber-100 text-amber-800 border-amber-300' },
    { range: '0-70', label: 'Kurang', color: 'bg-red-100 text-red-800 border-red-300' },
  ];

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Award className="h-4 w-4 text-emerald-600" />
          Kategori Nilai
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {grades.map((grade) => (
            <div key={grade.range} className="text-center">
              <Badge variant="outline" className={`${grade.color} w-full justify-center text-xs py-1`}>
                {grade.range}
              </Badge>
              <p className="text-xs text-gray-600 mt-1">{grade.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function getGradeLabel(score: number): string {
  if (score >= 91) return 'Sangat Baik';
  if (score >= 81) return 'Baik';
  if (score >= 71) return 'Cukup';
  return 'Kurang';
}

export function getGradeColor(score: number): string {
  if (score >= 91) return 'text-emerald-700';
  if (score >= 81) return 'text-blue-700';
  if (score >= 71) return 'text-amber-700';
  return 'text-red-700';
}
