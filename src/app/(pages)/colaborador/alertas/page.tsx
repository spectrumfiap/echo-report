"use client";

import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircleIcon, PencilSquareIcon, TrashIcon, EyeIcon, PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../../contexts/AuthContext';

type AlertSeverity = 'Alto' | 'Medio' | 'Baixo' | 'Informativo';
type AlertStatus = 'rascunho' | 'agendado' | 'ativo' | 'expirado' | 'cancelado';

interface ApiAlert {
  id: number;
  title: string;
  description: string;
  severity: AlertSeverity;
  source: string;
  publishedAt: string; // ISO string from backend
  targetArea?: string;
  status: AlertStatus;
}

interface AlertData {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  source: string;
  publishedAt: string; // ISO string
  targetArea?: string;
  status: AlertStatus;
}

interface AlertFormData {
  id?: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  source: string;
  publishedAt?: string; // ISO string for new/updated publication/schedule time
  targetArea?: string;
  status: AlertStatus;
}

const API_BASE_URL = 'http://localhost:8080';
const STATIC_API_KEY = '1234';

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

  const mapApiAlertToAlertData = useCallback((apiAlert: ApiAlert): AlertData => {
    return {
      id: String(apiAlert.id),
      title: apiAlert.title,
      description: apiAlert.description,
      severity: apiAlert.severity,
      source: apiAlert.source,
      publishedAt: apiAlert.publishedAt,
      targetArea: apiAlert.targetArea || '',
      status: apiAlert.status,
    };
  }, []);

  const fetchAlerts = useCallback(async () => {
    if (!isAdmin) return;
    setIsLoading(true);
    setNotification(null);
    try {
      const response = await fetch(`${API_BASE_URL}/alertas`, {
        method: 'GET',
        headers: { 'X-API-Key': STATIC_API_KEY, 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Erro ${response.status}` }));
        throw new Error(errorData.message || `Erro ${response.status}`);
      }
      const apiAlerts: ApiAlert[] = await response.json();
      setAlerts(apiAlerts.map(mapApiAlertToAlertData));
    } catch (error: any) {
      setNotification({ type: 'error', message: error.message || 'Falha ao carregar alertas.' });
      setAlerts([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin, mapApiAlertToAlertData]);

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
    else if (!isAdmin) router.push('/');
    else fetchAlerts();
  }, [isAdmin, isAuthenticated, router, fetchAlerts]);

  const formatDateTimeForInput = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      // Formato YYYY-MM-DDTHH:MM
      return date.toISOString().slice(0, 16);
    } catch (e) {
      return '';
    }
  };
  
  const openModal = (action: 'add' | 'edit' | 'view', alert?: AlertData) => {
    setModalAction(action);
    setNotification(null);
    if (action === 'add') {
      setAlertFormData({
        title: '',
        description: '',
        severity: 'Informativo',
        source: '',
        targetArea: '',
        status: 'rascunho',
        publishedAt: formatDateTimeForInput(new Date().toISOString()), // Default to now for 'agendado' or manual setting
      });
      setSelectedAlert(null);
    } else if (alert) {
      setSelectedAlert(alert);
      setAlertFormData({
        id: alert.id,
        title: alert.title,
        description: alert.description,
        severity: alert.severity,
        source: alert.source,
        targetArea: alert.targetArea || '',
        status: alert.status,
        publishedAt: formatDateTimeForInput(alert.publishedAt),
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalAction(null);
    setSelectedAlert(null);
    setAlertFormData(null);
    setIsSubmittingModal(false);
  };

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!alertFormData) return;
    const { name, value } = e.target;
    setAlertFormData({ ...alertFormData, [name]: value });
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!alertFormData) return;
    setIsSubmittingModal(true);
    setNotification(null);

    // O backend AlertaResource POST e PUT esperam um objeto Alerta
    const payload = {
      title: alertFormData.title,
      description: alertFormData.description,
      severity: alertFormData.severity,
      source: alertFormData.source,
      targetArea: alertFormData.targetArea,
      status: alertFormData.status,
      // publishedAt: se status for 'agendado', usar o valor do form.
      // Se status for 'ativo' na criação, o backend deve definir como now().
      // Se editando, enviar o valor atualizado.
      publishedAt: (alertFormData.status === 'agendado' || modalAction === 'edit') && alertFormData.publishedAt
                   ? new Date(alertFormData.publishedAt).toISOString()
                   : (modalAction === 'add' && alertFormData.status === 'ativo' ? new Date().toISOString() : undefined),
    };
    // Remover publishedAt se for undefined (ex: criando alerta ativo, backend define)
    if (payload.publishedAt === undefined) {
        delete payload.publishedAt;
    }


    let response: Response;
    try {
      if (modalAction === 'add') {
        response = await fetch(`${API_BASE_URL}/alertas`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-API-Key': STATIC_API_KEY },
          body: JSON.stringify(payload),
        });
      } else if (modalAction === 'edit' && alertFormData.id) {
        response = await fetch(`${API_BASE_URL}/alertas/${alertFormData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'X-API-Key': STATIC_API_KEY },
          body: JSON.stringify({ id: parseInt(alertFormData.id), ...payload }), // Backend espera Alerta completo, incluindo ID para PUT
        });
      } else {
        throw new Error("Ação de formulário inválida.");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Erro ${response.status}` }));
        throw new Error(errorData.message || errorData.entity || `Erro ${response.status}`);
      }
      
      const actionText = modalAction === 'add' ? 'criado' : 'atualizado';
      setNotification({ type: 'success', message: `Alerta ${actionText} com sucesso!` });
      fetchAlerts();
      closeModal();

    } catch (error: any) {
      setNotification({ type: 'error', message: error.message || `Falha ao ${modalAction === 'add' ? 'criar' : 'atualizar'} alerta.` });
    } finally {
      setIsSubmittingModal(false);
    }
  };
  
  const handleRemover = async (alertId: string, alertTitle: string) => {
    if (window.confirm(`Tem certeza que deseja remover o alerta "${alertTitle}"?`)) {
      setNotification(null);
      // setIsLoading(true); // Pode ser confuso com o loading da tabela
      try {
        const response = await fetch(`${API_BASE_URL}/alertas/${alertId}`, {
          method: 'DELETE',
          headers: { 'X-API-Key': STATIC_API_KEY },
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
      } finally {
        // setIsLoading(false);
      }
    }
  };

  const handleEnviarAgora = async (alertId: string) => {
    const alertToUpdate = alerts.find(a => a.id === alertId);
    if (!alertToUpdate) return;

    if (window.confirm(`Tem certeza que deseja enviar o alerta "${alertToUpdate.title}" agora? Seu status será 'ativo' e a data de publicação atualizada.`)) {
        setIsSubmittingModal(true); // Pode usar um loading específico para esta ação
        setNotification(null);
        try {
            const payload = {
                ...alertToUpdate, // Envia todos os campos do alerta existente
                id: parseInt(alertToUpdate.id), // Backend espera id como int
                status: 'ativo' as AlertStatus,
                publishedAt: new Date().toISOString(),
            };
            // O campo description já está completo em alertToUpdate.title
            // Se a API espera o objeto completo da entidade Alerta, garanta que todos os campos obrigatórios estão lá

            const response = await fetch(`${API_BASE_URL}/alertas/${alertId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'X-API-Key': STATIC_API_KEY },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: `Erro ${response.status}` }));
                throw new Error(errorData.message || errorData.entity || `Erro ${response.status}`);
            }
            setNotification({ type: 'success', message: `Alerta "${alertToUpdate.title}" enviado com sucesso.` });
            fetchAlerts(); // Recarrega a lista
        } catch (error: any) {
            setNotification({ type: 'error', message: error.message || 'Falha ao enviar alerta.' });
        } finally {
            setIsSubmittingModal(false);
        }
    }
  };


  if (!isAuthenticated || !isAdmin && typeof window !== 'undefined') {
    return <div className="container mx-auto p-6 text-center">Verificando permissões...</div>;
  }
  if (!isAdmin && !isLoading) return null;

  const renderModalContent = () => {
    const dataForView = selectedAlert; // Para visualização
    const dataForForm = alertFormData; // Para add/edit

    if (modalAction === 'view') {
      if (!dataForView) return null;
      return (
        <div className="space-y-3 text-sm">
          <h3 className="text-xl font-semibold text-[var(--brand-text-primary)] mb-4">Detalhes do Alerta</h3>
          <p><strong>ID:</strong> {dataForView.id}</p>
          <p><strong>Título:</strong> {dataForView.title}</p>
          <p><strong>Descrição Completa:</strong><br/> <span className="whitespace-pre-wrap">{dataForView.description}</span></p>
          <p><strong>Severidade:</strong> {dataForView.severity}</p>
          <p><strong>Fonte:</strong> {dataForView.source}</p>
          <p><strong>Área Alvo:</strong> {dataForView.targetArea || 'N/A'}</p>
          <p><strong>Status:</strong> {dataForView.status}</p>
          <p><strong>Publicado/Agendado para:</strong> {new Date(dataForView.publishedAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</p>
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
            <label htmlFor="title" className="block text-sm font-medium text-[var(--brand-text-secondary)]">Título</label>
            <input type="text" name="title" id="title" value={dataForForm.title} onChange={handleFormInputChange} required className="mt-1 p-2 w-full border border-slate-300 rounded-md shadow-sm"/>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-[var(--brand-text-secondary)]">Descrição Completa</label>
            <textarea name="description" id="description" rows={4} value={dataForForm.description} onChange={handleFormInputChange} required className="mt-1 p-2 w-full border border-slate-300 rounded-md shadow-sm"/>
          </div>
           <div>
            <label htmlFor="source" className="block text-sm font-medium text-[var(--brand-text-secondary)]">Fonte</label>
            <input type="text" name="source" id="source" value={dataForForm.source} onChange={handleFormInputChange} required className="mt-1 p-2 w-full border border-slate-300 rounded-md shadow-sm"/>
          </div>
          <div>
            <label htmlFor="targetArea" className="block text-sm font-medium text-[var(--brand-text-secondary)]">Área Alvo</label>
            <input type="text" name="targetArea" id="targetArea" value={dataForForm.targetArea || ''} onChange={handleFormInputChange} className="mt-1 p-2 w-full border border-slate-300 rounded-md shadow-sm"/>
          </div>
          <div>
            <label htmlFor="severity" className="block text-sm font-medium text-[var(--brand-text-secondary)]">Severidade</label>
            <select name="severity" id="severity" value={dataForForm.severity} onChange={handleFormInputChange} className="mt-1 p-2 w-full border border-slate-300 rounded-md shadow-sm">
              {severityOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-[var(--brand-text-secondary)]">Status</label>
            <select name="status" id="status" value={dataForForm.status} onChange={handleFormInputChange} className="mt-1 p-2 w-full border border-slate-300 rounded-md shadow-sm">
              {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
           <div>
            <label htmlFor="publishedAt" className="block text-sm font-medium text-[var(--brand-text-secondary)]">
              {dataForForm.status === 'agendado' ? 'Agendar Para:' : 'Data de Publicação (para edição):'}
            </label>
            <input type="datetime-local" name="publishedAt" id="publishedAt"
                   value={dataForForm.publishedAt || ''}
                   onChange={handleFormInputChange}
                   className="mt-1 p-2 w-full border border-slate-300 rounded-md shadow-sm"/>
            {modalAction === 'add' && dataForForm.status !== 'agendado' && <p className="text-xs text-slate-500 mt-1">Para status 'ativo', será definido como agora se deixado em branco.</p>}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">Cancelar</button>
            <button type="submit" disabled={isSubmittingModal} className="px-4 py-2 text-sm font-medium text-white bg-[var(--brand-header-bg)] rounded-md hover:bg-opacity-80 disabled:opacity-50">
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
        case 'Alto': return 'bg-red-100 text-red-800';
        case 'Medio': return 'bg-yellow-100 text-yellow-800'; // Mock usava orange, backend tem Medio
        case 'Baixo': return 'bg-blue-100 text-blue-800';   // Mock usava yellow, backend tem Baixo
        case 'Informativo': return 'bg-gray-100 text-gray-800'; // Mock usava blue para informativo
        default: return 'bg-gray-100 text-gray-800';
    }
  };


  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 md:py-12">
      <section className="mb-10 md:mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--brand-header-bg)]">Gerenciar Alertas</h1>
          <button onClick={() => openModal('add')}
            className="w-full sm:w-auto bg-[var(--brand-header-bg)] text-[var(--brand-text-header)] font-semibold px-6 py-2.5 rounded-lg shadow-md hover:bg-opacity-80 transition-colors flex items-center justify-center">
            <PlusCircleIcon className="w-5 h-5 mr-2" /> Criar Novo Alerta
          </button>
        </div>
        <p className="text-lg text-[var(--brand-text-secondary)] mt-4">Crie, agende, edite ou remova alertas para a comunidade.</p>
      </section>

      {notification && (
        <div className={`p-4 mb-6 text-sm rounded-lg ${notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`} role="alert">
          {notification.message}
        </div>
      )}
      
      <section className="mb-8 p-4 bg-[var(--brand-card-background)] rounded-lg shadow-[var(--shadow-subtle)]">
        <h2 className="text-xl font-semibold text-[var(--brand-text-primary)] mb-3">Filtros e Busca</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" placeholder="Buscar por título ou área..." className="p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[var(--brand-header-bg)]"/>
          <select className="p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[var(--brand-header-bg)]">
            <option value="">Todas as Severidades</option>
            {severityOptions.map(s => <option key={s} value={s.toLowerCase()}>{s}</option>)}
          </select>
          <select className="p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[var(--brand-header-bg)]">
            <option value="">Todos os Status</option>
            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Publicado/Agendado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {alerts.map((alertItem) => (
                <tr key={alertItem.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--brand-text-primary)] max-w-xs truncate" title={alertItem.title}>{alertItem.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityClass(alertItem.severity)}`}>
                      {alertItem.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--brand-text-secondary)] max-w-xs truncate" title={alertItem.targetArea}>{alertItem.targetArea}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--brand-text-secondary)]">{alertItem.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--brand-text-secondary)]">
                    {alertItem.publishedAt ? new Date(alertItem.publishedAt).toLocaleString('pt-BR', {dateStyle: 'short', timeStyle: 'short'}) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1 flex">
                    <button onClick={() => openModal('view', alertItem)} title="Visualizar" className="text-slate-600 hover:text-slate-800 p-1"><EyeIcon className="w-5 h-5"/></button>
                    <button onClick={() => openModal('edit', alertItem)} title="Editar" className="text-yellow-600 hover:text-yellow-800 p-1"><PencilSquareIcon className="w-5 h-5"/></button>
                    {(alertItem.status === 'rascunho' || alertItem.status === 'agendado') &&
                        <button onClick={() => handleEnviarAgora(alertItem.id)} title="Enviar Agora" className="text-green-600 hover:text-green-800 p-1"><PaperAirplaneIcon className="w-5 h-5"/></button>
                    }
                    <button onClick={() => handleRemover(alertItem.id, alertItem.title)} title="Remover" className="text-red-600 hover:text-red-800 p-1"><TrashIcon className="w-5 h-5"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-[var(--brand-text-secondary)] py-8">Nenhum alerta encontrado ou falha ao carregar.</p>
        )}
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="bg-[var(--brand-card-background)] p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-[var(--brand-text-primary)]">
                {modalAction === 'add' && 'Criar Novo Alerta'}
                {modalAction === 'edit' && 'Editar Alerta'}
                {modalAction === 'view' && 'Detalhes do Alerta'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
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