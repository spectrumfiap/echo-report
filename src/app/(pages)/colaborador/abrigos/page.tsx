// src/app/colaborador/abrigos/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusCircleIcon, PencilSquareIcon, TrashIcon, EyeIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface ShelterManagementData {
  id: string;
  name: string;
  address: string;
  neighborhood: string;
  capacity: string; // Ex: "50 vagas / 30 ocupadas"
  status: 'aberto' | 'fechado' | 'lotado' | 'manutencao';
  lastUpdate: string;
}

const mockShelters: ShelterManagementData[] = [
  { id: 'shltr_1', name: 'Abrigo Central Esperança', address: 'Rua da Acolhida, 123', neighborhood: 'Centro', capacity: '50 vagas / 30 ocupadas', status: 'aberto', lastUpdate: '2024-05-28 10:00'},
  { id: 'shltr_2', name: 'Casa de Apoio Florescer', address: 'Av. Flores, 789', neighborhood: 'Zona Leste', capacity: '100 vagas / 95 ocupadas', status: 'lotado', lastUpdate: '2024-05-28 08:30'},
  { id: 'shltr_3', name: 'Ponto de Apoio Sol Nascente', address: 'Travessa Segura, 45', neighborhood: 'Zona Norte', capacity: '30 vagas / 10 ocupadas', status: 'aberto', lastUpdate: '2024-05-27 17:00'},
];

export default function GerenciarAbrigosPage() {
  const { isAdmin, isAuthenticated } = useAuth();
  const router = useRouter();
  const [shelters, setShelters] = useState<ShelterManagementData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
    else if (!isAdmin) router.push('/');
    else {
      setTimeout(() => {
        setShelters(mockShelters);
        setIsLoading(false);
      }, 1000);
    }
  }, [isAdmin, isAuthenticated, router]);

  const handleAdicionar = () => alert('Funcionalidade "Adicionar Novo Abrigo" a ser implementada.');
  const handleEditar = (id: string) => alert(`Funcionalidade "Editar Abrigo ${id}" a ser implementada.`);
  const handleRemover = (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja remover o abrigo "${name}"?`)) {
      alert(`Abrigo ${id} removido (simulação).`);
      setShelters(prev => prev.filter(s => s.id !== id));
    }
  };
  const handleChangeStatus = (id: string, newStatus: ShelterManagementData['status']) => {
    alert(`Status do abrigo ${id} alterado para "${newStatus}" (simulação).`);
    setShelters(prev => prev.map(s => s.id === id ? {...s, status: newStatus, lastUpdate: new Date().toLocaleString('pt-BR')} : s));
  };


  if (!isAuthenticated || !isAdmin) return <div className="p-6 text-center">Verificando permissões...</div>;

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 md:py-12">
      <section className="mb-10 md:mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--brand-header-bg)]">
            Gerenciar Abrigos
          </h1>
          <button
            onClick={handleAdicionar}
            className="w-full sm:w-auto bg-[var(--brand-header-bg)] text-[var(--brand-text-header)] font-semibold px-6 py-2.5 rounded-lg shadow-md hover:bg-opacity-80 transition-colors flex items-center justify-center"
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            Adicionar Abrigo
          </button>
        </div>
        <p className="text-lg text-[var(--brand-text-secondary)] mt-4">
          Adicione, atualize informações e gerencie o status dos abrigos.
        </p>
      </section>

      <section className="mb-8 p-4 bg-[var(--brand-card-background)] rounded-lg shadow-[var(--shadow-subtle)]">
        <h2 className="text-xl font-semibold text-[var(--brand-text-primary)] mb-3">Filtros e Busca</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" placeholder="Buscar por nome ou bairro..." className="p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[var(--brand-header-bg)]"/>
          <select className="p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[var(--brand-header-bg)]">
            <option value="">Todos os Status</option>
            <option value="aberto">Aberto</option>
            <option value="fechado">Fechado</option>
            <option value="lotado">Lotado</option>
            <option value="manutencao">Em Manutenção</option>
          </select>
          <input type="text" placeholder="Buscar por CEP..." className="p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[var(--brand-header-bg)]"/>
        </div>
      </section>

      <section className="bg-[var(--brand-card-background)] p-4 sm:p-6 rounded-lg shadow-[var(--shadow-subtle)] overflow-x-auto">
        {isLoading ? (
          <p className="text-center text-[var(--brand-text-secondary)] py-8">Carregando abrigos...</p>
        ) : shelters.length > 0 ? (
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Endereço</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Capacidade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Últ. Att.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {shelters.map((shelter) => (
                <tr key={shelter.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--brand-text-primary)]">{shelter.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--brand-text-secondary)]">{shelter.address}, {shelter.neighborhood}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--brand-text-secondary)]">{shelter.capacity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        shelter.status === 'aberto' ? 'bg-green-100 text-green-800' :
                        shelter.status === 'lotado' ? 'bg-yellow-100 text-yellow-800' :
                        shelter.status === 'fechado' ? 'bg-red-100 text-red-800' :
                        'bg-slate-100 text-slate-800' // para manutencao
                    }`}>
                      {shelter.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--brand-text-secondary)]">{shelter.lastUpdate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 flex">
                    <button onClick={() => handleEditar(shelter.id)} title="Editar" className="text-yellow-600 hover:text-yellow-800 p-1"><PencilSquareIcon className="w-5 h-5"/></button>
                    {shelter.status === 'aberto' && <button onClick={() => handleChangeStatus(shelter.id, 'lotado')} title="Marcar como Lotado" className="text-orange-500 hover:text-orange-700 p-1"><XCircleIcon className="w-5 h-5"/></button>}
                    {shelter.status !== 'aberto' && <button onClick={() => handleChangeStatus(shelter.id, 'aberto')} title="Marcar como Aberto" className="text-green-500 hover:text-green-700 p-1"><CheckCircleIcon className="w-5 h-5"/></button>}
                    <button onClick={() => handleRemover(shelter.id, shelter.name)} title="Remover" className="text-red-600 hover:text-red-800 p-1"><TrashIcon className="w-5 h-5"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-[var(--brand-text-secondary)] py-8">Nenhum abrigo cadastrado.</p>
        )}
      </section>
    </div>
  );
}