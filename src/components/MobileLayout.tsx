import { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, BookOpen, Target, Award, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileLayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: "/ustadz/dashboard", label: "Home", icon: Home },
  { path: "/ustadz/setoran", label: "Setoran", icon: BookOpen },
  { path: "/ustadz/drill", label: "Drill", icon: Target },
  { path: "/ustadz/tasmi", label: "Tasmi'", icon: Award },
  { path: "/ustadz/tahfidz", label: "Ujian", icon: GraduationCap },
];

export function MobileLayout({ children }: MobileLayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 pt-2">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 safe-area-bottom">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive && "text-primary")} />
                <span className={cn(
                  "text-[10px] font-medium",
                  isActive && "text-primary"
                )}>
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
