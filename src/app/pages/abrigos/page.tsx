// src/app/abrigos/page.tsx
"use client";

import React from 'react';
import ShelterCard from '../../components/ShelterCard'; // Componente para exibir cada abrigo.

// Define a estrutura de dados para cada abrigo.
interface ShelterInfo {
  id: string;
  name: string;
  imageUrl: string;
  address: string;
  neighborhood: string;
  cityState: string;
  zipCode?: string;
  contactPhone?: string;
  contactEmail?: string;
  capacityStatus: string;
  servicesOffered: string[];
  targetAudience: string;
  operatingHours: string;
  observations?: string;
  googleMapsUrl?: string;
}

// Dados Mock (simulados) dos abrigos. Em produção, viriam da API.
const allSheltersData: ShelterInfo[] = [
  {
    id: 'abrigo1',
    name: 'CAE Mulher Lar Ditoso - Centro de Acolhida Especial Lar Ditoso',
    imageUrl: '/assets/cta3.jpg',
    address: 'R. Jean Lacome, 78',
    neighborhood: 'Jardim Quisisana (Vila Nova Curuca)',
    cityState: 'São Paulo - SP',
    zipCode: '08150-586',
    contactPhone: '(11) 50507735',
    capacityStatus: 'Vagas disponíveis: 15/50',
    servicesOffered: ['Alimentação (3 refeições)', 'Pernoite', 'Kit Higiene', 'Apoio Psicológico'],
    targetAudience: 'Mulheres e crianças',
    operatingHours: '24 horas',
    googleMapsUrl: 'https://maps.google.com/?q=Rua+da+Acolhida+123+Sao+Paulo',
  },
  {
    id: 'abrigo2',
    name: 'Centro de Acolhida Adultos II',
    imageUrl: '/assets/cta2.png',
    address: 'Av. Alcântara Machado, 91',
    neighborhood: 'Brás',
    cityState: 'São Paulo - SP',
    zipCode: '03044-000',
    contactPhone: '(11) 24781983',
    capacityStatus: 'Lotação: 30/30 (Ligar e consultar lista de espera)',
    servicesOffered: ['Pernoite', 'Banho', 'Encaminhamento para serviços sociais'],
    targetAudience: 'População adulta',
    operatingHours: '18:00 - 08:00 (Pernoite)',
    observations: 'Entrada até às 22h.',
    googleMapsUrl: 'https://maps.app.goo.gl/ygBSFLEJF2pEQEwT6',
  },
  {
    id: 'abrigo3',
    name: 'Missão Scalabriniana',
    imageUrl: '/assets/cta4.jpg',
    address: 'R. Teresa Francisca Martin, 201',
    neighborhood: 'Canindé',
    cityState: 'São Paulo - SP',
    zipCode: '03030-040',
    capacityStatus: 'Vagas: 52/100 (Prioridade para mães com crianças)',
    servicesOffered: ['Pernoite', 'Banho', 'Encaminhamento para serviços sociais', 'Acolhimento', 'Kit Higiene', 'Apoio Psicológico'],
    targetAudience: 'Imigrantes e refugiados',
    operatingHours: '24 horas',
    contactEmail: 'servicosocial@miscalim.org.br',
    googleMapsUrl: 'https://maps.app.goo.gl/kGtPKCoaMB8QZYz56',
  },
];

export default function AbrigosPage() {
  // A lista de abrigos a ser exibida é diretamente os dados por enquanto prof.
  const sheltersToDisplay = allSheltersData;

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 md:py-12">
      {/* Seção de título e descrição da página. */}
      <section className="text-center mb-10 md:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--brand-header-bg)]">
          Abrigos e Pontos de Apoio em São Paulo
        </h1>
        <p className="text-lg text-[var(--brand-text-secondary)] mt-4 max-w-2xl mx-auto">
          Quando abrigos temporários para desastres naturais não estiverem disponíveis, preencheremos com centros de acolhimentos convencionais.
        </p>
      </section>

      {/* Renderização da lista de abrigos em formato de grade. */}
      {sheltersToDisplay.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {sheltersToDisplay.map((shelter) => (
            <ShelterCard key={shelter.id} shelter={shelter} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-xl text-[var(--brand-text-secondary)]">
            Nenhum abrigo disponível no momento.
          </p>
        </div>
      )}
    </div>
  );
}