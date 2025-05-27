// src/app/mapa/page.tsx
import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mapa Interativo - Spectrum Aware',
  description: 'Visualize alertas e ocorrências em tempo real no mapa interativo.',
};

export default function MapaPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <section className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--brand-header-bg)]">
          Mapa Interativo de Riscos
        </h1>
        <p className="text-lg text-[var(--brand-text-secondary)] mt-4 max-w-2xl mx-auto">
          Acompanhe os eventos reportados pela comunidade e alertas oficiais diretamente no mapa.
        </p>
      </section>

      <section>
        {/* Placeholder para o componente do Mapa Interativo, vou implementar API DO MAPS depois */}
        <div className="bg-[var(--brand-card-background)] p-8 rounded-lg shadow-[var(--shadow-subtle)] min-h-[500px] flex items-center justify-center">
          <p className="text-2xl text-[var(--brand-text-secondary)]">
            [Componente do Mapa Interativo será carregado aqui]
          </p>
          {/* biblioteca de mapa Google Maps aqui */}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-[var(--brand-text-primary)] mb-6 text-center">Legenda e Filtros</h2>
        <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[var(--brand-card-background)] p-6 rounded-lg shadow-[var(--shadow-subtle)]">
                <h3 className="text-xl font-medium text-[var(--brand-text-primary)] mb-3">Legenda</h3>
                {/* Adicionar itens da legenda aqui */}
                <ul className="space-y-2 text-[var(--brand-text-secondary)]">
                    <li><span className="inline-block w-4 h-4 rounded-full bg-[var(--alert-red)] mr-2"></span> Alerta Crítico</li>
                    <li><span className="inline-block w-4 h-4 rounded-full bg-[var(--alert-orange)] mr-2"></span> Alerta Alto</li>
                    <li><span className="inline-block w-4 h-4 rounded-full bg-[var(--alert-yellow)] mr-2"></span> Aviso Médio</li>
                </ul>
            </div>
            <div className="bg-[var(--brand-card-background)] p-6 rounded-lg shadow-[var(--shadow-subtle)]">
                <h3 className="text-xl font-medium text-[var(--brand-text-primary)] mb-3">Filtros</h3>
                {/* Adicionar opções de filtro aqui */}
                <p className="text-[var(--brand-text-secondary)]">Filtros por tipo de evento, data, etc. (a serem implementados).</p>
            </div>
        </div>
      </section>
    </div>
  );
}