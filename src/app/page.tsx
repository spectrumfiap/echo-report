// src/app/page.tsx
import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--brand-header-bg)] mb-6"> {/* Usando variável para cor do título */}
          Bem-vindo ao EchoReport!
        </h1>
        <p className="text-lg text-[var(--brand-text-secondary)] mb-8 max-w-2xl mx-auto">
          Sua plataforma colaborativa para monitoramento e alerta de riscos urbanos causados por eventos climáticos extremos. Juntos, construímos um país mais seguro e resiliente.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <Link href="/pages/reportar">
          <button
            type="button"
            className="w-full sm:w-auto bg-green-500 text-[var(--brand-text-header)] font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-opacity-80 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--brand-header-bg)] focus:ring-opacity-50"
          >
            Reportar Ocorrência
          </button>
          </Link>
          <Link href="/pages/alertas">
          <button
            type="button"
            className="w-full sm:w-auto bg-red-500 text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-opacity-80 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--success-green)] focus:ring-opacity-50"
          >
            Ver Alertas Atuais
          </button>
          </Link>
        </div>
      </section>

      <section className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-[var(--brand-card-background)] p-6 rounded-lg shadow-[var(--shadow-subtle)]"> {/* Usando variável para sombra */}
          <h3 className="text-xl font-semibold text-[var(--brand-text-primary)] mb-2">Monitoramento em Tempo Real</h3>
          <p className="text-[var(--brand-text-secondary)]">
            Acompanhe os reportes da comunidade e dados meteorológicos atualizados.
          </p>
        </div>
        <div className="bg-[var(--brand-card-background)] p-6 rounded-lg shadow-[var(--shadow-subtle)]">
          <h3 className="text-xl font-semibold text-[var(--brand-text-primary)] mb-2">Alertas Inteligentes</h3>
          <p className="text-[var(--brand-text-secondary)]">
            Receba notificações sobre riscos potenciais em sua área de interesse.
          </p>
        </div>
        <div className="bg-[var(--brand-card-background)] p-6 rounded-lg shadow-[var(--shadow-subtle)]">
          <h3 className="text-xl font-semibold text-[var(--brand-text-primary)] mb-2">Comunidade Ativa</h3>
          <p className="text-[var(--brand-text-secondary)]">
            Contribua com seus reportes e ajude a manter sua vizinhança segura.
          </p>
        </div>
      </section>
    </div>
    
  );
}