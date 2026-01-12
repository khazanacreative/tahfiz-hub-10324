import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ClipboardCheck, 
  BookOpen, 
  GraduationCap,
  Award,
  ArrowLeft,
  ChevronRight
} from "lucide-react";

const penilaianOptions = [
  { 
    id: "drill", 
    label: "Drill", 
    description: "Latihan hafalan harian dengan metode drill",
    route: "/ustadz/drill",
    icon: ClipboardCheck,
    color: "from-emerald-400 to-emerald-600"
  },
  { 
    id: "tasmi1", 
    label: "Tasmi' 1 Juz", 
    description: "Ujian tasmi' per 1 juz hafalan",
    route: "/ustadz/tasmi",
    icon: BookOpen,
    color: "from-teal-400 to-teal-600"
  },
  { 
    id: "tasmi5", 
    label: "Tasmi' 5 Juz", 
    description: "Ujian tasmi' per 5 juz hafalan",
    route: "/ustadz/tasmi",
    icon: GraduationCap,
    color: "from-cyan-400 to-cyan-600"
  },
  { 
    id: "ujian", 
    label: "Ujian Tahfidz", 
    description: "Ujian tahfidz lengkap 30 juz",
    route: "/ustadz/tahfidz",
    icon: Award,
    color: "from-amber-400 to-amber-600"
  },
];

export default function PenilaianMobile() {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-400 to-amber-400">
        <div className="px-4 pt-4 pb-14">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>

            <div>
              <h1 className="text-xl font-bold text-white">Penilaian</h1>
              <p className="text-sm text-white/80">Pilih jenis penilaian</p>
            </div>
          </div>
        </div>
      </div>

        {/* Content */}
        <div className="bg-background rounded-t-3xl min-h-[calc(100vh-120px)] px-4 pt-6 pb-24">
          <div className="space-y-4">
            <h2 className="font-semibold text-foreground">Jenis Penilaian</h2>
            
            {penilaianOptions.map((option) => (
              <Card 
                key={option.id}
                className="border border-border/50 shadow-sm cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
                onClick={() => navigate(option.route)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center shadow-md`}>
                      <option.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{option.label}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">{option.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="mt-8">
            <h2 className="font-semibold text-foreground mb-4">Statistik Penilaian</h2>
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-emerald-700">24</p>
                  <p className="text-xs text-emerald-600 mt-1">Penilaian Minggu Ini</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-amber-700">8</p>
                  <p className="text-xs text-amber-600 mt-1">Menunggu Penilaian</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
