'use client';

import { useState, useMemo } from 'react';
import { useTahfidz } from '@/contexts/TahfidzContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, FileText, BarChart3 } from 'lucide-react';
import { TablePagination } from '@/components/tahfidz/TablePagination';
import { toast } from 'sonner';
import type { Santri } from '@/lib/tahfidz-types';

export default function LaporanPage() {
  const { data, currentUser } = useTahfidz();
  const [selectedSantri, setSelectedSantri] = useState<string>('all');
  const [filterHalaqoh, setFilterHalaqoh] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const handleExportPDF = (): void => {
    toast.success('Export PDF (Simulasi)');
  };

  const handleExportExcel = (): void => {
    toast.success('Export Excel (Simulasi)');
  };

  // Filter santri based on role
  const santriList = useMemo(() => {
    let filtered = data.santri.filter((s) => s.status === 'Aktif');
    
    // Filter for Asatidz role - only show santri from their halaqoh
    if (currentUser && currentUser.role === 'Asatidz') {
      const ustadzHalaqoh = data.halaqoh.filter((h) => h.id_asatidz === currentUser.id);
      const halaqohIds = ustadzHalaqoh.map((h) => h.id);
      filtered = filtered.filter((s) => halaqohIds.includes(s.id_halaqoh));
    }
    
    return filtered;
  }, [data.santri, data.halaqoh, currentUser]);

  const getReportData = () => {
    if (selectedSantri === 'all') {
      return santriList.map((santri: Santri) => {
        const setoranSantri = data.setoran.filter((s) => s.id_santri === santri.id);
        const totalSetoran = setoranSantri.length;
        const avgNilai = totalSetoran > 0
          ? Math.round(setoranSantri.reduce((acc, s) => acc + s.nilai_kelancaran, 0) / totalSetoran)
          : 0;
        const absensiCount = data.absensi.filter((a) => a.id_santri === santri.id && a.status_kehadiran === 'Hadir').length;
        
        return {
          santri,
          totalSetoran,
          avgNilai,
          absensiCount,
        };
      });
    } else {
      const santri = santriList.find((s) => s.id === selectedSantri);
      if (!santri) return [];
      
      const setoranSantri = data.setoran.filter((s) => s.id_santri === santri.id);
      const totalSetoran = setoranSantri.length;
      const avgNilai = totalSetoran > 0
        ? Math.round(setoranSantri.reduce((acc, s) => acc + s.nilai_kelancaran, 0) / totalSetoran)
        : 0;
      const absensiCount = data.absensi.filter((a) => a.id_santri === santri.id && a.status_kehadiran === 'Hadir').length;

      return [{
        santri,
        totalSetoran,
        avgNilai,
        absensiCount,
      }];
    }
  };

  const reportData = useMemo(() => {
    const rawData = getReportData();
    
    if (filterHalaqoh !== 'all') {
      return rawData.filter(({ santri }) => santri.id_halaqoh === filterHalaqoh);
    }
    
    return rawData;
  }, [selectedSantri, filterHalaqoh, santriList, data.setoran, data.absensi, data.halaqoh]);

  const totalPages = Math.ceil(reportData.length / itemsPerPage);
  const paginatedData = reportData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">Laporan Hafalan</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Laporan dan statistik hafalan santri</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Total Santri Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-900">{santriList.length}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-lime-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Total Setoran</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-900">{data.setoran.length}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Rata-rata Kehadiran</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-900">
              {data.absensi.length > 0
                ? Math.round((data.absensi.filter((a) => a.status_kehadiran === 'Hadir').length / data.absensi.length) * 100)
                : 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-emerald-900 dark:text-emerald-100">Rekap Hafalan</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExportPDF}>
                <FileText className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportExcel}>
                <Download className="h-4 w-4 mr-2" />
                Excel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full sm:w-64">
              <Label>Filter Santri:</Label>
              <Select value={selectedSantri} onValueChange={(v) => { setSelectedSantri(v); setCurrentPage(1); }}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Pilih Santri" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Santri</SelectItem>
                  {santriList.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.nama_santri}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-64">
              <Label>Filter Halaqoh:</Label>
              <Select value={filterHalaqoh} onValueChange={(v) => { setFilterHalaqoh(v); setCurrentPage(1); }}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Pilih Halaqoh" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Halaqoh</SelectItem>
                  {(() => {
                    let halaqohList = data.halaqoh;
                    if (currentUser && currentUser.role === 'Asatidz') {
                      halaqohList = data.halaqoh.filter((h) => h.id_asatidz === currentUser.id);
                    }
                    return halaqohList.map((h) => (
                      <SelectItem key={h.id} value={h.id}>
                        {h.nama_halaqoh}
                      </SelectItem>
                    ));
                  })()}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NIS</TableHead>
                  <TableHead>Nama Santri</TableHead>
                  <TableHead>Halaqoh</TableHead>
                  <TableHead>Total Setoran</TableHead>
                  <TableHead>Rata-rata Nilai</TableHead>
                  <TableHead>Kehadiran</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map(({ santri, totalSetoran, avgNilai, absensiCount }) => {
                  const halaqoh = data.halaqoh.find((h) => h.id === santri.id_halaqoh);
                  return (
                    <TableRow key={santri.id}>
                      <TableCell className="font-medium">{santri.nis}</TableCell>
                      <TableCell>{santri.nama_santri}</TableCell>
                      <TableCell>{halaqoh?.nama_halaqoh || '-'}</TableCell>
                      <TableCell>{totalSetoran}</TableCell>
                      <TableCell>
                        <span className="font-bold text-emerald-700">{avgNilai}</span>
                      </TableCell>
                      <TableCell>{absensiCount} hari</TableCell>
                    </TableRow>
                  );
                })}
                {paginatedData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                      Tidak ada data
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={reportData.length}
            itemsPerPage={itemsPerPage}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Statistik Setoran per Juz
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {Array.from({ length: 30 }, (_, i) => {
              const juzNumber = i + 1;
              const setoranCount = data.setoran.filter((s) => s.juz === juzNumber).length;
              return (
                <div
                  key={juzNumber}
                  className="flex flex-col items-center justify-center p-3 bg-emerald-50 dark:bg-emerald-950 rounded-lg border border-emerald-200 dark:border-emerald-800"
                >
                  <span className="text-xs text-gray-600 dark:text-gray-400">Juz {juzNumber}</span>
                  <span className="text-lg font-bold text-emerald-700 dark:text-emerald-300">{setoranCount}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}