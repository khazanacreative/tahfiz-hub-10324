import { z } from 'zod';

// User validation schemas
export const userSchema = z.object({
  nama_lengkap: z.string().min(2, 'Nama minimal 2 karakter').max(100, 'Nama maksimal 100 karakter'),
  username: z.string().min(3, 'Username minimal 3 karakter').max(50, 'Username maksimal 50 karakter'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  email: z.string().email('Email tidak valid').optional(),
  no_hp: z.string().optional(),
  role: z.enum(['Admin', 'Asatidz', 'Santri', 'WaliSantri']),
  aktif: z.boolean().default(true),
});

export const loginSchema = z.object({
  username: z.string().min(1, 'Username harus diisi'),
  password: z.string().min(1, 'Password harus diisi'),
});

// Santri validation schemas
export const santriSchema = z.object({
  nis: z.string().min(1, 'NIS harus diisi'),
  nama_santri: z.string().min(2, 'Nama minimal 2 karakter').max(100, 'Nama maksimal 100 karakter'),
  id_halaqoh: z.string().min(1, 'Halaqoh harus dipilih'),
  id_kelas: z.string().min(1, 'Kelas harus dipilih'),
  id_wali: z.string().optional(),
  tanggal_masuk: z.string().min(1, 'Tanggal masuk harus diisi'),
  status: z.enum(['Aktif', 'Nonaktif']),
});

// Halaqoh validation schemas
export const halaqohSchema = z.object({
  nama_halaqoh: z.string().min(2, 'Nama halaqoh minimal 2 karakter').max(100, 'Nama halaqoh maksimal 100 karakter'),
  id_asatidz: z.string().min(1, 'Ustadz harus dipilih'),
  tingkat: z.string().min(1, 'Tingkat harus dipilih'),
});

// Kelas validation schemas
export const kelasSchema = z.object({
  nama_kelas: z.string().min(2, 'Nama kelas minimal 2 karakter').max(50, 'Nama kelas maksimal 50 karakter'),
  jenis: z.enum(['Ikhwan', 'Akhwat']),
  program: z.string().min(1, 'Program harus dipilih'),
  tingkat: z.string().min(1, 'Tingkat harus dipilih'),
});

// Setoran validation schemas
export const setoranSchema = z.object({
  id_santri: z.string().min(1, 'Santri harus dipilih'),
  id_asatidz: z.string().min(1, 'Ustadz harus dipilih'),
  tanggal_setoran: z.string().min(1, 'Tanggal setoran harus diisi'),
  juz: z.number().min(1, 'Juz minimal 1').max(30, 'Juz maksimal 30'),
  surah_number: z.number().min(1, 'Nomor surah minimal 1').max(114, 'Nomor surah maksimal 114'),
  ayat_dari: z.number().min(1, 'Ayat dari minimal 1'),
  ayat_sampai: z.number().min(1, 'Ayat sampai minimal 1'),
  nilai_kelancaran: z.number().min(0, 'Nilai kelancaran minimal 0').max(100, 'Nilai kelancaran maksimal 100'),
  nilai_tajwid: z.number().min(0, 'Nilai tajwid minimal 0').max(100, 'Nilai tajwid maksimal 100'),
  nilai_fashahah: z.number().min(0, 'Nilai fashahah minimal 0').max(100, 'Nilai fashahah maksimal 100'),
  status: z.enum(['Lancar', 'Ulangi', 'Salah', 'Lulus']),
  catatan: z.string().optional(),
});

// Absensi validation schemas
export const absensiSchema = z.object({
  id_santri: z.string().min(1, 'Santri harus dipilih'),
  tanggal: z.string().min(1, 'Tanggal harus diisi'),
  status: z.enum(['Hadir', 'Sakit', 'Izin', 'Alpha']),
  catatan: z.string().optional(),
});

// Penilaian validation schemas
export const penilaianSchema = z.object({
  id_santri: z.string().min(1, 'Santri harus dipilih'),
  id_asatidz: z.string().min(1, 'Ustadz harus dipilih'),
  tanggal_penilaian: z.string().min(1, 'Tanggal penilaian harus diisi'),
  tajwid: z.number().min(0, 'Nilai tajwid minimal 0').max(100, 'Nilai tajwid maksimal 100'),
  fashahah: z.number().min(0, 'Nilai fashahah minimal 0').max(100, 'Nilai fashahah maksimal 100'),
  kelancaran: z.number().min(0, 'Nilai kelancaran minimal 0').max(100, 'Nilai kelancaran maksimal 100'),
  catatan: z.string().optional(),
});

// Pengumuman validation schemas
export const pengumumanSchema = z.object({
  judul: z.string().min(5, 'Judul minimal 5 karakter').max(200, 'Judul maksimal 200 karakter'),
  isi: z.string().min(10, 'Isi minimal 10 karakter'),
  kategori: z.enum(['Motivasi', 'Informasi', 'Pengumuman', 'Peringatan']),
  target_audience: z.enum(['Semua', 'Santri', 'Ustadz', 'Admin']).default('Semua'),
  prioritas: z.enum(['Normal', 'Tinggi', 'Urgent']).default('Normal'),
});

// Type exports
export type UserFormData = z.infer<typeof userSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type SantriFormData = z.infer<typeof santriSchema>;
export type HalaqohFormData = z.infer<typeof halaqohSchema>;
export type KelasFormData = z.infer<typeof kelasSchema>;
export type SetoranFormData = z.infer<typeof setoranSchema>;
export type AbsensiFormData = z.infer<typeof absensiSchema>;
export type PenilaianFormData = z.infer<typeof penilaianSchema>;
export type PengumumanFormData = z.infer<typeof pengumumanSchema>;