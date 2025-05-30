"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { EyeIcon, CheckCircleIcon, XCircleIcon, ShieldExclamationIcon, TrashIcon, ArrowPathIcon, XMarkIcon } from '@heroicons/react/24/outline';
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
  createdAt: string;
  severity?: ReportSeverity;
}

interface ReportViewData {
  id: string; 
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

const API_BASE_URL = 'http://localhost:8080';
const STATIC_API_KEY = '1234';

const statusOptions: ReportStatus[] = ['novo', 'verificado', 'em_atendimento', 'resolvido', 'falso_positivo'];
const severityOptions: ReportSeverity[] = ['nao_definida', 'baixa', 'media', 'alta'];

export default function GerenciarReportesPage() {
  const { isAdmin, isAuthenticated } = useAuth();
  const router = useRouter();

  const [reports, setReports] = useState<ReportData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedReportForView, setSelectedReportForView] = useState<ReportViewData | null>(null);
  
  const [editingReport, setEditingReport] = useState<ReportViewData | null>(null);
  const [currentAdminNotes, setCurrentAdminNotes] = useState('');
  const [currentSeverity, setCurrentSeverity] = useState<ReportSeverity>('nao_definida');

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
      status: apiReport.status || 'novo',
      createdAt: apiReport.reportTimestamp,
      severity: apiReport.severity || 'nao_definida',
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

  const fetchReportById = async (id: string): Promise<ApiReport | null> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/reportes/${id}`, {
        headers: { 'X-API-Key': STATIC_API_KEY },
      });
      if (!response.ok) throw new Error('Falha ao buscar dados do reporte');
      const report: ApiReport = await response.json();
      return report;
    } catch (error: any) {
      setNotification({ type: 'error', message: error.message });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const openViewModal = async (reportId: string) => {
    const apiReportDetails = await fetchReportById(reportId);
    if (apiReportDetails) {
      const reportViewDataInstance: ReportViewData = {
        id: String(apiReportDetails.id),
        eventType: apiReportDetails.eventType,
        location: apiReportDetails.location,
        description: apiReportDetails.description,
        reporterName: apiReportDetails.reporterName,
        userId: apiReportDetails.userId,
        imageUrl: apiReportDetails.imageUrl,
        reportTimestamp: apiReportDetails.reportTimestamp,
        status: apiReportDetails.status,
        severity: apiReportDetails.severity,
        adminNotes: apiReportDetails.adminNotes,
      };
      setSelectedReportForView(reportViewDataInstance);
      setEditingReport(reportViewDataInstance); 
      setCurrentAdminNotes(reportViewDataInstance.adminNotes || '');
      setCurrentSeverity(reportViewDataInstance.severity || 'nao_definida');
      setIsViewModalOpen(true);
      setNotification(null);
    }
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedReportForView(null);
    setEditingReport(null);
    setCurrentAdminNotes('');
    setCurrentSeverity('nao_definida');
  };
  
  const handleUpdateReportDetails = async () => {
    if (!editingReport) return;
    setIsLoading(true); 
    setNotification(null);

    const payload: Partial<ApiReport> & {id: number} = { // API espera id numérico no corpo para PUT
        id: parseInt(editingReport.id),
        status: editingReport.status,
        severity: currentSeverity,
        adminNotes: currentAdminNotes,
        eventType: editingReport.eventType,
        location: editingReport.location,
        description: editingReport.description,
        reporterName: editingReport.reporterName,
        userId: editingReport.userId,
        imageUrl: editingReport.imageUrl,
        reportTimestamp: editingReport.reportTimestamp,
    };

    try {
        const response = await fetch(`${API_BASE_URL}/reportes/${editingReport.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'X-API-Key': STATIC_API_KEY },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({message: `Erro ${response.status}`}));
            throw new Error(errorData.message || errorData.entity || `Erro ${response.status}`);
        }
        setNotification({type: 'success', message: 'Reporte atualizado com sucesso!'});
        fetchReports();
        closeViewModal();
    } catch (error: any) {
        setNotification({type: 'error', message: error.message || 'Falha ao atualizar reporte.'});
    } finally {
        setIsLoading(false);
    }
  };

  const handleMudarStatus = async (reportId: string, newStatus: ReportStatus) => {
    setNotification(null);
    setIsLoading(true);

    try {
      const reportToUpdate = await fetchReportById(reportId);
      if (!reportToUpdate) {
          throw new Error("Reporte não encontrado para atualização de status.");
      }

      const payload: ApiReport = {
        ...reportToUpdate, 
        status: newStatus, 
      };
      
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
      fetchReports(); 
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleRemover = async (reportId: string) => {
    const reportToRemove = reports.find(r => r.id === reportId);
    if (!reportToRemove) return;

    if (window.confirm(`Tem certeza que deseja remover o reporte "${reportToRemove.eventType} em ${reportToRemove.location}"?`)) {
      setNotification(null);
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/reportes/${reportId}`, {
          method: 'DELETE',
          headers: { 'X-API-Key': STATIC_API_KEY },
        });
        if (!response.ok) {
          let errorMsg = `Erro ${response.status}`;
          try { const data = await response.json(); errorMsg = data.message || data.entity || errorMsg; } catch(e){}
          throw new Error(errorMsg);
        }
        setNotification({ type: 'success', message: `Reporte ${reportId} removido.` });
        fetchReports();
      } catch (error: any) {
        setNotification({ type: 'error', message: error.message || 'Falha ao remover reporte.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!isAuthenticated || !isAdmin && typeof window !== 'undefined') {
    return <div className="p-6 text-center">Verificando permissões...</div>;
  }
  if (!isAdmin && !isLoading && typeof window !== 'undefined') {
       router.push('/');
       return null;
  }

  const renderViewModalContent = () => {
    if (!editingReport) return null;

    return (
        <div className="space-y-3 text-sm max-h-[75vh] overflow-y-auto pr-2">
            <p><strong>ID do Reporte:</strong> {editingReport.id}</p>
            <p><strong>Tipo de Evento:</strong> {editingReport.eventType}</p>
            <p><strong>Localização:</strong> {editingReport.location}</p>
            <p><strong>Data do Reporte:</strong> {new Date(editingReport.reportTimestamp).toLocaleString('pt-BR')}</p>
            <p><strong>Reportado por:</strong> {editingReport.reporterName || (editingReport.userId ? `Usuário ID: ${editingReport.userId}` : 'Anônimo')}</p>
            
            <div className="my-4">
                <label htmlFor="descriptionFull" className="block text-xs font-medium text-gray-700">Descrição Completa:</label>
                <textarea id="descriptionFull" value={editingReport.description} readOnly rows={5}
                          className="mt-1 p-2 w-full border border-slate-300 rounded-md bg-slate-50"/>
            </div>

            {editingReport.imageUrl && (
                <div className="my-4">
                    <p className="text-xs font-medium text-gray-700">Imagem Anexada:</p>
                    <img src={editingReport.imageUrl.startsWith('http') ? editingReport.imageUrl : `${API_BASE_URL}${editingReport.imageUrl}`} 
                         alt="Imagem do Reporte" 
                         className="mt-1 rounded-md max-w-full max-h-64 border"/>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4 my-4">
                <div>
                    <label htmlFor="modal_status" className="block text-xs font-medium text-gray-700">Status Atual:</label>
                    <select id="modal_status" name="status" 
                            value={editingReport.status}
                            onChange={(e) => setEditingReport(prev => prev ? {...prev, status: e.target.value as ReportStatus} : null)}
                            className="mt-1 p-2 w-full border border-slate-300 rounded-md">
                        {statusOptions.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="modal_severity" className="block text-xs font-medium text-gray-700">Severidade Avaliada:</label>
                    <select id="modal_severity" name="severity" 
                            value={currentSeverity}
                            onChange={(e) => setCurrentSeverity(e.target.value as ReportSeverity)}
                            className="mt-1 p-2 w-full border border-slate-300 rounded-md">
                        {severityOptions.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                    </select>
                </div>
            </div>
            
            <div>
                <label htmlFor="adminNotes" className="block text-xs font-medium text-gray-700">Notas do Administrador:</label>
                <textarea id="adminNotes" name="adminNotes" rows={3}
                          value={currentAdminNotes}
                          onChange={(e) => setCurrentAdminNotes(e.target.value)}
                          placeholder="Adicione observações ou ações tomadas..."
                          className="mt-1 p-2 w-full border border-slate-300 rounded-md"/>
            </div>

            <div className="flex justify-end space-x-3 pt-4 mt-4 border-t">
                <button type="button" onClick={closeViewModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                    Cancelar
                </button>
                <button type="button" onClick={handleUpdateReportDetails} disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-[var(--brand-header-bg)] rounded-md hover:bg-opacity-80 disabled:opacity-50">
                    {isLoading ? "Salvando..." : "Salvar Alterações no Reporte"}
                </button>
            </div>
        </div>
    );
  };

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

      {notification && (
        <div className={`p-4 mb-6 text-sm rounded-lg ${notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`} role="alert">
          {notification.message}
        </div>
      )}
      
      <section className="mb-8 p-4 bg-[var(--brand-card-background)] rounded-lg shadow-[var(--shadow-subtle)]">
        <h2 className="text-xl font-semibold text-[var(--brand-text-primary)] mb-3">Filtros e Busca</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" placeholder="Buscar por localização ou descrição..." className="p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[var(--brand-header-bg)]"/>
          <select className="p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[var(--brand-header-bg)]">
            <option value="">Todos os Tipos</option>
          </select>
          <select className="p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[var(--brand-header-bg)]">
            <option value="">Todos os Status</option>
            {statusOptions.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--brand-text-secondary)] max-w-xs truncate" title={report.location}>{report.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--brand-text-secondary)] max-w-xs truncate" title={report.reporterInfo}>{report.reporterInfo}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        report.status === 'novo' ? 'bg-blue-100 text-blue-800' :
                        report.status === 'verificado' ? 'bg-teal-100 text-teal-800' :
                        report.status === 'em_atendimento' ? 'bg-yellow-100 text-yellow-800' :
                        report.status === 'resolvido' ? 'bg-green-100 text-green-800' :
                        report.status === 'falso_positivo' ? 'bg-red-100 text-red-800' :
                        'bg-slate-100 text-slate-800'
                    }`}>
                      {report.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--brand-text-secondary)]">
                    {report.createdAt ? new Date(report.createdAt).toLocaleString('pt-BR', {dateStyle:'short', timeStyle:'short'}) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1 flex items-center">
                    <button onClick={() => openViewModal(report.id)} title="Visualizar/Editar Detalhes" className="text-slate-600 hover:text-slate-800 p-1"><EyeIcon className="w-5 h-5"/></button>
                    
                    {report.status === 'novo' && (
                        <button onClick={() => handleMudarStatus(report.id, 'verificado')} title="Marcar como Verificado" className="text-teal-600 hover:text-teal-800 p-1"><CheckCircleIcon className="w-5 h-5"/></button>
                    )}
                    {report.status === 'verificado' && (
                        <button onClick={() => handleMudarStatus(report.id, 'em_atendimento')} title="Marcar como Em Atendimento" className="text-purple-600 hover:text-purple-800 p-1"><ShieldExclamationIcon className="w-5 h-5"/></button>
                    )}
                    {report.status === 'em_atendimento' && (
                        <button onClick={() => handleMudarStatus(report.id, 'resolvido')} title="Marcar como Resolvido" className="text-green-600 hover:text-green-800 p-1"><ArrowPathIcon className="w-5 h-5"/></button>
                    )}
                    {report.status !== 'falso_positivo' && report.status !== 'resolvido' && (
                        <button onClick={() => handleMudarStatus(report.id, 'falso_positivo')} title="Marcar como Falso Positivo" className="text-orange-500 hover:text-orange-700 p-1"><XCircleIcon className="w-5 h-5"/></button>
                    )}

                    <button onClick={() => handleRemover(report.id)} title="Remover Reporte" className="text-red-600 hover:text-red-800 p-1"><TrashIcon className="w-5 h-5"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-[var(--brand-text-secondary)] py-8">Nenhum reporte encontrado ou falha ao carregar.</p>
        )}
      </section>

      {isViewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="bg-[var(--brand-card-background)] p-6 rounded-lg shadow-xl w-full max-w-xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-[var(--brand-text-primary)]">
                Detalhes e Gerenciamento do Reporte
              </h2>
              <button onClick={closeViewModal} className="text-gray-500 hover:text-gray-700">
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