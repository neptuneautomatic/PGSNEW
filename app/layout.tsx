import type { Metadata } from 'next';
import './globals.css';
import { PGSProvider } from '@/context/PGSContext';
import { BackgroundProvider } from '@/context/BackgroundContext';
import AppLayout from '@/components/layout/AppLayout';

export const metadata: Metadata = {
  title: 'PGS Rev - Smart Parking Guidance System',
  description: 'Next-generation Parking Guidance, Live Floor Monitoring and LED Signage Control System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.cdnfonts.com" crossOrigin="anonymous" />
        <link href="https://fonts.cdnfonts.com/css/google-sans" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  localStorage.setItem('pgs_theme', 'light');
                  document.documentElement.setAttribute('data-theme', 'light');
                  document.documentElement.classList.remove('dark');
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <PGSProvider>
          <BackgroundProvider>
            <AppLayout>{children}</AppLayout>
          </BackgroundProvider>
        </PGSProvider>
      </body>
    </html>
  );
}
