import React, { ReactNode, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  UserCheck, 
  LogOut, 
  Menu, 
  X,
  FileText,
  Award,
  Activity,
  User,
  Bell,
  ChevronDown,
  Settings,
  Shield
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';

interface LayoutProps {
  children: ReactNode;
}

interface UserProfile {
  id: string;
  nama_lengkap: string;
  username: string;
  email: string;
  role?: string;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/auth');
          return;
        }

        // Get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        // Get user role
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        if (profile) {
          setUser({
            id: profile.id,
            nama_lengkap: profile.nama_lengkap,
            username: profile.username,
            email: profile.email || '',
            role: roleData?.role || 'User'
          });
          setUserRole(roleData?.role || null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Berhasil logout');
    navigate('/auth');
  };

  // Menu items berdasarkan role
  const getMenuItems = () => {
    const baseItems = [
      { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    ];

    const adminItems = [
      { href: '/santri', icon: Users, label: 'Data Santri' },
      { href: '/absensi', icon: UserCheck, label: 'Absensi' },
      { href: '/ujian', icon: Award, label: 'Tasmi\' Marhalah' },
      { href: '/laporan', icon: FileText, label: 'Laporan' },
      { href: '/users', icon: Shield, label: 'Kelola Users' },
      { href: '/logs', icon: Activity, label: 'Log Aktivitas' },
    ];

    const asatidzItems = [
      { href: '/santri', icon: Users, label: 'Data Santri' },
      { href: '/absensi', icon: UserCheck, label: 'Absensi' },
      { href: '/ujian', icon: Award, label: 'Tasmi\' Marhalah' },
      { href: '/laporan', icon: FileText, label: 'Laporan' },
    ];

    const waliItems = [
      { href: '/santri-progress', icon: BookOpen, label: 'Progress Hafalan' },
      { href: '/santri-absensi', icon: UserCheck, label: 'Kehadiran' },
      { href: '/santri-tasmi', icon: Award, label: 'Tasmi\'' },
      { href: '/santri-rapor', icon: FileText, label: 'Rapor' },
      { href: '/santri-pengumuman', icon: Bell, label: 'Pengumuman' },
    ];

    if (userRole === 'Admin') {
      return [...baseItems, ...adminItems];
    } else if (userRole === 'Koordinator') {
      return [...baseItems, ...adminItems];
    } else if (userRole === 'Asatidz') {
      return [...baseItems, ...asatidzItems];
    } else if (userRole === 'WaliSantri') {
      return [...baseItems, ...waliItems];
    }
    
    return baseItems;
  };

  const menuItems = getMenuItems();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-card border-r overflow-hidden flex flex-col`}>
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-primary to-primary/80">
          <div className="flex items-center gap-3 text-primary-foreground">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-bold text-sm">Tahfidz System</h2>
              <p className="text-xs opacity-80">Manajemen Hafalan</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div className="p-4 border-b bg-muted/30">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.nama_lengkap?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{user.nama_lengkap}</p>
                <p className="text-xs text-muted-foreground">{userRole || 'User'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <ScrollArea className="flex-1 p-3">
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link key={item.href} to={item.href}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    className={`w-full justify-start gap-3 ${isActive ? '' : 'hover:bg-muted'}`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="p-3 border-t space-y-1">
          <Link to="/profile">
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Settings className="h-4 w-4" />
              Pengaturan
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10" 
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-14 border-b flex items-center justify-between px-4 bg-card">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h1 className="font-semibold text-foreground hidden sm:block">
              Tahfidz Management System
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {user?.nama_lengkap?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">{user?.nama_lengkap}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="h-4 w-4 mr-2" />
                  Profil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <Settings className="h-4 w-4 mr-2" />
                  Pengaturan
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6 bg-muted/30">
          {children}
        </main>
      </div>
    </div>
  );
}