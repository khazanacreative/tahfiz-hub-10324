import type { ManzilTahfidz, Santri, TasmiMarhalah } from './tahfidz-types';

export const hitungNilaiKelancaran = (
  nilaiAwal: number,
  jumlahKesalahan: number
): number => {
  const nilaiAkhir = nilaiAwal - jumlahKesalahan;
  return Math.max(0, Math.min(100, nilaiAkhir));
};

export const getManzilBerikutnya = (
  manzilSekarang: ManzilTahfidz
): ManzilTahfidz | null => {
  const manzilMap: Record<ManzilTahfidz, ManzilTahfidz | null> = {
    'Manzil1_3to5Baris': 'Manzil2_PerHalaman',
    'Manzil2_PerHalaman': 'Manzil3_Per5Halaman',
    'Manzil3_Per5Halaman': 'Manzil4_PerSetengahJuz',
    'Manzil4_PerSetengahJuz': 'Manzil5_PerJuz',
    'Manzil5_PerJuz': null,
  };
  return manzilMap[manzilSekarang];
};

export const formatManzilLabel = (manzil: ManzilTahfidz): string => {
  const labelMap: Record<ManzilTahfidz, string> = {
    'Manzil1_3to5Baris': 'Manzil 1: Per 3-5 Baris',
    'Manzil2_PerHalaman': 'Manzil 2: Per Halaman',
    'Manzil3_Per5Halaman': 'Manzil 3: Per 5 Halaman',
    'Manzil4_PerSetengahJuz': 'Manzil 4: Per ½ Juz',
    'Manzil5_PerJuz': 'Manzil 5: Per Juz (Tasmi\')',
  };
  return labelMap[manzil];
};

export const formatManzilShort = (manzil: ManzilTahfidz): string => {
  const labelMap: Record<ManzilTahfidz, string> = {
    'Manzil1_3to5Baris': '3-5 Baris',
    'Manzil2_PerHalaman': '1 Halaman',
    'Manzil3_Per5Halaman': '5 Halaman',
    'Manzil4_PerSetengahJuz': '½ Juz',
    'Manzil5_PerJuz': '1 Juz',
  };
  return labelMap[manzil];
};

// Alias for backward compatibility with old naming
export const formatTahapLabel = formatManzilLabel;
export const formatTahapShort = formatManzilShort;

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

// Alias for backward compatibility
export const cekSyaratUjian = cekSyaratManzil;

export const getManzilNumber = (manzil: ManzilTahfidz): number => {
  const manzilMap: Record<ManzilTahfidz, number> = {
    'Manzil1_3to5Baris': 1,
    'Manzil2_PerHalaman': 2,
    'Manzil3_Per5Halaman': 3,
    'Manzil4_PerSetengahJuz': 4,
    'Manzil5_PerJuz': 5,
  };
  return manzilMap[manzil];
};
