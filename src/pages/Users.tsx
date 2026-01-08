import { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import { useTahfidz } from '@/contexts/TahfidzContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2 } from 'lucide-react';
import TablePagination from '@/components/tahfidz/TablePagination';
import { toast } from 'sonner';
import { useForm } from '@/lib/hooks/forms';
import type { User, UserRole } from '@/lib/tahfidz-types';

export default function UsersPage() {
  const { data, addUser, updateUser, deleteUser } = useTahfidz();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [filterRole, setFilterRole] = useState<string>('all');
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
    nama_lengkap: '',
    username: '',
    password: '',
    role: 'WaliSantri' as UserRole,
    email: '',
    no_hp: '',
    aktif: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await formHandleSubmit(onSubmit);
  };

  const onSubmit = async (values: typeof formData) => {
    if (!values.nama_lengkap || !values.username || !values.email) {
      toast.error('Nama, username, dan email harus diisi');
      return;
    }

    if (!editingUser && !values.password) {
      toast.error('Password harus diisi untuk user baru');
      return;
    }

    if (editingUser) {
      const updateData = { ...values };
      if (!values.password) {
        const { password, ...rest } = updateData;
        updateUser(editingUser.id, rest);
      } else {
        updateUser(editingUser.id, updateData);
      }
      toast.success('User berhasil diupdate');
    } else {
      addUser(values);
      toast.success('User berhasil ditambahkan');
    }

    setIsDialogOpen(false);
    resetFormManual();
  };

  const handleEdit = (user: User): void => {
    setEditingUser(user);
    updateValues({
      nama_lengkap: user.nama_lengkap,
      username: user.username,
      password: '',
      role: user.role,
      email: user.email,
      no_hp: user.no_hp,
      aktif: user.aktif,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string): void => {
    if (confirm('Yakin ingin menghapus user ini?')) {
      deleteUser(id);
      toast.success('User berhasil dihapus');
    }
  };

  const resetFormManual = (): void => {
    updateValues({
      nama_lengkap: '',
      username: '',
      password: '',
      role: 'WaliSantri',
      email: '',
      no_hp: '',
      aktif: true,
    });
    setEditingUser(null);
  };

  const filteredUsers = useMemo(() => {
    if (filterRole === 'all') {
      return data.users;
    }
    return data.users.filter((u) => u.role === filterRole);
  }, [data.users, filterRole]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Layout>
      <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">Akun Pengguna</h1>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-emerald-600 to-lime-600 hover:from-emerald-700 hover:to-lime-700">
              <Plus className="h-4 w-4 mr-2" />
              Tambah User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingUser ? 'Edit' : 'Tambah'} User</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
                  <Input
                    id="nama_lengkap"
                    value={formData.nama_lengkap}
                    onChange={(e) => setFormData('nama_lengkap', e.target.value)}
                    placeholder="Nama lengkap"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData('username', e.target.value)}
                    placeholder="Username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password {editingUser && '(kosongkan jika tidak diubah)'}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData('password', e.target.value)}
                    placeholder={editingUser ? 'Kosongkan jika tidak diubah' : 'Password'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData('role', value as UserRole)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Asatidz">Asatidz</SelectItem>
                      <SelectItem value="WaliSantri">Wali Santri</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData('email', e.target.value)}
                    placeholder="Email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="no_hp">No. HP</Label>
                  <Input
                    id="no_hp"
                    value={formData.no_hp}
                    onChange={(e) => setFormData('no_hp', e.target.value)}
                    placeholder="No. HP"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="aktif">Status Aktif</Label>
                    <Switch
                      id="aktif"
                      checked={formData.aktif}
                      onCheckedChange={(checked) => setFormData('aktif', checked)}
                    />
                  </div>
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
          <div className="flex items-center gap-4">
            <div className="w-full sm:w-64">
              <Select
                value={filterRole}
                onValueChange={(value) => {
                  setFilterRole(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Role</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Asatidz">Asatidz</SelectItem>
                  <SelectItem value="WaliSantri">Wali Santri</SelectItem>
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
                  <TableHead>Nama Lengkap</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>No. HP</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.nama_lengkap}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{user.role}</Badge>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.no_hp}</TableCell>
                    <TableCell>
                      <Badge variant={user.aktif ? 'default' : 'secondary'}>
                        {user.aktif ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600"
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                      Tidak ada data user
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
            totalItems={filteredUsers.length}
            itemsPerPage={itemsPerPage}
          />
        </CardContent>
      </Card>
      </div>
    </Layout>
  );
}
