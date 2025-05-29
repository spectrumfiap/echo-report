// src/app/colaborador/reportes/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { EyeIcon, CheckCircleIcon, XCircleIcon, ShieldExclamationIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../../contexts/AuthContext'; 
import { useRouter } from 'next/navigation';

interface ReportData {
  id: string;
  eventType: string; // Alagamento, Queda de Árvore, etc.
  location: string; // Endereço ou descrição da localização
  descriptionExcerpt: string;
  reporterInfo: string; // "Nome do Usuário" ou "Anônimo (email@exemplo.com)" ou "Anônimo"
  status: 'novo' | 'verificado' | 'em_atendimento' | 'resolvido' | 'falso_positivo';
  createdAt: string;
  severity?: 'baixa' | 'media' | 'alta'; 
}

const mockReports: ReportData[] = [
  { id: 'rep_1', eventType: 'Alagamento', location: 'Rua X, Centro', descriptionExcerpt: 'Água subindo rapidamente, carros presos...', reporterInfo: 'Ana Silva', status: 'novo', createdAt: '2024-05-28 14:30', severity: 'alta' },
  { id: 'rep_2', eventType: 'Queda de Árvore', location: 'Av. Y, Bairro Z', descriptionExcerpt: 'Galho grande bloqueando a via...', reporterInfo: 'Anônimo (reporte_app@email.com)', status: 'verificado', createdAt: '2024-05-28 10:15', severity: 'media' },
  { id: 'rep_3', eventType: 'Falta de Energia', location: 'Praça da Sé', descriptionExcerpt: 'Região toda sem luz há 2 horas...', reporterInfo: 'Carlos Dias', status: 'em_atendimento', createdAt: '2024-05-27 22:00' },
];


export default function GerenciarReportesPage() {
  const { isAdmin, isAuthenticated } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<ReportData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
    else if (!isAdmin) router.push('/');
    else {
      setTimeout(() => {
        setReports(mockReports);
        setIsLoading(false);
      }, 1000);
    }
  }, [isAdmin, isAuthenticated, router]);

  const handleVisualizar = (id: string) => alert(`Funcionalidade "Visualizar Detalhes do Reporte ${id}" a ser implementada.`);
  const handleMudarStatus = (id: string, newStatus: ReportData['status']) => {
    alert(`Status do reporte ${id} alterado para "${newStatus}" (simulação).`);
     setReports(prev => prev.map(r => r.id === id ? {...r, status: newStatus} : r));
  };
   const handleRemover = (id: string) => {
    if (window.confirm(`Tem certeza que deseja remover o reporte ${id}? Isso pode ser útil para spam ou reportes duplicados.`)) {
      alert(`Reporte ${id} removido (simulação).`);
      setReports(prev => prev.filter(r => r.id !== id));
    }
  };


  if (!isAuthenticated || !isAdmin) return <div className="p-6 text-center">Verificando permissões...</div>;

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 md:py-12">
      <section className="mb-10 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--brand-header-bg)]">
          Gerenciar Reportes da Comunidade
        </h1>
        <p className="text-lg text-[var(--brand-text-secondary)] mt-4">
          Visualize, valide e gerencie os reportes enviados pelos usuários.
        </p>
      </section>

       <section className="mb-8 p-4 bg-[var(--brand-card-background)] rounded-lg shadow-[var(--shadow-subtle)]">
        <h2 className="text-xl font-semibold text-[var(--brand-text-primary)] mb-3">Filtros e Busca</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" placeholder="Buscar por localização ou descrição..." className="p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[var(--brand-header-bg)]"/>
          <select className="p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[var(--brand-header-bg)]">
            <option value="">Todos os Tipos</option>
            <option value="Alagamento">Alagamento</option>
            <option value="QuedaDeArvore">Queda de Árvore</option>
            {/* Outros tipos */}
          </select>
          <select className="p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[var(--brand-header-bg)]">
            <option value="">Todos os Status</option>
            <option value="novo">Novo</option>
            <option value="verificado">Verificado</option>
            <option value="em_atendimento">Em Atendimento</option>
            <option value="resolvido">Resolvido</option>
            <option value="falso_positivo">Falso Positivo</option>
          </select>
        </div>
      </section>

      <section className="bg-[var(--brand-card-background)] p-4 sm:p-6 rounded-lg shadow-[var(--shadow-subtle)] overflow-x-auto">
        {isLoading ? (
          <p className="text-center text-[var(--brand-text-secondary)] py-8">Carregando reportes...</p>
        ) : reports.length > 0 ? (
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Localização</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Reportador</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--brand-text-primary)]">{report.eventType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--brand-text-secondary)]">{report.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--brand-text-secondary)]">{report.reporterInfo}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        report.status === 'novo' ? 'bg-blue-100 text-blue-800' :
                        report.status === 'verificado' ? 'bg-teal-100 text-teal-800' :
                        report.status === 'em_atendimento' ? 'bg-yellow-100 text-yellow-800' :
                        report.status === 'resolvido' ? 'bg-green-100 text-green-800' :
                        report.status === 'falso_positivo' ? 'bg-red-100 text-red-800' :
                        'bg-slate-100 text-slate-800'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--brand-text-secondary)]">{new Date(report.createdAt).toLocaleString('pt-BR')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 flex">
                    <button onClick={() => handleVisualizar(report.id)} title="Visualizar Detalhes" className="text-slate-600 hover:text-slate-800 p-1"><EyeIcon className="w-5 h-5"/></button>
                    <button onClick={() => handleMudarStatus(report.id, 'verificado')} title="Marcar como Verificado" className="text-green-600 hover:text-green-800 p-1"><CheckCircleIcon className="w-5 h-5"/></button>
                    <button onClick={() => handleMudarStatus(report.id, 'falso_positivo')} title="Marcar como Falso Positivo" className="text-orange-500 hover:text-orange-700 p-1"><XCircleIcon className="w-5 h-5"/></button>
                    <button onClick={() => handleMudarStatus(report.id, 'em_atendimento')} title="Marcar como Em Atendimento" className="text-purple-600 hover:text-purple-800 p-1"><ShieldExclamationIcon className="w-5 h-5"/></button>
                    <button onClick={() => handleRemover(report.id)} title="Remover Reporte" className="text-red-600 hover:text-red-800 p-1"><TrashIcon className="w-5 h-5"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-[var(--brand-text-secondary)] py-8">Nenhum reporte encontrado.</p>
        )}
      </section>
    </div>
  );
}