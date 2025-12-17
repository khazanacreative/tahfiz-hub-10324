
'use client';

import { useState, useMemo } from 'react';
import { useTahfidz } from '@/contexts/TahfidzContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { TablePagination } from '@/components/tahfidz/TablePagination';
import { toast } from 'sonner';
import type { Absensi, StatusKehadiran } from '@/lib/tahfidz-types';

export default function AbsensiPage() {
  const { data, currentUser, addAbsensi, updateAbsensi, deleteAbsensi } = useTahfidz();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editingAbsensi, setEditingAbsensi] = useState<Absensi | null>(null);
  const [filterSantri, setFilterSantri] = useState<string>('all');
  const [filterHalaqoh, setFilterHalaqoh] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState<{
    id_santri: string;
    tanggal: string;
    status_kehadiran: StatusKehadiran;
    keterangan: string;
  }>({
    id_santri: '',
    tanggal: new Date().toISOString().split('T')[0],
    status_kehadiran: 'Hadir',
    keterangan: '',
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!formData.id_santri) {
      toast.error('Santri harus dipilih');
      return;
    }

    if (editingAbsensi) {
      updateAbsensi(editingAbsensi.id, formData);
      toast.success('Absensi berhasil diupdate');
    } else {
      addAbsensi(formData);
      toast.success('Absensi berhasil ditambahkan');
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (absensi: Absensi): void => {
    setEditingAbsensi(absensi);
    setFormData({
      id_santri: absensi.id_santri,
      tanggal: absensi.tanggal,
      status_kehadiran: absensi.status_kehadiran,
      keterangan: absensi.keterangan,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string): void => {
    if (confirm('Yakin ingin menghapus absensi ini?')) {
      deleteAbsensi(id);
      toast.success('Absensi berhasil dihapus');
    }
  };

  const resetForm = (): void => {
    setFormData({
      id_santri: '',
      tanggal: new Date().toISOString().split('T')[0],
      status_kehadiran: 'Hadir',
      keterangan: '',
    });
    setEditingAbsensi(null);
  };

  const filteredAbsensi = useMemo(() => {
    let filtered = [...data.absensi].sort(
      (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
    );
    
    // Filter for Asatidz role - only show absensi from their halaqoh santri
    if (currentUser && currentUser.role === 'Asatidz') {
      const ustadzHalaqoh = data.halaqoh.filter((h) => h.id_asatidz === currentUser.id);
      const halaqohIds = ustadzHalaqoh.map((h) => h.id);
      const santriIds = data.santri
        .filter((s) => halaqohIds.includes(s.id_halaqoh))
        .map((s) => s.id);
      filtered = filtered.filter((a) => santriIds.includes(a.id_santri));
    }
    
    if (filterSantri !== 'all') {
      filtered = filtered.filter((a) => a.id_santri === filterSantri);
    }
    
    if (filterHalaqoh !== 'all') {
      filtered = filtered.filter((a) => {
        const santri = data.santri.find((s) => s.id === a.id_santri);
        return santri?.id_halaqoh === filterHalaqoh;
      });
    }
    
    return filtered;
  }, [data.absensi, data.santri, data.halaqoh, currentUser, filterSantri, filterHalaqoh]);

  const totalPages = Math.ceil(filteredAbsensi.length / itemsPerPage);
  const paginatedAbsensi = filteredAbsensi.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusColor = (status: StatusKehadiran): string => {
    const colors: Record<StatusKehadiran, string> = {
      'Hadir': 'default',
      'Izin': 'secondary',
      'Sakit': 'secondary',
      'Alfa': 'destructive',
    };
    return colors[status] || 'default';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">Absensi Setoran</h1>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-emerald-600 to-lime-600 hover:from-emerald-700 hover:to-lime-700">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Absensi
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingAbsensi ? 'Edit' : 'Tambah'} Absensi</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="id_santri">Santri</Label>
                <Select
                  value={formData.id_santri}
                  onValueChange={(value) => setFormData({ ...formData, id_santri: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih santri" />
                  </SelectTrigger>
                  <SelectContent>
                    {data.santri.filter((s) => s.status === 'Aktif').map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.nama_santri}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tanggal">Tanggal</Label>
                <Input
                  id="tanggal"
                  type="date"
                  value={formData.tanggal}
                  onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status_kehadiran">Status Kehadiran</Label>
                <Select
                  value={formData.status_kehadiran}
                  onValueChange={(value) => setFormData({ ...formData, status_kehadiran: value as StatusKehadiran })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hadir">Hadir</SelectItem>
                    <SelectItem value="Izin">Izin</SelectItem>
                    <SelectItem value="Sakit">Sakit</SelectItem>
                    <SelectItem value="Alfa">Alfa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="keterangan">Keterangan</Label>
                <Textarea
                  id="keterangan"
                  value={formData.keterangan}
                  onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                  placeholder="Keterangan (opsional)"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                  Simpan
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full sm:w-64">
              <Select
                value={filterSantri}
                onValueChange={(value) => {
                  setFilterSantri(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter Santri" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Santri</SelectItem>
                  {(() => {
                    let santriList = data.santri.filter((s) => s.status === 'Aktif');
                    if (currentUser && currentUser.role === 'Asatidz') {
                      const ustadzHalaqoh = data.halaqoh.filter((h) => h.id_asatidz === currentUser.id);
                      const halaqohIds = ustadzHalaqoh.map((h) => h.id);
                      santriList = santriList.filter((s) => halaqohIds.includes(s.id_halaqoh));
                    }
                    return santriList.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.nama_santri}
                      </SelectItem>
                    ));
                  })()}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-64">
              <Select
                value={filterHalaqoh}
                onValueChange={(value) => {
                  setFilterHalaqoh(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter Halaqoh" />
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
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Santri</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Keterangan</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAbsensi.map((absensi) => {
                  const santri = data.santri.find((s) => s.id === absensi.id_santri);
                  return (
                    <TableRow key={absensi.id}>
                      <TableCell>{new Date(absensi.tanggal).toLocaleDateString('id-ID')}</TableCell>
                      <TableCell>{santri?.nama_santri || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(absensi.status_kehadiran) as 'default' | 'secondary' | 'destructive'}>
                          {absensi.status_kehadiran}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{absensi.keterangan || '-'}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(absensi)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                            onClick={() => handleDelete(absensi.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {paginatedAbsensi.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                      Tidak ada data absensi
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
            totalItems={filteredAbsensi.length}
            itemsPerPage={itemsPerPage}
          />
        </CardContent>
      </Card>
    </div>
  );
}
