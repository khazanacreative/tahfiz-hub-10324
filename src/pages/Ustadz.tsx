import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { getDummyProfile } from "@/lib/offline-db";
import { useSupabaseOrDummy } from "@/hooks/use-supabase-or-dummy";

interface Ustadz {
  id: string;
  nama_lengkap: string;
  username: string;
  email: string;
  no_hp: string | null;
  aktif: boolean;
}

export default function UstadzPage() {
  const [ustadzList, setUstadzList] = useState<Ustadz[]>([
    { id: 'as-1', nama_lengkap: 'Ustadz Ahmad', username: 'ustadzahmad', email: 'ahmad@example.com', no_hp: '081234567890', aktif: true },
    { id: 'as-2', nama_lengkap: 'Ustadz Budi', username: 'ustadzbudi', email: 'budi@example.com', no_hp: '081234567891', aktif: true }
  ]);
  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nama_lengkap: "",
    username: "",
    email: "",
    no_hp: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editId) {
        toast.success("Data ustadz berhasil diperbarui");
      } else {
        toast.success("Ustadz baru berhasil ditambahkan");
      }

      setIsOpen(false);
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat menyimpan data");
    }
  };

  const handleEdit = (ustadz: Ustadz) => {
    setEditId(ustadz.id);
    setFormData({
      nama_lengkap: ustadz.nama_lengkap,
      username: ustadz.username,
      email: ustadz.email || "",
      no_hp: ustadz.no_hp || "",
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus ustadz ini?")) return;

    try {
      toast.success("Ustadz berhasil dihapus");
    } catch (error) {
      toast.error("Gagal menghapus ustadz");
    }
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({ nama_lengkap: "", username: "", email: "", no_hp: "" });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Data Ustadz</h1>
            <p className="text-muted-foreground">Kelola data ustadz tahfidz</p>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" /> Tambah Ustadz
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editId ? "Edit Ustadz" : "Tambah Ustadz Baru"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Nama Lengkap</Label>
                  <Input
                    value={formData.nama_lengkap}
                    onChange={(e) => setFormData({ ...formData, nama_lengkap: e.target.value })}
                    placeholder="Masukkan nama lengkap"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="Masukkan username"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Masukkan email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>No. HP</Label>
                  <Input
                    value={formData.no_hp}
                    onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
                    placeholder="Masukkan nomor HP"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Menyimpan..." : "Simpan"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-card rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Lengkap</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>No. HP</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-4">
                    Memuat data...
                  </TableCell>
                </TableRow>
              ) : ustadzList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-4">
                    Belum ada data ustadz
                  </TableCell>
                </TableRow>
              ) : (
                ustadzList.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.nama_lengkap}</TableCell>
                    <TableCell>{u.username}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.no_hp || "-"}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${
                        u.aktif ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'
                      }`}>
                        {u.aktif ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="icon" variant="ghost" onClick={() => handleEdit(u)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDelete(u.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
}
