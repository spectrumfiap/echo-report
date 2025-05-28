// src/app/layout.tsx
import type { Metadata } from 'next';
import { Kanit } from 'next/font/google';
import './styles/globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider } from './contexts/AuthContext';

const kanit = Kanit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: 'EchoReport - Monitoramento e Alerta Urbano',
  description: 'Plataforma colaborativa para monitoramento e alerta de riscos urbanos.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body
        className={`${kanit.className} flex flex-col min-h-screen bg-[var(--brand-background-page)] text-[var(--brand-text-primary)]`}
      >
        <AuthProvider>
          <Header />
          <main className="flex flex-col flex-1">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}