'use client';

import React, { useMemo } from 'react';
import { useTahfidz } from '@/contexts/TahfidzContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, TrendingUp, Award, MessageSquare } from 'lucide-react';
import type { Santri, Penilaian, User as UserType } from '@/lib/tahfidz-types';

export default function PenilaianSantriPage(): React.JSX.Element {
  const { data, currentUser } = useTahfidz();

  // Get santri data yang terkait dengan user yang login
  const mySantri = useMemo<Santri | undefined>(() => {
    if (!currentUser) return undefined;
    return data.santri.find((s: Santri) => s.id_wali === currentUser.id);
  }, [data.santri, currentUser]);

  // Get penilaian untuk santri ini saja
  const myPenilaian = useMemo<Penilaian[]>(() => {
    if (!mySantri) return [];
    return data.penilaian
      .filter((p: Penilaian) => p.id_santri === mySantri.id)
      .sort((a: Penilaian, b: Penilaian) => 
        new Date(b.tanggal_penilaian).getTime() - new Date(a.tanggal_penilaian).getTime()
      );
  }, [data.penilaian, mySantri]);

  // Calculate average scores
  const avgScores = useMemo(() => {
    if (myPenilaian.length === 0) return { total: 0, tajwid: 0, makharij: 0, kelancaran: 0 };
    
    const sum = myPenilaian.reduce(
      (acc: { tajwid: number; makharij: number; kelancaran: number }, p: Penilaian) => ({
        tajwid: acc.tajwid + p.tajwid,
        makharij: acc.makharij + p.makharij,
        kelancaran: acc.kelancaran + p.kelancaran,
      }),
      { tajwid: 0, makharij: 0, kelancaran: 0 }
    );

    const count = myPenilaian.length;
    const tajwid = Math.round(sum.tajwid / count);
    const makharij = Math.round(sum.makharij / count);
    const kelancaran = Math.round(sum.kelancaran / count);
    const total = Math.round((tajwid + makharij + kelancaran) / 3);

    return { total, tajwid, makharij, kelancaran };
  }, [myPenilaian]);

  const getStatusBadge = (avgScore: number): React.JSX.Element => {
    if (avgScore >= 90) {
      return <Badge className="bg-green-500">Lulus</Badge>;
    } else if (avgScore >= 75) {
      return <Badge className="bg-yellow-500">Cukup</Badge>;
    } else {
      return <Badge className="bg-red-500">Perlu Diulang</Badge>;
    }
  };

  const getUstadzName = (idAsatidz: string): string => {
    const ustadz = data.users.find((u: UserType) => u.id === idAsatidz);
    return ustadz?.nama_lengkap || '-';
  };

  if (!mySantri) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-green-900">Penilaian Hafalan</h1>
            <p className="text-muted-foreground">Data santri tidak ditemukan</p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Akun Anda belum terhubung dengan data santri. Silakan hubungi admin.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-900">Penilaian Hafalan</h1>
          <p className="text-muted-foreground">Lihat penilaian dari ustadz pembimbing</p>
        </div>
      </div>

      {/* Average Scores */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
          <CardHeader className="pb-3">
            <CardDescription>Rata-rata Total</CardDescription>
            <CardTitle className="text-3xl text-purple-600">{avgScores.total}</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={avgScores.total} className="h-2 [&>div]:bg-purple-500" />
            <p className="mt-2 text-xs text-muted-foreground">Dari {myPenilaian.length} penilaian</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="pb-3">
            <CardDescription>Tajwid</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{avgScores.tajwid}</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={avgScores.tajwid} className="h-2 [&>div]:bg-blue-500" />
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
          <CardHeader className="pb-3">
            <CardDescription>Makharij</CardDescription>
            <CardTitle className="text-3xl text-green-600">{avgScores.makharij}</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={avgScores.makharij} className="h-2 [&>div]:bg-green-500" />
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-white">
          <CardHeader className="pb-3">
            <CardDescription>Kelancaran</CardDescription>
            <CardTitle className="text-3xl text-amber-600">{avgScores.kelancaran}</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={avgScores.kelancaran} className="h-2 [&>div]:bg-amber-500" />
          </CardContent>
        </Card>
      </div>

      {/* Riwayat Penilaian */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Riwayat Penilaian
          </CardTitle>
          <CardDescription>Penilaian dari ustadz pembimbing</CardDescription>
        </CardHeader>
        <CardContent>
          {myPenilaian.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Belum ada penilaian</p>
          ) : (
            <div className="space-y-4">
              {myPenilaian.map((penilaian) => {
                const avgPenilaian = Math.round((penilaian.tajwid + penilaian.makharij + penilaian.kelancaran) / 3);
                
                return (
                  <div
                    key={penilaian.id}
                    className="rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-lime-50 p-5 shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-900">
                            {new Date(penilaian.tanggal_penilaian).toLocaleDateString('id-ID', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Dinilai oleh: <span className="font-medium">{getUstadzName(penilaian.id_asatidz)}</span>
                        </p>
                      </div>
                      {getStatusBadge(avgPenilaian)}
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 mb-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-green-900">Tajwid</span>
                          <span className="text-sm font-bold text-green-700">{penilaian.tajwid}</span>
                        </div>
                        <Progress value={penilaian.tajwid} className="h-2 [&>div]:bg-blue-500" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-green-900">Makharij</span>
                          <span className="text-sm font-bold text-green-700">{penilaian.makharij}</span>
                        </div>
                        <Progress value={penilaian.makharij} className="h-2 [&>div]:bg-green-500" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-green-900">Kelancaran</span>
                          <span className="text-sm font-bold text-green-700">{penilaian.kelancaran}</span>
                        </div>
                        <Progress value={penilaian.kelancaran} className="h-2 [&>div]:bg-amber-500" />
                      </div>
                    </div>

                    {penilaian.catatan && (
                      <div className="rounded-md bg-white/70 p-3 border border-green-200">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-medium text-green-900 mb-1">Catatan Ustadz:</p>
                            <p className="text-sm text-gray-700">{penilaian.catatan}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-3 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-xs text-green-700 font-medium">
                        Nilai Rata-rata: {avgPenilaian}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Keterangan Status */}
      <Card>
        <CardHeader>
          <CardTitle>Keterangan Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500">Lulus</Badge>
              <p className="text-sm text-muted-foreground">Nilai rata-rata ≥ 90</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-yellow-500">Cukup</Badge>
              <p className="text-sm text-muted-foreground">Nilai rata-rata 75-89</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-red-500">Perlu Diulang</Badge>
              <p className="text-sm text-muted-foreground">Nilai rata-rata &lt; 75</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
