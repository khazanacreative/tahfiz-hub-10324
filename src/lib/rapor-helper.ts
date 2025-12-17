import type { Santri, Penilaian, TasmiMarhalah, Absensi, RaporSemester, ManzilTahfidz, Semester } from './tahfidz-types';

export const generateRapor = (
  santri: Santri,
  tahunAjaran: string,
  semester: 'Ganjil' | 'Genap',
  penilaian: Penilaian[],
  tasmiMarhalah: TasmiMarhalah[],
  absensi: Absensi[],
  halaqohNama: string,
  ustadzNama: string,
  pembuatId: string
): Omit<RaporSemester, 'id'> => {
  
  // Filter data semester ini (contoh: semester ganjil = Juli-Desember)
  const startDate = semester === 'Ganjil' 
    ? new Date(`${tahunAjaran.split('/')[0]}-07-01`)  // Juli
    : new Date(`${tahunAjaran.split('/')[1]}-01-01`); // Januari
  const endDate = semester === 'Ganjil'
    ? new Date(`${tahunAjaran.split('/')[0]}-12-31`)  // Desember
    : new Date(`${tahunAjaran.split('/')[1]}-06-30`); // Juni
  
  const penilaianSemester = penilaian.filter((p: Penilaian) => 
    p.id_santri === santri.id &&
    new Date(p.tanggal_penilaian) >= startDate &&
    new Date(p.tanggal_penilaian) <= endDate
  );
  
  const tasmiSemester = tasmiMarhalah.filter((t: TasmiMarhalah) =>
    t.id_santri === santri.id &&
    new Date(t.tanggal_tasmi) >= startDate &&
    new Date(t.tanggal_tasmi) <= endDate
  );
  
  const absensiSemester = absensi.filter((a: Absensi) =>
    a.id_santri === santri.id &&
    new Date(a.tanggal) >= startDate &&
    new Date(a.tanggal) <= endDate
  );
  
  // Hitung juz yang dikuasai (tasmi' juz lulus)
  const juzDikuasai = tasmiSemester
    .filter((t: TasmiMarhalah) => t.manzil === 'Manzil5_PerJuz' && t.status === 'Lulus')
    .map((t: TasmiMarhalah) => t.juz);
  const uniqueJuz = [...new Set(juzDikuasai)];
  
  // Hitung total halaman & ayat
  const totalAyat = tasmiSemester.reduce((sum: number, t: TasmiMarhalah) => sum + t.total_ayat, 0);
  const totalHalaman = tasmiSemester.reduce((sum: number, t: TasmiMarhalah) => sum + t.total_halaman, 0);
  
  // Hitung progress manzil
  const manzil1Lulus = tasmiSemester.filter((t: TasmiMarhalah) => t.manzil === 'Manzil1_3to5Baris' && t.status === 'Lulus').length;
  const manzil2Lulus = tasmiSemester.filter((t: TasmiMarhalah) => t.manzil === 'Manzil2_PerHalaman' && t.status === 'Lulus').length;
  const manzil3Lulus = tasmiSemester.filter((t: TasmiMarhalah) => t.manzil === 'Manzil3_Per5Halaman' && t.status === 'Lulus').length;
  const manzil4Lulus = tasmiSemester.filter((t: TasmiMarhalah) => t.manzil === 'Manzil4_PerSetengahJuz' && t.status === 'Lulus').length;
  const manzil5Lulus = tasmiSemester.filter((t: TasmiMarhalah) => t.manzil === 'Manzil5_PerJuz' && t.status === 'Lulus').length;
  
  // Hitung rata-rata kelancaran
  const totalKelancaran = tasmiSemester.reduce((sum: number, t: TasmiMarhalah) => sum + t.kelancaran, 0);
  const rataRataKelancaran = tasmiSemester.length > 0 
    ? Math.round(totalKelancaran / tasmiSemester.length) 
    : 0;
  
  // Ekstrak poin tajwid (dari catatan penilaian)
  const poinKuatTajwid = extractPoinKuat(penilaianSemester.map((p: Penilaian) => p.catatan_tajwid));
  const poinPerbaikanTajwid = extractPoinPerbaikan(penilaianSemester.map((p: Penilaian) => p.catatan_tajwid));
  
  // Ekstrak poin fashahah
  const poinKuatFashahah = extractPoinKuat(penilaianSemester.map((p: Penilaian) => p.catatan_fashahah));
  const poinPerbaikanFashahah = extractPoinPerbaikan(penilaianSemester.map((p: Penilaian) => p.catatan_fashahah));
  
  // Hitung kehadiran
  const totalHadir = absensiSemester.filter((a: Absensi) => a.status_kehadiran === 'Hadir').length;
  const totalIzin = absensiSemester.filter((a: Absensi) => a.status_kehadiran === 'Izin').length;
  const totalSakit = absensiSemester.filter((a: Absensi) => a.status_kehadiran === 'Sakit').length;
  const totalAlfa = absensiSemester.filter((a: Absensi) => a.status_kehadiran === 'Alfa').length;
  const persentaseKehadiran = absensiSemester.length > 0
    ? Math.round((totalHadir / absensiSemester.length) * 100)
    : 0;
  
  return {
    id_santri: santri.id,
    tahun_ajaran: tahunAjaran,
    semester,
    nama_santri: santri.nama_santri,
    nis: santri.nis,
    halaqoh: halaqohNama,
    ustadz_pembimbing: ustadzNama,
    juz_dikuasai: uniqueJuz.sort((a: number, b: number) => a - b),
    total_juz: uniqueJuz.length,
    total_halaman: totalHalaman,
    total_ayat: totalAyat,
    manzil_1_lulus: manzil1Lulus,
    manzil_2_lulus: manzil2Lulus,
    manzil_3_lulus: manzil3Lulus,
    manzil_4_lulus: manzil4Lulus,
    manzil_5_lulus: manzil5Lulus,
    rata_rata_kelancaran: rataRataKelancaran,
    poin_kuat_tajwid: poinKuatTajwid,
    poin_perlu_perbaikan_tajwid: poinPerbaikanTajwid,
    poin_kuat_fashahah: poinKuatFashahah,
    poin_perlu_perbaikan_fashahah: poinPerbaikanFashahah,
    detail_tasmi_marhalah: tasmiSemester.sort((a: TasmiMarhalah, b: TasmiMarhalah) => 
      new Date(b.tanggal_tasmi).getTime() - new Date(a.tanggal_tasmi).getTime()
    ),
    total_pertemuan: absensiSemester.length,
    total_hadir: totalHadir,
    total_izin: totalIzin,
    total_sakit: totalSakit,
    total_alfa: totalAlfa,
    persentase_kehadiran: persentaseKehadiran,
    prestasi: [],
    catatan_ustadz: '',
    rekomendasi: '',
    tanggal_dibuat: new Date().toISOString(),
    dibuat_oleh: pembuatId,
  };
};

// Helper untuk ekstrak poin kuat dari catatan
const extractPoinKuat = (catatan: string[]): string[] => {
  const keywords = ['baik', 'bagus', 'sempurna', 'jelas', 'sudah', 'lancar', 'benar', 'luar biasa', 'masya allah'];
  const poin: string[] = [];
  
  catatan.forEach((c: string) => {
    if (!c) return;
    const sentences = c.split('.').map((s: string) => s.trim());
    sentences.forEach((sentence: string) => {
      if (keywords.some((k: string) => sentence.toLowerCase().includes(k))) {
        if (sentence.length > 0) {
          poin.push(sentence);
        }
      }
    });
  });
  
  return [...new Set(poin)].slice(0, 5); // Max 5 poin
};

// Helper untuk ekstrak poin perbaikan
const extractPoinPerbaikan = (catatan: string[]): string[] => {
  const keywords = ['perlu', 'kurang', 'harus', 'belum', 'salah', 'ulangi', 'latihan', 'perbaiki'];
  const poin: string[] = [];
  
  catatan.forEach((c: string) => {
    if (!c) return;
    const sentences = c.split('.').map((s: string) => s.trim());
    sentences.forEach((sentence: string) => {
      if (keywords.some((k: string) => sentence.toLowerCase().includes(k))) {
        if (sentence.length > 0) {
          poin.push(sentence);
        }
      }
    });
  });
  
  return [...new Set(poin)].slice(0, 5); // Max 5 poin
};

// Format manzil untuk display
export const formatManzilLabel = (manzil: ManzilTahfidz): string => {
  const labels: Record<ManzilTahfidz, string> = {
    'Manzil1_3to5Baris': 'Manzil 1: Per 3-5 Baris',
    'Manzil2_PerHalaman': 'Manzil 2: Per Halaman',
    'Manzil3_Per5Halaman': 'Manzil 3: Per 5 Halaman',
    'Manzil4_PerSetengahJuz': 'Manzil 4: Per ½ Juz',
    'Manzil5_PerJuz': 'Manzil 5: Per Juz (Tasmi\')',
  };
  return labels[manzil];
};

export const formatManzilShort = (manzil: ManzilTahfidz): string => {
  const labels: Record<ManzilTahfidz, string> = {
    'Manzil1_3to5Baris': '3-5 Baris',
    'Manzil2_PerHalaman': '1 Halaman',
    'Manzil3_Per5Halaman': '5 Halaman',
    'Manzil4_PerSetengahJuz': '½ Juz',
    'Manzil5_PerJuz': '1 Juz',
  };
  return labels[manzil];
};

// Cek syarat manzil dengan sistem bertahap
export const cekSyaratManzil = (
  santri: Santri,
  manzil: ManzilTahfidz,
  tasmiSebelumnya: TasmiMarhalah[]
): { siap: boolean; pesan: string } => {
  
  const tasmiSantri = tasmiSebelumnya.filter((t: TasmiMarhalah) => t.id_santri === santri.id);
  
  switch (manzil) {
    case 'Manzil1_3to5Baris':
      return { siap: true, pesan: 'Siap tasmi\' manzil 1' };
    
    case 'Manzil2_PerHalaman':
      const manzil1Lulus = tasmiSantri.some(
        (t: TasmiMarhalah) => t.manzil === 'Manzil1_3to5Baris' && t.status === 'Lulus'
      );
      return manzil1Lulus
        ? { siap: true, pesan: 'Siap tasmi\' manzil 2' }
        : { siap: false, pesan: 'Harus lulus Manzil 1 terlebih dahulu' };
    
    case 'Manzil3_Per5Halaman':
      const manzil2Lulus = tasmiSantri.some(
        (t: TasmiMarhalah) => t.manzil === 'Manzil2_PerHalaman' && t.status === 'Lulus'
      );
      return manzil2Lulus
        ? { siap: true, pesan: 'Siap tasmi\' manzil 3' }
        : { siap: false, pesan: 'Harus lulus Manzil 2 terlebih dahulu' };
    
    case 'Manzil4_PerSetengahJuz':
      const manzil3Lulus = tasmiSantri.some(
        (t: TasmiMarhalah) => t.manzil === 'Manzil3_Per5Halaman' && t.status === 'Lulus'
      );
      return manzil3Lulus
        ? { siap: true, pesan: 'Siap tasmi\' manzil 4' }
        : { siap: false, pesan: 'Harus lulus Manzil 3 terlebih dahulu' };
    
    case 'Manzil5_PerJuz':
      const manzil4Lulus = tasmiSantri.some(
        (t: TasmiMarhalah) => t.manzil === 'Manzil4_PerSetengahJuz' && t.status === 'Lulus'
      );
      return manzil4Lulus
        ? { siap: true, pesan: 'Siap tasmi\' manzil 5 (ujian juz)' }
        : { siap: false, pesan: 'Harus lulus Manzil 4 terlebih dahulu' };
    
    default:
      return { siap: false, pesan: 'Manzil tidak valid' };
  }
};
