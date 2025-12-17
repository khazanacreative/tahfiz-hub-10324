import type { TahfidzData, User, UserRole } from './tahfidz-types';

const STORAGE_KEY = 'tahfidz_data';

export const getInitialData = (): TahfidzData => {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  
  // Helper untuk generate tanggal mundur
  const daysAgo = (days: number): string => {
    const date = new Date(now);
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  };

  return {
    users: [
      // Admin
      {
        id: '1',
        nama_lengkap: 'Admin Utama',
        username: 'admin',
        password: 'admin123',
        role: 'Admin',
        email: 'admin@tahfidz.com',
        no_hp: '081234567890',
        aktif: true,
      },
      // Asatidz (Ustadz)
      {
        id: '2',
        nama_lengkap: 'Ustadz Ahmad Fauzi',
        username: 'ahmad',
        password: 'ahmad123',
        role: 'Asatidz',
        email: 'ahmad@tahfidz.com',
        no_hp: '081234567891',
        aktif: true,
      },
      {
        id: '3',
        nama_lengkap: 'Ustadz Budi Santoso',
        username: 'budi',
        password: 'budi123',
        role: 'Asatidz',
        email: 'budi@tahfidz.com',
        no_hp: '081234567892',
        aktif: true,
      },
      {
        id: '4',
        nama_lengkap: 'Ustadz Muhammad Yusuf',
        username: 'yusuf',
        password: 'yusuf123',
        role: 'Asatidz',
        email: 'yusuf@tahfidz.com',
        no_hp: '081234567893',
        aktif: true,
      },
      // Wali Santri / Santri
      {
        id: '5',
        nama_lengkap: 'H. Abdullah (Wali Muhammad Faiz)',
        username: 'faiz',
        password: 'faiz123',
        role: 'WaliSantri',
        email: 'faiz@tahfidz.com',
        no_hp: '081234567894',
        aktif: true,
      },
      {
        id: '6',
        nama_lengkap: 'Bapak Hasan (Wali Ahmad Rizky)',
        username: 'rizky',
        password: 'rizky123',
        role: 'WaliSantri',
        email: 'rizky@tahfidz.com',
        no_hp: '081234567895',
        aktif: true,
      },
      {
        id: '7',
        nama_lengkap: 'Ibu Fatimah (Wali Fatimah Zahra)',
        username: 'fatimah',
        password: 'fatimah123',
        role: 'WaliSantri',
        email: 'fatimah@tahfidz.com',
        no_hp: '081234567896',
        aktif: true,
      },
      {
        id: '8',
        nama_lengkap: 'Bapak Ali (Wali Ali Akbar)',
        username: 'ali',
        password: 'ali123',
        role: 'WaliSantri',
        email: 'ali@tahfidz.com',
        no_hp: '081234567897',
        aktif: true,
      },
      {
        id: '9',
        nama_lengkap: 'Ibu Khadijah (Wali Aisyah Nur)',
        username: 'aisyah',
        password: 'aisyah123',
        role: 'WaliSantri',
        email: 'aisyah@tahfidz.com',
        no_hp: '081234567898',
        aktif: true,
      },
      {
        id: '10',
        nama_lengkap: 'Bapak Umar (Wali Umar Faruq)',
        username: 'umar',
        password: 'umar123',
        role: 'WaliSantri',
        email: 'umar@tahfidz.com',
        no_hp: '081234567899',
        aktif: true,
      },
    ],
    halaqoh: [
      {
        id: '1',
        nama_halaqoh: 'Halaqoh Al-Azhary',
        id_asatidz: '2', // Ustadz Ahmad
        tingkat: 'Pemula',
        jumlah_santri: 0,
      },
      {
        id: '2',
        nama_halaqoh: 'Halaqoh Al-Furqon',
        id_asatidz: '3', // Ustadz Budi
        tingkat: 'Menengah',
        jumlah_santri: 0,
      },
      {
        id: '3',
        nama_halaqoh: 'Halaqoh Al-Hidayah',
        id_asatidz: '4', // Ustadz Yusuf
        tingkat: 'Lanjutan',
        jumlah_santri: 0,
      },
    ],
    kelas: [
      // Paket A Ikhwan
      {
        id: '1',
        nama_kelas: 'Paket A Kelas 1 Ikhwan',
        jenis: 'Ikhwan',
        program: 'Paket A',
        tingkat: '1',
        jumlah_santri: 0,
      },
      {
        id: '2',
        nama_kelas: 'Paket A Kelas 2 Ikhwan',
        jenis: 'Ikhwan',
        program: 'Paket A',
        tingkat: '2',
        jumlah_santri: 0,
      },
      {
        id: '3',
        nama_kelas: 'Paket A Kelas 3 Ikhwan',
        jenis: 'Ikhwan',
        program: 'Paket A',
        tingkat: '3',
        jumlah_santri: 0,
      },
      {
        id: '4',
        nama_kelas: 'Paket A Kelas 4 Ikhwan',
        jenis: 'Ikhwan',
        program: 'Paket A',
        tingkat: '4',
        jumlah_santri: 0,
      },
      {
        id: '5',
        nama_kelas: 'Paket A Kelas 5 Ikhwan',
        jenis: 'Ikhwan',
        program: 'Paket A',
        tingkat: '5',
        jumlah_santri: 0,
      },
      {
        id: '6',
        nama_kelas: 'Paket A Kelas 6 Ikhwan',
        jenis: 'Ikhwan',
        program: 'Paket A',
        tingkat: '6',
        jumlah_santri: 0,
      },
      {
        id: '7',
        nama_kelas: 'Paket A Kelas 7 Ikhwan',
        jenis: 'Ikhwan',
        program: 'Paket A',
        tingkat: '7',
        jumlah_santri: 0,
      },
      // Paket B Ikhwan
      {
        id: '8',
        nama_kelas: 'Paket B Kelas 1 Ikhwan',
        jenis: 'Ikhwan',
        program: 'Paket B',
        tingkat: '1',
        jumlah_santri: 0,
      },
      {
        id: '9',
        nama_kelas: 'Paket B Kelas 2 Ikhwan',
        jenis: 'Ikhwan',
        program: 'Paket B',
        tingkat: '2',
        jumlah_santri: 0,
      },
      {
        id: '10',
        nama_kelas: 'Paket B Kelas 3 Ikhwan',
        jenis: 'Ikhwan',
        program: 'Paket B',
        tingkat: '3',
        jumlah_santri: 0,
      },
      {
        id: '11',
        nama_kelas: 'Paket B Kelas 4 Ikhwan',
        jenis: 'Ikhwan',
        program: 'Paket B',
        tingkat: '4',
        jumlah_santri: 0,
      },
      {
        id: '12',
        nama_kelas: 'Paket B Kelas 5 Ikhwan',
        jenis: 'Ikhwan',
        program: 'Paket B',
        tingkat: '5',
        jumlah_santri: 0,
      },
      {
        id: '13',
        nama_kelas: 'Paket B Kelas 6 Ikhwan',
        jenis: 'Ikhwan',
        program: 'Paket B',
        tingkat: '6',
        jumlah_santri: 0,
      },
      {
        id: '14',
        nama_kelas: 'Paket B Kelas 7 Ikhwan',
        jenis: 'Ikhwan',
        program: 'Paket B',
        tingkat: '7',
        jumlah_santri: 0,
      },
      // Paket A Akhwat
      {
        id: '15',
        nama_kelas: 'Paket A Kelas 1 Akhwat',
        jenis: 'Akhwat',
        program: 'Paket A',
        tingkat: '1',
        jumlah_santri: 0,
      },
      {
        id: '16',
        nama_kelas: 'Paket A Kelas 2 Akhwat',
        jenis: 'Akhwat',
        program: 'Paket A',
        tingkat: '2',
        jumlah_santri: 0,
      },
      {
        id: '17',
        nama_kelas: 'Paket A Kelas 3 Akhwat',
        jenis: 'Akhwat',
        program: 'Paket A',
        tingkat: '3',
        jumlah_santri: 0,
      },
      {
        id: '18',
        nama_kelas: 'Paket A Kelas 4 Akhwat',
        jenis: 'Akhwat',
        program: 'Paket A',
        tingkat: '4',
        jumlah_santri: 0,
      },
      {
        id: '19',
        nama_kelas: 'Paket A Kelas 5 Akhwat',
        jenis: 'Akhwat',
        program: 'Paket A',
        tingkat: '5',
        jumlah_santri: 0,
      },
      {
        id: '20',
        nama_kelas: 'Paket A Kelas 6 Akhwat',
        jenis: 'Akhwat',
        program: 'Paket A',
        tingkat: '6',
        jumlah_santri: 0,
      },
      {
        id: '21',
        nama_kelas: 'Paket A Kelas 7 Akhwat',
        jenis: 'Akhwat',
        program: 'Paket A',
        tingkat: '7',
        jumlah_santri: 0,
      },
      // Paket B Akhwat
      {
        id: '22',
        nama_kelas: 'Paket B Kelas 1 Akhwat',
        jenis: 'Akhwat',
        program: 'Paket B',
        tingkat: '1',
        jumlah_santri: 0,
      },
      {
        id: '23',
        nama_kelas: 'Paket B Kelas 2 Akhwat',
        jenis: 'Akhwat',
        program: 'Paket B',
        tingkat: '2',
        jumlah_santri: 0,
      },
      {
        id: '24',
        nama_kelas: 'Paket B Kelas 3 Akhwat',
        jenis: 'Akhwat',
        program: 'Paket B',
        tingkat: '3',
        jumlah_santri: 0,
      },
      {
        id: '25',
        nama_kelas: 'Paket B Kelas 4 Akhwat',
        jenis: 'Akhwat',
        program: 'Paket B',
        tingkat: '4',
        jumlah_santri: 0,
      },
      {
        id: '26',
        nama_kelas: 'Paket B Kelas 5 Akhwat',
        jenis: 'Akhwat',
        program: 'Paket B',
        tingkat: '5',
        jumlah_santri: 0,
      },
      {
        id: '27',
        nama_kelas: 'Paket B Kelas 6 Akhwat',
        jenis: 'Akhwat',
        program: 'Paket B',
        tingkat: '6',
        jumlah_santri: 0,
      },
      {
        id: '28',
        nama_kelas: 'Paket B Kelas 7 Akhwat',
        jenis: 'Akhwat',
        program: 'Paket B',
        tingkat: '7',
        jumlah_santri: 0,
      },
    ],
    santri: [
      {
        id: '1',
        nis: 'S001',
        nama_santri: 'Muhammad Faiz',
        id_halaqoh: '1',
        id_kelas: '7', // Paket A Kelas 1 Ikhwan
        id_wali: '5',
        tanggal_masuk: '2024-01-01',
        status: 'Aktif',
      },
      {
        id: '2',
        nis: 'S002',
        nama_santri: 'Ahmad Rizky',
        id_halaqoh: '1',
        id_kelas: '8', // Paket A Kelas 2 Ikhwan
        id_wali: '6',
        tanggal_masuk: '2024-01-15',
        status: 'Aktif',
      },
      {
        id: '3',
        nis: 'S003',
        nama_santri: 'Fatimah Zahra',
        id_halaqoh: '2',
        id_kelas: '19', // Paket B Kelas 7 Ikhwan
        id_wali: '7',
        tanggal_masuk: '2024-02-01',
        status: 'Aktif',
      },
      {
        id: '4',
        nis: 'S004',
        nama_santri: 'Ali Akbar',
        id_halaqoh: '2',
        id_kelas: '13', // Paket A Kelas 1 Akhwat
        id_wali: '8',
        tanggal_masuk: '2024-02-10',
        status: 'Aktif',
      },
      {
        id: '5',
        nis: 'S005',
        nama_santri: 'Aisyah Nur',
        id_halaqoh: '3',
        id_kelas: '22', // Paket B Kelas 7 Akhwat
        id_wali: '9',
        tanggal_masuk: '2024-02-15',
        status: 'Aktif',
      },
      {
        id: '6',
        nis: 'S006',
        nama_santri: 'Umar Faruq',
        id_halaqoh: '3',
        id_kelas: '14', // Paket A Kelas 2 Akhwat
        id_wali: '10',
        tanggal_masuk: '2024-03-01',
        status: 'Aktif',
      },
    ],
    setoran: [
      // Setoran Muhammad Faiz (Santri 1) - Halaqoh Al-Azhary - Ustadz Ahmad
      { id: '1', id_santri: '1', id_asatidz: '2', tanggal_setoran: daysAgo(30), juz: 1, surah_number: 1, ayat_dari: 1, ayat_sampai: 7, nilai_kelancaran: 75, nilai_tajwid: 78, nilai_fashahah: 80, status: 'Lancar', catatan: 'Awal yang baik' },
      { id: '2', id_santri: '1', id_asatidz: '2', tanggal_setoran: daysAgo(28), juz: 1, surah_number: 1, ayat_dari: 8, ayat_sampai: 20, nilai_kelancaran: 80, nilai_tajwid: 82, nilai_fashahah: 85, status: 'Lancar', catatan: 'Makin lancar' },
      { id: '3', id_santri: '1', id_asatidz: '2', tanggal_setoran: daysAgo(25), juz: 1, surah_number: 1, ayat_dari: 21, ayat_sampai: 50, nilai_kelancaran: 82, nilai_tajwid: 85, nilai_fashahah: 87, status: 'Lancar', catatan: 'Bagus' },
      { id: '4', id_santri: '1', id_asatidz: '2', tanggal_setoran: daysAgo(22), juz: 1, surah_number: 1, ayat_dari: 51, ayat_sampai: 100, nilai_kelancaran: 85, nilai_tajwid: 87, nilai_fashahah: 90, status: 'Lancar', catatan: 'Lanjutkan' },
      { id: '5', id_santri: '1', id_asatidz: '2', tanggal_setoran: daysAgo(20), juz: 2, surah_number: 2, ayat_dari: 1, ayat_sampai: 30, nilai_kelancaran: 88, nilai_tajwid: 90, nilai_fashahah: 92, status: 'Lancar', catatan: 'Sangat baik' },
      { id: '6', id_santri: '1', id_asatidz: '2', tanggal_setoran: daysAgo(18), juz: 2, surah_number: 2, ayat_dari: 31, ayat_sampai: 80, nilai_kelancaran: 90, nilai_tajwid: 92, nilai_fashahah: 94, status: 'Lancar', catatan: 'Luar biasa' },
      { id: '7', id_santri: '1', id_asatidz: '2', tanggal_setoran: daysAgo(15), juz: 2, surah_number: 2, ayat_dari: 81, ayat_sampai: 150, nilai_kelancaran: 87, nilai_tajwid: 89, nilai_fashahah: 91, status: 'Lancar', catatan: 'Pertahankan' },
      { id: '8', id_santri: '1', id_asatidz: '2', tanggal_setoran: daysAgo(10), juz: 3, surah_number: 3, ayat_dari: 1, ayat_sampai: 50, nilai_kelancaran: 85, nilai_tajwid: 87, nilai_fashahah: 89, status: 'Lancar', catatan: 'Baik sekali' },
      { id: '9', id_santri: '1', id_asatidz: '2', tanggal_setoran: daysAgo(5), juz: 3, surah_number: 3, ayat_dari: 51, ayat_sampai: 100, nilai_kelancaran: 92, nilai_tajwid: 94, nilai_fashahah: 96, status: 'Lancar', catatan: 'Masya Allah' },
      { id: '10', id_santri: '1', id_asatidz: '2', tanggal_setoran: daysAgo(2), juz: 3, surah_number: 3, ayat_dari: 101, ayat_sampai: 200, nilai_kelancaran: 95, nilai_tajwid: 97, nilai_fashahah: 98, status: 'Lancar', catatan: 'Sempurna!' },

      // Setoran Ahmad Rizky (Santri 2) - Halaqoh Al-Azhary - Ustadz Ahmad
      { id: '11', id_santri: '2', id_asatidz: '2', tanggal_setoran: daysAgo(29), juz: 1, surah_number: 1, ayat_dari: 1, ayat_sampai: 10, nilai_kelancaran: 70, nilai_tajwid: 72, nilai_fashahah: 75, status: 'Ulangi', catatan: 'Perlu perbaikan tajwid' },
      { id: '12', id_santri: '2', id_asatidz: '2', tanggal_setoran: daysAgo(27), juz: 1, surah_number: 1, ayat_dari: 1, ayat_sampai: 10, nilai_kelancaran: 78, nilai_tajwid: 80, nilai_fashahah: 82, status: 'Lancar', catatan: 'Sudah membaik' },
      { id: '13', id_santri: '2', id_asatidz: '2', tanggal_setoran: daysAgo(24), juz: 1, surah_number: 1, ayat_dari: 11, ayat_sampai: 30, nilai_kelancaran: 75, nilai_tajwid: 77, nilai_fashahah: 80, status: 'Lancar', catatan: 'Latihan lagi' },
      { id: '14', id_santri: '2', id_asatidz: '2', tanggal_setoran: daysAgo(21), juz: 1, surah_number: 1, ayat_dari: 31, ayat_sampai: 60, nilai_kelancaran: 80, nilai_tajwid: 82, nilai_fashahah: 85, status: 'Lancar', catatan: 'Alhamdulillah' },
      { id: '15', id_santri: '2', id_asatidz: '2', tanggal_setoran: daysAgo(18), juz: 1, surah_number: 1, ayat_dari: 61, ayat_sampai: 100, nilai_kelancaran: 82, nilai_tajwid: 84, nilai_fashahah: 87, status: 'Lancar', catatan: 'Terus semangat' },
      { id: '16', id_santri: '2', id_asatidz: '2', tanggal_setoran: daysAgo(14), juz: 2, surah_number: 2, ayat_dari: 1, ayat_sampai: 40, nilai_kelancaran: 85, nilai_tajwid: 87, nilai_fashahah: 90, status: 'Lancar', catatan: 'Bagus' },
      { id: '17', id_santri: '2', id_asatidz: '2', tanggal_setoran: daysAgo(10), juz: 2, surah_number: 2, ayat_dari: 41, ayat_sampai: 90, nilai_kelancaran: 88, nilai_tajwid: 90, nilai_fashahah: 92, status: 'Lancar', catatan: 'Sangat baik' },

      // Setoran Fatimah Zahra (Santri 3) - Halaqoh Al-Furqon - Ustadz Budi
      { id: '18', id_santri: '3', id_asatidz: '3', tanggal_setoran: daysAgo(28), juz: 1, surah_number: 1, ayat_dari: 1, ayat_sampai: 15, nilai_kelancaran: 88, nilai_tajwid: 90, nilai_fashahah: 92, status: 'Lancar', catatan: 'Sangat bagus' },
      { id: '19', id_santri: '3', id_asatidz: '3', tanggal_setoran: daysAgo(25), juz: 1, surah_number: 1, ayat_dari: 16, ayat_sampai: 40, nilai_kelancaran: 90, nilai_tajwid: 92, nilai_fashahah: 94, status: 'Lancar', catatan: 'Luar biasa' },
      { id: '20', id_santri: '3', id_asatidz: '3', tanggal_setoran: daysAgo(22), juz: 1, surah_number: 1, ayat_dari: 41, ayat_sampai: 80, nilai_kelancaran: 92, nilai_tajwid: 94, nilai_fashahah: 96, status: 'Lancar', catatan: 'Masya Allah' },
      { id: '21', id_santri: '3', id_asatidz: '3', tanggal_setoran: daysAgo(19), juz: 2, surah_number: 2, ayat_dari: 1, ayat_sampai: 50, nilai_kelancaran: 95, nilai_tajwid: 97, nilai_fashahah: 98, status: 'Lancar', catatan: 'Sempurna' },
      { id: '22', id_santri: '3', id_asatidz: '3', tanggal_setoran: daysAgo(15), juz: 2, surah_number: 2, ayat_dari: 51, ayat_sampai: 120, nilai_kelancaran: 93, nilai_tajwid: 95, nilai_fashahah: 97, status: 'Lancar', catatan: 'Mantap' },
      { id: '23', id_santri: '3', id_asatidz: '3', tanggal_setoran: daysAgo(12), juz: 3, surah_number: 3, ayat_dari: 1, ayat_sampai: 60, nilai_kelancaran: 90, nilai_tajwid: 92, nilai_fashahah: 94, status: 'Lancar', catatan: 'Istiqomah' },
      { id: '24', id_santri: '3', id_asatidz: '3', tanggal_setoran: daysAgo(8), juz: 3, surah_number: 3, ayat_dari: 61, ayat_sampai: 130, nilai_kelancaran: 94, nilai_tajwid: 96, nilai_fashahah: 97, status: 'Lancar', catatan: 'Barakallah' },
      { id: '25', id_santri: '3', id_asatidz: '3', tanggal_setoran: daysAgo(4), juz: 4, surah_number: 4, ayat_dari: 1, ayat_sampai: 70, nilai_kelancaran: 96, nilai_tajwid: 98, nilai_fashahah: 99, status: 'Lancar', catatan: 'Allahu Akbar' },

      // Setoran Ali Akbar (Santri 4) - Halaqoh Al-Furqon - Ustadz Budi
      { id: '26', id_santri: '4', id_asatidz: '3', tanggal_setoran: daysAgo(26), juz: 1, surah_number: 1, ayat_dari: 1, ayat_sampai: 20, nilai_kelancaran: 78, nilai_tajwid: 80, nilai_fashahah: 82, status: 'Lancar', catatan: 'Bagus' },
      { id: '27', id_santri: '4', id_asatidz: '3', tanggal_setoran: daysAgo(23), juz: 1, surah_number: 1, ayat_dari: 21, ayat_sampai: 50, nilai_kelancaran: 82, nilai_tajwid: 84, nilai_fashahah: 86, status: 'Lancar', catatan: 'Terus semangat' },
      { id: '28', id_santri: '4', id_asatidz: '3', tanggal_setoran: daysAgo(19), juz: 1, surah_number: 1, ayat_dari: 51, ayat_sampai: 100, nilai_kelancaran: 85, nilai_tajwid: 87, nilai_fashahah: 89, status: 'Lancar', catatan: 'Alhamdulillah' },
      { id: '29', id_santri: '4', id_asatidz: '3', tanggal_setoran: daysAgo(16), juz: 2, surah_number: 2, ayat_dari: 1, ayat_sampai: 45, nilai_kelancaran: 87, nilai_tajwid: 89, nilai_fashahah: 91, status: 'Lancar', catatan: 'Mantap' },
      { id: '30', id_santri: '4', id_asatidz: '3', tanggal_setoran: daysAgo(12), juz: 2, surah_number: 2, ayat_dari: 46, ayat_sampai: 100, nilai_kelancaran: 89, nilai_tajwid: 91, nilai_fashahah: 93, status: 'Lancar', catatan: 'Terus lanjutkan' },

      // Setoran Aisyah Nur (Santri 5) - Halaqoh Al-Hidayah - Ustadz Yusuf
      { id: '31', id_santri: '5', id_asatidz: '4', tanggal_setoran: daysAgo(25), juz: 1, surah_number: 1, ayat_dari: 1, ayat_sampai: 25, nilai_kelancaran: 85, nilai_tajwid: 87, nilai_fashahah: 89, status: 'Lancar', catatan: 'Sangat baik' },
      { id: '32', id_santri: '5', id_asatidz: '4', tanggal_setoran: daysAgo(22), juz: 1, surah_number: 1, ayat_dari: 26, ayat_sampai: 60, nilai_kelancaran: 88, nilai_tajwid: 90, nilai_fashahah: 92, status: 'Lancar', catatan: 'Lanjutkan' },
      { id: '33', id_santri: '5', id_asatidz: '4', tanggal_setoran: daysAgo(18), juz: 1, surah_number: 1, ayat_dari: 61, ayat_sampai: 100, nilai_kelancaran: 90, nilai_tajwid: 92, nilai_fashahah: 94, status: 'Lancar', catatan: 'Masya Allah' },
      { id: '34', id_santri: '5', id_asatidz: '4', tanggal_setoran: daysAgo(14), juz: 2, surah_number: 2, ayat_dari: 1, ayat_sampai: 50, nilai_kelancaran: 92, nilai_tajwid: 94, nilai_fashahah: 96, status: 'Lancar', catatan: 'Sempurna' },
      { id: '35', id_santri: '5', id_asatidz: '4', tanggal_setoran: daysAgo(10), juz: 2, surah_number: 2, ayat_dari: 51, ayat_sampai: 110, nilai_kelancaran: 94, nilai_tajwid: 96, nilai_fashahah: 97, status: 'Lancar', catatan: 'Barakallah' },
      { id: '36', id_santri: '5', id_asatidz: '4', tanggal_setoran: daysAgo(6), juz: 3, surah_number: 3, ayat_dari: 1, ayat_sampai: 70, nilai_kelancaran: 95, nilai_tajwid: 97, nilai_fashahah: 98, status: 'Lancar', catatan: 'Allahu Akbar' },

      // Setoran Umar Faruq (Santri 6) - Halaqoh Al-Hidayah - Ustadz Yusuf
      { id: '37', id_santri: '6', id_asatidz: '4', tanggal_setoran: daysAgo(24), juz: 1, surah_number: 1, ayat_dari: 1, ayat_sampai: 15, nilai_kelancaran: 80, nilai_tajwid: 82, nilai_fashahah: 84, status: 'Lancar', catatan: 'Bagus' },
      { id: '38', id_santri: '6', id_asatidz: '4', tanggal_setoran: daysAgo(20), juz: 1, surah_number: 1, ayat_dari: 16, ayat_sampai: 40, nilai_kelancaran: 83, nilai_tajwid: 85, nilai_fashahah: 87, status: 'Lancar', catatan: 'Terus semangat' },
      { id: '39', id_santri: '6', id_asatidz: '4', tanggal_setoran: daysAgo(16), juz: 1, surah_number: 1, ayat_dari: 41, ayat_sampai: 80, nilai_kelancaran: 86, nilai_tajwid: 88, nilai_fashahah: 90, status: 'Lancar', catatan: 'Alhamdulillah' },
      { id: '40', id_santri: '6', id_asatidz: '4', tanggal_setoran: daysAgo(12), juz: 2, surah_number: 2, ayat_dari: 1, ayat_sampai: 50, nilai_kelancaran: 88, nilai_tajwid: 90, nilai_fashahah: 92, status: 'Lancar', catatan: 'Mantap' },
    ],
    absensi: [
      // Absensi Muhammad Faiz (Santri 1)
      { id: '1', id_santri: '1', tanggal: daysAgo(30), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '2', id_santri: '1', tanggal: daysAgo(29), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '3', id_santri: '1', tanggal: daysAgo(28), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '4', id_santri: '1', tanggal: daysAgo(27), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '5', id_santri: '1', tanggal: daysAgo(26), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '6', id_santri: '1', tanggal: daysAgo(25), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '7', id_santri: '1', tanggal: daysAgo(24), status_kehadiran: 'Izin', keterangan: 'Kunjungan keluarga' },
      { id: '8', id_santri: '1', tanggal: daysAgo(23), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '9', id_santri: '1', tanggal: daysAgo(22), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '10', id_santri: '1', tanggal: daysAgo(21), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '11', id_santri: '1', tanggal: daysAgo(20), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '12', id_santri: '1', tanggal: daysAgo(19), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '13', id_santri: '1', tanggal: daysAgo(18), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '14', id_santri: '1', tanggal: daysAgo(17), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '15', id_santri: '1', tanggal: daysAgo(16), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '16', id_santri: '1', tanggal: daysAgo(15), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '17', id_santri: '1', tanggal: daysAgo(14), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '18', id_santri: '1', tanggal: daysAgo(13), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '19', id_santri: '1', tanggal: daysAgo(12), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '20', id_santri: '1', tanggal: daysAgo(11), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '21', id_santri: '1', tanggal: daysAgo(10), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '22', id_santri: '1', tanggal: daysAgo(9), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '23', id_santri: '1', tanggal: daysAgo(8), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '24', id_santri: '1', tanggal: daysAgo(7), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '25', id_santri: '1', tanggal: daysAgo(6), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '26', id_santri: '1', tanggal: daysAgo(5), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '27', id_santri: '1', tanggal: daysAgo(4), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '28', id_santri: '1', tanggal: daysAgo(3), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '29', id_santri: '1', tanggal: daysAgo(2), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '30', id_santri: '1', tanggal: daysAgo(1), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '31', id_santri: '1', tanggal: today, status_kehadiran: 'Hadir', keterangan: '' },

      // Absensi Ahmad Rizky (Santri 2) - beberapa hari saja
      { id: '32', id_santri: '2', tanggal: daysAgo(29), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '33', id_santri: '2', tanggal: daysAgo(28), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '34', id_santri: '2', tanggal: daysAgo(27), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '35', id_santri: '2', tanggal: daysAgo(26), status_kehadiran: 'Sakit', keterangan: 'Demam' },
      { id: '36', id_santri: '2', tanggal: daysAgo(25), status_kehadiran: 'Sakit', keterangan: 'Masih demam' },
      { id: '37', id_santri: '2', tanggal: daysAgo(24), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '38', id_santri: '2', tanggal: daysAgo(23), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '39', id_santri: '2', tanggal: daysAgo(22), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '40', id_santri: '2', tanggal: daysAgo(21), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '41', id_santri: '2', tanggal: daysAgo(20), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '42', id_santri: '2', tanggal: daysAgo(19), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '43', id_santri: '2', tanggal: daysAgo(18), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '44', id_santri: '2', tanggal: daysAgo(17), status_kehadiran: 'Alfa', keterangan: 'Tanpa keterangan' },
      { id: '45', id_santri: '2', tanggal: daysAgo(16), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '46', id_santri: '2', tanggal: daysAgo(15), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '47', id_santri: '2', tanggal: daysAgo(14), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '48', id_santri: '2', tanggal: daysAgo(13), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '49', id_santri: '2', tanggal: daysAgo(12), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '50', id_santri: '2', tanggal: daysAgo(11), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '51', id_santri: '2', tanggal: daysAgo(10), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '52', id_santri: '2', tanggal: today, status_kehadiran: 'Hadir', keterangan: '' },

      // Absensi untuk santri lainnya (singkat)
      { id: '53', id_santri: '3', tanggal: daysAgo(28), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '54', id_santri: '3', tanggal: daysAgo(25), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '55', id_santri: '3', tanggal: daysAgo(22), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '56', id_santri: '3', tanggal: daysAgo(19), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '57', id_santri: '3', tanggal: daysAgo(15), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '58', id_santri: '3', tanggal: daysAgo(12), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '59', id_santri: '3', tanggal: daysAgo(8), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '60', id_santri: '3', tanggal: daysAgo(4), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '61', id_santri: '3', tanggal: today, status_kehadiran: 'Hadir', keterangan: '' },

      { id: '62', id_santri: '4', tanggal: daysAgo(26), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '63', id_santri: '4', tanggal: daysAgo(23), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '64', id_santri: '4', tanggal: daysAgo(19), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '65', id_santri: '4', tanggal: daysAgo(16), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '66', id_santri: '4', tanggal: daysAgo(12), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '67', id_santri: '4', tanggal: today, status_kehadiran: 'Hadir', keterangan: '' },

      { id: '68', id_santri: '5', tanggal: daysAgo(25), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '69', id_santri: '5', tanggal: daysAgo(22), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '70', id_santri: '5', tanggal: daysAgo(18), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '71', id_santri: '5', tanggal: daysAgo(14), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '72', id_santri: '5', tanggal: daysAgo(10), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '73', id_santri: '5', tanggal: daysAgo(6), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '74', id_santri: '5', tanggal: today, status_kehadiran: 'Hadir', keterangan: '' },

      { id: '75', id_santri: '6', tanggal: daysAgo(24), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '76', id_santri: '6', tanggal: daysAgo(20), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '77', id_santri: '6', tanggal: daysAgo(16), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '78', id_santri: '6', tanggal: daysAgo(12), status_kehadiran: 'Hadir', keterangan: '' },
      { id: '79', id_santri: '6', tanggal: today, status_kehadiran: 'Hadir', keterangan: '' },
    ],
    penilaian: [
      // Penilaian Muhammad Faiz (Santri 1)
      { id: '1', id_santri: '1', id_asatidz: '2', tanggal_penilaian: daysAgo(30), tajwid: 78, fashahah: 80, kelancaran: 75, catatan: 'Idghom dan ikhfa sudah cukup baik. Mad wajib perlu diperbaiki. Makhroj huruf halqi sudah baik. Huruf ث dan س perlu dibedakan. Awal yang baik, perlu lebih banyak latihan' },
      { id: '2', id_santri: '1', id_asatidz: '2', tanggal_penilaian: daysAgo(25), tajwid: 85, fashahah: 87, kelancaran: 82, catatan: 'Idghom sudah bagus. Qolqolah sudah jelas. Huruf ث dan س sudah membaik. Huruf ع sudah baik. Perkembangan yang bagus' },
      { id: '3', id_santri: '1', id_asatidz: '2', tanggal_penilaian: daysAgo(20), tajwid: 90, fashahah: 92, kelancaran: 88, catatan: 'Mad wajib sudah baik. Bacaan nun sukun dan tanwin sudah bagus. Semua makhroj huruf sudah baik dan jelas. Sangat baik, terus pertahankan' },
      { id: '4', id_santri: '1', id_asatidz: '2', tanggal_penilaian: daysAgo(15), tajwid: 89, fashahah: 91, kelancaran: 87, catatan: 'Tajwid sudah dikuasai dengan baik. Idzhar dan ikhfa sempurna. Fashahah sudah sangat baik. Huruf-huruf halqi jelas. Alhamdulillah makin lancar' },
      { id: '5', id_santri: '1', id_asatidz: '2', tanggal_penilaian: daysAgo(10), tajwid: 87, fashahah: 89, kelancaran: 85, catatan: 'Semua hukum tajwid sudah bagus. Mad lazim sudah sempurna. Makhroj huruf syafawi dan lisani sudah benar semua. Terus semangat' },
      { id: '6', id_santri: '1', id_asatidz: '2', tanggal_penilaian: daysAgo(5), tajwid: 94, fashahah: 96, kelancaran: 92, catatan: 'Masya Allah, tajwid sangat baik. Qolqolah, idghom, ikhfa sempurna. Fashahah luar biasa. Semua huruf sudah benar dan jelas. Masya Allah, luar biasa' },
      { id: '7', id_santri: '1', id_asatidz: '2', tanggal_penilaian: daysAgo(2), tajwid: 97, fashahah: 98, kelancaran: 95, catatan: 'Sempurna! Semua hukum tajwid dikuasai dengan baik. Sempurna! Makhroj huruf sangat jelas dan benar. Sempurna! Barakallah' },

      // Penilaian Ahmad Rizky (Santri 2)
      { id: '8', id_santri: '2', id_asatidz: '2', tanggal_penilaian: daysAgo(29), tajwid: 72, fashahah: 75, kelancaran: 70, catatan: 'Qolqolah perlu perbaikan. Ikhfa masih kurang jelas. Huruf ث, ذ, dan ظ perlu latihan. Makhroj syafawi sudah baik. Perlu perbaikan tajwid dan makharij' },
      { id: '9', id_santri: '2', id_asatidz: '2', tanggal_penilaian: daysAgo(27), tajwid: 80, fashahah: 82, kelancaran: 78, catatan: 'Qolqolah sudah membaik. Idghom perlu latihan lagi. Huruf ث dan ذ sudah membaik. Terus latihan. Sudah membaik, terus latihan' },
      { id: '10', id_santri: '2', id_asatidz: '2', tanggal_penilaian: daysAgo(24), tajwid: 77, fashahah: 80, kelancaran: 75, catatan: 'Idghom sudah cukup baik. Mad wajib perlu diperbaiki. Huruf ظ sudah bagus. Huruf ع perlu latihan. Alhamdulillah ada kemajuan' },
      { id: '11', id_santri: '2', id_asatidz: '2', tanggal_penilaian: daysAgo(21), tajwid: 82, fashahah: 85, kelancaran: 80, catatan: 'Mad wajib sudah membaik. Ikhfa sudah cukup bagus. Huruf ع sudah membaik. Huruf halqi sudah jelas. Terus semangat' },
      { id: '12', id_santri: '2', id_asatidz: '2', tanggal_penilaian: daysAgo(18), tajwid: 84, fashahah: 87, kelancaran: 82, catatan: 'Bacaan nun sukun sudah baik. Qolqolah sudah jelas. Makhroj huruf sudah baik. Pertahankan. Bagus, pertahankan' },
      { id: '13', id_santri: '2', id_asatidz: '2', tanggal_penilaian: daysAgo(14), tajwid: 87, fashahah: 90, kelancaran: 85, catatan: 'Tajwid sudah dikuasai dengan baik. Idghom dan ikhfa bagus. Fashahah sudah sangat baik. Semua huruf jelas. Sangat baik' },
      { id: '14', id_santri: '2', id_asatidz: '2', tanggal_penilaian: daysAgo(10), tajwid: 90, fashahah: 92, kelancaran: 88, catatan: 'Masya Allah, semua hukum tajwid sudah bagus. Makhroj huruf sudah sempurna. Masya Allah' },

      // Penilaian Fatimah Zahra (Santri 3)
      { id: '15', id_santri: '3', id_asatidz: '3', tanggal_penilaian: daysAgo(28), tajwid: 95, fashahah: 97, kelancaran: 88, catatan: 'Tajwid sangat baik. Idghom, ikhfa, qolqolah sempurna. Makhroj huruf sangat jelas. Fashahah luar biasa. Sangat bagus' },
      { id: '16', id_santri: '3', id_asatidz: '3', tanggal_penilaian: daysAgo(25), tajwid: 97, fashahah: 98, kelancaran: 90, catatan: 'Semua hukum tajwid dikuasai dengan sempurna. Fashahah luar biasa. Semua huruf benar. Luar biasa' },
      { id: '17', id_santri: '3', id_asatidz: '3', tanggal_penilaian: daysAgo(22), tajwid: 98, fashahah: 99, kelancaran: 92, catatan: 'Masya Allah! Mad, idghom, ikhfa semuanya sempurna. Makhroj huruf halqi, syafawi, lisani sempurna. Masya Allah' },
      { id: '18', id_santri: '3', id_asatidz: '3', tanggal_penilaian: daysAgo(19), tajwid: 99, fashahah: 100, kelancaran: 95, catatan: 'Sempurna! Tidak ada yang perlu diperbaiki. Sempurna! Fashahah sangat tinggi. Sempurna' },
      { id: '19', id_santri: '3', id_asatidz: '3', tanggal_penilaian: daysAgo(15), tajwid: 98, fashahah: 99, kelancaran: 93, catatan: 'Tajwid sudah sempurna. Qolqolah sangat jelas. Makhroj huruf sempurna. Fashahah tinggi. Mantap' },
      { id: '20', id_santri: '3', id_asatidz: '3', tanggal_penilaian: daysAgo(12), tajwid: 97, fashahah: 98, kelancaran: 90, catatan: 'Tajwid dikuasai dengan sangat baik. Istiqomah. Fashahah sangat baik. Terus pertahankan. Istiqomah' },
      { id: '21', id_santri: '3', id_asatidz: '3', tanggal_penilaian: daysAgo(8), tajwid: 99, fashahah: 100, kelancaran: 94, catatan: 'Barakallah, semua tajwid sempurna. Barakallah, fashahah luar biasa. Barakallah' },
      { id: '22', id_santri: '3', id_asatidz: '3', tanggal_penilaian: daysAgo(4), tajwid: 100, fashahah: 100, kelancaran: 96, catatan: 'Allahu Akbar! Tajwid sempurna. Allahu Akbar! Fashahah sempurna. Allahu Akbar' },

      // Penilaian Ali Akbar (Santri 4)
      { id: '23', id_santri: '4', id_asatidz: '3', tanggal_penilaian: daysAgo(26), tajwid: 82, fashahah: 85, kelancaran: 78, catatan: 'Idghom dan ikhfa sudah baik. Mad perlu latihan. Makhroj huruf cukup baik. Huruf ع perlu latihan. Bagus' },
      { id: '24', id_santri: '4', id_asatidz: '3', tanggal_penilaian: daysAgo(23), tajwid: 85, fashahah: 87, kelancaran: 82, catatan: 'Mad sudah membaik. Qolqolah sudah jelas. Huruf ع sudah membaik. Huruf halqi jelas. Terus semangat' },
      { id: '25', id_santri: '4', id_asatidz: '3', tanggal_penilaian: daysAgo(19), tajwid: 87, fashahah: 89, kelancaran: 85, catatan: 'Tajwid sudah baik. Bacaan nun sukun bagus. Makhroj huruf sudah baik semua. Alhamdulillah' },
      { id: '26', id_santri: '4', id_asatidz: '3', tanggal_penilaian: daysAgo(16), tajwid: 89, fashahah: 91, kelancaran: 87, catatan: 'Semua hukum tajwid sudah dikuasai dengan baik. Fashahah sudah baik. Pertahankan. Mantap' },
      { id: '27', id_santri: '4', id_asatidz: '3', tanggal_penilaian: daysAgo(12), tajwid: 91, fashahah: 93, kelancaran: 89, catatan: 'Tajwid sangat baik. Terus lanjutkan. Fashahah sangat baik. Terus lanjutkan. Terus lanjutkan' },

      // Penilaian Aisyah Nur (Santri 5)
      { id: '28', id_santri: '5', id_asatidz: '4', tanggal_penilaian: daysAgo(25), tajwid: 88, fashahah: 90, kelancaran: 85, catatan: 'Tajwid sudah baik. Idghom dan ikhfa bagus. Makhroj huruf sudah baik. Huruf halqi jelas. Sangat baik' },
      { id: '29', id_santri: '5', id_asatidz: '4', tanggal_penilaian: daysAgo(22), tajwid: 90, fashahah: 92, kelancaran: 88, catatan: 'Semua hukum tajwid sudah dikuasai dengan baik. Fashahah sudah baik. Lanjutkan. Lanjutkan' },
      { id: '30', id_santri: '5', id_asatidz: '4', tanggal_penilaian: daysAgo(18), tajwid: 92, fashahah: 94, kelancaran: 90, catatan: 'Masya Allah, tajwid sudah sangat baik. Masya Allah, fashahah sangat baik. Masya Allah' },
      { id: '31', id_santri: '5', id_asatidz: '4', tanggal_penilaian: daysAgo(14), tajwid: 94, fashahah: 96, kelancaran: 92, catatan: 'Sempurna! Semua tajwid dikuasai. Sempurna! Fashahah sangat baik. Sempurna' },
      { id: '32', id_santri: '5', id_asatidz: '4', tanggal_penilaian: daysAgo(10), tajwid: 96, fashahah: 97, kelancaran: 94, catatan: 'Barakallah, tajwid sangat baik. Barakallah, fashahah sangat baik. Barakallah' },
      { id: '33', id_santri: '5', id_asatidz: '4', tanggal_penilaian: daysAgo(6), tajwid: 98, fashahah: 98, kelancaran: 95, catatan: 'Allahu Akbar! Tajwid sempurna. Allahu Akbar! Fashahah sempurna. Allahu Akbar' },

      // Penilaian Umar Faruq (Santri 6)
      { id: '34', id_santri: '6', id_asatidz: '4', tanggal_penilaian: daysAgo(24), tajwid: 83, fashahah: 86, kelancaran: 80, catatan: 'Tajwid sudah baik. Idghom dan qolqolah bagus. Makhroj huruf sudah baik. Huruf ع perlu latihan. Bagus' },
      { id: '35', id_santri: '6', id_asatidz: '4', tanggal_penilaian: daysAgo(20), tajwid: 86, fashahah: 88, kelancaran: 83, catatan: 'Semua hukum tajwid sudah baik. Terus latihan. Huruf ع sudah membaik. Fashahah baik. Terus semangat' },
      { id: '36', id_santri: '6', id_asatidz: '4', tanggal_penilaian: daysAgo(16), tajwid: 88, fashahah: 90, kelancaran: 86, catatan: 'Tajwid dikuasai dengan baik. Alhamdulillah. Fashahah sudah baik. Alhamdulillah. Alhamdulillah' },
      { id: '37', id_santri: '6', id_asatidz: '4', tanggal_penilaian: daysAgo(12), tajwid: 90, fashahah: 92, kelancaran: 88, catatan: 'Tajwid sangat baik. Mantap. Fashahah sangat baik. Mantap. Mantap' },
    ],
    pengumuman: [
      {
        id: '1',
        judul: 'Selamat Datang di Sistem Tahfidz Al-Quran',
        isi: 'Assalamualaikum warahmatullahi wabarakatuh. Alhamdulillah sistem manajemen tahfidz telah aktif dan siap digunakan. Mari bersama-sama kita tingkatkan hafalan Al-Quran dengan penuh semangat dan istiqomah. Barakallahu fiikum.',
        kategori: 'Pengumuman',
        tanggal_post: new Date().toISOString(),
        dibuat_oleh: '1',
      },
      {
        id: '2',
        judul: 'Motivasi Menghafal Al-Quran',
        isi: 'Bacalah Al-Quran, karena sesungguhnya ia akan datang pada hari kiamat sebagai pemberi syafaat bagi orang yang membacanya. (HR. Muslim)',
        kategori: 'Motivasi',
        tanggal_post: new Date().toISOString(),
        dibuat_oleh: '1',
      },
      {
        id: '3',
        judul: 'Keutamaan Menghafal Al-Quran',
        isi: 'Sebaik-baik kalian adalah yang belajar Al-Quran dan mengajarkannya. (HR. Bukhari)',
        kategori: 'Motivasi',
        tanggal_post: daysAgo(5),
        dibuat_oleh: '2',
      },
      {
        id: '4',
        judul: 'Jadwal Muroja\'ah Bersama',
        isi: 'Bismillah, akan diadakan muroja\'ah bersama setiap hari Jum\'at ba\'da Ashar. Diharapkan seluruh santri dapat mengikuti dengan tertib. Jazakumullahu khairan.',
        kategori: 'Pengumuman',
        tanggal_post: daysAgo(10),
        dibuat_oleh: '1',
      },
      {
        id: '5',
        judul: 'Tips Menjaga Hafalan',
        isi: 'Ulangi hafalan setiap hari minimal 1 juz. Jangan menambah hafalan baru sebelum hafalan lama benar-benar kuat. Istiqomah adalah kunci.',
        kategori: 'Motivasi',
        tanggal_post: daysAgo(15),
        dibuat_oleh: '3',
      },
    ],
    tasmi_marhalah: [
      // Muhammad Faiz - Lulus Tahap 1
      {
        id: 'tasmi1',
        id_santri: '1',
        id_asatidz: '2',
        manzil: 'Manzil1_3to5Baris',
        tanggal_tasmi: daysAgo(25),
        juz: 1,
        surah: 'Al-Fatihah & Al-Baqarah',
        ayat_dari: 1,
        ayat_sampai: 141,
        total_ayat: 141,
        total_halaman: 5,
        total_baris: 35,
        kelancaran: 92,
        jumlah_kesalahan: 8,
        catatan_tajwid: 'Bacaan idghom sudah baik. Mad wajib perlu diperbaiki sedikit. Ikhfa sudah cukup bagus.',
        catatan_fashahah: 'Makhroj huruf ث dan س sudah bagus. Huruf ع perlu sedikit perbaikan pada beberapa kata.',
        status: 'Lulus',
        perlu_murajaah: false,
        catatan_umum: 'Alhamdulillah sudah lancar, lanjut manzil 2. Terus istiqomah murojaah.',
        tanggal_selesai: daysAgo(25),
      },
      // Muhammad Faiz - Lulus Tahap 2
      {
        id: 'tasmi2',
        id_santri: '1',
        id_asatidz: '2',
        manzil: 'Manzil2_PerHalaman',
        tanggal_tasmi: daysAgo(15),
        juz: 1,
        surah: 'Al-Baqarah',
        ayat_dari: 142,
        ayat_sampai: 286,
        total_ayat: 145,
        total_halaman: 10,
        kelancaran: 88,
        jumlah_kesalahan: 12,
        catatan_tajwid: 'Mad lazim sudah baik. Idzhar syafawi perlu latihan. Qolqolah sudah bagus.',
        catatan_fashahah: 'Makhroj huruf-huruf halqi sudah bagus. Huruf غ dan خ perlu dibedakan lebih jelas.',
        status: 'Lulus',
        perlu_murajaah: false,
        catatan_umum: 'Masya Allah, pertahankan. Siap lanjut manzil 3 setelah istirahat.',
        tanggal_selesai: daysAgo(15),
      },
      // Ahmad Rizky - Lulus Tahap 1
      {
        id: 'tasmi3',
        id_santri: '2',
        id_asatidz: '2',
        manzil: 'Manzil1_3to5Baris',
        tanggal_tasmi: daysAgo(20),
        juz: 1,
        surah: 'Al-Fatihah & Al-Baqarah',
        ayat_dari: 1,
        ayat_sampai: 100,
        total_ayat: 100,
        total_halaman: 5,
        total_baris: 35,
        kelancaran: 85,
        jumlah_kesalahan: 15,
        catatan_tajwid: 'Qolqolah perlu diulang. Ikhfa sudah cukup baik. Mad jaiz munfashil sudah bagus.',
        catatan_fashahah: 'Perlu latihan huruf غ dan خ. Huruf ض dan ظ sudah bagus.',
        status: 'Lulus',
        perlu_murajaah: true,
        ayat_yang_perlu_diulang: 'Ayat 50-60 (qolqolah)',
        catatan_umum: 'Cukup baik, terus berlatih. Fokus pada tajwid qolqolah.',
        tanggal_selesai: daysAgo(20),
      },
      // Fatimah Zahra - Lulus Tahap 1
      {
        id: 'tasmi4',
        id_santri: '3',
        id_asatidz: '3',
        manzil: 'Manzil1_3to5Baris',
        tanggal_tasmi: daysAgo(22),
        juz: 1,
        surah: 'Al-Fatihah & Al-Baqarah',
        ayat_dari: 1,
        ayat_sampai: 80,
        total_ayat: 80,
        total_halaman: 5,
        total_baris: 35,
        kelancaran: 95,
        jumlah_kesalahan: 5,
        catatan_tajwid: 'Masya Allah, semua tajwid sudah sangat baik. Idghom, ikhfa, qolqolah sudah sempurna.',
        catatan_fashahah: 'Makhroj huruf sangat bagus. Huruf halqi, syafawi, dan lisani sudah benar semua.',
        status: 'Lulus',
        perlu_murajaah: false,
        catatan_umum: 'Alhamdulillah luar biasa! Siap lanjut manzil 2. Barakallahu fiik.',
        tanggal_selesai: daysAgo(22),
      },
      // Fatimah Zahra - Lulus Tahap 2
      {
        id: 'tasmi5',
        id_santri: '3',
        id_asatidz: '3',
        manzil: 'Manzil2_PerHalaman',
        tanggal_tasmi: daysAgo(12),
        juz: 2,
        surah: 'Al-Baqarah',
        ayat_dari: 1,
        ayat_sampai: 120,
        total_ayat: 120,
        total_halaman: 10,
        kelancaran: 93,
        jumlah_kesalahan: 7,
        catatan_tajwid: 'Sempurna! Semua hukum tajwid sudah dikuasai dengan baik. Mad, idghom, ikhfa semuanya bagus.',
        catatan_fashahah: 'Makhroj huruf sangat baik. Fashahah sudah tinggi, lanjutkan!',
        status: 'Lulus',
        perlu_murajaah: false,
        catatan_umum: 'Masya Allah tabarakallah. Siap manzil 3. Terus istiqomah.',
        tanggal_selesai: daysAgo(12),
      },
      // Ali Akbar - Sedang Proses Tahap 1
      {
        id: 'tasmi6',
        id_santri: '4',
        id_asatidz: '3',
        manzil: 'Manzil1_3to5Baris',
        tanggal_tasmi: daysAgo(16),
        juz: 1,
        surah: 'Al-Fatihah & Al-Baqarah',
        ayat_dari: 1,
        ayat_sampai: 100,
        total_ayat: 100,
        total_halaman: 5,
        total_baris: 35,
        kelancaran: 72,
        jumlah_kesalahan: 28,
        catatan_tajwid: 'Perlu perbaikan pada bacaan ikhfa dan idghom. Qolqolah masih kurang jelas.',
        catatan_fashahah: 'Huruf ث, ذ, dan ظ masih perlu latihan. Makhroj huruf syafawi sudah baik.',
        status: 'Tidak Lulus',
        perlu_murajaah: true,
        ayat_yang_perlu_diulang: 'Ayat 1-100 (terutama ayat dengan ikhfa dan qolqolah)',
        catatan_umum: 'Masih perlu latihan lagi. Fokus pada tajwid dan makhroj huruf. Semangat!',
        tanggal_selesai: daysAgo(16),
      },
      // Aisyah Nur - Lulus Tahap 1
      {
        id: 'tasmi7',
        id_santri: '5',
        id_asatidz: '4',
        manzil: 'Manzil1_3to5Baris',
        tanggal_tasmi: daysAgo(18),
        juz: 1,
        surah: 'Al-Fatihah & Al-Baqarah',
        ayat_dari: 1,
        ayat_sampai: 100,
        total_ayat: 100,
        total_halaman: 5,
        total_baris: 35,
        kelancaran: 90,
        jumlah_kesalahan: 10,
        catatan_tajwid: 'Sangat baik. Idghom dan ikhfa sudah bagus. Mad wajib perlu sedikit perbaikan.',
        catatan_fashahah: 'Makhroj huruf bagus. Huruf halqi sudah benar semua.',
        status: 'Lulus',
        perlu_murajaah: false,
        catatan_umum: 'Alhamdulillah bagus sekali. Siap lanjut manzil 2. Terus semangat!',
        tanggal_selesai: daysAgo(18),
      },
      // Umar Faruq - Lulus Tahap 1
      {
        id: 'tasmi8',
        id_santri: '6',
        id_asatidz: '4',
        manzil: 'Manzil1_3to5Baris',
        tanggal_tasmi: daysAgo(16),
        juz: 1,
        surah: 'Al-Fatihah & Al-Baqarah',
        ayat_dari: 1,
        ayat_sampai: 80,
        total_ayat: 80,
        total_halaman: 5,
        total_baris: 35,
        kelancaran: 86,
        jumlah_kesalahan: 14,
        catatan_tajwid: 'Bagus. Qolqolah sudah baik. Ikhfa perlu sedikit perbaikan.',
        catatan_fashahah: 'Makhroj huruf cukup baik. Huruf ع dan غ perlu latihan lagi.',
        status: 'Lulus',
        perlu_murajaah: false,
        catatan_umum: 'Alhamdulillah lulus. Terus latihan tajwid. Siap manzil 2.',
        tanggal_selesai: daysAgo(16),
      },
    ],
    rapor: [],
    log_aktivitas: [],
  };
};

export const loadData = (): TahfidzData => {
  if (typeof window === 'undefined') {
    return getInitialData();
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsedData = JSON.parse(stored) as TahfidzData;
      
      // Migrate old data: ensure tasmi_marhalah and rapor arrays exist
      if (!parsedData.tasmi_marhalah) {
        parsedData.tasmi_marhalah = [];
      }
      if (!parsedData.rapor) {
        parsedData.rapor = [];
      }
      if (!parsedData.kelas) {
        parsedData.kelas = getInitialData().kelas;
      }
      
      // Save migrated data back to localStorage
      saveData(parsedData);
      return parsedData;
    }
  } catch (error) {
    console.error('Error loading data:', error);
    // Clear corrupted data and start fresh
    localStorage.removeItem(STORAGE_KEY);
  }
  
  const initialData = getInitialData();
  saveData(initialData);
  return initialData;
};

export const saveData = (data: TahfidzData): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

export const addLog = (data: TahfidzData, userId: string, aksi: string): TahfidzData => {
  const newLog = {
    id: Date.now().toString(),
    id_user: userId,
    aksi,
    waktu: new Date().toISOString(),
  };
  
  return {
    ...data,
    log_aktivitas: [...data.log_aktivitas, newLog],
  };
};

export const authenticateUser = (username: string, password: string, data: TahfidzData): User | null => {
  const user = data.users.find(
    (u: User) => u.username === username && u.password === password && u.aktif
  );
  return user || null;
};

export const getUsersByRole = (data: TahfidzData, role: UserRole): User[] => {
  return data.users.filter((u: User) => u.role === role && u.aktif);
};
