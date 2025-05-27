// src/app/layout.tsx
import type { Metadata } from 'next';
import { Kanit } from 'next/font/google';
import './styles/globals.css'; 
import Header from './components/Header';
import Footer from './components/Footer';

const kanit = Kanit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: 'Watch Tower - Monitoramento e Alerta Urbano',
  description: 'Plataforma colaborativa para monitoramento e alerta de riscos urbanos.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      {/* As classes de fundo e texto do body são aplicadas via CSS em globals.css */}
      <body className={`${kanit.className} flex flex-col min-h-screen`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}