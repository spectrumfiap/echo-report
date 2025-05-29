// src/app/colaborador/alertas/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusCircleIcon, PencilSquareIcon, TrashIcon, EyeIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../../contexts/AuthContext'; 
import { useRouter } from 'next/navigation';

interface AlertData {
  id: string;
  title: string;
  messageExcerpt: string; // Um trecho da mensagem
  severity: 'informativo' | 'atencao' | 'perigo';
  targetArea: string; // Pode ser um bairro, região, ou "Geral"
  status: 'rascunho' | 'agendado' | 'enviado' | 'cancelado';
  createdAt: string;
  scheduledAt?: string;
}

const mockAlerts: AlertData[] = [
  { id: 'alert_1', title: 'Risco de Alagamento - Zona Leste', messageExcerpt: 'Chuvas intensas previstas para as próximas horas na Zona Leste...', severity: 'perigo', targetArea: 'Zona Leste', status: 'rascunho', createdAt: '2024-05-28', scheduledAt: '2024-05-29 10:00' },
  { id: 'alert_2', title: 'Manutenção Preventiva - Centro', messageExcerpt: 'Interdição de via para poda de árvores no Centro...', severity: 'informativo', targetArea: 'Centro', status: 'enviado', createdAt: '2024-05-27' },
  { id: 'alert_3', title: 'Alerta de Ventos Fortes', messageExcerpt: 'Rajadas de vento acima de 70km/h esperadas para toda a cidade...', severity: 'atencao', targetArea: 'Geral', status: 'agendado', createdAt: '2024-05-28', scheduledAt: '2024-05-28 18:00'},
];

export default function GerenciarAlertasPage() {
  const { isAdmin, isAuthenticated } = useAuth();
  const router = useRouter();
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
    else if (!isAdmin) router.push('/');
    else {
      setTimeout(() => {
        setAlerts(mockAlerts);
        setIsLoading(false);
      }, 1000);
    }
  }, [isAdmin, isAuthenticated, router]);

  const handleCriarAlerta = () => alert('Funcionalidade "Criar Novo Alerta" a ser implementada.');
  const handleEditar = (id: string) => alert(`Funcionalidade "Editar Alerta ${id}" a ser implementada.`);
  const handleRemover = (id: string, title: string) => {
    if (window.confirm(`Tem certeza que deseja remover o alerta "${title}"?`)) {
      alert(`Alerta ${id} removido (simulação).`);
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    }
  };
  const handleVisualizar = (id: string) => alert(`Funcionalidade "Visualizar Alerta ${id}" a ser implementada.`);
  const handleEnviarAgora = (id: string) => alert(`Funcionalidade "Enviar Alerta ${id} Agora" a ser implementada.`);

  if (!isAuthenticated || !isAdmin) return <div className="p-6 text-center">Verificando permissões...</div>;

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 md:py-12">
      <section className="mb-10 md:mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--brand-header-bg)]">
            Gerenciar Alertas
          </h1>
          <button
            onClick={handleCriarAlerta}
            className="w-full sm:w-auto bg-[var(--brand-header-bg)] text-[var(--brand-text-header)] font-semibold px-6 py-2.5 rounded-lg shadow-md hover:bg-opacity-80 transition-colors flex items-center justify-center"
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            Criar Novo Alerta
          </button>
        </div>
        <p className="text-lg text-[var(--brand-text-secondary)] mt-4">
          Crie, agende, edite ou remova alertas para a comunidade.
        </p>
      </section>

      {/* Área para Filtros e Busca (Placeholder) */}
      <section className="mb-8 p-4 bg-[var(--brand-card-background)] rounded-lg shadow-[var(--shadow-subtle)]">
        <h2 className="text-xl font-semibold text-[var(--brand-text-primary)] mb-3">Filtros e Busca</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" placeholder="Buscar por título ou área..." className="p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[var(--brand-header-bg)]"/>
          <select className="p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[var(--brand-header-bg)]">
            <option value="">Todas as Severidades</option>
            <option value="informativo">Informativo</option>
            <option value="atencao">Atenção</option>
            <option value="perigo">Perigo</option>
          </select>
          <select className="p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[var(--brand-header-bg)]">
            <option value="">Todos os Status</option>
            <option value="rascunho">Rascunho</option>
            <option value="agendado">Agendado</option>
            <option value="enviado">Enviado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
      </section>

      <section className="bg-[var(--brand-card-background)] p-4 sm:p-6 rounded-lg shadow-[var(--shadow-subtle)] overflow-x-auto">
        {isLoading ? (
          <p className="text-center text-[var(--brand-text-secondary)] py-8">Carregando alertas...</p>
        ) : alerts.length > 0 ? (
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Título</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Severidade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Área Alvo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Agendado Para</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {alerts.map((alertItem) => (
                <tr key={alertItem.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--brand-text-primary)]">{alertItem.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${alertItem.severity === 'perigo' ? 'bg-red-100 text-red-800' : 
                        alertItem.severity === 'atencao' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-blue-100 text-blue-800'}`}>
                      {alertItem.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--brand-text-secondary)]">{alertItem.targetArea}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--brand-text-secondary)]">{alertItem.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--brand-text-secondary)]">{alertItem.scheduledAt || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 flex">
                    <button onClick={() => handleVisualizar(alertItem.id)} title="Visualizar" className="text-slate-600 hover:text-slate-800 p-1"><EyeIcon className="w-5 h-5"/></button>
                    <button onClick={() => handleEditar(alertItem.id)} title="Editar" className="text-yellow-600 hover:text-yellow-800 p-1"><PencilSquareIcon className="w-5 h-5"/></button>
                    {alertItem.status !== 'enviado' && alertItem.status !== 'cancelado' &&
                        <button onClick={() => handleEnviarAgora(alertItem.id)} title="Enviar Agora" className="text-green-600 hover:text-green-800 p-1"><PaperAirplaneIcon className="w-5 h-5"/></button>
                    }
                    <button onClick={() => handleRemover(alertItem.id, alertItem.title)} title="Remover" className="text-red-600 hover:text-red-800 p-1"><TrashIcon className="w-5 h-5"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-[var(--brand-text-secondary)] py-8">Nenhum alerta encontrado.</p>
        )}
      </section>
    </div>
  );
}