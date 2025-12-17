import type { Kelas } from './tahfidz-types';

/**
 * Format kelas name to short version
 * Example: "Paket A Kelas 4 Ikhwan" => "A IV I"
 * Example: "KBTK TKA Ikhwan" => "KBTK TKA I"
 */
export function formatKelasShort(kelas: Kelas): string {
  const programMap: Record<string, string> = {
    'Paket A': 'A',
    'Paket B': 'B',
    'Paket C': 'C',
  };

  const tingkatRomanMap: Record<string, string> = {
    '1': 'I',
    '2': 'II',
    '3': 'III',
    '4': 'IV',
    '5': 'V',
    '6': 'VI',
    '7': 'VII',
    '8': 'VIII',
    '9': 'IX',
    '10': 'X',
    '11': 'XI',
    '12': 'XII',
  };

  const jenisShort = kelas.jenis === 'Ikhwan' ? 'I' : 'A';
  const programShort = programMap[kelas.program];
  
  // For KBTK, keep the tingkat as-is (PG, TKA, TKB)
  if (kelas.program === 'KBTK') {
    return `${programShort} ${kelas.tingkat} ${jenisShort}`;
  }
  
  // For Paket A/B/C, convert tingkat to Roman numerals
  const tingkatRoman = tingkatRomanMap[kelas.tingkat] || kelas.tingkat;
  return `${programShort} ${tingkatRoman} ${jenisShort}`;
}

/**
 * Get grade color based on score
 */
export function getGradeColor(score: number): string {
  if (score >= 91) return 'text-green-600 dark:text-green-400';
  if (score >= 81) return 'text-blue-600 dark:text-blue-400';
  if (score >= 71) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
}

/**
 * Get grade label based on score
 */
export function getGradeLabel(score: number): string {
  if (score >= 91) return 'Sangat Baik';
  if (score >= 81) return 'Baik';
  if (score >= 71) return 'Cukup';
  return 'Kurang';
}

/**
 * Get unique programs from kelas list
 */
export function getUniquePrograms(kelasList: Kelas[]): string[] {
  const programs = new Set(kelasList.map((k) => k.program));
  return Array.from(programs);
}

/**
 * Format kelas name without program prefix (for when program filter is active)
 * Example: When Program = "Paket A", show "IV I" instead of "A IV I"
 */
export function formatKelasWithoutProgram(kelas: Kelas): string {
  const tingkatRomanMap: Record<string, string> = {
    '1': 'I',
    '2': 'II',
    '3': 'III',
    '4': 'IV',
    '5': 'V',
    '6': 'VI',
    '7': 'VII',
    '8': 'VIII',
    '9': 'IX',
    '10': 'X',
    '11': 'XI',
    '12': 'XII',
  };

  const jenisShort = kelas.jenis === 'Ikhwan' ? 'I' : 'A';
  
  // For KBTK, keep the tingkat as-is (PG, TKA, TKB)
  if (kelas.program === 'KBTK') {
    return `${kelas.tingkat} ${jenisShort}`;
  }
  
  // For Paket A/B/C, convert tingkat to Roman numerals
  const tingkatRoman = tingkatRomanMap[kelas.tingkat] || kelas.tingkat;
  return `${tingkatRoman} ${jenisShort}`;
}
