import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, BookOpen, Award, TrendingUp, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileLayoutProps {
  children: ReactNode;
  title?: string;
  showHeader?: boolean;
}

const navItems = [
  { path: "/ustadz", label: "Home", icon: Home },
  { path: "/ustadz/setoran", label: "Setoran", icon: BookOpen },
  { path: "/ustadz/penilaian", label: "Penilaian", icon: Award },
  { path: "/ustadz/progress", label: "Progress", icon: TrendingUp },
  { path: "/ustadz/profil", label: "Profil", icon: User },
];

export default function MobileLayout({ children, title, showHeader = true }: MobileLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

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
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 shadow-lg">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
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
                <div className={cn(
                  "p-1.5 rounded-xl transition-all duration-200",
                  isActive && "bg-primary/10"
                )}>
                  <item.icon className={cn(
                    "h-5 w-5 transition-all",
                    isActive && "scale-110"
                  )} />
                </div>
                <span className={cn(
                  "text-[10px] mt-0.5 font-medium",
                  isActive && "text-primary"
                )}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
