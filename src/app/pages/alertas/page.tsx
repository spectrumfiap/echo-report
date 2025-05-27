// src/app/alertas/page.tsx
import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = { 
  title: 'Alertas e Avisos - Watch Tower',
  description: 'Veja os últimos alertas e avisos oficiais e da comunidade.',
};

// Dados de exemplo para alertas
const sampleAlerts = [
  { id: 1, title: 'Risco de Alagamento - Centro', severity: 'Alto', source: 'Defesa Civil', time: 'Há 30 minutos', description: 'Chuvas intensas na região central. Evite deslocamentos desnecessários. Pontos de alagamento na Av. Principal.' },
  { id: 2, title: 'Queda de Árvore - Bairro das Flores', severity: 'Médio', source: 'Comunidade', time: 'Há 1 hora', description: 'Árvore caída na Rua das Orquídeas, obstruindo parcialmente a via.' },
  { id: 3, title: 'Ventos Fortes Previstos', severity: 'Baixo', source: 'Meteorologia', time: 'Há 2 horas', description: 'Previsão de rajadas de vento de até 60km/h para as próximas horas. Cuidado com objetos soltos.' },
];

const AlertCard = ({ title, severity, source, time, description }: typeof sampleAlerts[0]) => {
  let bgColor = 'bg-gray-100';
  let textColor = 'text-gray-800';
  let borderColor = 'border-gray-300';

  if (severity === 'Alto') {
    bgColor = 'bg-[var(--alert-red)]/10'; // Usando a cor de alerta com opacidade
    textColor = 'text-[var(--alert-red)]';
    borderColor = 'border-[var(--alert-red)]/50';
  } else if (severity === 'Médio') {
    bgColor = 'bg-[var(--alert-orange)]/10';
    textColor = 'text-[var(--alert-orange)]';
    borderColor = 'border-[var(--alert-orange)]/50';
  } else if (severity === 'Baixo') { // Exemplo para Baixo
    bgColor = 'bg-[var(--alert-yellow)]/10';
    textColor = 'text-[var(--alert-yellow)]';
    borderColor = 'border-[var(--alert-yellow)]/50';
  }

  return (
    <div className={`p-6 rounded-lg shadow-[var(--shadow-subtle)] border-l-4 ${borderColor} ${bgColor}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className={`text-xl font-semibold ${textColor}`}>{title}</h3>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${textColor} ${bgColor.replace('/10', '/20')}`}>{severity}</span>
      </div>
      <p className="text-sm text-[var(--brand-text-secondary)] mb-1"><strong>Fonte:</strong> {source}</p>
      <p className="text-sm text-[var(--brand-text-secondary)] mb-3"><strong>Horário:</strong> {time}</p>
      <p className="text-[var(--brand-text-primary)] text-sm">
        {description}
      </p>
    </div>
  );
};

export default function AlertasPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <section className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--brand-header-bg)]">
          Alertas e Avisos Recentes
        </h1>
        <p className="text-lg text-[var(--brand-text-secondary)] mt-4 max-w-xl mx-auto">
          Mantenha-se informado sobre os últimos acontecimentos e recomendações.
        </p>
      </section>

      <div className="space-y-6">
        {sampleAlerts.length > 0 ? (
          sampleAlerts.map(alert => <AlertCard key={alert.id} {...alert} />)
        ) : (
          <p className="text-center text-[var(--brand-text-secondary)]">Nenhum alerta no momento.</p>
        )}
      </div>
      {/* LembrAr de adicionar paginação ou "carregar mais" se a lista for longa */}
    </div>
  );
}