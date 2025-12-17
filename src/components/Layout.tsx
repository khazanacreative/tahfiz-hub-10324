import React, { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTahfidz } from '@/contexts/TahfidzContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LayoutDashboard, BookOpen, Users, UserCheck, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { currentUser, logout } = useTahfidz();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const menuItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/santri', icon: Users, label: 'Data Santri' },
    { href: '/dashboard/absensi', icon: UserCheck, label: 'Absensi' },
  ];

  if (!currentUser) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-card border-r overflow-hidden`}>
        <div className="p-6 bg-gradient-to-r from-emerald-600 to-lime-600">
          <div className="flex items-center gap-3 text-white">
            <BookOpen className="h-8 w-8" />
            <div>
              <h2 className="font-bold">Sistem Tahfidz</h2>
              <p className="text-xs opacity-80">Manajemen Hafalan</p>
            </div>
          </div>
        </div>
        <div className="p-4 border-b">
          <p className="font-semibold text-sm">{currentUser.nama_lengkap}</p>
          <p className="text-xs text-muted-foreground">{currentUser.role}</p>
        </div>
        <ScrollArea className="flex-1 p-3">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <Button
                  variant={location.pathname === item.href ? 'default' : 'ghost'}
                  className="w-full justify-start gap-3"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        </ScrollArea>
        <div className="p-3 border-t">
          <Button variant="ghost" className="w-full justify-start gap-3 text-red-600" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b flex items-center px-4 gap-4">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <h1 className="font-semibold">Tahfidz Management System</h1>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
