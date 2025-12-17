import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TahfidzData, User, Santri, Halaqoh, Setoran, Absensi, Penilaian, Pengumuman, LogAktivitas, TasmiMarhalah, RaporSemester, Kelas } from '@/lib/tahfidz-types';

interface TahfidzContextType {
  data: TahfidzData;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isLoading: boolean;
  refreshData: () => void;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  // Santri
  addSantri: (santri: Omit<Santri, 'id'>) => void;
  updateSantri: (id: string, santri: Partial<Santri>) => void;
  deleteSantri: (id: string) => void;
  // Setoran
  addSetoran: (setoran: Omit<Setoran, 'id'>) => void;
  updateSetoran: (id: string, setoran: Partial<Setoran>) => void;
  deleteSetoran: (id: string) => void;
  // Absensi
  addAbsensi: (absensi: Omit<Absensi, 'id'>) => void;
  // Penilaian
  addPenilaian: (penilaian: Omit<Penilaian, 'id'>) => void;
  updatePenilaian: (id: string, penilaian: Partial<Penilaian>) => void;
  deletePenilaian: (id: string) => void;
  // Pengumuman
  addPengumuman: (pengumuman: Omit<Pengumuman, 'id'>) => void;
  updatePengumuman: (id: string, pengumuman: Partial<Pengumuman>) => void;
  deletePengumuman: (id: string) => void;
  // Halaqoh
  addHalaqoh: (halaqoh: Omit<Halaqoh, 'id'>) => void;
  updateHalaqoh: (id: string, halaqoh: Partial<Halaqoh>) => void;
  deleteHalaqoh: (id: string) => void;
  // Kelas
  addKelas: (kelas: Omit<Kelas, 'id'>) => void;
  updateKelas: (id: string, kelas: Partial<Kelas>) => void;
  deleteKelas: (id: string) => void;
  // User
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  updatePassword: (id: string, newPassword: string) => void;
  // Tasmi Marhalah
  addTasmiMarhalah: (tasmi: Omit<TasmiMarhalah, 'id'>) => void;
  deleteTasmiMarhalah: (id: string) => void;
  // Rapor
  addRapor: (rapor: Omit<RaporSemester, 'id'>) => void;
  deleteRapor: (id: string) => void;
  // Log
  addLog: (aksi: string) => void;
}

const TahfidzContext = createContext<TahfidzContextType | undefined>(undefined);

const initialData: TahfidzData = {
  users: [
    { id: '1', nama_lengkap: 'Admin Utama', username: 'admin', password: 'admin123', role: 'Admin', email: 'admin@tahfidz.com', no_hp: '081234567890', aktif: true },
    { id: '2', nama_lengkap: 'Ustadz Ahmad', username: 'ustadz1', password: 'ustadz123', role: 'Asatidz', email: 'ahmad@tahfidz.com', no_hp: '081234567891', aktif: true },
    { id: '3', nama_lengkap: 'Ustadz Mahmud', username: 'ustadz2', password: 'ustadz123', role: 'Asatidz', email: 'mahmud@tahfidz.com', no_hp: '081234567892', aktif: true },
    { id: '4', nama_lengkap: 'Wali Santri 1', username: 'wali1', password: 'wali123', role: 'WaliSantri', email: 'wali1@email.com', no_hp: '081234567893', aktif: true },
  ],
  santri: [
    { id: '1', nis: 'S001', nama_santri: 'Muhammad Farhan', id_halaqoh: '1', id_kelas: '1', id_wali: '4', tanggal_masuk: '2024-01-15', status: 'Aktif' },
    { id: '2', nis: 'S002', nama_santri: 'Ahmad Rizki', id_halaqoh: '1', id_kelas: '1', id_wali: '', tanggal_masuk: '2024-01-20', status: 'Aktif' },
    { id: '3', nis: 'S003', nama_santri: 'Yusuf Hakim', id_halaqoh: '2', id_kelas: '1', id_wali: '', tanggal_masuk: '2024-02-01', status: 'Aktif' },
  ],
  halaqoh: [
    { id: '1', nama_halaqoh: 'Halaqoh Al-Fatih', id_asatidz: '2', tingkat: 'Pemula', jumlah_santri: 10 },
    { id: '2', nama_halaqoh: 'Halaqoh Al-Furqon', id_asatidz: '3', tingkat: 'Menengah', jumlah_santri: 8 },
  ],
  kelas: [
    { id: '1', nama_kelas: 'Kelas 1A', jenis: 'Ikhwan', program: 'Reguler', tingkat: 'Pemula', jumlah_santri: 15 },
    { id: '2', nama_kelas: 'Kelas 1B', jenis: 'Ikhwan', program: 'Intensif', tingkat: 'Menengah', jumlah_santri: 12 },
  ],
  setoran: [
    { id: '1', id_santri: '1', id_asatidz: '2', tanggal_setoran: '2024-12-10', juz: 1, surah_number: 2, ayat_dari: 1, ayat_sampai: 10, nilai_kelancaran: 85, nilai_tajwid: 80, nilai_fashahah: 82, status: 'Lancar', catatan: 'Bagus' },
    { id: '2', id_santri: '2', id_asatidz: '2', tanggal_setoran: '2024-12-11', juz: 1, surah_number: 2, ayat_dari: 11, ayat_sampai: 20, nilai_kelancaran: 90, nilai_tajwid: 88, nilai_fashahah: 85, status: 'Lancar', catatan: 'Sangat baik' },
  ],
  absensi: [
    { id: '1', id_santri: '1', tanggal: '2024-12-16', status_kehadiran: 'Hadir', keterangan: '' },
    { id: '2', id_santri: '2', tanggal: '2024-12-16', status_kehadiran: 'Hadir', keterangan: '' },
    { id: '3', id_santri: '3', tanggal: '2024-12-16', status_kehadiran: 'Izin', keterangan: 'Sakit' },
  ],
  penilaian: [
    { id: '1', id_santri: '1', id_asatidz: '2', tanggal_penilaian: '2024-12-15', tajwid: 85, fashahah: 80, kelancaran: 88, catatan: 'Perlu perbaikan mad' },
    { id: '2', id_santri: '2', id_asatidz: '2', tanggal_penilaian: '2024-12-15', tajwid: 90, fashahah: 88, kelancaran: 92, catatan: 'Sangat baik' },
  ],
  tasmi_marhalah: [],
  rapor: [],
  pengumuman: [
    { id: '1', judul: 'Libur Akhir Tahun', isi: 'Kegiatan tahfidz libur mulai 25 Desember - 1 Januari', kategori: 'Pengumuman', tanggal_post: '2024-12-15', dibuat_oleh: '1' },
    { id: '2', judul: 'Motivasi Hari Ini', isi: 'Hafalan adalah amalan yang akan menemani kita hingga akhirat', kategori: 'Motivasi', tanggal_post: '2024-12-16', dibuat_oleh: '2' },
  ],
  log_aktivitas: [
    { id: '1', id_user: '1', aksi: 'Login ke sistem', waktu: '2024-12-16T08:00:00' },
    { id: '2', id_user: '2', aksi: 'Menambahkan setoran santri', waktu: '2024-12-16T09:30:00' },
  ],
};

export function TahfidzProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<TahfidzData>(initialData);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  const login = (username: string, password: string): boolean => {
    const user = data.users.find(u => u.username === username && u.password === password && u.aktif);
    if (user) {
      setCurrentUser(user);
      addLogInternal(user.id, 'Login ke sistem');
      return true;
    }
    return false;
  };

  const logout = () => {
    if (currentUser) {
      addLogInternal(currentUser.id, 'Logout dari sistem');
    }
    setCurrentUser(null);
  };

  const addLogInternal = (userId: string, aksi: string) => {
    setData(prev => ({
      ...prev,
      log_aktivitas: [...prev.log_aktivitas, {
        id: generateId(),
        id_user: userId,
        aksi,
        waktu: new Date().toISOString()
      }]
    }));
  };

  const addLog = (aksi: string) => {
    if (!currentUser) return;
    addLogInternal(currentUser.id, aksi);
  };

  // Santri methods
  const addSantri = (santri: Omit<Santri, 'id'>) => {
    setData(prev => ({ ...prev, santri: [...prev.santri, { ...santri, id: generateId() }] }));
    addLog('Menambahkan santri baru: ' + santri.nama_santri);
  };
  const updateSantri = (id: string, santri: Partial<Santri>) => {
    setData(prev => ({ ...prev, santri: prev.santri.map(s => s.id === id ? { ...s, ...santri } : s) }));
    addLog('Mengupdate data santri');
  };
  const deleteSantri = (id: string) => {
    setData(prev => ({ ...prev, santri: prev.santri.filter(s => s.id !== id) }));
    addLog('Menghapus santri');
  };

  // Setoran methods
  const addSetoran = (setoran: Omit<Setoran, 'id'>) => {
    setData(prev => ({ ...prev, setoran: [...prev.setoran, { ...setoran, id: generateId() }] }));
    addLog('Menambahkan setoran baru');
  };
  const updateSetoran = (id: string, setoran: Partial<Setoran>) => {
    setData(prev => ({ ...prev, setoran: prev.setoran.map(s => s.id === id ? { ...s, ...setoran } : s) }));
    addLog('Mengupdate setoran');
  };
  const deleteSetoran = (id: string) => {
    setData(prev => ({ ...prev, setoran: prev.setoran.filter(s => s.id !== id) }));
    addLog('Menghapus setoran');
  };

  // Absensi methods
  const addAbsensi = (absensi: Omit<Absensi, 'id'>) => {
    setData(prev => ({ ...prev, absensi: [...prev.absensi, { ...absensi, id: generateId() }] }));
    addLog('Menambahkan absensi');
  };

  // Penilaian methods
  const addPenilaian = (penilaian: Omit<Penilaian, 'id'>) => {
    setData(prev => ({ ...prev, penilaian: [...prev.penilaian, { ...penilaian, id: generateId() }] }));
    addLog('Menambahkan penilaian');
  };
  const updatePenilaian = (id: string, penilaian: Partial<Penilaian>) => {
    setData(prev => ({ ...prev, penilaian: prev.penilaian.map(p => p.id === id ? { ...p, ...penilaian } : p) }));
    addLog('Mengupdate penilaian');
  };
  const deletePenilaian = (id: string) => {
    setData(prev => ({ ...prev, penilaian: prev.penilaian.filter(p => p.id !== id) }));
    addLog('Menghapus penilaian');
  };

  // Pengumuman methods
  const addPengumuman = (pengumuman: Omit<Pengumuman, 'id'>) => {
    setData(prev => ({ ...prev, pengumuman: [...prev.pengumuman, { ...pengumuman, id: generateId() }] }));
    addLog('Menambahkan pengumuman');
  };
  const updatePengumuman = (id: string, pengumuman: Partial<Pengumuman>) => {
    setData(prev => ({ ...prev, pengumuman: prev.pengumuman.map(p => p.id === id ? { ...p, ...pengumuman } : p) }));
    addLog('Mengupdate pengumuman');
  };
  const deletePengumuman = (id: string) => {
    setData(prev => ({ ...prev, pengumuman: prev.pengumuman.filter(p => p.id !== id) }));
    addLog('Menghapus pengumuman');
  };

  // Halaqoh methods
  const addHalaqoh = (halaqoh: Omit<Halaqoh, 'id'>) => {
    setData(prev => ({ ...prev, halaqoh: [...prev.halaqoh, { ...halaqoh, id: generateId() }] }));
    addLog('Menambahkan halaqoh baru');
  };
  const updateHalaqoh = (id: string, halaqoh: Partial<Halaqoh>) => {
    setData(prev => ({ ...prev, halaqoh: prev.halaqoh.map(h => h.id === id ? { ...h, ...halaqoh } : h) }));
    addLog('Mengupdate halaqoh');
  };
  const deleteHalaqoh = (id: string) => {
    setData(prev => ({ ...prev, halaqoh: prev.halaqoh.filter(h => h.id !== id) }));
    addLog('Menghapus halaqoh');
  };

  // Kelas methods
  const addKelas = (kelas: Omit<Kelas, 'id'>) => {
    setData(prev => ({ ...prev, kelas: [...prev.kelas, { ...kelas, id: generateId() }] }));
    addLog('Menambahkan kelas baru');
  };
  const updateKelas = (id: string, kelas: Partial<Kelas>) => {
    setData(prev => ({ ...prev, kelas: prev.kelas.map(k => k.id === id ? { ...k, ...kelas } : k) }));
    addLog('Mengupdate kelas');
  };
  const deleteKelas = (id: string) => {
    setData(prev => ({ ...prev, kelas: prev.kelas.filter(k => k.id !== id) }));
    addLog('Menghapus kelas');
  };

  // User methods
  const addUser = (user: Omit<User, 'id'>) => {
    setData(prev => ({ ...prev, users: [...prev.users, { ...user, id: generateId() }] }));
    addLog('Menambahkan user baru');
  };
  const updateUser = (id: string, user: Partial<User>) => {
    setData(prev => ({ ...prev, users: prev.users.map(u => u.id === id ? { ...u, ...user } : u) }));
    addLog('Mengupdate user');
  };
  const deleteUser = (id: string) => {
    setData(prev => ({ ...prev, users: prev.users.filter(u => u.id !== id) }));
    addLog('Menghapus user');
  };
  const updatePassword = (id: string, newPassword: string) => {
    setData(prev => ({ ...prev, users: prev.users.map(u => u.id === id ? { ...u, password: newPassword } : u) }));
    addLog('Mengubah password');
  };

  // Tasmi Marhalah methods
  const addTasmiMarhalah = (tasmi: Omit<TasmiMarhalah, 'id'>) => {
    setData(prev => ({ ...prev, tasmi_marhalah: [...prev.tasmi_marhalah, { ...tasmi, id: generateId() }] }));
    addLog('Menambahkan tasmi marhalah');
  };
  const deleteTasmiMarhalah = (id: string) => {
    setData(prev => ({ ...prev, tasmi_marhalah: prev.tasmi_marhalah.filter(t => t.id !== id) }));
    addLog('Menghapus tasmi marhalah');
  };

  // Rapor methods
  const addRapor = (rapor: Omit<RaporSemester, 'id'>) => {
    setData(prev => ({ ...prev, rapor: [...prev.rapor, { ...rapor, id: generateId() }] }));
    addLog('Menambahkan rapor');
  };
  const deleteRapor = (id: string) => {
    setData(prev => ({ ...prev, rapor: prev.rapor.filter(r => r.id !== id) }));
    addLog('Menghapus rapor');
  };

  return (
    <TahfidzContext.Provider value={{
      data, currentUser, setCurrentUser, isLoading, refreshData,
      login, logout,
      addSantri, updateSantri, deleteSantri,
      addSetoran, updateSetoran, deleteSetoran,
      addAbsensi,
      addPenilaian, updatePenilaian, deletePenilaian,
      addPengumuman, updatePengumuman, deletePengumuman,
      addHalaqoh, updateHalaqoh, deleteHalaqoh,
      addKelas, updateKelas, deleteKelas,
      addUser, updateUser, deleteUser, updatePassword,
      addTasmiMarhalah, deleteTasmiMarhalah,
      addRapor, deleteRapor,
      addLog,
    }}>
      {children}
    </TahfidzContext.Provider>
  );
}

export function useTahfidz() {
  const context = useContext(TahfidzContext);
  if (context === undefined) {
    throw new Error('useTahfidz must be used within a TahfidzProvider');
  }
  return context;
}
