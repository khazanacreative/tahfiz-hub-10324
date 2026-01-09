import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, BookOpen, Target, Award, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileLayoutProps {
  children: ReactNode;
  title?: string;
}

const navItems = [
  { path: "/ustadz", label: "Home", icon: Home },
  { path: "/ustadz/setoran", label: "Setoran", icon: BookOpen },
  { path: "/ustadz/drill", label: "Drill", icon: Target },
  { path: "/ustadz/tasmi", label: "Tasmi'", icon: Award },
  { path: "/ustadz/tahfidz", label: "Ujian", icon: GraduationCap },
];

export default function MobileLayout({ children, title }: MobileLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      {title && (
        <header className="sticky top-0 z-40 bg-primary text-primary-foreground px-4 py-3 shadow-md">
          <h1 className="text-lg font-semibold text-center">{title}</h1>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5 mb-1" />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
