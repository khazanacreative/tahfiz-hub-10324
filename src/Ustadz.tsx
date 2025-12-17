'use client';

import { useState, useMemo } from 'react';
import { useTahfidz } from '@/contexts/TahfidzContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { School, Users } from 'lucide-react';
import TablePagination from '@/components/tahfidz/TablePagination';

export default function UstadzPage() {
  const { data } = useTahfidz();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  
  const asatidzList = data.users.filter((u) => u.role === 'Asatidz');
  
  const totalPages = Math.ceil(asatidzList.length / itemsPerPage);
  const paginatedAsatidz = asatidzList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">Data Ustadz</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Daftar asatidz pembimbing tahfidz</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedAsatidz.map((ustadz) => {
          const halaqohBinaan = data.halaqoh.filter((h) => h.id_asatidz === ustadz.id);
          const santriTotal = data.santri.filter((s) => 
            halaqohBinaan.some((h) => h.id === s.id_halaqoh) && s.status === 'Aktif'
          ).length;

          return (
            <Card key={ustadz.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-r from-emerald-500 to-lime-500 text-white rounded-t-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{ustadz.nama_lengkap}</CardTitle>
                    <p className="text-sm text-emerald-100 mt-1">{ustadz.email}</p>
                  </div>
                  <Badge variant={ustadz.aktif ? 'default' : 'secondary'} className="bg-white text-emerald-700">
                    {ustadz.aktif ? 'Aktif' : 'Nonaktif'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <span className="text-sm">📞</span>
                    <span className="text-sm">{ustadz.no_hp}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <School className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm">{halaqohBinaan.length} Halaqoh</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Users className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm">{santriTotal} Santri</span>
                  </div>

                  {halaqohBinaan.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                        Halaqoh Binaan:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {halaqohBinaan.map((h) => (
                          <Badge key={h.id} variant="outline" className="text-xs">
                            {h.nama_halaqoh}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {paginatedAsatidz.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            Belum ada data ustadz
          </div>
        )}
      </div>

      {asatidzList.length > itemsPerPage && (
        <div className="mt-6">
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={asatidzList.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}
    </div>
  );
}
