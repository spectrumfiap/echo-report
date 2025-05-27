// src/app/reportar/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import ReportForm from '../../components/ReportForm';

export const metadata: Metadata = {
  title: 'Reportar Ocorrência - Spectrum Aware',
  description: 'Contribua com a comunidade reportando um evento ou risco na sua área.',
};

export default function ReportarPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 md:py-12"> {/* Ajuste de padding */}
      <section className="text-center mb-10 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--brand-header-bg)]">
          Reportar Ocorrência
        </h1>
        <p className="text-lg text-[var(--brand-text-secondary)] mt-4 max-w-xl mx-auto">
          Sua colaboração é fundamental para a segurança de todos. Descreva o evento ou risco que você observou.
        </p>
      </section>

      <ReportForm /> {/* Renderizando o Client Component aqui */}
    </div>
  );
}