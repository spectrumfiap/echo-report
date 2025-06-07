"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { EyeIcon, CheckCircleIcon, XCircleIcon, ShieldExclamationIcon, TrashIcon, ArrowPathIcon, XMarkIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../../contexts/AuthContext';

type ReportStatus = 'novo' | 'verificado' | 'em_atendimento' | 'resolvido' | 'falso_positivo';
type ReportSeverity = 'baixa' | 'media' | 'alta' | 'nao_definida';

interface ApiReport {
  id: number; eventType: string; location: string; description: string;
  reporterName?: string; userId?: number; imageUrl?: string; reportTimestamp: string;
  status: ReportStatus; severity?: ReportSeverity; adminNotes?: string;
}

interface ReportData {
  id: string; eventType: string; location: string; descriptionExcerpt: string;
  reporterInfo: string; status: ReportStatus; createdAt: string; severity?: ReportSeverity;
}

interface ReportModalFormData {
  id?: string; eventType: string; location: string; description: string;
  reporterName?: string; imageUrl?: string; reportTimestamp?: string;
  status: ReportStatus; severity: ReportSeverity; adminNotes?: string; imageFile?: File | null;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://echoreport-api.onrender.com';
const STATIC_API_KEY = process.env.NEXT_PUBLIC_STATIC_API_KEY || '1234';

const statusOptions: ReportStatus[] = ['novo', 'verificado', 'em_atendimento', 'resolvido', 'falso_positivo'];
const severityOptions: ReportSeverity[] = ['nao_definida', 'baixa', 'media', 'alta'];
const eventTypeOptions: string[] = ["Alagamento", "QuedaDeArvore", "FaltaDeEnergia", "AglomeracaoAbrigo", "VazamentoGas", "Deslizamento", "Outro"];

export default function GerenciarReportesPage() {
  const { user, isAdmin, isAuthenticated } = useAuth();
  const router = useRouter();

  const [reports, setReports] = useState<ReportData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'viewEdit' | 'addAdminReport' | null>(null);
  const [currentFormData, setCurrentFormData] = useState<ReportModalFormData | null>(null);
  const [editingReportOriginal, setEditingReportOriginal] = useState<ApiReport | null>(null);
  const [isSubmittingModal, setIsSubmittingModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventType, setSelectedEventType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ReportStatus | ''>('');
  const [filteredReports, setFilteredReports] = useState<ReportData[]>([]);

  const mapApiReportToReportData = useCallback((apiReport: ApiReport): ReportData => {
    let reporterDisplay = apiReport.reporterName || 'Anônimo';
    if (apiReport.userId && apiReport.reporterName && apiReport.reporterName !== "Anônimo") {
      reporterDisplay = `${apiReport.reporterName} (ID: ${apiReport.userId})`;
    } else if (apiReport.userId) {
      reporterDisplay = `Usuário ID: ${apiReport.userId}`;
    }
    return {
      id: String(apiReport.id), eventType: apiReport.eventType, location: apiReport.location,
      descriptionExcerpt: apiReport.description.length > 100 ? `${apiReport.description.substring(0, 97)}...` : apiReport.description,
      reporterInfo: reporterDisplay, status: apiReport.status || statusOptions[0],
      createdAt: apiReport.reportTimestamp, severity: apiReport.severity || severityOptions[0],
    };
  }, []);

  const fetchReports = useCallback(async () => {
    if (!isAdmin) return;
    setIsLoading(true); setNotification(null);
    try {
      const response = await fetch(`${API_BASE_URL}/reportes`, {
        method: 'GET', headers: { 'X-API-Key': STATIC_API_KEY, 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Erro ${response.status}` }));
        throw new Error(errorData.message || `Erro ${response.status}`);
      }
      const apiReports: ApiReport[] = await response.json();
      const mappedReports = apiReports.map(mapApiReportToReportData).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setReports(mappedReports);
    } catch (error: unknown) {
      let message = 'Falha ao carregar reportes.';
      if (error instanceof Error) { message = error.message; }
      else if (typeof error === 'string') { message = error; }
      setNotification({ type: 'error', message });
      setReports([]);
    } finally { setIsLoading(false); }
  }, [isAdmin, mapApiReportToReportData]);

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
    else if (!isAdmin) router.push('/');
    else fetchReports();
  }, [isAdmin, isAuthenticated, router, fetchReports]);

  useEffect(() => {
    let currentReports = [...reports];
    const term = searchTerm.toLowerCase();
    if (term) {
      currentReports = currentReports.filter(report =>
        report.location.toLowerCase().includes(term) ||
        report.descriptionExcerpt.toLowerCase().includes(term) ||
        report.eventType.replace(/([A-Z])/g, ' $1').trim().toLowerCase().includes(term) ||
        report.reporterInfo.toLowerCase().includes(term)
      );
    }
    if (selectedEventType) {
      currentReports = currentReports.filter(report => report.eventType === selectedEventType);
    }
    if (selectedStatus) {
      currentReports = currentReports.filter(report => report.status === selectedStatus);
    }
    setFilteredReports(currentReports);
  }, [reports, searchTerm, selectedEventType, selectedStatus]);

  const fetchReportByIdForModal = async (id: string): Promise<ApiReport | null> => {
    setIsLoading(true);
    try {
        const response = await fetch(`${API_BASE_URL}/reportes/${id}`, {
            method: 'GET',
            headers: { 'X-API-Key': STATIC_API_KEY, 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: `Erro ${response.status} ao buscar reporte ${id}` }));
            throw new Error(errorData.message || `Erro ${response.status}`);
        }
        const report: ApiReport = await response.json();
        return report;
    } catch (error: unknown) {
        let message = `Falha ao carregar detalhes do reporte ${id}`;
        if (error instanceof Error) { message = `${message}: ${error.message}`; }
        else if (typeof error === 'string') { message = `${message}: ${error}`; }
        setNotification({ type: 'error', message });
        return null;
    } finally {
        setIsLoading(false);
    }
  };

  const openModalForViewEdit = async (reportId: string) => {
    const reportDetail = await fetchReportByIdForModal(reportId);
    if (reportDetail) {
      setModalMode('viewEdit');
      setCurrentFormData({
        id: String(reportDetail.id),
        eventType: reportDetail.eventType,
        location: reportDetail.location,
        description: reportDetail.description,
        reporterName: reportDetail.reporterName || '',
        imageUrl: reportDetail.imageUrl || '',
        reportTimestamp: reportDetail.reportTimestamp,
        status: reportDetail.status || statusOptions[0],
        severity: reportDetail.severity || severityOptions[0],
        adminNotes: reportDetail.adminNotes || '',
        imageFile: null,
      });
      setEditingReportOriginal(reportDetail);
      setIsModalOpen(true);
    }
  };

  const openModalForAddAdminReport = () => {
    setModalMode('addAdminReport');
    setCurrentFormData({
      eventType: eventTypeOptions[0] || '',
      location: '',
      description: '',
      reporterName: user?.name || 'Admin',
      status: statusOptions[0] as ReportStatus,
      severity: severityOptions[0] as ReportSeverity,
      adminNotes: '',
      imageUrl: '',
      imageFile: null,
    });
    setEditingReportOriginal(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMode(null);
    setCurrentFormData(null);
    setEditingReportOriginal(null);
  };

  const handleModalFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!currentFormData) return;
    const { name, value } = e.target;
    setCurrentFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleModalFormImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentFormData) return;
    const file = event.target.files ? event.target.files[0] : null;
    setCurrentFormData(prev => prev ? { ...prev, imageFile: file } : null);
  };

  const handleModalFormSubmit = async () => {
    if (!currentFormData || !modalMode) return;
    setIsSubmittingModal(true);
    setNotification(null);

    const formDataToSubmit = new FormData();
    let endpoint = `${API_BASE_URL}/reportes`;
    let method = 'POST';

    formDataToSubmit.append('eventType', currentFormData.eventType);
    formDataToSubmit.append('location', currentFormData.location);
    formDataToSubmit.append('description', currentFormData.description);
    formDataToSubmit.append('status', currentFormData.status);
    formDataToSubmit.append('severity', currentFormData.severity);
    if (currentFormData.adminNotes) formDataToSubmit.append('adminNotes', currentFormData.adminNotes);

    if (modalMode === 'addAdminReport') {
        formDataToSubmit.append('reporterName', currentFormData.reporterName || (user?.name || "Admin"));
        if (user?.id) formDataToSubmit.append('userId', String(user.id));
        if (currentFormData.imageFile) {
            formDataToSubmit.append('imageFile', currentFormData.imageFile);
        } else if (currentFormData.imageUrl) {
            formDataToSubmit.append('imageUrl', currentFormData.imageUrl);
        }
    } else if (modalMode === 'viewEdit' && currentFormData.id) {
        endpoint = `${API_BASE_URL}/reportes/${currentFormData.id}`;
        method = 'PUT';
        if (editingReportOriginal?.reporterName === "Anônimo" && currentFormData.reporterName && currentFormData.reporterName !== "Anônimo") {
            formDataToSubmit.append('reporterName', currentFormData.reporterName);
        }
        if (currentFormData.imageUrl !== editingReportOriginal?.imageUrl) {
            formDataToSubmit.append('imageUrl', currentFormData.imageUrl || '');
        }
    }

    try {
        const response = await fetch(endpoint, {
            method: method,
            headers: { 'X-API-Key': STATIC_API_KEY },
            body: formDataToSubmit,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: `Erro ${response.status}` }));
            throw new Error(errorData.message || `Falha ao ${modalMode === 'addAdminReport' ? 'adicionar' : 'atualizar'} reporte.`);
        }

        setNotification({ type: 'success', message: `Reporte ${modalMode === 'addAdminReport' ? 'adicionado' : 'atualizado'} com sucesso!` });
        closeModal();
        fetchReports();
    } catch (error: unknown) {
        let message = 'Ocorreu um erro desconhecido.';
        if (error instanceof Error) { message = error.message; }
        else if (typeof error === 'string') { message = error; }
        setNotification({ type: 'error', message });
    } finally {
        setIsSubmittingModal(false);
    }
  };

  const handleMudarStatusRapido = async (reportId: string, newStatus: ReportStatus) => {
    setIsLoading(true);
    setNotification(null);
    try {
        const response = await fetch(`${API_BASE_URL}/reportes/${reportId}/status`, {
            method: 'PATCH',
            headers: {
                'X-API-Key': STATIC_API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: `Erro ${response.status}` }));
            throw new Error(errorData.message || 'Falha ao atualizar status do reporte.');
        }
        setNotification({ type: 'success', message: `Status do reporte ${reportId} atualizado para ${newStatus.replace('_', ' ')}.` });
        fetchReports();
    } catch (error: unknown) {
        let message = 'Falha ao atualizar status do reporte.';
        if (error instanceof Error) { message = error.message; }
        else if (typeof error === 'string') { message = error; }
        setNotification({ type: 'error', message });
    } finally {
        setIsLoading(false);
    }
  };

  const handleRemover = async (reportId: string) => {
    if (!window.confirm(`Tem certeza que deseja remover o reporte ID ${reportId}? Esta ação não pode ser desfeita.`)) {
        return;
    }
    setIsLoading(true);
    setNotification(null);
    try {
        const response = await fetch(`${API_BASE_URL}/reportes/${reportId}`, {
            method: 'DELETE',
            headers: { 'X-API-Key': STATIC_API_KEY },
        });

        if (!response.ok) {
            if (response.status === 204 || response.headers.get("content-length") === "0") {
                // Success
            } else {
                const errorData = await response.json().catch(() => ({ message: `Erro ${response.status}` }));
                throw new Error(errorData.message || 'Falha ao remover o reporte.');
            }
        }
        setNotification({ type: 'success', message: `Reporte ID ${reportId} removido com sucesso.` });
        fetchReports();
    } catch (error: unknown) {
        let message = 'Falha ao remover o reporte.';
        if (error instanceof Error) { message = error.message; }
        else if (typeof error === 'string') { message = error; }
        setNotification({ type: 'error', message });
    } finally {
        setIsLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm(''); setSelectedEventType(''); setSelectedStatus('');
  };

  const inputStyles = "p-2 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-header-bg)] dark:focus:ring-blue-500 focus:border-[var(--brand-header-bg)] dark:focus:border-blue-500 sm:text-sm transition-colors bg-[var(--brand-input-background)] text-[var(--brand-text-primary)] placeholder:text-slate-400 dark:placeholder:text-slate-500";
  const modalInputStyles = `mt-1 w-full ${inputStyles}`;
  const modalTextareaStyles = `${modalInputStyles} min-h-[80px]`;
  const modalSelectStyles = `${modalInputStyles} appearance-none`;

  if (!isAuthenticated || !isAdmin && typeof window !== 'undefined') {
    return <div className="p-6 text-center text-[var(--brand-text-secondary)]">Verificando permissões...</div>;
  }
  if (!isAdmin && !isLoading && typeof window !== 'undefined') {
    router.push('/'); return null;
  }
    
  const getStatusBadgeClass = (status: ReportStatus) => {
    switch (status) {
        case 'novo': return 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300';
        case 'verificado': return 'bg-teal-100 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300';
        case 'em_atendimento': return 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-300';
        case 'resolvido': return 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300';
        case 'falso_positivo': return 'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-300';
        default: return 'bg-slate-100 dark:bg-slate-500/20 text-slate-800 dark:text-slate-300';
    }
  };

  const renderViewModalContent = () => {
    if (!currentFormData) return null;
    const originalDataForDisplay = modalMode === 'viewEdit' ? editingReportOriginal : null;
    return (
      <form onSubmit={(e) => { e.preventDefault(); handleModalFormSubmit(); }} className="space-y-3 text-sm text-[var(--brand-text-secondary)] max-h-[75vh] overflow-y-auto pr-2">
        {(modalMode === 'viewEdit' && originalDataForDisplay?.id) && (
          <p><strong>ID do Reporte:</strong> <span className="text-[var(--brand-text-primary)]">{originalDataForDisplay.id}</span></p>
        )}
        <div className={(modalMode === 'addAdminReport' || !originalDataForDisplay?.reportTimestamp) ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'grid grid-cols-1 md:grid-cols-2 gap-4 items-end'}>
          <div>
            <label htmlFor="eventTypeModal" className="block text-xs font-medium text-[var(--brand-text-secondary)]">Tipo de Evento</label>
            <select id="eventTypeModal" name="eventType" value={currentFormData.eventType} onChange={handleModalFormInputChange}
              disabled={modalMode === 'viewEdit'} required className={`${modalSelectStyles} ${modalMode === 'viewEdit' ? 'disabled:opacity-70 disabled:cursor-not-allowed' : ''}`}>
              {eventTypeOptions.map(type => <option key={type} value={type} className="bg-[var(--brand-input-background)] text-[var(--brand-text-primary)]">{type.replace(/([A-Z])/g, ' $1').trim()}</option>)}
            </select>
          </div>
          {modalMode === 'viewEdit' && originalDataForDisplay?.reportTimestamp && (
            <p><strong>Data do Reporte:</strong> <span className="text-[var(--brand-text-primary)]">{new Date(originalDataForDisplay.reportTimestamp).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span></p>
          )}
        </div>
        <div>
          <label htmlFor="locationModal" className="block text-xs font-medium text-[var(--brand-text-secondary)]">Localização</label>
          <input type="text" id="locationModal" name="location" value={currentFormData.location} onChange={handleModalFormInputChange} required
            disabled={modalMode === 'viewEdit'} className={`${modalInputStyles} ${modalMode === 'viewEdit' ? 'disabled:opacity-70 disabled:cursor-not-allowed' : ''}`} />
        </div>
        <div>
          <label htmlFor="reporterNameModal" className="block text-xs font-medium text-[var(--brand-text-secondary)]">Reportado por</label>
          <input type="text" id="reporterNameModal" name="reporterName" value={currentFormData.reporterName || ''} onChange={handleModalFormInputChange}
            disabled={modalMode === 'viewEdit' && !!originalDataForDisplay?.userId && originalDataForDisplay?.reporterName !== "Anônimo"}
            placeholder={modalMode === 'addAdminReport' ? (user?.name || 'Admin') : 'Nome do reportador'}
            className={`${modalInputStyles} ${(modalMode === 'viewEdit' && !!originalDataForDisplay?.userId && originalDataForDisplay?.reporterName !== "Anônimo") ? 'disabled:opacity-70 disabled:cursor-not-allowed' : ''}`} />
          {modalMode === 'viewEdit' && originalDataForDisplay?.userId &&
            <span className="text-xs text-[var(--brand-text-secondary)] ml-1">(Usuário ID: {originalDataForDisplay.userId})</span>}
        </div>
        <div>
          <label htmlFor="descriptionModal" className="block text-xs font-medium text-[var(--brand-text-secondary)]">Descrição Completa:</label>
          <textarea id="descriptionModal" name="description" value={currentFormData.description}
            onChange={handleModalFormInputChange} rows={modalMode === 'viewEdit' && originalDataForDisplay?.imageUrl ? 3 : 5} required className={modalTextareaStyles} />
        </div>
        {modalMode === 'viewEdit' && originalDataForDisplay?.imageUrl && (
          <div className="my-2">
            <p className="text-xs font-medium text-[var(--brand-text-secondary)]">Imagem Anexada:</p>
            <div className="relative w-full max-w-sm h-48 mt-1 mx-auto">
              <Image 
                src={originalDataForDisplay.imageUrl.startsWith('http') ? originalDataForDisplay.imageUrl : `${API_BASE_URL}${originalDataForDisplay.imageUrl}`}
                alt="Imagem do Reporte" 
                layout="fill"
                objectFit="contain"
                className="rounded-md border dark:border-slate-700"
                unoptimized={true} 
              />
            </div>
          </div>
        )}
        {(modalMode === 'addAdminReport') && (
          <div>
            <label htmlFor="adminReportImageFile" className="block text-xs font-medium text-[var(--brand-text-secondary)]">Imagem (opcional)</label>
            <input type="file" name="imageFile" id="adminReportImageFile" accept="image/*" onChange={handleModalFormImageChange}
              className={`mt-1 block w-full text-sm text-[var(--brand-text-secondary)] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--brand-header-bg)]/20 dark:file:bg-[var(--brand-header-bg)]/30 file:text-[var(--brand-header-bg)] dark:file:text-blue-300 hover:file:bg-[var(--brand-header-bg)]/30 dark:hover:file:bg-[var(--brand-header-bg)]/40 cursor-pointer`} />
          </div>
        )}
        {(modalMode === 'viewEdit') && (
          <div>
            <label htmlFor="imageUrlModal" className="block text-xs font-medium text-[var(--brand-text-secondary)]">URL da Imagem (se houver, pode editar)</label>
            <input type="text" name="imageUrl" id="imageUrlModal" value={currentFormData.imageUrl || ''} onChange={handleModalFormInputChange}
              placeholder="https://exemplo.com/imagem.jpg ou deixe em branco" className={modalInputStyles} />
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 my-4">
          <div>
            <label htmlFor="statusModal" className="block text-xs font-medium text-[var(--brand-text-secondary)]">Status:</label>
            <select id="statusModal" name="status" value={currentFormData.status} onChange={handleModalFormInputChange} className={modalSelectStyles}>
              {statusOptions.map(s => <option key={s} value={s} className="bg-[var(--brand-input-background)] text-[var(--brand-text-primary)] capitalize">{s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="severityModal" className="block text-xs font-medium text-[var(--brand-text-secondary)]">Severidade Avaliada:</label>
            <select id="severityModal" name="severity" value={currentFormData.severity} onChange={handleModalFormInputChange} className={modalSelectStyles}>
              {severityOptions.map(s => <option key={s} value={s} className="bg-[var(--brand-input-background)] text-[var(--brand-text-primary)] capitalize">{s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="adminNotesModal" className="block text-xs font-medium text-[var(--brand-text-secondary)]">Notas do Administrador:</label>
          <textarea id="adminNotesModal" name="adminNotes" rows={3} value={currentFormData.adminNotes || ''}
            onChange={handleModalFormInputChange} placeholder="Adicione observações ou ações tomadas..." className={modalTextareaStyles} />
        </div>
        <div className="flex justify-end space-x-3 pt-4 mt-4 border-t dark:border-slate-700">
          <button type="button" onClick={closeModal} className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500 focus:ring-slate-400 dark:focus:ring-slate-500 dark:focus:ring-offset-[var(--brand-card-background)]`}>
            Cancelar
          </button>
          {(modalMode === 'viewEdit' || modalMode === 'addAdminReport') && (
            <button type="submit" disabled={isSubmittingModal || isLoading} className={`px-4 py-2 text-sm font-medium text-white rounded-md hover:bg-opacity-80 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-[var(--brand-header-bg)] dark:bg-blue-600 dark:hover:bg-blue-500 focus:ring-[var(--brand-header-bg)] dark:focus:ring-blue-500 dark:focus:ring-offset-[var(--brand-card-background)]`}>
              {isSubmittingModal ? "Salvando..." : (modalMode === 'addAdminReport' ? "Adicionar Reporte" : "Salvar Alterações")}
            </button>
          )}
        </div>
      </form>
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 md:py-12">
      <section className="mb-10 md:mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--brand-header-bg)] dark:text-blue-400">
            Gerenciar Reportes da Comunidade
          </h1>
          <button
            onClick={openModalForAddAdminReport}
            className="w-full sm:w-auto bg-[var(--brand-header-bg)] dark:bg-blue-600 text-[var(--brand-text-header)] dark:hover:bg-blue-500 font-semibold px-6 py-2.5 rounded-lg shadow-md hover:bg-opacity-80 transition-colors flex items-center justify-center">
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            Adicionar Reporte
          </button>
        </div>
        <p className="text-lg text-[var(--brand-text-secondary)] mt-4">
          Visualize, valide e gerencie os reportes enviados pelos usuários.
        </p>
      </section>

      {notification && (
        <div className={`p-4 mb-6 text-sm rounded-lg ${notification.type === 'success' ? 'bg-green-100 dark:bg-green-800/30 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-600' : 'bg-red-100 dark:bg-red-800/30 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-600'}`} role="alert">
          {notification.message}
        </div>
      )}

      <section className="mb-8 p-4 sm:p-6 bg-[var(--brand-card-background)] rounded-lg shadow-[var(--shadow-subtle)]">
        <h2 className="text-xl font-semibold text-[var(--brand-text-primary)] mb-4">Filtros e Busca</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
          <input
            id="searchTermInput" type="text" placeholder="Buscar por tipo, local, descrição, reportador..."
            className={`${inputStyles} w-full`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            id="filterEventType" className={`${inputStyles} w-full appearance-none`}
            value={selectedEventType} onChange={(e) => setSelectedEventType(e.target.value)}
          >
            <option value="" className="bg-[var(--brand-input-background)] text-[var(--brand-text-primary)]">Todos os Tipos</option>
            {eventTypeOptions.map(type => <option key={type} value={type} className="bg-[var(--brand-input-background)] text-[var(--brand-text-primary)]">{type.replace(/([A-Z])/g, ' $1').trim()}</option>)}
          </select>
          <select
            id="filterStatus" className={`${inputStyles} w-full appearance-none`}
            value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value as ReportStatus | '')}
          >
            <option value="" className="bg-[var(--brand-input-background)] text-[var(--brand-text-primary)]">Todos os Status</option>
            {statusOptions.map(s => <option key={s} value={s} className="bg-[var(--brand-input-background)] text-[var(--brand-text-primary)] capitalize">{s ? s.replace('_', ' ') : '-'}</option>)}
          </select>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500 focus:ring-slate-400 dark:focus:ring-slate-500 dark:focus:ring-offset-[var(--brand-card-background)]"
            aria-label="Limpar filtros">
            Limpar Filtros
          </button>
        </div>
      </section>

      <section className="bg-[var(--brand-card-background)] rounded-lg shadow-[var(--shadow-subtle)] overflow-x-auto">
        {isLoading && !isModalOpen ? (
          <p className="text-center text-[var(--brand-text-secondary)] py-8">Carregando reportes...</p>
        ) : reports.length === 0 && !isLoading ? (
          <p className="text-center text-[var(--brand-text-secondary)] py-8">Nenhum reporte cadastrado no sistema.</p>
        ) : filteredReports.length === 0 && !isLoading ? (
          <p className="text-center text-[var(--brand-text-secondary)] py-8">Nenhum reporte encontrado com os filtros aplicados.</p>
        ) : (
          <table className="min-w-full">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Localização</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Reportador</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-[var(--brand-card-background)] divide-y divide-slate-200 dark:divide-slate-700">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--brand-text-primary)]">{report.eventType.replace(/([A-Z])/g, ' $1').trim()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--brand-text-secondary)] max-w-xs truncate" title={report.location}>{report.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--brand-text-secondary)] max-w-xs truncate" title={report.reporterInfo}>{report.reporterInfo}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(report.status)}`}>
                      {report.status ? report.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--brand-text-secondary)]">
                    {report.createdAt ? new Date(report.createdAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1 flex items-center">
                    <button onClick={() => openModalForViewEdit(report.id)} title="Visualizar/Editar Detalhes" className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-300 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50"><EyeIcon className="w-5 h-5" /></button>
                    {report.status === 'novo' && (
                      <button onClick={() => handleMudarStatusRapido(report.id, 'verificado')} title="Marcar como Verificado" className="text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 p-1 rounded-md hover:bg-teal-100 dark:hover:bg-teal-600/50"><CheckCircleIcon className="w-5 h-5" /></button>
                    )}
                    {report.status === 'verificado' && (
                      <button onClick={() => handleMudarStatusRapido(report.id, 'em_atendimento')} title="Marcar como Em Atendimento" className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 p-1 rounded-md hover:bg-purple-100 dark:hover:bg-purple-600/50"><ShieldExclamationIcon className="w-5 h-5" /></button>
                    )}
                    {report.status === 'em_atendimento' && (
                      <button onClick={() => handleMudarStatusRapido(report.id, 'resolvido')} title="Marcar como Resolvido" className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 p-1 rounded-md hover:bg-green-100 dark:hover:bg-green-600/50"><ArrowPathIcon className="w-5 h-5" /></button>
                    )}
                    {report.status !== 'falso_positivo' && report.status !== 'resolvido' && (
                      <button onClick={() => handleMudarStatusRapido(report.id, 'falso_positivo')} title="Marcar como Falso Positivo" className="text-orange-500 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 p-1 rounded-md hover:bg-orange-100 dark:hover:bg-orange-600/50"><XCircleIcon className="w-5 h-5" /></button>
                    )}
                    <button onClick={() => handleRemover(report.id)} title="Remover Reporte" className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-700/50"><TrashIcon className="w-5 h-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[var(--brand-card-background)] p-6 rounded-lg shadow-xl w-full max-w-xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-[var(--brand-text-primary)]">
                {modalMode === 'addAdminReport' ? 'Adicionar Novo Reporte (Admin)' : 'Detalhes e Gerenciamento do Reporte'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 p-1 rounded-md -mr-2">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="pt-4">
              {renderViewModalContent()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}