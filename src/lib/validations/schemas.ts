import { z } from 'zod';

export const halaqohSchema = z.object({
  nama_halaqoh: z.string().min(2, 'Nama minimal 2 karakter'),
  id_asatidz: z.string().min(1, 'Ustadz harus dipilih'),
  tingkat: z.string().min(1, 'Tingkat harus dipilih'),
});

export const kelasSchema = z.object({
  nama_kelas: z.string().min(2, 'Nama minimal 2 karakter'),
  jenis: z.enum(['Ikhwan', 'Akhwat']),
  program: z.string().optional(),
  tingkat: z.string().optional(),
});

export const santriSchema = z.object({
  nis: z.string().min(1, 'NIS harus diisi'),
  nama_santri: z.string().min(2, 'Nama minimal 2 karakter'),
  id_halaqoh: z.string().min(1, 'Halaqoh harus dipilih'),
  id_kelas: z.string().optional(),
  id_wali: z.string().optional(),
  tanggal_masuk: z.string().min(1, 'Tanggal masuk harus diisi'),
  status: z.enum(['Aktif', 'Nonaktif']),
});

export const userSchema = z.object({
  nama_lengkap: z.string().min(2, 'Nama minimal 2 karakter'),
  username: z.string().min(3, 'Username minimal 3 karakter'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  email: z.string().email('Email tidak valid').optional(),
  no_hp: z.string().optional(),
  role: z.enum(['Admin', 'Asatidz', 'WaliSantri', 'Santri']),
  aktif: z.boolean().default(true),
});

export type HalaqohFormData = z.infer<typeof halaqohSchema>;
export type KelasFormData = z.infer<typeof kelasSchema>;
export type SantriFormData = z.infer<typeof santriSchema>;
export type UserFormData = z.infer<typeof userSchema>;
