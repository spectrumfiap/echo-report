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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const chatbaseChatbotId = "yJNzeKJmvkX0YlGC8HR__";

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var LDM = localStorage.getItem('darkMode');
                  if (LDM === 'true' || (!LDM && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  // Opcional: console.error("Erro ao aplicar tema inicial:", e);
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${kanit.className} flex flex-col min-h-screen bg-[var(--brand-background-page)] text-[var(--brand-text-primary)] transition-colors duration-300`}
      >
        <AuthProvider>
          <Header />
          <main className="flex flex-col flex-1">
            {children}
          </main>
          <Footer />
        </AuthProvider>

        <Script id="chatbase-config" strategy="lazyOnload">
          {`
            window.chatbaseConfig = {
              chatbotId: "${chatbaseChatbotId}"
            }
          `}
        </Script>
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