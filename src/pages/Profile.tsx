'use client';

import { useState } from 'react';
import { useTahfidz } from '@/contexts/TahfidzContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { User, Lock, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { currentUser, updateUser, updatePassword } = useTahfidz();
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);

  const [profileData, setProfileData] = useState({
    nama_lengkap: currentUser?.nama_lengkap || '',
    email: currentUser?.email || '',
    no_hp: currentUser?.no_hp || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleUpdateProfile = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!profileData.nama_lengkap || !profileData.email) {
      toast.error('Nama dan email harus diisi');
      return;
    }

    if (currentUser) {
      updateUser(currentUser.id, profileData);
      toast.success('Profil berhasil diupdate');
      setIsEditingProfile(false);
    }
  };

  const handleChangePassword = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Semua field password harus diisi');
      return;
    }

    if (passwordData.currentPassword !== currentUser?.password) {
      toast.error('Password lama salah');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Password baru tidak cocok');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password minimal 6 karakter');
      return;
    }

    if (currentUser) {
      updatePassword(currentUser.id, passwordData.newPassword);
      toast.success('Password berhasil diubah');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">Profil Saya</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Kelola profil dan keamanan akun</p>
      </div>

      <Card className="border-l-4 border-l-emerald-500">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-lime-50 dark:from-emerald-950 dark:to-lime-950">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-emerald-600 to-lime-600 flex items-center justify-center text-white text-2xl font-bold">
              {currentUser.nama_lengkap.charAt(0).toUpperCase()}
            </div>
            <div>
              <CardTitle className="text-emerald-900 dark:text-emerald-100">{currentUser.nama_lengkap}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="bg-emerald-600 text-white">
                  {currentUser.role}
                </Badge>
                <Badge variant={currentUser.aktif ? 'default' : 'secondary'}>
                  {currentUser.aktif ? 'Aktif' : 'Nonaktif'}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="security">Keamanan</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-900 dark:text-emerald-100">Informasi Profil</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nama_lengkap" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Nama Lengkap
                  </Label>
                  <Input
                    id="nama_lengkap"
                    value={profileData.nama_lengkap}
                    onChange={(e) => setProfileData({ ...profileData, nama_lengkap: e.target.value })}
                    disabled={!isEditingProfile}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Username
                  </Label>
                  <Input
                    id="username"
                    value={currentUser.username}
                    disabled
                    className="bg-gray-100 dark:bg-gray-800"
                  />
                  <p className="text-xs text-gray-500">Username tidak dapat diubah</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    disabled={!isEditingProfile}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="no_hp" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    No. HP
                  </Label>
                  <Input
                    id="no_hp"
                    value={profileData.no_hp}
                    onChange={(e) => setProfileData({ ...profileData, no_hp: e.target.value })}
                    disabled={!isEditingProfile}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  {isEditingProfile ? (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditingProfile(false);
                          setProfileData({
                            nama_lengkap: currentUser.nama_lengkap,
                            email: currentUser.email,
                            no_hp: currentUser.no_hp,
                          });
                        }}
                      >
                        Batal
                      </Button>
                      <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                        Simpan Perubahan
                      </Button>
                    </>
                  ) : (
                    <Button type="button" onClick={() => setIsEditingProfile(true)}>
                      Edit Profil
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Ubah Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Password Lama</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    placeholder="Masukkan password lama"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Password Baru</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    placeholder="Masukkan password baru"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    placeholder="Konfirmasi password baru"
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                    Ubah Password
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}