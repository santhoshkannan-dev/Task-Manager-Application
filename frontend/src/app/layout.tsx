import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'TaskFlow - Premium Productivity SaaS',
  description: 'A production-grade modern Task Management SaaS powered by Next.js, Express & PostgreSQL',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-brand-100 selection:text-brand-900">
        <AppShell>{children}</AppShell>
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              borderRadius: '14px',
              fontFamily: 'inherit',
            },
          }}
        />
      </body>
    </html>
  );
}

