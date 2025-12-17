'use client';

import { useTahfidz } from '@/contexts/TahfidzContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Activity } from 'lucide-react';

export default function LogsPage() {
  const { data } = useTahfidz();

  const sortedLogs = [...data.log_aktivitas].sort(
    (a, b) => new Date(b.waktu).getTime() - new Date(a.waktu).getTime()
  );

  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Activity className="h-8 w-8 text-emerald-600" />
        <div>
          <h1 className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">Log Aktivitas</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Riwayat aktivitas sistem</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-emerald-900 dark:text-emerald-100">
            Total {sortedLogs.length} Aktivitas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Pengguna</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedLogs.map((log) => {
                  const user = data.users.find((u) => u.id === log.id_user);
                  return (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium whitespace-nowrap">
                        {formatDateTime(log.waktu)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{user?.nama_lengkap || 'Unknown'}</span>
                          <Badge variant="secondary" className="text-xs">
                            {user?.role || '-'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{log.aksi}</TableCell>
                    </TableRow>
                  );
                })}
                {sortedLogs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-gray-500 py-8">
                      Belum ada log aktivitas
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}