'use client';

import { useState } from 'react';
import { useTahfidz } from '@/contexts/TahfidzContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Megaphone, Heart } from 'lucide-react';
import { toast } from 'sonner';
import type { Pengumuman, KategoriPengumuman } from '@/lib/tahfidz-types';

export default function PengumumanPage() {
  const { data, currentUser, addPengumuman, updatePengumuman, deletePengumuman } = useTahfidz();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editingPengumuman, setEditingPengumuman] = useState<Pengumuman | null>(null);

  const [formData, setFormData] = useState<{
    judul: string;
    isi: string;
    kategori: KategoriPengumuman;
    dibuat_oleh: string;
  }>({
    judul: '',
    isi: '',
    kategori: 'Pengumuman',
    dibuat_oleh: currentUser?.id || '',
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!formData.judul || !formData.isi) {
      toast.error('Judul dan isi harus diisi');
      return;
    }

    if (editingPengumuman) {
      updatePengumuman(editingPengumuman.id, formData);
      toast.success('Pengumuman berhasil diupdate');
    } else {
      addPengumuman(formData);
      toast.success('Pengumuman berhasil ditambahkan');
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (pengumuman: Pengumuman): void => {
    setEditingPengumuman(pengumuman);
    setFormData({
      judul: pengumuman.judul,
      isi: pengumuman.isi,
      kategori: pengumuman.kategori,
      dibuat_oleh: pengumuman.dibuat_oleh,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string): void => {
    if (confirm('Yakin ingin menghapus pengumuman ini?')) {
      deletePengumuman(id);
      toast.success('Pengumuman berhasil dihapus');
    }
  };

  const resetForm = (): void => {
    setFormData({
      judul: '',
      isi: '',
      kategori: 'Pengumuman',
      dibuat_oleh: currentUser?.id || '',
    });
    setEditingPengumuman(null);
  };

  const sortedPengumuman = [...data.pengumuman].sort(
    (a, b) => new Date(b.tanggal_post).getTime() - new Date(a.tanggal_post).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">Pengumuman & Motivasi</h1>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-emerald-600 to-lime-600 hover:from-emerald-700 hover:to-lime-700">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Pengumuman
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingPengumuman ? 'Edit' : 'Tambah'} Pengumuman</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="judul">Judul</Label>
                <Input
                  id="judul"
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  placeholder="Judul pengumuman"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kategori">Kategori</Label>
                <Select
                  value={formData.kategori}
                  onValueChange={(value) => setFormData({ ...formData, kategori: value as KategoriPengumuman })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pengumuman">Pengumuman</SelectItem>
                    <SelectItem value="Motivasi">Motivasi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="isi">Isi</Label>
                <Textarea
                  id="isi"
                  value={formData.isi}
                  onChange={(e) => setFormData({ ...formData, isi: e.target.value })}
                  placeholder="Isi pengumuman atau motivasi..."
                  rows={6}
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

      <div className="grid gap-4">
        {sortedPengumuman.map((pengumuman) => {
          const author = data.users.find((u) => u.id === pengumuman.dibuat_oleh);
          return (
            <Card key={pengumuman.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-2 rounded-lg ${pengumuman.kategori === 'Pengumuman' ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                      {pengumuman.kategori === 'Pengumuman' ? (
                        <Megaphone className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <Heart className="h-5 w-5 text-rose-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-emerald-900 dark:text-emerald-100">
                        {pengumuman.judul}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-600 dark:text-gray-400">
                        <span>{author?.nama_lengkap || 'Unknown'}</span>
                        <span>•</span>
                        <span>{new Date(pengumuman.tanggal_post).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={pengumuman.kategori === 'Pengumuman' ? 'default' : 'secondary'}
                      className={pengumuman.kategori === 'Pengumuman' ? 'bg-emerald-600' : 'bg-rose-500 text-white'}
                    >
                      {pengumuman.kategori}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line mb-4">
                  {pengumuman.isi}
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(pengumuman)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600"
                    onClick={() => handleDelete(pengumuman.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Hapus
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {sortedPengumuman.length === 0 && (
          <Card>
            <CardContent className="py-12">
              <p className="text-center text-gray-500">Belum ada pengumuman</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
