import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export default function AuthUstadz() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  useEffect(() => {
    const checkUserRole = async (userId: string) => {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .single();

      if (roles?.role === "asatidz") {
        navigate("/ustadz/dashboard", { replace: true });
      } else if (roles?.role === "wali_santri") {
        navigate("/ustadz/profil", { replace: true }); // Wali santri page
      } else if (roles?.role === "admin") {
        toast.error("Akun admin tidak bisa login di aplikasi mobile");
        await supabase.auth.signOut();
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        checkUserRole(session.user.id);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        checkUserRole(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      loginSchema.parse(loginData);
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) throw error;
      
      toast.success("Berhasil login!");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Email atau password salah");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-400 p-4">
      {/* Mobile App Badge */}
      <div className="flex items-center gap-2 mb-6 text-white/90">
        <Smartphone className="w-5 h-5" />
        <span className="text-sm font-medium">Aplikasi Mobile</span>
      </div>

      <Card className="w-full max-w-sm shadow-2xl border-0">
        <CardHeader className="text-center space-y-4 pb-2">
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">MANTAF-IMIS</CardTitle>
            <CardDescription className="text-sm">Login Ustadz / Wali Santri</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="email@pesantren.id"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
                className="h-12"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 text-base bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600" 
              disabled={loading}
            >
              {loading ? "Memproses..." : "Masuk"}
            </Button>
          </form>

          <div className="mt-6 p-3 bg-muted rounded-lg space-y-2">
            <p className="text-xs text-center text-muted-foreground font-medium">
              Akun Demo:
            </p>
            <div className="text-xs text-center text-muted-foreground space-y-1">
              <p><strong>Ustadz:</strong> ustadz@mantaf.id / ustadz123</p>
              <p><strong>Wali:</strong> wali@mantaf.id / wali123</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="mt-6 text-white/80 text-xs text-center">
        © 2025 MANTAF-IMIS<br />
        Sistem Manajemen Tahfidz IMIS
      </p>
    </div>
  );
}
