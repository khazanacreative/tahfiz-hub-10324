'use client';

import { useState } from 'react';
import { useTahfidz } from '@/contexts/TahfidzContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Kelas } from '@/lib/tahfidz-types';
import { PageLayout, TableLayout } from '@/components/layout/page-layouts';
import { TextField, SelectField } from '@/components/forms/form-fields';
import { StatusBadge, EmptyState, ConfirmDialog } from '@/components/common/ui-components';
import { useForm, useModal } from '@/lib/hooks/forms';
import { kelasSchema, type KelasFormData } from '@/lib/validations/schemas';

export default function KelasPage() {
  const { data, addKelas, updateKelas, deleteKelas } = useTahfidz();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterJenis, setFilterJenis] = useState<string>('all');

  const formModal = useModal();
  const deleteModal = useModal();

  const form = useForm<KelasFormData>({
    nama_kelas: '',
    jenis: 'Ikhwan',
    program: '',
    tingkat: '',
  });

  const [editingKelas, setEditingKelas] = useState<Kelas | null>(null);
  const [deletingKelas, setDeletingKelas] = useState<Kelas | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await form.handleSubmit(async (values) => {
      try {
        if (editingKelas) {
          updateKelas(editingKelas.id, values);
          toast.success('Kelas berhasil diupdate');
        } else {
          addKelas(values as Omit<Kelas, "id" | "jumlah_santri">);
          toast.success('Kelas berhasil ditambahkan');
        }

        formModal.close();
        form.reset();
        setEditingKelas(null);
      } catch (error) {
        toast.error('Terjadi kesalahan saat menyimpan data');
      }
    });
  };

  const handleEdit = (kelas: Kelas): void => {
    setEditingKelas(kelas);
    form.updateValues({
      nama_kelas: kelas.nama_kelas,
      jenis: kelas.jenis,
      program: kelas.program,
      tingkat: kelas.tingkat,
    });
    formModal.open();
  };

  const handleDelete = (): void => {
    if (deletingKelas) {
      deleteKelas(deletingKelas.id);
      toast.success('Kelas berhasil dihapus');
      deleteModal.close();
      setDeletingKelas(null);
    }
  };

  // Apply filters
  let filtered = data.kelas.filter((k) =>
    k.nama_kelas.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter by jenis
  if (filterJenis !== 'all') {
    filtered = filtered.filter((k) => k.jenis === filterJenis);
  }

  const jenisOptions = [
    { value: 'Ikhwan', label: 'Ikhwan' },
    { value: 'Akhwat', label: 'Akhwat' },
  ];

  return (
    <PageLayout
      title="Data Kelas"
      description="Kelola kelas dalam sistem tahfidz"
      actions={
        <Dialog open={formModal.isOpen} onOpenChange={formModal.setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-emerald-600 to-lime-600 hover:from-emerald-700 hover:to-lime-700">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Kelas
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingKelas ? 'Edit' : 'Tambah'} Kelas</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  label="Nama Kelas"
                  placeholder="Nama kelas"
                  value={form.values.nama_kelas}
                  onChange={(value) => form.setValue('nama_kelas', value)}
                  error={form.errors.nama_kelas}
                  required
                />
                <SelectField
                  label="Jenis Kelas"
                  placeholder="Pilih jenis kelas"
                  value={form.values.jenis}
                  onChange={(value) => form.setValue('jenis', value as "Ikhwan" | "Akhwat")}
                  options={jenisOptions}
                  error={form.errors.jenis}
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    formModal.close();
                    form.reset();
                    setEditingKelas(null);
                  }}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={form.isSubmitting}>
                  {form.isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      <TableLayout
        title="Data Kelas"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium whitespace-nowrap">Jenis:</label>
            <Select value={filterJenis} onValueChange={setFilterJenis}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="Ikhwan">Ikhwan</SelectItem>
                <SelectItem value="Akhwat">Akhwat</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      >
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4 font-medium">Nama Kelas</th>
              <th className="text-left p-4 font-medium">Jenis</th>
              <th className="text-left p-4 font-medium">Jumlah Santri</th>
              <th className="text-left p-4 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((kelas) => {
              const jumlahSantri = data.santri.filter((s) => s.id_kelas === kelas.id).length;
              return (
                <tr key={kelas.id} className="border-b hover:bg-muted/50">
                  <td className="p-4 font-medium">{kelas.nama_kelas}</td>
                  <td className="p-4">
                    <StatusBadge
                      status={kelas.jenis}
                      variant={kelas.jenis === 'Ikhwan' ? 'default' : 'secondary'}
                    />
                  </td>
                  <td className="p-4">
                    <StatusBadge
                      status={`${jumlahSantri} santri`}
                      variant="secondary"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(kelas)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => {
                          setDeletingKelas(kelas);
                          deleteModal.open();
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8">
                  <EmptyState
                    title="Tidak ada data kelas"
                    description="Belum ada data kelas yang sesuai dengan filter yang dipilih"
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </TableLayout>

      <ConfirmDialog
        isOpen={deleteModal.isOpen}
        title="Hapus Kelas"
        message={`Apakah Anda yakin ingin menghapus kelas "${deletingKelas?.nama_kelas}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus"
        onConfirm={handleDelete}
        onCancel={() => {
          deleteModal.close();
          setDeletingKelas(null);
        }}
      />
    </PageLayout>
  );
}