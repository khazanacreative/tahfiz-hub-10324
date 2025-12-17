'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTahfidz } from '@/contexts/TahfidzContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { login, currentUser, isLoading } = useTahfidz();
  const router = useRouter();

  // Redirect if already logged in - optimized check
  useEffect(() => {
    if (!isLoading && currentUser) {
      router.replace('/dashboard'); // Use replace instead of push for better performance
    }
  }, [currentUser, isLoading, router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      toast.error('Username dan password harus diisi');
      return;
    }

    try {
      const success = login(username.trim(), password);
      
      if (success) {
        toast.success('Login berhasil!');
        // Immediate redirect without delay for better UX
        router.replace('/dashboard');
      } else {
        toast.error('Username atau password salah');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Terjadi kesalahan saat login');
    }
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lime-50 via-emerald-50 to-green-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-emerald-700">Memuat...</p>
        </div>
      </div>
    );
  }

  // Don't show login form if already authenticated
  if (currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 via-emerald-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-16 w-16 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-emerald-900 mb-2">Sistem Tahfidz</h1>
          <p className="text-emerald-700">Manajemen Hafalan Al-Quran</p>
        </div>

        <Card className="shadow-xl border-emerald-200">
          <CardHeader className="space-y-1 bg-gradient-to-r from-emerald-500 to-lime-500 text-white rounded-t-lg">
            <CardTitle className="text-2xl text-center">Login</CardTitle>
            <CardDescription className="text-center text-emerald-50">
              Silakan masuk dengan akun Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-emerald-900">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                  className="border-emerald-200 focus:border-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-emerald-900">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  className="border-emerald-200 focus:border-emerald-500"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-lime-600 hover:from-emerald-700 hover:to-lime-700 text-white font-semibold"
              >
                Masuk
              </Button>
            </form>

            <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200 max-h-96 overflow-y-auto">
              <p className="text-sm font-semibold text-emerald-900 mb-3">Demo Akun:</p>
              <div className="space-y-3 text-xs text-emerald-700">
                <div>
                  <p className="font-semibold text-emerald-900">👤 Admin:</p>
                  <p className="ml-3 mt-1">• <span className="font-mono">admin / admin123</span></p>
                </div>
                
                <div>
                  <p className="font-semibold text-emerald-900">👨‍🏫 Ustadz/Asatidz:</p>
                  <p className="ml-3 mt-1">• <span className="font-mono">ahmad / ahmad123</span></p>
                  <p className="ml-3">• <span className="font-mono">budi / budi123</span></p>
                  <p className="ml-3">• <span className="font-mono">yusuf / yusuf123</span></p>
                </div>
                
                <div>
                  <p className="font-semibold text-emerald-900">👨‍👩‍👦 Wali Santri:</p>
                  <p className="ml-3 mt-1">• <span className="font-mono">faiz / faiz123</span> <span className="text-xs text-emerald-600">(M. Faiz)</span></p>
                  <p className="ml-3">• <span className="font-mono">rizky / rizky123</span> <span className="text-xs text-emerald-600">(A. Rizky)</span></p>
                  <p className="ml-3">• <span className="font-mono">fatimah / fatimah123</span> <span className="text-xs text-emerald-600">(F. Zahra)</span></p>
                  <p className="ml-3">• <span className="font-mono">ali / ali123</span> <span className="text-xs text-emerald-600">(Ali Akbar)</span></p>
                  <p className="ml-3">• <span className="font-mono">aisyah / aisyah123</span> <span className="text-xs text-emerald-600">(A. Nur)</span></p>
                  <p className="ml-3">• <span className="font-mono">umar / umar123</span> <span className="text-xs text-emerald-600">(U. Faruq)</span></p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-emerald-700">
            &quot;Bacalah Al-Quran, karena ia akan datang sebagai pemberi syafaat&quot;
          </p>
          <p className="text-xs text-emerald-600 mt-1">(HR. Muslim)</p>
        </div>
      </div>
    </div>
  );
}
