'use client';

import { Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { ManzilTahfidz, StatusManzil } from '@/lib/tahfidz-types';
import { formatManzilShort, getManzilNumber } from '@/lib/ujian-helper';

interface ManzilInfo {
  manzil: ManzilTahfidz;
  status: StatusManzil;
  kelancaran?: number;
}

interface ProgressTahapanProps {
  manzilData: ManzilInfo[];
}

export default function ProgressTahapan({ manzilData }: ProgressTahapanProps) {
  const allManzil: ManzilTahfidz[] = [
    'Manzil1_3to5Baris',
    'Manzil2_PerHalaman',
    'Manzil3_Per5Halaman',
    'Manzil4_PerSetengahJuz',
    'Manzil5_PerJuz',
  ];

  const getManzilInfo = (manzil: ManzilTahfidz): ManzilInfo => {
    const found = manzilData.find((m) => m.manzil === manzil);
    return found || { manzil, status: 'Belum Dimulai' };
  };

  const getManzilSelesai = (): number => {
    return manzilData.filter((m) => m.status === 'Lulus').length;
  };

  const progressPercentage = (getManzilSelesai() / 5) * 100;

  return (
    <div className="relative py-8">
      {/* Progress Line */}
      <div className="absolute top-12 left-0 right-0 h-2 bg-gray-200 dark:bg-gray-800 rounded-full mx-8">
        <div
          className="h-full bg-gradient-to-r from-emerald-600 to-lime-600 rounded-full transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Steps */}
      <div className="relative flex justify-between px-4">
        {allManzil.map((manzil) => {
          const info = getManzilInfo(manzil);
          const isLulus = info.status === 'Lulus';
          const isProses = info.status === 'Sedang Proses';
          const isTidakLulus = info.status === 'Tidak Lulus';

          return (
            <div key={manzil} className="flex flex-col items-center" style={{ flex: 1 }}>
              {/* Circle */}
              <div
                className={`
                  w-16 h-16 rounded-full border-4 flex items-center justify-center font-bold text-lg
                  transition-all duration-300 z-10
                  ${
                    isLulus
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg'
                      : isProses
                      ? 'bg-yellow-500 border-yellow-500 text-white shadow-md'
                      : isTidakLulus
                      ? 'bg-red-500 border-red-500 text-white shadow-md'
                      : 'bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-700 text-gray-400'
                  }
                `}
              >
                {isLulus ? <Check className="h-8 w-8" /> : getManzilNumber(manzil)}
              </div>

              {/* Label */}
              <div className="mt-3 text-center max-w-[120px]">
                <p
                  className={`
                    font-semibold text-sm mb-1
                    ${
                      isLulus
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : isProses
                        ? 'text-yellow-700 dark:text-yellow-400'
                        : isTidakLulus
                        ? 'text-red-700 dark:text-red-400'
                        : 'text-gray-500'
                    }
                  `}
                >
                  Manzil {getManzilNumber(manzil)}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {formatManzilShort(manzil)}
                </p>

                {/* Status Badge */}
                {isLulus && (
                  <Badge variant="default" className="bg-emerald-600 text-xs">
                    {info.kelancaran ? `${info.kelancaran}/100` : 'Lulus'}
                  </Badge>
                )}
                {isProses && (
                  <Badge variant="secondary" className="bg-yellow-500 text-white text-xs">
                    Sedang Proses
                  </Badge>
                )}
                {isTidakLulus && (
                  <Badge variant="destructive" className="text-xs">
                    Tidak Lulus
                  </Badge>
                )}
                {!isLulus && !isProses && !isTidakLulus && (
                  <Badge variant="outline" className="text-xs">
                    Belum Dimulai
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}