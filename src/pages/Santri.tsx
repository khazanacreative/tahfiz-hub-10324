'use client';

import { useState, useMemo } from 'react';
import { useTahfidz } from '@/contexts/TahfidzContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import TablePagination from '@/components/tahfidz/TablePagination';
import { toast } from 'sonner';
import { useForm } from '@/lib/hooks/forms';
import type { Santri, StatusSantri } from '@/lib/tahfidz-types';

export default function SantriPage() {
  const { data, currentUser, addSantri, updateSantri, deleteSantri } = useTahfidz();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editingSantri, setEditingSantri] = useState<Santri | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterHalaqoh, setFilterHalaqoh] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const {
    values: formData,
    setValue: setFormData,
    updateValues,
    reset: resetForm,
    handleSubmit: formHandleSubmit,
    isSubmitting
  } = useForm({
    nis: '',
    nama_santri: '',
    id_halaqoh: '',
    id_kelas: '',
    id_wali: '',
    tanggal_masuk: '',
    status: 'Aktif' as StatusSantri,
  });

  const waliList = data.users.filter((u) => u.role === 'WaliSantri');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await formHandleSubmit(onSubmit);
  };

  const onSubmit = async (values: typeof formData) => {
    if (editingSantri) {
      updateSantri(editingSantri.id, values);
      toast.success('Data santri berhasil diupdate');
    } else {
      addSantri(values);
      toast.success('Santri berhasil ditambahkan');
    }

    setIsDialogOpen(false);
    resetFormManual();
  };

  const handleEdit = (santri: Santri): void => {
    setEditingSantri(santri);
    updateValues({
      nis: santri.nis,
      nama_santri: santri.nama_santri,
      id_halaqoh: santri.id_halaqoh,
      id_kelas: santri.id_kelas,
      id_wali: santri.id_wali,
      tanggal_masuk: santri.tanggal_masuk,
      status: santri.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string): void => {
    if (confirm('Yakin ingin menghapus santri ini?')) {
      deleteSantri(id);
      toast.success('Santri berhasil dihapus');
    }
  };

  const resetFormManual = (): void => {
    updateValues({
      nis: '',
      nama_santri: '',
      id_halaqoh: '',
      id_kelas: '',
      id_wali: '',
      tanggal_masuk: '',
      status: 'Aktif',
    });
    setEditingSantri(null);
  };

  const filteredSantri = useMemo(() => {
    let filtered = data.santri;
    
    // Filter for Asatidz role - only show santri from their halaqoh
    if (currentUser && currentUser.role === 'Asatidz') {
      const ustadzHalaqoh = data.halaqoh.filter((h) => h.id_asatidz === currentUser.id);
      const halaqohIds = ustadzHalaqoh.map((h) => h.id);
      filtered = filtered.filter((s) => halaqohIds.includes(s.id_halaqoh));
    }
    
    filtered = filtered.filter((s) =>
      s.nama_santri.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nis.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (filterHalaqoh !== 'all') {
      filtered = filtered.filter((s) => s.id_halaqoh === filterHalaqoh);
    }
    
    return filtered;
  }, [data.santri, data.halaqoh, currentUser, searchTerm, filterHalaqoh]);

  const totalPages = Math.ceil(filteredSantri.length / itemsPerPage);
  const paginatedSantri = filteredSantri.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">Data Santri</h1>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-emerald-600 to-lime-600 hover:from-emerald-700 hover:to-lime-700">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Santri
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingSantri ? 'Edit' : 'Tambah'} Santri</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nis">NIS</Label>
                  <Input
                    id="nis"
                    value={formData.nis}
                    onChange={(e) => setFormData('nis', e.target.value)}
                    placeholder="Nomor Induk Santri"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nama_santri">Nama Lengkap</Label>
                  <Input
                    id="nama_santri"
                    value={formData.nama_santri}
                    onChange={(e) => setFormData('nama_santri', e.target.value)}
                    placeholder="Nama lengkap santri"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="id_halaqoh">Halaqoh</Label>
                  <Select
                    value={formData.id_halaqoh}
                    onValueChange={(value) => setFormData('id_halaqoh', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih halaqoh" />
                    </SelectTrigger>
                    <SelectContent>
                      {data.halaqoh.map((h) => (
                        <SelectItem key={h.id} value={h.id}>
                          {h.nama_halaqoh}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="id_wali">Wali Santri</Label>
                  <Select
                    value={formData.id_wali}
                    onValueChange={(value) => setFormData('id_wali', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih wali" />
                    </SelectTrigger>
                    <SelectContent>
                      {waliList.map((w) => (
                        <SelectItem key={w.id} value={w.id}>
                          {w.nama_lengkap}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tanggal_masuk">Tanggal Masuk</Label>
                  <Input
                    id="tanggal_masuk"
                    type="date"
                    value={formData.tanggal_masuk}
                    onChange={(e) => setFormData('tanggal_masuk', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData('status', value as StatusSantri)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Aktif">Aktif</SelectItem>
                      <SelectItem value="Nonaktif">Nonaktif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
                  {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari santri..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
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
                  <TableHead>NIS</TableHead>
                  <TableHead>Nama Santri</TableHead>
                  <TableHead>Halaqoh</TableHead>
                  <TableHead>Wali Santri</TableHead>
                  <TableHead>Tanggal Masuk</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSantri.map((santri) => {
                  const halaqoh = data.halaqoh.find((h) => h.id === santri.id_halaqoh);
                  const wali = data.users.find((u) => u.id === santri.id_wali);
                  return (
                    <TableRow key={santri.id}>
                      <TableCell className="font-medium">{santri.nis}</TableCell>
                      <TableCell>{santri.nama_santri}</TableCell>
                      <TableCell>{halaqoh?.nama_halaqoh || '-'}</TableCell>
                      <TableCell>{wali?.nama_lengkap || '-'}</TableCell>
                      <TableCell>{new Date(santri.tanggal_masuk).toLocaleDateString('id-ID')}</TableCell>
                      <TableCell>
                        <Badge variant={santri.status === 'Aktif' ? 'default' : 'secondary'}>
                          {santri.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(santri)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                            onClick={() => handleDelete(santri.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {paginatedSantri.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                      Tidak ada data santri
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
            totalItems={filteredSantri.length}
            itemsPerPage={itemsPerPage}
          />
        </CardContent>
      </Card>
    </div>
  );
}
