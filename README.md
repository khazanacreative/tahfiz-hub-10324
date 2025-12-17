# Sistem Tahfidz - Manajemen Hafalan Al-Quran

Aplikasi web untuk mengelola hafalan Al-Quran dengan fitur lengkap untuk santri, ustadz, dan admin.

## 🚀 Fitur Utama

- **Manajemen Santri**: Tambah, edit, hapus data santri
- **Setoran Hafalan**: Rekam dan lacak progress hafalan
- **Absensi**: Monitoring kehadiran setoran
- **Penilaian**: Evaluasi dan penilaian hafalan
- **Laporan**: Generate laporan progress dan statistik
- **Multi-role**: Support untuk Admin, Ustadz, dan Santri
- **Responsive UI**: Interface modern dengan dark/light mode

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Context
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod

## 📦 Instalasi

1. Clone repository:
```bash
git clone <repository-url>
cd sistem-tahfidz-ohara
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables:
```bash
cp .env.example .env.local
```

4. Jalankan development server:
```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

## 🔐 Demo Akun

- **Admin**: `admin` / `admin123`
- **Ustadz**: `ahmad` / `ahmad123`
- **Santri**: `faiz` / `faiz123`

## 📱 Penggunaan

1. Buka aplikasi di browser
2. Login dengan salah satu akun demo
3. Explore fitur sesuai role Anda

## 🏗️ Struktur Project

```
src/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Halaman dashboard
│   ├── api/              # API routes
│   └── layout.tsx        # Root layout
├── components/           # Reusable components
│   ├── ui/              # shadcn/ui components
│   └── tahfidz/         # App-specific components
├── contexts/            # React contexts
├── hooks/               # Custom hooks
├── lib/                 # Utilities & types
└── services/            # Business logic services
```

## 🚀 Build & Deploy

```bash
# Build untuk production
npm run build

# Jalankan production server
npm start
```

## 📋 Requirements

- Node.js 18+
- npm atau yarn

## 🤝 Contributing

1. Fork repository
2. Buat branch fitur baru
3. Commit perubahan
4. Push ke branch
5. Buat Pull Request

## 📄 License

MIT License - lihat file LICENSE untuk detail.