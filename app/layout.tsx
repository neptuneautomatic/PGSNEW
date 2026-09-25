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
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('pgs_theme') || 'light';
                  document.documentElement.setAttribute('data-theme', saved);
                  if (saved === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
                  }
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
