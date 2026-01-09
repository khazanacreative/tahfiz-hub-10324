import { useState } from "react";
import Layout from "@/components/MobileLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, GraduationCap } from "lucide-react";
import { toast } from "sonner";

interface Kelas {
  id: string;
  nama_kelas: string;
  deskripsi: string | null;
}

const mockKelasList: Kelas[] = [
  { id: "1", nama_kelas: "KBTK A", deskripsi: "Kelas Baca Tulis Al-Quran A" },
  { id: "2", nama_kelas: "KBTK B", deskripsi: "Kelas Baca Tulis Al-Quran B" },
  { id: "3", nama_kelas: "Paket A Kelas 6", deskripsi: "Setara SD Kelas 6" },
  { id: "4", nama_kelas: "Paket B Kelas 8", deskripsi: "Setara SMP Kelas 8" },
];

export default function DataKelas() {
  const [kelasList, setKelasList] = useState<Kelas[]>(mockKelasList);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedKelas, setSelectedKelas] = useState<Kelas | null>(null);
  const [namaKelas, setNamaKelas] = useState("");
  const [deskripsi, setDeskripsi] = useState("");

  const handleSubmit = () => {
    if (!namaKelas.trim()) {
      toast.error("Nama kelas harus diisi");
      return;
    }

    if (isEditMode && selectedKelas) {
      setKelasList(kelasList.map(k => 
        k.id === selectedKelas.id ? { ...k, nama_kelas: namaKelas, deskripsi } : k
      ));
      toast.success("Kelas berhasil diupdate");
    } else {
      setKelasList([...kelasList, { id: String(Date.now()), nama_kelas: namaKelas, deskripsi }]);
      toast.success("Kelas berhasil ditambahkan");
    }
    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (kelas: Kelas) => {
    setSelectedKelas(kelas);
    setNamaKelas(kelas.nama_kelas);
    setDeskripsi(kelas.deskripsi || "");
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus kelas ini?")) return;
    setKelasList(kelasList.filter(k => k.id !== id));
    toast.success("Kelas berhasil dihapus");
  };

  const resetForm = () => {
    setNamaKelas("");
    setDeskripsi("");
    setSelectedKelas(null);
    setIsEditMode(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <GraduationCap className="w-7 h-7 text-primary" />
              Data Kelas
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Kelola data kelas</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" />Tambah Kelas</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{isEditMode ? "Edit Kelas" : "Tambah Kelas Baru"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Nama Kelas *</Label>
                  <Input placeholder="Contoh: KBTK A" value={namaKelas} onChange={(e) => setNamaKelas(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Deskripsi</Label>
                  <Input placeholder="Deskripsi kelas" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
                  <Button onClick={handleSubmit}>{isEditMode ? "Simpan" : "Tambah"}</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Nama Kelas</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {kelasList.map((kelas, index) => (
                <TableRow key={kelas.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-semibold">{kelas.nama_kelas}</TableCell>
                  <TableCell className="text-muted-foreground">{kelas.deskripsi || "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleEdit(kelas)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(kelas.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
}
