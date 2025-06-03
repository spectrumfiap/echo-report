// src/app/(admin)/colaborador/gerenciar-alertas/page.tsx
"use client";

import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircleIcon, PencilSquareIcon, TrashIcon, EyeIcon, PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../../contexts/AuthContext';

type AlertSeverity = 'Alto' | 'Medio' | 'Baixo' | 'Informativo';
type AlertStatus = 'rascunho' | 'agendado' | 'ativo' | 'expirado' | 'cancelado';

interface ApiAlert {
  id: number; title: string; description: string; severity: AlertSeverity;
  source: string; publishedAt: string; targetArea?: string; status: AlertStatus;
}
interface AlertData {
  id: string; title: string; description: string; severity: AlertSeverity;
  source: string; publishedAt: string; targetArea?: string; status: AlertStatus;
}
interface AlertFormData {
  id?: string; title: string; description: string; severity: AlertSeverity;
  source: string; publishedAt?: string; targetArea?: string; status: AlertStatus;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
const STATIC_API_KEY = process.env.NEXT_PUBLIC_STATIC_API_KEY || '1234';

const severityOptions: AlertSeverity[] = ['Informativo', 'Baixo', 'Medio', 'Alto'];
const statusOptions: AlertStatus[] = ['rascunho', 'agendado', 'ativo', 'cancelado', 'expirado'];

export default function GerenciarAlertasPage() {
  const { isAdmin, isAuthenticated } = useAuth();
  const router = useRouter();

  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<'add' | 'edit' | 'view' | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<AlertData | null>(null);
  const [alertFormData, setAlertFormData] = useState<AlertFormData | null>(null);
  const [isSubmittingModal, setIsSubmittingModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const mapApiAlertToAlertData = useCallback((apiAlert: ApiAlert): AlertData => ({
    id: String(apiAlert.id), title: apiAlert.title, description: apiAlert.description,
    severity: apiAlert.severity, source: apiAlert.source, publishedAt: apiAlert.publishedAt,
    targetArea: apiAlert.targetArea || '', status: apiAlert.status,
  }), []);

  const fetchAlerts = useCallback(async () => {
    if (!isAdmin) return;
    setIsLoading(true); setNotification(null);
    try {
      const response = await fetch(`${API_BASE_URL}/alertas`, {
        method: 'GET', headers: { 'X-API-Key': STATIC_API_KEY, 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Erro ${response.status}` }));
        throw new Error(errorData.message || `Erro ${response.status}`);
      }
      const apiAlerts: ApiAlert[] = await response.json();
      setAlerts(apiAlerts.map(mapApiAlertToAlertData).sort((a,b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()));
    } catch (error: any) {
      setNotification({ type: 'error', message: error.message || 'Falha ao carregar alertas.' });
      setAlerts([]);
    } finally { setIsLoading(false); }
  }, [isAdmin, mapApiAlertToAlertData]);

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
    else if (!isAdmin) router.push('/');
    else fetchAlerts();
  }, [isAdmin, isAuthenticated, router, fetchAlerts]);

  const formatDateTimeForInput = (isoString?: string) => {
    if (!isoString) return '';
    try { const date = new Date(isoString); return date.toISOString().slice(0, 16); }
    catch (e) { return ''; }
  };
  
  const openModal = (action: 'add' | 'edit' | 'view', alert?: AlertData) => {
    setModalAction(action); setNotification(null);
    if (action === 'add') {
      setAlertFormData({
        title: '', description: '', severity: 'Informativo', source: 'Defesa Civil',
        targetArea: '', status: 'rascunho', publishedAt: formatDateTimeForInput(new Date().toISOString()),
      });
      setSelectedAlert(null);
    } else if (alert) {
      setSelectedAlert(alert);
      setAlertFormData({
        id: alert.id, title: alert.title, description: alert.description, severity: alert.severity,
        source: alert.source, targetArea: alert.targetArea || '', status: alert.status,
        publishedAt: formatDateTimeForInput(alert.publishedAt),
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false); setModalAction(null); setSelectedAlert(null);
    setAlertFormData(null); setIsSubmittingModal(false);
  };

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!alertFormData) return;
    const { name, value } = e.target;
    setAlertFormData({ ...alertFormData, [name]: value });
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); if (!alertFormData) return;
    setIsSubmittingModal(true); setNotification(null);
    const payload = {
      title: alertFormData.title, description: alertFormData.description, severity: alertFormData.severity,
      source: alertFormData.source, targetArea: alertFormData.targetArea, status: alertFormData.status,
      publishedAt: (alertFormData.status === 'agendado' || modalAction === 'edit') && alertFormData.publishedAt
                    ? new Date(alertFormData.publishedAt).toISOString()
                    : (modalAction === 'add' && alertFormData.status === 'ativo' ? new Date().toISOString() : undefined),
    };
    if (payload.publishedAt === undefined) { delete (payload as any).publishedAt; }
    let response: Response;
    try {
      if (modalAction === 'add') {
        response = await fetch(`${API_BASE_URL}/alertas`, {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'X-API-Key': STATIC_API_KEY },
          body: JSON.stringify(payload),
        });
      } else if (modalAction === 'edit' && alertFormData.id) {
        response = await fetch(`${API_BASE_URL}/alertas/${alertFormData.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-API-Key': STATIC_API_KEY },
          body: JSON.stringify({ id: parseInt(alertFormData.id), ...payload }),
        });
      } else { throw new Error("Ação de formulário inválida."); }
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Erro ${response.status}` }));
        throw new Error(errorData.message || errorData.entity || `Erro ${response.status}`);
      }
      const actionText = modalAction === 'add' ? 'criado' : 'atualizado';
      setNotification({ type: 'success', message: `Alerta ${actionText} com sucesso!` });
      fetchAlerts(); closeModal();
    } catch (error: any) {
      setNotification({ type: 'error', message: error.message || `Falha ao ${modalAction === 'add' ? 'criar' : 'atualizar'} alerta.` });
    } finally { setIsSubmittingModal(false); }
  };
  
  const handleRemover = async (alertId: string, alertTitle: string) => {
    if (window.confirm(`Tem certeza que deseja remover o alerta "${alertTitle}"?`)) {
      setNotification(null);
      try {
        const response = await fetch(`${API_BASE_URL}/alertas/${alertId}`, {
          method: 'DELETE', headers: { 'X-API-Key': STATIC_API_KEY },
        });
        if (!response.ok) {
          let errorMsg = `Erro ${response.status}`;
          try { const data = await response.json(); errorMsg = data.message || data.entity || errorMsg; } catch(e){}
          throw new Error(errorMsg);
        }
        setNotification({ type: 'success', message: `Alerta "${alertTitle}" removido.` });
        fetchAlerts();
      } catch (error: any) {
        setNotification({ type: 'error', message: error.message || 'Falha ao remover alerta.' });
      }
    }
  };

  const handleEnviarAgora = async (alertId: string) => {
    const alertToUpdate = alerts.find(a => a.id === alertId);
    if (!alertToUpdate) return;
    if (window.confirm(`Tem certeza que deseja enviar o alerta "${alertToUpdate.title}" agora?`)) {
        setIsSubmittingModal(true); setNotification(null);
        try {
            const payload = { ...alertToUpdate, id: parseInt(alertToUpdate.id), status: 'ativo' as AlertStatus, publishedAt: new Date().toISOString() };
            const response = await fetch(`${API_BASE_URL}/alertas/${alertId}`, {
                method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-API-Key': STATIC_API_KEY },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: `Erro ${response.status}` }));
                throw new Error(errorData.message || errorData.entity || `Erro ${response.status}`);
            }
            setNotification({ type: 'success', message: `Alerta "${alertToUpdate.title}" enviado com sucesso.` });
            fetchAlerts();
        } catch (error: any) {
            setNotification({ type: 'error', message: error.message || 'Falha ao enviar alerta.' });
        } finally { setIsSubmittingModal(false); }
    }
  };
  
  const filteredAlerts = alerts.filter(alert => {
    const searchTermLower = searchTerm.toLowerCase();
    const titleMatch = alert.title.toLowerCase().includes(searchTermLower);
    const areaMatch = alert.targetArea?.toLowerCase().includes(searchTermLower);
    const severityMatch = filterSeverity ? alert.severity === filterSeverity : true;
    const statusMatch = filterStatus ? alert.status === filterStatus : true;
    return (titleMatch || areaMatch) && severityMatch && statusMatch;
  });
  
  const inputStyles = "p-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-header-bg)] dark:focus:ring-blue-500 focus:border-[var(--brand-header-bg)] dark:focus:border-blue-500 sm:text-sm transition-colors bg-[var(--brand-input-background)] text-[var(--brand-text-primary)] placeholder:text-slate-400 dark:placeholder:text-slate-500";
  const modalInputStyles = `mt-1 w-full ${inputStyles}`;
  const modalTextareaStyles = `${modalInputStyles} min-h-[80px]`;
  const modalSelectStyles = `${modalInputStyles} appearance-none`;


  if (!isAuthenticated || !isAdmin && typeof window !== 'undefined') {
    return <div className="container mx-auto p-6 text-center text-[var(--brand-text-secondary)]">Verificando permissões...</div>;
  }
  if (!isAdmin && !isLoading) {
     router.push('/');
     return <div className="container mx-auto p-6 text-center text-[var(--brand-text-secondary)]">Acesso negado. Redirecionando...</div>;
  }

  const renderModalContent = () => {
    const dataForView = selectedAlert; const dataForForm = alertFormData;
    if (modalAction === 'view') {
      if (!dataForView) return null;
      return (
        <div className="space-y-3 text-sm text-[var(--brand-text-secondary)]">
          <h3 className="text-xl font-semibold text-[var(--brand-text-primary)] mb-4">Detalhes do Alerta</h3>
          <p><strong>ID:</strong> <span className="text-[var(--brand-text-primary)]">{dataForView.id}</span></p>
          <p><strong>Título:</strong> <span className="text-[var(--brand-text-primary)]">{dataForView.title}</span></p>
          <p><strong>Descrição:</strong><br/> <span className="whitespace-pre-wrap text-[var(--brand-text-primary)]">{dataForView.description}</span></p>
          <p><strong>Severidade:</strong> <span className="text-[var(--brand-text-primary)]">{dataForView.severity}</span></p>
          <p><strong>Fonte:</strong> <span className="text-[var(--brand-text-primary)]">{dataForView.source}</span></p>
          <p><strong>Área Alvo:</strong> <span className="text-[var(--brand-text-primary)]">{dataForView.targetArea || 'N/A'}</span></p>
          <p><strong>Status:</strong> <span className="text-[var(--brand-text-primary)] capitalize">{dataForView.status ? dataForView.status.replace('_',' ') : '-'}</span></p>
          <p><strong>Publicado/Agendado:</strong> <span className="text-[var(--brand-text-primary)]">{new Date(dataForView.publishedAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</span></p>
          <div className="flex justify-end pt-4">
            <button type="button" onClick={closeModal} className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500 focus:ring-slate-400 dark:focus:ring-slate-500 dark:focus:ring-offset-[var(--brand-card-background)]`}>
              Fechar
            </button>
          </div>
        </div>
      );
    } else if (modalAction === 'add' || modalAction === 'edit') {
      if (!dataForForm) return null;
      return (
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <h3 className="text-xl font-semibold text-[var(--brand-text-primary)] mb-4">
            {modalAction === 'add' ? 'Criar Novo Alerta' : 'Editar Alerta'}
          </h3>
          <div>
            <label htmlFor="titleModal" className="block text-sm font-medium text-[var(--brand-text-secondary)]">Título</label>
            <input type="text" name="title" id="titleModal" value={dataForForm.title} onChange={handleFormInputChange} required className={modalInputStyles}/>
          </div>
          <div>
            <label htmlFor="descriptionModal" className="block text-sm font-medium text-[var(--brand-text-secondary)]">Descrição Completa</label>
            <textarea name="description" id="descriptionModal" rows={4} value={dataForForm.description} onChange={handleFormInputChange} required className={modalTextareaStyles}/>
          </div>
          <div>
            <label htmlFor="sourceModal" className="block text-sm font-medium text-[var(--brand-text-secondary)]">Fonte</label>
            <input type="text" name="source" id="sourceModal" value={dataForForm.source} onChange={handleFormInputChange} required className={modalInputStyles}/>
          </div>
          <div>
            <label htmlFor="targetAreaModal" className="block text-sm font-medium text-[var(--brand-text-secondary)]">Área Alvo (opcional)</label>
            <input type="text" name="targetArea" id="targetAreaModal" value={dataForForm.targetArea || ''} onChange={handleFormInputChange} className={modalInputStyles}/>
          </div>
          <div>
            <label htmlFor="severityModal" className="block text-sm font-medium text-[var(--brand-text-secondary)]">Severidade</label>
            <select name="severity" id="severityModal" value={dataForForm.severity} onChange={handleFormInputChange} className={modalSelectStyles}>
              {severityOptions.map(s => <option key={s} value={s} className="bg-[var(--brand-input-background)] text-[var(--brand-text-primary)]">{s}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="statusModal" className="block text-sm font-medium text-[var(--brand-text-secondary)]">Status</label>
            <select name="status" id="statusModal" value={dataForForm.status} onChange={handleFormInputChange} className={modalSelectStyles}>
              {statusOptions.map(s => <option key={s} value={s} className="bg-[var(--brand-input-background)] text-[var(--brand-text-primary)] capitalize">{s ? s.replace('_', ' ') : '-'}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="publishedAtModal" className="block text-sm font-medium text-[var(--brand-text-secondary)]">
              {dataForForm.status === 'agendado' ? 'Agendar Para:' : (modalAction === 'edit' ? 'Data de Publicação/Agendamento:' : 'Data de Publicação (auto se "ativo"):')}
            </label>
            <input type="datetime-local" name="publishedAt" id="publishedAtModal" value={dataForForm.publishedAt || ''} onChange={handleFormInputChange} className={`${modalInputStyles} dark:[color-scheme:dark]`} />
            {modalAction === 'add' && dataForForm.status !== 'agendado' && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Para status 'ativo', será definido como agora se deixado em branco.</p>}
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={closeModal} className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500 focus:ring-slate-400 dark:focus:ring-slate-500 dark:focus:ring-offset-[var(--brand-card-background)]`}>
              Cancelar
            </button>
            <button type="submit" disabled={isSubmittingModal} className={`px-4 py-2 text-sm font-medium text-white rounded-md hover:bg-opacity-80 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-[var(--brand-header-bg)] dark:bg-blue-600 dark:hover:bg-blue-500 focus:ring-[var(--brand-header-bg)] dark:focus:ring-blue-500 dark:focus:ring-offset-[var(--brand-card-background)]`}>
              {isSubmittingModal ? 'Salvando...' : (modalAction === 'add' ? 'Criar Alerta' : 'Salvar Alterações')}
            </button>
          </div>
        </form>
      );
    }
    return null;
  };
  
  const getSeverityClass = (severity: AlertSeverity) => {
    switch (severity) {
        case 'Alto': return 'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-300';
        case 'Medio': return 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-300';
        case 'Baixo': return 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300';
        case 'Informativo': return 'bg-slate-100 dark:bg-slate-500/20 text-slate-800 dark:text-slate-300';
        default: return 'bg-gray-100 dark:bg-gray-500/20 text-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 md:py-12">
      <section className="mb-10 md:mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--brand-header-bg)] dark:text-blue-400">Gerenciar Alertas</h1>
          <button onClick={() => openModal('add')}
            className="w-full sm:w-auto bg-[var(--brand-header-bg)] dark:bg-blue-600 text-[var(--brand-text-header)] dark:hover:bg-blue-500 font-semibold px-6 py-2.5 rounded-lg shadow-md hover:bg-opacity-80 transition-colors flex items-center justify-center">
            <PlusCircleIcon className="w-5 h-5 mr-2" /> Adicionar Alerta
          </button>
        </div>
        <p className="text-lg text-[var(--brand-text-secondary)] mt-4">Crie, agende, edite ou remova alertas para a comunidade.</p>
      </section>

      {notification && (
        <div className={`p-4 mb-6 text-sm rounded-lg ${notification.type === 'success' ? 'bg-green-100 dark:bg-green-800/30 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-600' : 'bg-red-100 dark:bg-red-800/30 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-600'}`} role="alert">
          {notification.message}
        </div>
      )}
      
      <section className="mb-8 p-4 sm:p-6 bg-[var(--brand-card-background)] rounded-lg shadow-[var(--shadow-subtle)]">
        <h2 className="text-xl font-semibold text-[var(--brand-text-primary)] mb-4">Filtros e Busca</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" placeholder="Buscar por título ou área..." 
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className={`${inputStyles} w-full`}
          />
          <select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)}
            className={`${inputStyles} w-full appearance-none`}
          >
            <option value="" className="bg-[var(--brand-input-background)] text-[var(--brand-text-primary)]">Todas as Severidades</option>
            {severityOptions.map(s => <option key={s} value={s} className="bg-[var(--brand-input-background)] text-[var(--brand-text-primary)]">{s}</option>)}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className={`${inputStyles} w-full appearance-none`}
          >
            <option value="" className="bg-[var(--brand-input-background)] text-[var(--brand-text-primary)]">Todos os Status</option>
            {statusOptions.map(s => <option key={s} value={s} className="bg-[var(--brand-input-background)] text-[var(--brand-text-primary)] capitalize">{s ? s.replace('_', ' ') : '-'}</option>)}
          </select>
        </div>
      </section>

      <section className="bg-[var(--brand-card-background)] rounded-lg shadow-[var(--shadow-subtle)] overflow-x-auto">
        {isLoading ? (
          <p className="text-center text-[var(--brand-text-secondary)] py-8">Carregando alertas...</p>
        ) : filteredAlerts.length > 0 ? (
          <table className="min-w-full">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Título</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Severidade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Área Alvo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Publicado/Agendado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-[var(--brand-card-background)] divide-y divide-slate-200 dark:divide-slate-700">
              {filteredAlerts.map((alertItem) => (
                <tr key={alertItem.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--brand-text-primary)] max-w-xs truncate" title={alertItem.title}>{alertItem.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityClass(alertItem.severity)}`}>
                      {alertItem.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--brand-text-secondary)] max-w-xs truncate" title={alertItem.targetArea}>{alertItem.targetArea || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--brand-text-secondary)] capitalize">
                    {alertItem.status ? alertItem.status.replace('_', ' ') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--brand-text-secondary)]">
                    {alertItem.publishedAt ? new Date(alertItem.publishedAt).toLocaleString('pt-BR', {dateStyle: 'short', timeStyle: 'short'}) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1 flex">
                    <button onClick={() => openModal('view', alertItem)} title="Visualizar" className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-300 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50"><EyeIcon className="w-5 h-5"/></button>
                    <button onClick={() => openModal('edit', alertItem)} title="Editar" className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300 p-1 rounded-md hover:bg-yellow-100 dark:hover:bg-yellow-600/50"><PencilSquareIcon className="w-5 h-5"/></button>
                    {(alertItem.status === 'rascunho' || alertItem.status === 'agendado') &&
                        <button onClick={() => handleEnviarAgora(alertItem.id)} title="Enviar Agora" className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 p-1 rounded-md hover:bg-green-100 dark:hover:bg-green-600/50"><PaperAirplaneIcon className="w-5 h-5"/></button>
                    }
                    <button onClick={() => handleRemover(alertItem.id, alertItem.title)} title="Remover" className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-700/50"><TrashIcon className="w-5 h-5"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-[var(--brand-text-secondary)] py-8">Nenhum alerta encontrado.</p>
        )}
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[var(--brand-card-background)] p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-[var(--brand-text-primary)]">
                {modalAction === 'add' && 'Criar Novo Alerta'}
                {modalAction === 'edit' && 'Editar Alerta'}
                {modalAction === 'view' && 'Detalhes do Alerta'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-md">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            {renderModalContent()} 
          </div>
        </div>
      )}
    </div>
  );
}