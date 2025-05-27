// src/app/perfil/page.tsx
import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Meu Perfil - Spectrum Aware',
  description: 'Gerencie suas informações de perfil e preferências de alerta.',
};

export default function PerfilPage() {
  // Dados de exemplo do usuário - isso vai vir do sistema de autenticação/banco de dados
  const user = {
    name: 'Usuário Exemplo',
    email: 'usuario@exemplo.com',
    locationPreference: 'Bairro das Palmeiras, Cidade Exemplo',
    alertTypes: ['Alagamentos', 'Ventos Fortes'],
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <section className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--brand-header-bg)]">
          Meu Perfil
        </h1>
        <p className="text-lg text-[var(--brand-text-secondary)] mt-4 max-w-xl mx-auto">
          Gerencie suas informações e preferências da plataforma Spectrum Aware.
        </p>
      </section>

      <div className="max-w-2xl mx-auto bg-[var(--brand-card-background)] p-8 rounded-lg shadow-[var(--shadow-subtle)] space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-[var(--brand-text-primary)] mb-1">Informações Pessoais</h2>
          <p className="text-[var(--brand-text-secondary)]"><span className="font-medium">Nome:</span> {user.name}</p>
          <p className="text-[var(--brand-text-secondary)]"><span className="font-medium">Email:</span> {user.email}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[var(--brand-text-primary)] mb-1">Preferências de Localização</h2>
          <p className="text-[var(--brand-text-secondary)]">{user.locationPreference || 'Nenhuma localização principal definida.'}</p>
          <button className="mt-2 text-sm text-[var(--brand-header-bg)] hover:underline">Editar Localização</button>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-[var(--brand-text-primary)] mb-1">Tipos de Alerta Ativados</h2>
          {user.alertTypes.length > 0 ? (
            <ul className="list-disc list-inside text-[var(--brand-text-secondary)]">
              {user.alertTypes.map(type => <li key={type}>{type}</li>)}
            </ul>
          ) : (
            <p className="text-[var(--brand-text-secondary)]">Nenhum tipo de alerta específico selecionado.</p>
          )}
          <button className="mt-2 text-sm text-[var(--brand-header-bg)] hover:underline">Gerenciar Alertas</button>
        </div>

        <div className="pt-6 border-t border-gray-200">
             <button 
                type="button" 
                className="w-full bg-[var(--alert-red)] text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-opacity-80 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--alert-red)] focus:ring-opacity-50"
              >
                Sair (Logout)
              </button>
        </div>
      </div>
    </div>
  );
}