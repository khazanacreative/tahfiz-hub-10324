import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { 
  User, 
  LogOut, 
  BookOpen,
  Target,
  Award,
  GraduationCap,
  ChevronRight,
  Moon,
  Sun
} from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "next-themes";

interface UserProfile {
  email: string;
  namaLengkap: string;
  username: string;
}

export default function ProfilMobile() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock stats
  const stats = {
    setoran: 45,
    drill: 28,
    tasmi: 12,
    tahfidz: 8,
  };

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setProfile({
            email: user.email || "",
            namaLengkap: user.user_metadata?.nama_lengkap || "Ustadz",
            username: user.user_metadata?.username || user.email?.split("@")[0] || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Berhasil logout");
      navigate("/ustadz/login");
    } catch (error) {
      toast.error("Gagal logout");
    }
  };

  return (
    <MobileLayout>
      <div className="p-4 space-y-4">
        {/* Profile Card */}
        <Card className="bg-gradient-to-br from-green-500 to-lime-500 border-0 text-white">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-white/30">
                <AvatarImage src="" />
                <AvatarFallback className="bg-white/20 text-white text-xl">
                  {profile?.namaLengkap?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-bold">
                  {loading ? "Loading..." : profile?.namaLengkap || "Ustadz"}
                </h2>
                <p className="text-sm text-white/80">{profile?.email}</p>
                <Badge className="mt-1 bg-white/20 hover:bg-white/30">
                  Ustadz Pengampu
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.setoran}</p>
                <p className="text-xs text-muted-foreground">Setoran</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.drill}</p>
                <p className="text-xs text-muted-foreground">Drill</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Award className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.tasmi}</p>
                <p className="text-xs text-muted-foreground">Tasmi'</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.tahfidz}</p>
                <p className="text-xs text-muted-foreground">Tahfidz</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings */}
        <Card>
          <CardContent className="p-0">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {theme === "dark" ? (
                  <Moon className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Sun className="w-5 h-5 text-muted-foreground" />
                )}
                <span className="font-medium">Mode Tampilan</span>
              </div>
              <Badge variant="outline">
                {theme === "dark" ? "Gelap" : "Terang"}
              </Badge>
            </button>
            
            <Separator />
            
            <button
              className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">Edit Profil</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </CardContent>
        </Card>

        {/* Logout */}
        <Button
          variant="destructive"
          className="w-full h-12"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Keluar
        </Button>

        {/* App Info */}
        <div className="text-center pt-4">
          <p className="text-xs text-muted-foreground">
            MANTAF-IMIS Mobile v1.0
          </p>
          <p className="text-xs text-muted-foreground">
            © 2025 Sistem Manajemen Tahfidz IMIS
          </p>
        </div>
      </div>
    </MobileLayout>
  );
}
