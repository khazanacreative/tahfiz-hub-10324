export type UserRole = 'Admin' | 'Asatidz' | 'WaliSantri' | 'Santri';

export type StatusSantri = 'Aktif' | 'Nonaktif';
export type StatusHafalan = 'Lancar' | 'Ulangi' | 'Salah' | 'Lulus';
export type StatusKehadiran = 'Hadir' | 'Izin' | 'Sakit' | 'Alfa';
export type KategoriPengumuman = 'Pengumuman' | 'Motivasi';

// Tipe untuk manzil tahfidz (checkpoint)
export type ManzilTahfidz = 
  | 'Manzil1_3to5Baris'      // Per 3-5 baris (setoran harian)
  | 'Manzil2_PerHalaman'     // Per halaman (setoran harian/mingguan)
  | 'Manzil3_Per5Halaman'    // Per 5 halaman
  | 'Manzil4_PerSetengahJuz' // Per 1/2 juz (10 halaman)
  | 'Manzil5_PerJuz';        // Per 1 juz (tasmi')

export type StatusManzil = 'Belum Dimulai' | 'Sedang Proses' | 'Lulus' | 'Perlu Muraja\'ah' | 'Tidak Lulus';
export type Semester = 'Ganjil' | 'Genap';

export interface User {
  id: string;
  nama_lengkap: string;
  username: string;
  password: string;
  role: UserRole;
  email: string;
  no_hp: string;
  aktif: boolean;
}

export interface Santri {
  id: string;
  nis: string;
  nama_santri: string;
  id_halaqoh: string;
  id_kelas: string;
  id_wali: string;
  tanggal_masuk: string;
  status: StatusSantri;
}

export interface Halaqoh {
  id: string;
  nama_halaqoh: string;
  id_asatidz: string;
  tingkat: string;
  jumlah_santri: number;
}

export interface Kelas {
  id: string;
  nama_kelas: string;
  jenis: 'Ikhwan' | 'Akhwat';
  program: string;
  tingkat: string;
  jumlah_santri: number;
}

export interface Setoran {
  id: string;
  id_santri: string;
  id_asatidz: string;
  tanggal_setoran: string;
  juz: number;
  surah_number: number;
  ayat_dari: number;
  ayat_sampai: number;
  nilai_kelancaran: number;
  nilai_tajwid: number;
  nilai_fashahah: number;
  status: StatusHafalan;
  catatan: string;
}

export interface Absensi {
  id: string;
  id_santri: string;
  tanggal: string;
  status_kehadiran: StatusKehadiran;
  keterangan: string;
}

// Penilaian dengan nilai tajwid dan fashahah (number)
export interface Penilaian {
  id: string;
  id_santri: string;
  id_asatidz: string;
  tanggal_penilaian: string;
  tajwid: number;              // Nilai tajwid 1-100
  fashahah: number;            // Nilai fashahah/makharijul huruf 1-100
  kelancaran: number;          // 1-100 sistem pengurangan
  catatan: string;             // Catatan umum
}

export interface Pengumuman {
  id: string;
  judul: string;
  isi: string;
  kategori: KategoriPengumuman;
  tanggal_post: string;
  dibuat_oleh: string;
}

export interface LogAktivitas {
  id: string;
  id_user: string;
  aksi: string;
  waktu: string;
}

// Tasmi' Marhalah (pengganti UjianTahapan)
export interface TasmiMarhalah {
  id: string;
  id_santri: string;
  id_asatidz: string;
  manzil: ManzilTahfidz;
  tanggal_tasmi: string;
  
  // Detail tasmi'
  juz: number;
  surah: string;
  ayat_dari: number;
  ayat_sampai: number;
  total_ayat: number;
  total_halaman: number;
  total_baris?: number;
  
  // Penilaian
  kelancaran: number;
  jumlah_kesalahan: number;
  catatan_tajwid: string;
  catatan_fashahah: string;
  catatan_makharij?: string;
  
  // Status & follow up
  status: StatusManzil;
  perlu_murajaah: boolean;
  ayat_yang_perlu_diulang?: string;
  catatan_umum: string;
  tanggal_selesai?: string;
}

// Rapor Semester
export interface RaporSemester {
  id: string;
  id_santri: string;
  tahun_ajaran: string;        // Format: "2024/2025"
  semester: Semester;
  
  // Data Santri
  nama_santri: string;
  nis: string;
  halaqoh: string;
  ustadz_pembimbing: string;
  
  // Statistik Hafalan
  juz_dikuasai: number[];
  total_juz: number;
  total_halaman: number;
  total_ayat: number;
  
  // Progress Manzil
  manzil_1_lulus: number;
  manzil_2_lulus: number;
  manzil_3_lulus: number;
  manzil_4_lulus: number;
  manzil_5_lulus: number;
  
  // Penilaian Rata-rata
  rata_rata_kelancaran: number;
  
  // Catatan Tajwid & Fashahah
  poin_kuat_tajwid: string[];
  poin_perlu_perbaikan_tajwid: string[];
  poin_kuat_fashahah: string[];
  poin_perlu_perbaikan_fashahah: string[];
  
  // Kehadiran
  total_pertemuan: number;
  total_hadir: number;
  total_izin: number;
  total_sakit: number;
  total_alfa: number;
  persentase_kehadiran: number;
  
  // Detail Tasmi' Marhalah
  detail_tasmi_marhalah: TasmiMarhalah[];
  
  // Prestasi & Catatan
  prestasi: string[];
  catatan_ustadz: string;
  rekomendasi: string;
  
  // Metadata
  tanggal_dibuat: string;
  dibuat_oleh: string;
  tanggal_cetak?: string;
}

export interface TahfidzData {
  users: User[];
  santri: Santri[];
  halaqoh: Halaqoh[];
  kelas: Kelas[];
  setoran: Setoran[];
  absensi: Absensi[];
  penilaian: Penilaian[];
  tasmi_marhalah: TasmiMarhalah[];
  rapor: RaporSemester[];
  pengumuman: Pengumuman[];
  log_aktivitas: LogAktivitas[];
}
