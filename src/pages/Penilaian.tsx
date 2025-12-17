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
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import type { Penilaian } from '@/lib/tahfidz-types';

export default function PenilaianPage() {
  const { data, currentUser, addPenilaian, updatePenilaian, deletePenilaian } = useTahfidz();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editingPenilaian, setEditingPenilaian] = useState<Penilaian | null>(null);

  const [formData, setFormData] = useState<{
    id_santri: string;
    id_asatidz: string;
    tanggal_penilaian: string;
    catatan_tajwid: string;
    catatan_fashahah: string;
    kelancaran: number;
    catatan_umum: string;
  }>({
    id_santri: '',
    id_asatidz: currentUser?.id || '',
    tanggal_penilaian: new Date().toISOString().split('T')[0],
    catatan_tajwid: '',
    catatan_fashahah: '',
    kelancaran: 0,
    catatan_umum: '',
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!currentUser) {
      toast.error('Anda harus login terlebih dahulu');
      return;
    }

    if (!formData.id_santri) {
      toast.error('Santri harus dipilih');
      return;
    }

    // Set id_asatidz dari currentUser jika belum ada
    const finalFormData = {
      ...formData,
      id_asatidz: formData.id_asatidz || currentUser.id,
    };

    if (!finalFormData.id_asatidz) {
      toast.error('Data ustadz tidak valid');
      return;
    }

    if (editingPenilaian) {
      updatePenilaian(editingPenilaian.id, finalFormData);
      toast.success('Penilaian berhasil diupdate');
    } else {
      addPenilaian(finalFormData);
      toast.success('Penilaian berhasil ditambahkan');
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (penilaian: Penilaian): void => {
    setEditingPenilaian(penilaian);
    setFormData({
      id_santri: penilaian.id_santri,
      id_asatidz: penilaian.id_asatidz,
      tanggal_penilaian: penilaian.tanggal_penilaian,
      catatan_tajwid: penilaian.catatan_tajwid,
      catatan_fashahah: penilaian.catatan_fashahah,
      kelancaran: penilaian.kelancaran,
      catatan_umum: penilaian.catatan_umum,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string): void => {
    if (confirm('Yakin ingin menghapus penilaian ini?')) {
      deletePenilaian(id);
      toast.success('Penilaian berhasil dihapus');
    }
  };

  const resetForm = (): void => {
    setFormData({
      id_santri: '',
      id_asatidz: currentUser?.id || '',
      tanggal_penilaian: new Date().toISOString().split('T')[0],
      catatan_tajwid: '',
      catatan_fashahah: '',
      kelancaran: 0,
      catatan_umum: '',
    });
    setEditingPenilaian(null);
  };

  const sortedPenilaian = useMemo(() => 
    [...data.penilaian].sort(
      (a, b) => new Date(b.tanggal_penilaian).getTime() - new Date(a.tanggal_penilaian).getTime()
    ), [data.penilaian]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">Penilaian & Evaluasi</h1>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-emerald-600 to-lime-600 hover:from-emerald-700 hover:to-lime-700">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Penilaian
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingPenilaian ? 'Edit' : 'Tambah'} Penilaian</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      {data.santri.filter((s) => s.status === 'Aktif').length === 0 ? (
                        <SelectItem value="" disabled>
                          Tidak ada santri aktif
                        </SelectItem>
                      ) : (
                        data.santri.filter((s) => s.status === 'Aktif').map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.nama_santri}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tanggal_penilaian">Tanggal Penilaian</Label>
                  <Input
                    id="tanggal_penilaian"
                    type="date"
                    value={formData.tanggal_penilaian}
                    onChange={(e) => setFormData({ ...formData, tanggal_penilaian: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kelancaran">Kelancaran (0-100)</Label>
                  <Input
                    id="kelancaran"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.kelancaran}
                    onChange={(e) => {
                      const value = e.target.value;
                      const numValue = value === '' ? 0 : parseInt(value) || 0;
                      setFormData({ ...formData, kelancaran: Math.min(100, Math.max(0, numValue)) });
                    }}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="catatan_tajwid">Catatan Tajwid</Label>
                  <Textarea
                    id="catatan_tajwid"
                    value={formData.catatan_tajwid}
                    onChange={(e) => setFormData({ ...formData, catatan_tajwid: e.target.value })}
                    placeholder="Contoh: Bacaan mad wajib sudah baik, qolqolah perlu diperbaiki..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="catatan_fashahah">Catatan Fashahah (Makharijul Huruf)</Label>
                  <Textarea
                    id="catatan_fashahah"
                    value={formData.catatan_fashahah}
                    onChange={(e) => setFormData({ ...formData, catatan_fashahah: e.target.value })}
                    placeholder="Contoh: Huruf ث dan س perlu dibedakan, huruf ع sudah bagus..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="catatan_umum">Catatan Umum</Label>
                  <Textarea
                    id="catatan_umum"
                    value={formData.catatan_umum}
                    onChange={(e) => setFormData({ ...formData, catatan_umum: e.target.value })}
                    placeholder="Catatan evaluasi tambahan..."
                    rows={2}
                  />
                </div>
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
        <CardHeader />
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Santri</TableHead>
                  <TableHead>Kelancaran</TableHead>
                  <TableHead>Catatan Tajwid</TableHead>
                  <TableHead>Catatan Fashahah</TableHead>
                  <TableHead>Catatan Umum</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPenilaian.map((penilaian) => {
                  const santri = data.santri.find((s) => s.id === penilaian.id_santri);
                  
                  return (
                    <TableRow key={penilaian.id}>
                      <TableCell>{new Date(penilaian.tanggal_penilaian).toLocaleDateString('id-ID')}</TableCell>
                      <TableCell>{santri?.nama_santri || '-'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={penilaian.kelancaran} className="w-16" />
                          <span className="font-semibold">{penilaian.kelancaran}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="truncate text-sm">{penilaian.catatan_tajwid || '-'}</p>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="truncate text-sm">{penilaian.catatan_fashahah || '-'}</p>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="truncate text-sm">{penilaian.catatan_umum || '-'}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(penilaian)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                            onClick={() => handleDelete(penilaian.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {sortedPenilaian.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                      Tidak ada data penilaian
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}