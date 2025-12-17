import type { Metadata } from 'next';
import { TahfidzProvider } from '@/contexts/TahfidzContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <TahfidzProvider>
          {children}
        </TahfidzProvider>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
        title: "Santri Tahfidz Management",
        description: "Manage santri tahfidz with features for memorization tracking, attendance, reports, and evaluations. Supports multi-role login and offers a modern, responsive UI with dark/light modes.",
        other: { "fc:frame": JSON.stringify({"version":"next","imageUrl":"https://placehold.co/600x400","button":{"title":"Open with Ohara","action":{"type":"launch_frame","name":"Santri Tahfidz Management","url":"https://evidence-outside-556.app.ohara.ai","splashImageUrl":"https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/farcaster/splash_images/splash_image1.svg","splashBackgroundColor":"#ffffff"}}}
        ) }
    };
