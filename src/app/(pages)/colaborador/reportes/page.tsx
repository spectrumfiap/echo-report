"use client";

import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { EyeIcon, CheckCircleIcon, XCircleIcon, ShieldExclamationIcon, TrashIcon, ArrowPathIcon, XMarkIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../../contexts/AuthContext';

type ReportStatus = 'novo' | 'verificado' | 'em_atendimento' | 'resolvido' | 'falso_positivo';
type ReportSeverity = 'baixa' | 'media' | 'alta' | 'nao_definida';

interface ApiReport {
  id: number;
  eventType: string;
  location: string;
  description: string;
  reporterName?: string;
  userId?: number;
  imageUrl?: string;
  reportTimestamp: string;
  status: ReportStatus;
  severity?: ReportSeverity;
  adminNotes?: string;
}

interface ReportData {
  id: string;
  eventType: string;
  location: string;
  descriptionExcerpt: string;
  reporterInfo: string;
  status: ReportStatus;
  createdAt: string; // Esta string é o reportTimestamp
  severity?: ReportSeverity;
}

interface ReportModalFormData {
  id?: string;
  eventType: string;
  location: string;
  description: string;
  reporterName?: string;
  imageUrl?: string;
  reportTimestamp?: string; // Esta string é o reportTimestamp
  status: ReportStatus;
  severity: ReportSeverity;
  adminNotes?: string;
  imageFile?: File | null;
}

const API_BASE_URL = 'http://localhost:8080';
const STATIC_API_KEY = '1234';

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

  // Estados para os filtros
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
      id: String(apiReport.id),
      eventType: apiReport.eventType,
      location: apiReport.location,
      descriptionExcerpt: apiReport.description.length > 100 ? `${apiReport.description.substring(0, 97)}...` : apiReport.description,
      reporterInfo: reporterDisplay,
      status: apiReport.status || statusOptions[0],
      createdAt: apiReport.reportTimestamp,
      severity: apiReport.severity || severityOptions[0],
    };
  }, []);

  const fetchReports = useCallback(async () => {
    if (!isAdmin) return;
    setIsLoading(true);
    setNotification(null);
    try {
      const response = await fetch(`${API_BASE_URL}/reportes`, {
        method: 'GET',
        headers: { 'X-API-Key': STATIC_API_KEY, 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Erro ${response.status}` }));
        throw new Error(errorData.message || `Erro ${response.status}`);
      }
      const apiReports: ApiReport[] = await response.json();
      setReports(apiReports.map(mapApiReportToReportData));
    } catch (error: any) {
      setNotification({ type: 'error', message: error.message || 'Falha ao carregar reportes.' });
      setReports([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin, mapApiReportToReportData]);

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
    else if (!isAdmin) router.push('/');
    else fetchReports();
  }, [isAdmin, isAuthenticated, router, fetchReports]);

  // Efeito para aplicar filtros
  useEffect(() => {
    let currentReports = [...reports];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
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
    try {
      const response = await fetch(`${API_BASE_URL}/reportes/${id}`, {
        headers: { 'X-API-Key': STATIC_API_KEY },
      });
      if (!response.ok) throw new Error('Falha ao buscar dados do reporte para o modal');
      return await response.json();
    } catch (error: any) {
      setNotification({ type: 'error', message: error.message });
      return null;
    }
  };

  const openModalForViewEdit = async (reportId: string) => {
    setModalMode('viewEdit');
    setNotification(null);
    setIsSubmittingModal(false);
    const apiReportDetails = await fetchReportByIdForModal(reportId);
    if (apiReportDetails) {
      setEditingReportOriginal(apiReportDetails);
      setCurrentFormData({
        id: String(apiReportDetails.id),
        eventType: apiReportDetails.eventType,
        location: apiReportDetails.location,
        description: apiReportDetails.description,
        reporterName: apiReportDetails.reporterName,
        imageUrl: apiReportDetails.imageUrl,
        reportTimestamp: apiReportDetails.reportTimestamp,
        status: statusOptions.includes(apiReportDetails.status) ? apiReportDetails.status : statusOptions[0],
        severity: severityOptions.includes(apiReportDetails.severity || 'nao_definida') ? (apiReportDetails.severity || 'nao_definida') : severityOptions[0],
        adminNotes: apiReportDetails.adminNotes || '',
        imageFile: null,
      });
      setIsModalOpen(true);
    }
  };

  const openModalForAddAdminReport = () => {
    setModalMode('addAdminReport');
    setNotification(null);
    setIsSubmittingModal(false);
    setCurrentFormData({
      eventType: eventTypeOptions[0],
      location: '',
      description: '',
      reporterName: user?.name || 'Admin',
      status: 'verificado',
      severity: 'media',
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
    setIsSubmittingModal(false);
  };

  const handleModalFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!currentFormData) return;
    const { name, value } = e.target;
    setCurrentFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleModalFormImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentFormData) return;
    if (event.target.files && event.target.files[0]) {
      setCurrentFormData(prev => prev ? { ...prev, imageFile: event.target.files![0] } : null);
    } else {
      setCurrentFormData(prev => prev ? { ...prev, imageFile: null } : null);
    }
  };

  const handleModalFormSubmit = async () => {
    if (!currentFormData || !modalMode) return;

    setIsSubmittingModal(true);
    setNotification(null);

    let url: string;
    let method: string;
    let body: BodyInit;
    let headers: HeadersInit = { 'X-API-Key': STATIC_API_KEY };

    if (modalMode === 'addAdminReport') {
      method = 'POST';
      url = `${API_BASE_URL}/reportes`;

      const formData = new FormData();
      formData.append('reporterName', currentFormData.reporterName || (user?.name || 'Admin'));
      formData.append('eventType', currentFormData.eventType);
      formData.append('description', currentFormData.description);
      formData.append('location', currentFormData.location);
      if (currentFormData.imageFile) {
        formData.append('image', currentFormData.imageFile, currentFormData.imageFile.name);
      }
      if (user && user.id && user.id !== 'admin_id_special') {
        formData.append('userId', user.id);
      }
      body = formData;

    } else if (modalMode === 'viewEdit' && currentFormData.id && editingReportOriginal) {
      method = 'PUT';
      url = `${API_BASE_URL}/reportes/${currentFormData.id}`;
      const payloadForEdit: Partial<ApiReport> & { id: number } = {
        id: parseInt(currentFormData.id),
        eventType: editingReportOriginal.eventType,
        location: editingReportOriginal.location,
        description: currentFormData.description,
        reporterName: currentFormData.reporterName,
        userId: editingReportOriginal.userId,
        imageUrl: currentFormData.imageUrl || editingReportOriginal.imageUrl,
        reportTimestamp: editingReportOriginal.reportTimestamp,
        status: currentFormData.status,
        severity: currentFormData.severity,
        adminNotes: currentFormData.adminNotes,
      };
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(payloadForEdit);
    } else {
      setNotification({ type: 'error', message: 'Ação inválida ou dados do reporte ausentes.' });
      setIsSubmittingModal(false);
      return;
    }

    try {
      const response = await fetch(url, { method, headers, body });
      if (!response.ok) {
        let errorMsg = `Erro HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorData.entity || errorData.error || JSON.stringify(errorData) || errorMsg;
        } catch (e) {
          try {
            const textError = await response.text();
            errorMsg = textError || errorMsg;
          } catch (e2) { /* Mantém errorMsg original */ }
        }
        throw new Error(errorMsg);
      }
      setNotification({ type: 'success', message: `Reporte ${modalMode === 'addAdminReport' ? 'criado' : 'atualizado'} com sucesso!` });
      fetchReports(); // Atualiza a lista principal, que acionará o useEffect de filtragem
      closeModal();
    } catch (error: any) {
      setNotification({ type: 'error', message: error.message || `Falha ao ${modalMode === 'addAdminReport' ? 'criar' : 'atualizar'} reporte.` });
    } finally {
      setIsSubmittingModal(false);
    }
  };

  const handleMudarStatusRapido = async (reportId: string, newStatus: ReportStatus) => {
    setNotification(null);
    // setIsLoading(true); // Pode ser redundante se fetchReports já o faz
    try {
      const reportToUpdate = await fetchReportByIdForModal(reportId);
      if (!reportToUpdate) {
        throw new Error("Reporte não encontrado para atualização de status.");
      }
      const payload: ApiReport = { ...reportToUpdate, status: newStatus };

      const response = await fetch(`${API_BASE_URL}/reportes/${reportId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-API-Key': STATIC_API_KEY },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Erro ${response.status}` }));
        throw new Error(errorData.message || errorData.entity || `Erro ${response.status}`);
      }
      setNotification({ type: 'success', message: `Status do reporte ${reportId} alterado para "${newStatus}".` });
      fetchReports();
    } catch (error: any) {
      setNotification({ type: 'error', message: error.message || 'Falha ao alterar status do reporte.' });
      fetchReports(); // Recarrega mesmo em caso de erro para garantir consistência do estado
    } finally {
      // setIsLoading(false); // fetchReports gerencia isLoading
    }
  };

  const handleRemover = async (reportId: string) => {
    const reportToRemove = reports.find(r => r.id === reportId); // Busca na lista original
    if (!reportToRemove) return;
    if (window.confirm(`Tem certeza que deseja remover o reporte "${reportToRemove.eventType.replace(/([A-Z])/g, ' $1').trim()} em ${reportToRemove.location}"?`)) {
      setNotification(null);
      // setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/reportes/${reportId}`, {
          method: 'DELETE',
          headers: { 'X-API-Key': STATIC_API_KEY },
        });
        if (!response.ok) {
          let errorMsg = `Erro ${response.status}`;
          try { const data = await response.json(); errorMsg = data.message || data.entity || errorMsg; } catch (e) { }
          throw new Error(errorMsg);
        }
        setNotification({ type: 'success', message: `Reporte ${reportId} removido.` });
        fetchReports();
      } catch (error: any) {
        setNotification({ type: 'error', message: error.message || 'Falha ao remover reporte.' });
      } finally {
        // setIsLoading(false);
      }
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedEventType('');
    setSelectedStatus('');
  };

  if (!isAuthenticated || !isAdmin && typeof window !== 'undefined') {
    return <div className="p-6 text-center">Verificando permissões...</div>;
  }
  if (!isAdmin && !isLoading && typeof window !== 'undefined') {
    router.push('/');
    return null;
  }

  const renderViewModalContent = () => {
    if (!currentFormData) return null;
    const originalDataForDisplay = modalMode === 'viewEdit' ? editingReportOriginal : null;

    return (
      <div className="space-y-3 text-sm max-h-[75vh] overflow-y-auto pr-2">
        {(modalMode === 'viewEdit' && originalDataForDisplay?.id) && (
          <p><strong>ID do Reporte:</strong> {originalDataForDisplay.id}</p>
        )}

        <div className={(modalMode === 'addAdminReport' || !originalDataForDisplay?.reportTimestamp) ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'grid grid-cols-2 gap-4'}>
          <div>
            <label htmlFor="eventType" className="block text-xs font-medium text-gray-700">Tipo de Evento</label>
            <select id="eventType" name="eventType"
              value={currentFormData.eventType}
              onChange={handleModalFormInputChange}
              disabled={modalMode === 'viewEdit'}
              required
              className="mt-1 p-2 w-full border border-slate-300 rounded-md bg-white disabled:bg-slate-100 disabled:text-slate-500">
              {eventTypeOptions.map(type => <option key={type} value={type}>{type.replace(/([A-Z])/g, ' $1').trim()}</option>)}
            </select>
          </div>
          {modalMode === 'viewEdit' && originalDataForDisplay?.reportTimestamp && (
            <p className="mt-5 self-end"><strong>Data do Reporte:</strong> {new Date(originalDataForDisplay.reportTimestamp).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          )}
        </div>
        <div>
          <label htmlFor="location" className="block text-xs font-medium text-gray-700">Localização</label>
          <input type="text" id="location" name="location"
            value={currentFormData.location}
            onChange={handleModalFormInputChange}
            required
            disabled={modalMode === 'viewEdit'}
            className="mt-1 p-2 w-full border border-slate-300 rounded-md bg-white disabled:bg-slate-100 disabled:text-slate-500" />
        </div>
        <div>
          <label htmlFor="reporterName" className="block text-xs font-medium text-gray-700">Reportado por</label>
          <input type="text" id="reporterName" name="reporterName"
            value={currentFormData.reporterName || ''}
            onChange={handleModalFormInputChange}
            disabled={modalMode === 'viewEdit' && !!originalDataForDisplay?.userId && originalDataForDisplay?.reporterName !== "Anônimo"}
            placeholder={modalMode === 'addAdminReport' ? (user?.name || 'Admin') : 'Nome do reportador'}
            className="mt-1 p-2 w-full border border-slate-300 rounded-md bg-white disabled:bg-slate-100 disabled:text-slate-500" />
          {modalMode === 'viewEdit' && originalDataForDisplay?.userId &&
            <span className="text-xs text-gray-500 ml-1">(Usuário ID: {originalDataForDisplay.userId})</span>}
        </div>

        <div>
          <label htmlFor="description" className="block text-xs font-medium text-gray-700">Descrição Completa:</label>
          <textarea id="description" name="description" value={currentFormData.description}
            onChange={handleModalFormInputChange}
            rows={modalMode === 'viewEdit' && originalDataForDisplay?.imageUrl ? 3 : 5}
            required
            className="mt-1 p-2 w-full border border-slate-300 rounded-md bg-white" />
        </div>

        {modalMode === 'viewEdit' && originalDataForDisplay?.imageUrl && (
          <div className="my-2">
            <p className="text-xs font-medium text-gray-700">Imagem Anexada:</p>
            <img src={originalDataForDisplay.imageUrl.startsWith('http') ? originalDataForDisplay.imageUrl : `${API_BASE_URL}${originalDataForDisplay.imageUrl}`}
              alt="Imagem do Reporte"
              className="mt-1 rounded-md max-w-full max-h-48 border" />
          </div>
        )}
        {(modalMode === 'addAdminReport') && (
          <div>
            <label htmlFor="adminReportImageFile" className="block text-xs font-medium text-gray-700">Imagem (opcional)</label>
            <input type="file" name="imageFile" id="adminReportImageFile"
              accept="image/*"
              onChange={handleModalFormImageChange}
              className="mt-1 block w-full text-sm" />
          </div>
        )}
        {(modalMode === 'viewEdit') && (
          <div>
            <label htmlFor="imageUrl" className="block text-xs font-medium text-gray-700">URL da Imagem (se houver, pode editar)</label>
            <input type="text" name="imageUrl" id="imageUrl"
              value={currentFormData.imageUrl || ''}
              onChange={handleModalFormInputChange}
              placeholder="https://exemplo.com/imagem.jpg ou deixe em branco"
              className="mt-1 p-2 w-full border border-slate-300 rounded-md" />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 my-4">
          <div>
            <label htmlFor="status" className="block text-xs font-medium text-gray-700">Status:</label>
            <select id="status" name="status"
              value={currentFormData.status}
              onChange={handleModalFormInputChange}
              className="mt-1 p-2 w-full border border-slate-300 rounded-md">
              {statusOptions.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="severity" className="block text-xs font-medium text-gray-700">Severidade Avaliada:</label>
            <select id="severity" name="severity"
              value={currentFormData.severity}
              onChange={handleModalFormInputChange}
              className="mt-1 p-2 w-full border border-slate-300 rounded-md">
              {severityOptions.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="adminNotes" className="block text-xs font-medium text-gray-700">Notas do Administrador:</label>
          <textarea id="adminNotes" name="adminNotes" rows={3}
            value={currentFormData.adminNotes || ''}
            onChange={handleModalFormInputChange}
            placeholder="Adicione observações ou ações tomadas..."
            className="mt-1 p-2 w-full border border-slate-300 rounded-md" />
        </div>

        <div className="flex justify-end space-x-3 pt-4 mt-4 border-t">
          <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
            Cancelar
          </button>
          <button type="button" onClick={handleModalFormSubmit} disabled={isSubmittingModal || isLoading} className="px-4 py-2 text-sm font-medium text-white bg-[var(--brand-header-bg)] rounded-md hover:bg-opacity-80 disabled:opacity-50">
            {isSubmittingModal ? "Salvando..." : (modalMode === 'addAdminReport' ? "Adicionar Reporte" : "Salvar Alterações")}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 md:py-12">
      <section className="mb-10 md:mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--brand-header-bg)]">
            Gerenciar Reportes da Comunidade
          </h1>
          <button
            onClick={openModalForAddAdminReport}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2.5 rounded-lg shadow-md transition-colors flex items-center justify-center"
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            Adicionar Reporte (Admin)
          </button>
        </div>
        <p className="text-lg text-[var(--brand-text-secondary)] mt-4">
          Visualize, valide e gerencie os reportes enviados pelos usuários.
        </p>
      </section>

      {notification && (
        <div className={`p-4 mb-6 text-sm rounded-lg ${notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`} role="alert">
          {notification.message}
        </div>
      )}

      {/* Seção de Filtros e Busca ATUALIZADA */}
      <section className="mb-8 p-4 bg-[var(--brand-card-background)] rounded-lg shadow-[var(--shadow-subtle)]">
        <h2 className="text-xl font-semibold text-[var(--brand-text-primary)] mb-3">Filtros e Busca</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="searchTermInput" className="sr-only">Termo de busca</label>
            <input
              id="searchTermInput"
              type="text"
              placeholder="Buscar por tipo, local, descrição, reportador..."
              className="p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[var(--brand-header-bg)] w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="filterEventType" className="sr-only">Filtrar por Tipo de Evento</label>
            <select
              id="filterEventType"
              className="p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[var(--brand-header-bg)] w-full"
              value={selectedEventType}
              onChange={(e) => setSelectedEventType(e.target.value)}
            >
              <option value="">Todos os Tipos</option>
              {eventTypeOptions.map(type => <option key={type} value={type}>{type.replace(/([A-Z])/g, ' $1').trim()}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="filterStatus" className="sr-only">Filtrar por Status</label>
            <select
              id="filterStatus"
              className="p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[var(--brand-header-bg)] w-full"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as ReportStatus | '')}
            >
              <option value="">Todos os Status</option>
              {statusOptions.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-200 rounded-md hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--brand-header-bg)]"
            aria-label="Limpar filtros"
          >
            Limpar Filtros
          </button>
        </div>
      </section>

      <section className="bg-[var(--brand-card-background)] p-4 sm:p-6 rounded-lg shadow-[var(--shadow-subtle)] overflow-x-auto">
        {isLoading ? (
          <p className="text-center text-[var(--brand-text-secondary)] py-8">Carregando reportes...</p>
        ) : reports.length === 0 ? (
          <p className="text-center text-[var(--brand-text-secondary)] py-8">Nenhum reporte cadastrado no sistema.</p>
        ) : filteredReports.length === 0 ? (
          <p className="text-center text-[var(--brand-text-secondary)] py-8">Nenhum reporte encontrado com os filtros aplicados.</p>
        ) : (
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
              {filteredReports.map((report) => ( // <-- Alterado para filteredReports
                <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--brand-text-primary)]">{report.eventType.replace(/([A-Z])/g, ' $1').trim()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--brand-text-secondary)] max-w-xs truncate" title={report.location}>{report.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--brand-text-secondary)] max-w-xs truncate" title={report.reporterInfo}>{report.reporterInfo}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${report.status === 'novo' ? 'bg-blue-100 text-blue-800' :
                      report.status === 'verificado' ? 'bg-teal-100 text-teal-800' :
                        report.status === 'em_atendimento' ? 'bg-yellow-100 text-yellow-800' :
                          report.status === 'resolvido' ? 'bg-green-100 text-green-800' :
                            report.status === 'falso_positivo' ? 'bg-red-100 text-red-800' :
                              'bg-slate-100 text-slate-800'
                      }`}>
                      {report.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--brand-text-secondary)]">
                    {report.createdAt ? new Date(report.createdAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1 flex items-center">
                    <button onClick={() => openModalForViewEdit(report.id)} title="Visualizar/Editar Detalhes" className="text-slate-600 hover:text-slate-800 p-1"><EyeIcon className="w-5 h-5" /></button>

                    {report.status === 'novo' && (
                      <button onClick={() => handleMudarStatusRapido(report.id, 'verificado')} title="Marcar como Verificado" className="text-teal-600 hover:text-teal-800 p-1"><CheckCircleIcon className="w-5 h-5" /></button>
                    )}
                    {report.status === 'verificado' && (
                      <button onClick={() => handleMudarStatusRapido(report.id, 'em_atendimento')} title="Marcar como Em Atendimento" className="text-purple-600 hover:text-purple-800 p-1"><ShieldExclamationIcon className="w-5 h-5" /></button>
                    )}
                    {report.status === 'em_atendimento' && (
                      <button onClick={() => handleMudarStatusRapido(report.id, 'resolvido')} title="Marcar como Resolvido" className="text-green-600 hover:text-green-800 p-1"><ArrowPathIcon className="w-5 h-5" /></button>
                    )}
                    {report.status !== 'falso_positivo' && report.status !== 'resolvido' && (
                      <button onClick={() => handleMudarStatusRapido(report.id, 'falso_positivo')} title="Marcar como Falso Positivo" className="text-orange-500 hover:text-orange-700 p-1"><XCircleIcon className="w-5 h-5" /></button>
                    )}

                    <button onClick={() => handleRemover(report.id)} title="Remover Reporte" className="text-red-600 hover:text-red-800 p-1"><TrashIcon className="w-5 h-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="bg-[var(--brand-card-background)] p-6 rounded-lg shadow-xl w-full max-w-xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-[var(--brand-text-primary)]">
                {modalMode === 'addAdminReport' ? 'Adicionar Novo Reporte (Admin)' : 'Detalhes e Gerenciamento do Reporte'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
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