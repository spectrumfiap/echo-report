// src/app/mapa/page.tsx
"use client"; // Define este componente como um Client Component para uso de hooks.

import React, { useState, useMemo } from 'react';
import MapDisplay from '../../components/MapDisplay'; // Componente que renderiza o mapa.

// Define a estrutura de dados para cada área de risco.
interface RiskArea {
  id: string;
  center: google.maps.LatLngLiteral;
  radius: number;
  riskLevel: 'alto' | 'medio' | 'baixo';
  title: string;
  description: string;
  reason?: string;
  lastUpdated?: string;
}

// Dados mock para as áreas de risco. Em um cenário real, viriam de uma API.
const allMockRiskAreas: RiskArea[] = [
  { 
    id: 'risk1', 
    center: { lat: -23.55, lng: -46.63 }, 
    radius: 1000, 
    riskLevel: 'alto' as const,
    title: 'Alagamento Crítico - Centro Histórico',
    description: 'Múltiplas ruas na região central, incluindo Rua Direita e arredores, apresentam pontos de alagamento intransitáveis devido à forte chuva contínua.',
    reason: 'Chuva Intensa e Bueiros Obstruídos',
    lastUpdated: 'Há 15 minutos'
  },
  { 
    id: 'risk2', 
    center: { lat: -23.56, lng: -46.65 }, 
    radius: 700, 
    riskLevel: 'medio' as const,
    title: 'Queda de Árvore - Av. Paulista',
    description: 'Uma árvore de grande porte caiu próximo ao MASP, bloqueando uma faixa da Av. Paulista sentido Consolação. Trânsito lento.',
    reason: 'Ventos Fortes',
    lastUpdated: 'Há 45 minutos'
  },
  { 
    id: 'risk3', 
    center: { lat: -23.545, lng: -46.60 }, 
    radius: 1500, 
    riskLevel: 'alto' as const,
    title: 'Risco de Deslizamento - Morro da Lua',
    description: 'Defesa Civil emitiu alerta máximo para risco de deslizamento no Morro da Lua devido à saturação do solo. Evacuação de áreas de encosta recomendada.',
    reason: 'Saturação do Solo por Chuva Persistente',
    lastUpdated: 'Há 2 horas'
  },
  { 
    id: 'risk4', 
    center: { lat: -23.57, lng: -46.62 }, 
    radius: 500, 
    riskLevel: 'medio' as const,
    title: 'Falta de Energia - Vila Mariana',
    description: 'Diversas ruas na Vila Mariana estão sem energia elétrica. Equipes da concessionária estão a caminho.',
    lastUpdated: 'Há 1 hora'
  },
  { 
    id: 'risk5', 
    center: { lat: -23.555, lng: -46.635 }, 
    radius: 300, 
    riskLevel: 'baixo' as const,
    title: 'Trânsito Lento - Marginal Tietê',
    description: 'Trânsito lento na Marginal Tietê sentido Ayrton Senna devido a obras na pista.',
    reason: 'Obras na Via',
    lastUpdated: 'Atualizado agora'
  },
];

// Coordenadas para o centro inicial do mapa.
const saoPauloCenter = {
  lat: -23.55052,
  lng: -46.633308
};

// Cores para a legenda (usadas no JSX abaixo).
const riskColorsForLegend = {
  alto: { fillColor: 'var(--alert-red)' },
  medio: { fillColor: 'var(--alert-yellow)' },
  baixo: { fillColor: '#00FF00' } 
};

export default function MapaPage() {
  // Chave da API do Google Maps vinda de variáveis de ambiente.
  const Maps_API_KEY = process.env.NEXT_PUBLIC_Maps_API_KEY;

  // Estado para controlar o filtro de nível de risco selecionado.
  const [filterRiskLevel, setFilterRiskLevel] = useState<'all' | 'alto' | 'medio' | 'baixo'>('all');

  // Memoiza a lista de áreas de risco filtradas para otimizar re-renderizações.
  // A lista é atualizada apenas quando 'filterRiskLevel' muda.
  const filteredRiskAreas = useMemo(() => {
    if (filterRiskLevel === 'all') {
      return allMockRiskAreas;
    }
    return allMockRiskAreas.filter(area => area.riskLevel === filterRiskLevel);
  }, [filterRiskLevel]);

  // Renderiza uma mensagem de erro se a chave da API não estiver configurada.
  if (!Maps_API_KEY) {
    return (
      <div className="container mx-auto px-6 py-12">
        <section className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--brand-header-bg)]">
            Mapa Interativo de Riscos
          </h1>
        </section>
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md" role="alert">
          <p className="font-bold">CONFIGURAÇÃO NECESSÁRIA</p>
          <p>A chave da API do Google Maps não está configurada corretamente.</p>
          <p className="mt-2 text-sm">Por favor, verifique se a variável de ambiente <code>NEXT_PUBLIC_Maps_API_KEY</code> está definida no seu arquivo <code>.env.local</code> e se o servidor de desenvolvimento foi reiniciado.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Seção de título e introdução da página do mapa. */}
      <section className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--brand-header-bg)]">
          Mapa Interativo de Riscos
        </h1>
        <p className="text-lg text-[var(--brand-text-secondary)] mt-4 max-w-2xl mx-auto">
          Acompanhe os eventos reportados pela comunidade e alertas oficiais diretamente no mapa.
        </p>
        <p className="text-sm text-[var(--brand-text-secondary)] mt-2 max-w-2xl mx-auto">
          Clique nos círculos para mais informações sobre cada área de risco.
        </p>
      </section>

      {/* Seção principal onde o componente do mapa é renderizado. */}
      <section>
        <MapDisplay 
          apiKey={Maps_API_KEY} 
          initialCenter={saoPauloCenter}
          riskAreasData={filteredRiskAreas} // Passa os dados já filtrados para o componente do mapa.
        />
      </section>

      {/* Seção para Legenda e Controles de Filtro do mapa. */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-[var(--brand-text-primary)] mb-6 text-center">Legenda e Filtros</h2>
        <div className="grid md:grid-cols-2 gap-8">
            {/* Card da Legenda */}
            <div className="bg-[var(--brand-card-background)] p-6 rounded-lg shadow-[var(--shadow-subtle)]">
                <h3 className="text-xl font-medium text-[var(--brand-text-primary)] mb-3">Legenda</h3>
                <ul className="space-y-2 text-[var(--brand-text-secondary)]">
                    <li><span style={{ backgroundColor: 'var(--alert-red)', opacity: 0.7 }} className="inline-block w-4 h-4 rounded-full border border-black/20 mr-2 align-middle"></span> <span className="align-middle">Risco Alto</span></li>
                    <li><span style={{ backgroundColor: 'var(--alert-yellow)', opacity: 0.7 }} className="inline-block w-4 h-4 rounded-full border border-black/20 mr-2 align-middle"></span> <span className="align-middle">Risco Médio</span></li>
                    <li><span style={{ backgroundColor: riskColorsForLegend.baixo.fillColor, opacity: 0.7 }} className="inline-block w-4 h-4 rounded-full border border-black/20 mr-2 align-middle"></span> <span className="align-middle">Risco Baixo</span></li>
                </ul>
            </div>

            {/* Card dos Filtros */}
            <div className="bg-[var(--brand-card-background)] p-6 rounded-lg shadow-[var(--shadow-subtle)]">
                <h3 className="text-xl font-medium text-[var(--brand-text-primary)] mb-4">Filtros</h3>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="filter-risk-level" className="block text-sm font-medium text-[var(--brand-text-secondary)] mb-1">
                            Nível de Risco:
                        </label>
                        <select
                            id="filter-risk-level"
                            value={filterRiskLevel}
                            onChange={(e) => setFilterRiskLevel(e.target.value as typeof filterRiskLevel)} // Atualiza o estado do filtro.
                            className="block w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[var(--brand-header-bg)] focus:border-transparent outline-none bg-white text-[var(--brand-text-primary)]"
                        >
                            <option value="all">Todos</option>
                            <option value="alto">Alto</option>
                            <option value="medio">Médio</option>
                            <option value="baixo">Baixo</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}