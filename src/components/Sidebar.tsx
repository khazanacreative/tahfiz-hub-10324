'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTahfidz } from '@/contexts/TahfidzContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useTheme } from 'next-themes';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  School,
  UserCheck,
  ClipboardList,
  Award,
  Megaphone,
  UserCog,
  Activity,
  User,
  LogOut,
  Menu,
  Moon,
  Sun,
  ChevronDown,
  ChevronRight,
  Settings,
  FileText,
  ArrowLeft,
} from 'lucide-react';
import { toast } from 'sonner';

interface MenuItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  roles: string[];
}

interface MenuGroup {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
  items: MenuItem[];
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useTahfidz();
  const { theme, setTheme } = useTheme();
  const { isOpen: isSidebarOpen, toggle: toggleSidebar } = useSidebar();
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [openGroups, setOpenGroups] = useState<{ [key: string]: boolean }>({
    tahfidz: true,
    master: false,
  });

  const handleLogout = (): void => {
    logout();
    toast.success('Logout berhasil');
    router.push('/');
  };

  const toggleTheme = (): void => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleGroup = (groupKey: string): void => {
    setOpenGroups((prev) => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  const menuGroups: MenuGroup[] = [
    {
      label: 'Manajemen Tahfidz',
      icon: BookOpen,
      roles: ['Admin', 'Asatidz'],
      items: [
        {
          href: '/dashboard',
          icon: LayoutDashboard,
          label: 'Dashboard Tahfidz',
          roles: ['Admin', 'Asatidz'],
        },
        {
          href: '/dashboard/setoran',
          icon: BookOpen,
          label: 'Setoran Hafalan',
          roles: ['Admin', 'Asatidz'],
        },
        {
          href: '/dashboard/absensi',
          icon: UserCheck,
          label: 'Absensi Setoran',
          roles: ['Admin', 'Asatidz'],
        },
        {
          href: '/dashboard/laporan',
          icon: ClipboardList,
          label: 'Laporan Hafalan',
          roles: ['Admin', 'Asatidz'],
        },
        {
          href: '/dashboard/ujian-tahapan',
          icon: Award,
          label: 'Tasmi\' Marhalah',
          roles: ['Admin', 'Asatidz'],
        },
        {
          href: '/dashboard/rapor',
          icon: FileText,
          label: 'Rapor Semester',
          roles: ['Admin', 'Asatidz'],
        },
      ],
    },
    {
      label: 'Master Data',
      icon: Settings,
      roles: ['Admin'],
      items: [
        {
          href: '/dashboard/santri',
          icon: Users,
          label: 'Data Santri',
          roles: ['Admin'],
        },
        {
          href: '/dashboard/halaqoh',
          icon: School,
          label: 'Data Halaqoh',
          roles: ['Admin'],
        },
        {
          href: '/dashboard/ustadz',
          icon: User,
          label: 'Data Ustadz / Asatidz',
          roles: ['Admin'],
        },
        {
          href: '/dashboard/users',
          icon: UserCog,
          label: 'Data Akun Pengguna',
          roles: ['Admin'],
        },
        {
          href: '/dashboard/pengumuman',
          icon: Megaphone,
          label: 'Motivasi & Pengumuman',
          roles: ['Admin'],
        },
      ],
    },
    {
      label: 'Portal Santri',
      icon: BookOpen,
      roles: ['WaliSantri'],
      items: [
        {
          href: '/dashboard',
          icon: LayoutDashboard,
          label: 'Dashboard Santri',
          roles: ['WaliSantri'],
        },
        {
          href: '/dashboard/santri-view/setoran',
          icon: BookOpen,
          label: 'Setoran Hafalan',
          roles: ['WaliSantri'],
        },
        {
          href: '/dashboard/santri-view/progress',
          icon: Award,
          label: 'Progress Hafalan',
          roles: ['WaliSantri'],
        },
        {
          href: '/dashboard/santri-view/tasmi-saya',
          icon: Award,
          label: 'Tasmi\' Saya',
          roles: ['WaliSantri'],
        },
        {
          href: '/dashboard/santri-view/rapor-saya',
          icon: FileText,
          label: 'Rapor Saya',
          roles: ['WaliSantri'],
        },
        {
          href: '/dashboard/santri-view/absensi',
          icon: UserCheck,
          label: 'Absensi Tahfidz',
          roles: ['WaliSantri'],
        },
        {
          href: '/dashboard/santri-view/laporan',
          icon: ClipboardList,
          label: 'Laporan & Rekapan',
          roles: ['WaliSantri'],
        },
        {
          href: '/dashboard/santri-view/pengumuman',
          icon: Megaphone,
          label: 'Pengumuman & Motivasi',
          roles: ['WaliSantri'],
        },
      ],
    },
  ];

  const singleMenuItems: MenuItem[] = [
    {
      href: '/dashboard/logs',
      icon: Activity,
      label: 'Log Aktivitas',
      roles: ['Admin'],
    },
  ];

  const getFilteredGroups = (): MenuGroup[] => {
    if (!currentUser) return [];
    return menuGroups
      .filter((group) => group.roles.includes(currentUser.role))
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => item.roles.includes(currentUser.role)),
      }))
      .filter((group) => group.items.length > 0);
  };

  const getFilteredSingleItems = (): MenuItem[] => {
    if (!currentUser) return [];
    return singleMenuItems.filter((item) => item.roles.includes(currentUser.role));
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header - Fixed */}
      <div className="flex-shrink-0">
        <div className="p-6 bg-gradient-to-r from-emerald-600 to-lime-600 relative">
          <div className="flex items-center gap-3 text-white">
            <BookOpen className="h-8 w-8" />
            <div className="flex-1">
              <h2 className="font-bold text-lg">Sistem Tahfidz</h2>
              <p className="text-xs text-emerald-100">Manajemen Hafalan</p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleSidebar}
              className="hidden lg:flex text-white hover:bg-white/20 transition-colors absolute right-4 top-1/2 -translate-y-1/2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="px-4 py-4 bg-emerald-50 dark:bg-emerald-950">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
              {currentUser?.nama_lengkap.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-emerald-900 dark:text-emerald-100 truncate">
                {currentUser?.nama_lengkap}
              </p>
              <Badge variant="secondary" className="text-xs bg-emerald-600 text-white">
                {currentUser?.role}
              </Badge>
            </div>
          </div>
        </div>

        <Separator />
      </div>

      {/* Menu Area - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-3 py-4">
          <nav className="space-y-1">
            {getFilteredGroups().map((group, idx) => {
              const groupKey = group.label.toLowerCase().replace(/\s+/g, '-');
              const isGroupOpen = openGroups[groupKey];
              const hasActiveItem = group.items.some((item) => pathname === item.href);

              return (
                <Collapsible
                  key={groupKey}
                  open={isGroupOpen}
                  onOpenChange={() => toggleGroup(groupKey)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`w-full justify-between hover:bg-emerald-50 dark:hover:bg-emerald-950 ${
                        hasActiveItem ? 'bg-emerald-50 dark:bg-emerald-950' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <group.icon className="h-4 w-4" />
                        <span className="font-semibold text-sm">{group.label}</span>
                      </div>
                      {isGroupOpen ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-4 mt-1 space-y-1">
                    {group.items.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link key={item.href} href={item.href} onClick={() => setIsMobileOpen(false)}>
                          <Button
                            variant={isActive ? 'default' : 'ghost'}
                            size="sm"
                            className={`w-full justify-start gap-3 ${
                              isActive
                                ? 'bg-gradient-to-r from-emerald-600 to-lime-600 text-white hover:from-emerald-700 hover:to-lime-700'
                                : 'hover:bg-emerald-50 dark:hover:bg-emerald-950'
                            }`}
                          >
                            <item.icon className="h-4 w-4" />
                            <span className="text-xs">{item.label}</span>
                          </Button>
                        </Link>
                      );
                    })}
                  </CollapsibleContent>
                </Collapsible>
              );
            })}

            {getFilteredSingleItems().map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} onClick={() => setIsMobileOpen(false)}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    className={`w-full justify-start gap-3 ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-600 to-lime-600 text-white hover:from-emerald-700 hover:to-lime-700'
                        : 'hover:bg-emerald-50 dark:hover:bg-emerald-950'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer - Fixed */}
      <div className="flex-shrink-0">
        <Separator />
        <div className="p-3 space-y-2 bg-white dark:bg-gray-950">
          <Link href="/dashboard/profile">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 hover:bg-emerald-50 dark:hover:bg-emerald-950"
              onClick={() => setIsMobileOpen(false)}
            >
              <User className="h-4 w-4" />
              <span>Profil Saya</span>
            </Button>
          </Link>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 hover:bg-emerald-50 dark:hover:bg-emerald-950"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span>{theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}</span>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex w-64 flex-col border-r bg-white dark:bg-gray-950 fixed left-0 top-0 h-screen z-40 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild className="lg:hidden fixed top-4 left-4 z-50">
          <Button size="icon" variant="outline" className="bg-white dark:bg-gray-950">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
