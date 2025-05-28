// src/app/layout.tsx
import type { Metadata } from 'next';
import { Kanit } from 'next/font/google';
import Script from 'next/script';
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
  const chatbaseChatbotId = "yJNzeKJmvkX0YlGC8HR__";

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

        {/* Script de configuração do Chatbase */}
        <Script id="chatbase-config" strategy="lazyOnload">
          {`
            window.chatbaseConfig = {
              chatbotId: "${chatbaseChatbotId}"
            }
          `}
        </Script>
        {/* Script principal de carregamento do Chatbase */}
        <Script 
          src="https://www.chatbase.co/embed.min.js" 
          id={chatbaseChatbotId} 
          strategy="lazyOnload"
          defer
        />
      </body>
    </html>
  );
}