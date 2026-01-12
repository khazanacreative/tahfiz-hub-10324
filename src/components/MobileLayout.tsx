import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, BookOpen, ClipboardCheck, TrendingUp, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileLayoutProps {
  children: ReactNode;
  title?: string;
  showHeader?: boolean;
}

const navItems = [
  { path: "/ustadz", label: "Home", icon: Home },
  { path: "/ustadz/setoran", label: "Setoran", icon: BookOpen },
  { path: "/ustadz/penilaian", label: "Penilaian", icon: ClipboardCheck },
  { path: "/ustadz/progress", label: "Progress", icon: TrendingUp },
  { path: "/ustadz/profil", label: "Profil", icon: User },
];

export default function MobileLayout({ children, title, showHeader = true }: MobileLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if current path starts with nav item path for active state
  const isNavActive = (path: string) => {
    if (path === "/ustadz") {
      return location.pathname === "/ustadz";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      {showHeader && title && (
        <header className="sticky top-0 z-40 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-3 shadow-md">
          <h1 className="text-lg font-semibold text-center">{title}</h1>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
          {navItems.map((item, index) => {
            const isActive = isNavActive(item.path);
            const isCenter = index === 2; // Penilaian is center

            if (isCenter) {
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="flex flex-col items-center justify-center -mt-6"
                >
                  <div className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all",
                    isActive 
                      ? "bg-gradient-to-br from-emerald-500 to-teal-500" 
                      : "bg-gradient-to-br from-emerald-400 to-teal-400"
                  )}>
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className={cn(
                    "text-[10px] mt-1 font-medium",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}>{item.label}</span>
                </button>
              );
            }

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full transition-all duration-200",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 transition-all",
                  isActive && "text-primary"
                )} />
                <span className={cn(
                  "text-[10px] mt-1 font-medium",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
