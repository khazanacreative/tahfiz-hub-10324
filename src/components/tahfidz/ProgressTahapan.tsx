import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

interface TahapItem {
  id: string;
  nama: string;
  status: 'selesai' | 'sedang' | 'belum';
  progress: number;
  tanggal?: string;
}

interface ProgressTahapanProps {
  tahapan: TahapItem[];
  title?: string;
}

export function ProgressTahapan({ tahapan, title = "Progress Tahapan" }: ProgressTahapanProps) {
  const getStatusIcon = (status: TahapItem['status']) => {
    switch (status) {
      case 'selesai':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'sedang':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-300" />;
    }
  };

  const getStatusBadge = (status: TahapItem['status']) => {
    switch (status) {
      case 'selesai':
        return <Badge variant="default" className="bg-green-500">Selesai</Badge>;
      case 'sedang':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Sedang</Badge>;
      default:
        return <Badge variant="outline">Belum</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tahapan.map((tahap, index) => (
          <div key={tahap.id} className="flex items-center gap-4">
            <div className="flex-shrink-0">
              {getStatusIcon(tahap.status)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium truncate">{tahap.nama}</span>
                {getStatusBadge(tahap.status)}
              </div>
              <Progress value={tahap.progress} className="h-2" />
              {tahap.tanggal && (
                <span className="text-xs text-muted-foreground mt-1">{tahap.tanggal}</span>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default ProgressTahapan;
