'use client';

import { useState } from 'react';
import { useTahfidz } from '@/contexts/TahfidzContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useForm, useModal } from '@/lib/hooks/forms';
import { halaqohSchema, type HalaqohFormData } from '@/lib/validations/schemas';
import type { Halaqoh } from '@/lib/tahfidz-types';

export default function HalaqohPage() {
  const { data, addHalaqoh, updateHalaqoh, deleteHalaqoh } = useTahfidz();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterUstadz, setFilterUstadz] = useState<string>('all');

  const formModal = useModal();
  const deleteModal = useModal();

  const form = useForm<HalaqohFormData>({
    nama_halaqoh: '',
    id_asatidz: '',
    tingkat: '',
  });

  const [editingHalaqoh, setEditingHalaqoh] = useState<Halaqoh | null>(null);

  const asatidzList = data.users.filter((u) => u.role === 'Asatidz' && u.aktif);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await form.handleSubmit(async (values) => {
      try {
        if (editingHalaqoh) {
          updateHalaqoh(editingHalaqoh.id, values);
          toast.success('Halaqoh berhasil diupdate');
        } else {
          addHalaqoh(values as Omit<Halaqoh, "id" | "jumlah_santri">);
          toast.success('Halaqoh berhasil ditambahkan');
        }

        formModal.close();
        form.reset();
        setEditingHalaqoh(null);
      } catch (error) {
        toast.error('Terjadi kesalahan saat menyimpan data');
      }
    });
  };

  const handleEdit = (halaqoh: Halaqoh): void => {
    setEditingHalaqoh(halaqoh);
    form.setValue('nama_halaqoh', halaqoh.nama_halaqoh);
    form.setValue('id_asatidz', halaqoh.id_asatidz);
    form.setValue('tingkat', halaqoh.tingkat);
    formModal.open();
  };

  const handleDelete = (id: string): void => {
    if (confirm('Yakin ingin menghapus halaqoh ini?')) {
      deleteHalaqoh(id);
      toast.success('Halaqoh berhasil dihapus');
    }
  };

  const resetForm = (): void => {
    form.reset();
    setEditingHalaqoh(null);
  };

  const halaqohWithCount = data.halaqoh.map((h) => ({
    ...h,
    jumlah_santri: data.santri.filter((s) => s.id_halaqoh === h.id && s.status === 'Aktif').length,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">Data Halaqoh</h1>
        <Dialog open={formModal.isOpen} onOpenChange={(open) => {
          formModal.setIsOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-emerald-600 to-lime-600 hover:from-emerald-700 hover:to-lime-700">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Halaqoh
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingHalaqoh ? 'Edit' : 'Tambah'} Halaqoh</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nama_halaqoh">Nama Halaqoh</Label>
                <Input
                  id="nama_halaqoh"
                  value={form.values.nama_halaqoh}
                  onChange={(e) => form.setValue('nama_halaqoh', e.target.value)}
                  placeholder="Nama halaqoh"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="id_asatidz">Ustadz Pembimbing</Label>
                <Select
                  value={form.values.id_asatidz}
                  onValueChange={(value) => form.setValue('id_asatidz', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih ustadz" />
                  </SelectTrigger>
                  <SelectContent>
                    {asatidzList.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.nama_lengkap}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tingkat">Tingkat</Label>
                <Select
                  value={form.values.tingkat}
                  onValueChange={(value) => form.setValue('tingkat', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tingkat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pemula">Pemula</SelectItem>
                    <SelectItem value="Menengah">Menengah</SelectItem>
                    <SelectItem value="Lanjutan">Lanjutan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => formModal.setIsOpen(false)}>
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
                  <TableHead>Nama Halaqoh</TableHead>
                  <TableHead>Ustadz Pembimbing</TableHead>
                  <TableHead>Tingkat</TableHead>
                  <TableHead>Jumlah Santri</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {halaqohWithCount.map((halaqoh) => {
                  const ustadz = data.users.find((u) => u.id === halaqoh.id_asatidz);
                  return (
                    <TableRow key={halaqoh.id}>
                      <TableCell className="font-semibold">{halaqoh.nama_halaqoh}</TableCell>
                      <TableCell>{ustadz?.nama_lengkap || '-'}</TableCell>
                      <TableCell>{halaqoh.tingkat}</TableCell>
                      <TableCell>{halaqoh.jumlah_santri} santri</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(halaqoh)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                            onClick={() => handleDelete(halaqoh.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {halaqohWithCount.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                      Tidak ada data halaqoh
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
