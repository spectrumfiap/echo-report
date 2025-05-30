"use client";

import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircleIcon, PencilSquareIcon, TrashIcon, EyeIcon as SolidEyeIcon, MapPinIcon } from '@heroicons/react/24/solid'; // Usando ícones sólidos para consistência
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../../contexts/AuthContext';

type RiskLevel = 'alto' | 'medio' | 'baixo';

interface ApiMapa {
  id: number;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  radius: number;
  riskLevel: RiskLevel;
  reason?: string;
  lastUpdatedTimestamp?: string;
  isActive: boolean;
}

interface MapaData {
  id: string;
  title: string;
  riskLevel: RiskLevel;
  isActive: boolean;
  center: string;
  radius: string;
  lastUpdated: string;
}

interface MapaFormData {
  id?: string;
  title: string;
  description: string;
  latitude: string;
  longitude: string;
  radius: string;
  riskLevel: RiskLevel;
  reason?: string;
  isActive: boolean;
}

const API_BASE_URL = 'http://localhost:8080';
const STATIC_API_KEY = '1234';

const riskLevelOptions: RiskLevel[] = ['baixo', 'medio', 'alto'];

export default function GerenciarMapasPage() {
  const { isAdmin, isAuthenticated } = useAuth();
  const router = useRouter();

  const [mapas, setMapas] = useState<MapaData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<'add' | 'edit' | 'view' | null>(null);
  const [selectedMapa, setSelectedMapa] = useState<ApiMapa | null>(null); // Para view e preencher edit
  const [mapaFormData, setMapaFormData] = useState<MapaFormData | null>(null);
  const [isSubmittingModal, setIsSubmittingModal] = useState(false);

  const mapApiMapaToMapaData = useCallback((apiMapa: ApiMapa): MapaData => {
    return {
      id: String(apiMapa.id),
      title: apiMapa.title,
      riskLevel: apiMapa.riskLevel,
      isActive: apiMapa.isActive,
      center: `${apiMapa.latitude.toFixed(4)}, ${apiMapa.longitude.toFixed(4)}`,
      radius: `${apiMapa.radius} m`,
      lastUpdated: apiMapa.lastUpdatedTimestamp ? new Date(apiMapa.lastUpdatedTimestamp).toLocaleString('pt-BR') : 'N/A',
    };
  }, []);

  const fetchMapas = useCallback(async () => {
    if (!isAdmin) return;
    setIsLoading(true);
    setNotification(null);
    try {
      const response = await fetch(`${API_BASE_URL}/mapas`, {
        method: 'GET',
        headers: { 'X-API-Key': STATIC_API_KEY, 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Erro ${response.status}` }));
        throw new Error(errorData.message || `Erro ${response.status}`);
      }
      const apiMapas: ApiMapa[] = await response.json();
      setMapas(apiMapas.map(mapApiMapaToMapaData));
    } catch (error: any) {
      setNotification({ type: 'error', message: error.message || 'Falha ao carregar zonas de risco.' });
      setMapas([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin, mapApiMapaToMapaData]);

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
    else if (!isAdmin) router.push('/');
    else fetchMapas();
  }, [isAdmin, isAuthenticated, router, fetchMapas]);

  const fetchMapaById = async (id: string): Promise<ApiMapa | null> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/mapas/${id}`, {
        headers: { 'X-API-Key': STATIC_API_KEY },
      });
      if (!response.ok) throw new Error('Falha ao buscar dados da zona de risco');
      return await response.json();
    } catch (error: any) {
      setNotification({ type: 'error', message: error.message });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = async (action: 'add' | 'edit' | 'view', mapaId?: string) => {
    setModalAction(action);
    setNotification(null);
    if (action === 'add') {
      setMapaFormData({
        title: '', description: '', latitude: '', longitude: '', radius: '500',
        riskLevel: 'medio', reason: '', isActive: true,
      });
      setSelectedMapa(null);
      setIsModalOpen(true);
    } else if (mapaId) {
      const mapaDetails = await fetchMapaById(mapaId);
      if (mapaDetails) {
        setSelectedMapa(mapaDetails);
        setMapaFormData({
          id: String(mapaDetails.id),
          title: mapaDetails.title,
          description: mapaDetails.description,
          latitude: String(mapaDetails.latitude),
          longitude: String(mapaDetails.longitude),
          radius: String(mapaDetails.radius),
          riskLevel: mapaDetails.riskLevel,
          reason: mapaDetails.reason || '',
          isActive: mapaDetails.isActive,
        });
        setIsModalOpen(true);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalAction(null);
    setSelectedMapa(null);
    setMapaFormData(null);
    setIsSubmittingModal(false);
  };

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!mapaFormData) return;
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setMapaFormData({ ...mapaFormData, [name]: checked });
    } else {
        setMapaFormData({ ...mapaFormData, [name]: value });
    }
  };
  
  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!mapaFormData) return;
    setIsSubmittingModal(true);
    setNotification(null);

    const payload: Omit<ApiMapa, 'id' | 'lastUpdatedTimestamp'> & { id?: number } = {
      title: mapaFormData.title,
      description: mapaFormData.description,
      latitude: parseFloat(mapaFormData.latitude),
      longitude: parseFloat(mapaFormData.longitude),
      radius: parseInt(mapaFormData.radius, 10),
      riskLevel: mapaFormData.riskLevel,
      reason: mapaFormData.reason || undefined,
      isActive: mapaFormData.isActive,
    };
    if (modalAction === 'edit' && mapaFormData.id) {
        payload.id = parseInt(mapaFormData.id);
    }
    
    let response: Response;
    try {
      if (modalAction === 'add') {
        response = await fetch(`${API_BASE_URL}/mapas`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-API-Key': STATIC_API_KEY },
          body: JSON.stringify(payload),
        });
      } else if (modalAction === 'edit' && mapaFormData.id) {
        response = await fetch(`${API_BASE_URL}/mapas/${mapaFormData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'X-API-Key': STATIC_API_KEY },
          body: JSON.stringify(payload),
        });
      } else {
        throw new Error("Ação de formulário inválida.");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Erro ${response.status}` }));
        throw new Error(errorData.message || errorData.entity || `Erro ${response.status}`);
      }
      
      const actionText = modalAction === 'add' ? 'criada' : 'atualizada';
      setNotification({ type: 'success', message: `Zona de Risco ${actionText} com sucesso!` });
      fetchMapas();
      closeModal();

    } catch (error: any) {
      setNotification({ type: 'error', message: error.message || `Falha ao ${modalAction === 'add' ? 'criar' : 'atualizar'} zona de risco.` });
    } finally {
      setIsSubmittingModal(false);
    }
  };
  
  const handleRemover = async (mapaId: string, mapaTitle: string) => {
    if (window.confirm(`Tem certeza que deseja remover a zona de risco "${mapaTitle}"?`)) {
      setNotification(null);
      try {
        const response = await fetch(`${API_BASE_URL}/mapas/${mapaId}`, {
          method: 'DELETE',
          headers: { 'X-API-Key': STATIC_API_KEY },
        });
        if (!response.ok) {
          let errorMsg = `Erro ${response.status}`;
          try { const data = await response.json(); errorMsg = data.message || data.entity || errorMsg; } catch(e){}
          throw new Error(errorMsg);
        }
        setNotification({ type: 'success', message: `Zona de Risco "${mapaTitle}" removida.` });
        fetchMapas();
      } catch (error: any) {
        setNotification({ type: 'error', message: error.message || 'Falha ao remover zona de risco.' });
      }
    }
  };

  if (!isAuthenticated || !isAdmin && typeof window !== 'undefined') {
    return <div className="container mx-auto p-6 text-center">Verificando permissões...</div>;
  }
  if (!isAdmin && !isLoading) return null;

  const renderModalContent = () => {
    const dataForView = selectedMapa; 
    const dataForForm = mapaFormData;

    if (modalAction === 'view') {
      if (!dataForView) return null;
      return (
        <div className="space-y-2 text-sm max-h-[70vh] overflow-y-auto pr-2">
          <h3 className="text-xl font-semibold text-[var(--brand-text-primary)] mb-3">Detalhes da Zona de Risco</h3>
          <p><strong>ID:</strong> {dataForView.id}</p>
          <p><strong>Título:</strong> {dataForView.title}</p>
          <p><strong>Descrição:</strong> {dataForView.description}</p>
          <p><strong>Coordenadas (Lat, Lng):</strong> {dataForView.latitude}, {dataForView.longitude}</p>
          <p><strong>Raio:</strong> {dataForView.radius} metros</p>
          <p><strong>Nível de Risco:</strong> {dataForView.riskLevel}</p>
          <p><strong>Motivo:</strong> {dataForView.reason || 'N/A'}</p>
          <p><strong>Status:</strong> {dataForView.isActive ? 'Ativa' : 'Inativa'}</p>
          <p><strong>Última Atualização:</strong> {dataForView.lastUpdatedTimestamp ? new Date(dataForView.lastUpdatedTimestamp).toLocaleString('pt-BR') : 'N/A'}</p>
        </div>
      );
    } else if (modalAction === 'add' || modalAction === 'edit') {
      if (!dataForForm) return null;
      return (
        <form onSubmit={handleFormSubmit} className="space-y-3 text-sm max-h-[70vh] overflow-y-auto pr-2">
          <h3 className="text-xl font-semibold text-[var(--brand-text-primary)] mb-3">
            {modalAction === 'add' ? 'Adicionar Nova Zona de Risco' : 'Editar Zona de Risco'}
          </h3>
          <div>
            <label htmlFor="title" className="block text-xs font-medium text-[var(--brand-text-secondary)]">Título</label>
            <input type="text" name="title" id="title" value={dataForForm.title} onChange={handleFormInputChange} required className="mt-1 p-2 w-full border border-slate-300 rounded-md"/>
          </div>
          <div>
            <label htmlFor="description" className="block text-xs font-medium text-[var(--brand-text-secondary)]">Descrição</label>
            <textarea name="description" id="description" rows={3} value={dataForForm.description} onChange={handleFormInputChange} required className="mt-1 p-2 w-full border border-slate-300 rounded-md"/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
            <div>
              <label htmlFor="latitude" className="block text-xs font-medium text-[var(--brand-text-secondary)]">Latitude</label>
              <input type="number" step="any" name="latitude" id="latitude" value={dataForForm.latitude} onChange={handleFormInputChange} required placeholder="-23.5505" className="mt-1 p-2 w-full border border-slate-300 rounded-md"/>
            </div>
            <div>
              <label htmlFor="longitude" className="block text-xs font-medium text-[var(--brand-text-secondary)]">Longitude</label>
              <input type="number" step="any" name="longitude" id="longitude" value={dataForForm.longitude} onChange={handleFormInputChange} required placeholder="-46.6333" className="mt-1 p-2 w-full border border-slate-300 rounded-md"/>
            </div>
            <div>
              <label htmlFor="radius" className="block text-xs font-medium text-[var(--brand-text-secondary)]">Raio (metros)</label>
              <input type="number" name="radius" id="radius" value={dataForForm.radius} onChange={handleFormInputChange} required placeholder="500" className="mt-1 p-2 w-full border border-slate-300 rounded-md"/>
            </div>
            <div>
              <label htmlFor="riskLevel" className="block text-xs font-medium text-[var(--brand-text-secondary)]">Nível de Risco</label>
              <select name="riskLevel" id="riskLevel" value={dataForForm.riskLevel} onChange={handleFormInputChange} className="mt-1 p-2 w-full border border-slate-300 rounded-md">
                {riskLevelOptions.map(level => <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="reason" className="block text-xs font-medium text-[var(--brand-text-secondary)]">Motivo (opcional)</label>
            <input type="text" name="reason" id="reason" value={dataForForm.reason || ''} onChange={handleFormInputChange} className="mt-1 p-2 w-full border border-slate-300 rounded-md"/>
          </div>
           <div className="flex items-center mt-2">
              <input type="checkbox" name="isActive" id="isActive" checked={dataForForm.isActive} onChange={handleFormInputChange} className="h-4 w-4 text-[var(--brand-header-bg)] border-gray-300 rounded focus:ring-[var(--brand-header-bg)]"/>
              <label htmlFor="isActive" className="ml-2 block text-sm text-[var(--brand-text-secondary)]">Zona Ativa no Mapa Público?</label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">Cancelar</button>
            <button type="submit" disabled={isSubmittingModal} className="px-4 py-2 text-sm font-medium text-white bg-[var(--brand-header-bg)] rounded-md hover:bg-opacity-80 disabled:opacity-50">
              {isSubmittingModal ? 'Salvando...' : (modalAction === 'add' ? 'Criar Zona' : 'Salvar Alterações')}
            </button>
          </div>
        </form>
      );
    }
    return null;
  };
  
  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 md:py-12">
      <section className="mb-10 md:mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--brand-header-bg)]">Gerenciar Zonas de Risco</h1>
          <button onClick={() => openModal('add')}
            className="w-full sm:w-auto bg-[var(--brand-header-bg)] text-[var(--brand-text-header)] font-semibold px-6 py-2.5 rounded-lg shadow-md hover:bg-opacity-80 transition-colors flex items-center justify-center">
            <MapPinIcon className="w-5 h-5 mr-2" /> Adicionar Nova Zona
          </button>
        </div>
        <p className="text-lg text-[var(--brand-text-secondary)] mt-4">Crie, edite ou remova zonas de risco oficiais que aparecerão no mapa público.</p>
      </section>

      {notification && (
        <div className={`p-4 mb-6 text-sm rounded-lg ${notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`} role="alert">
          {notification.message}
        </div>
      )}
      
      <section className="mb-8 p-4 bg-[var(--brand-card-background)] rounded-lg shadow-[var(--shadow-subtle)]">
        <h2 className="text-xl font-semibold text-[var(--brand-text-primary)] mb-3">Filtros e Busca</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" placeholder="Buscar por título..." className="p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[var(--brand-header-bg)]"/>
          <select className="p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[var(--brand-header-bg)]">
            <option value="">Todos os Níveis</option>
            {riskLevelOptions.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <select className="p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[var(--brand-header-bg)]">
            <option value="">Todos os Status (Ativa/Inativa)</option>
            <option value="true">Ativa</option>
            <option value="false">Inativa</option>
          </select>
        </div>
      </section>

      <section className="bg-[var(--brand-card-background)] p-4 sm:p-6 rounded-lg shadow-[var(--shadow-subtle)] overflow-x-auto">
        {isLoading ? (
          <p className="text-center text-[var(--brand-text-secondary)] py-8">Carregando zonas de risco...</p>
        ) : mapas.length > 0 ? (
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Título</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Nível Risco</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Centro (Lat, Lng)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Raio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Últ. Att.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {mapas.map((mapaItem) => (
                <tr key={mapaItem.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--brand-text-primary)] max-w-xs truncate" title={mapaItem.title}>{mapaItem.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                     <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        mapaItem.riskLevel === 'alto' ? 'bg-red-100 text-red-800' : 
                        mapaItem.riskLevel === 'medio' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'}`}>
                      {mapaItem.riskLevel.charAt(0).toUpperCase() + mapaItem.riskLevel.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${mapaItem.isActive ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                        {mapaItem.isActive ? 'Ativa' : 'Inativa'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--brand-text-secondary)]">{mapaItem.center}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--brand-text-secondary)]">{mapaItem.radius}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--brand-text-secondary)]">{mapaItem.lastUpdated}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1 flex items-center">
                    <button onClick={() => openModal('view', mapaItem.id)} title="Visualizar" className="text-slate-600 hover:text-slate-800 p-1"><SolidEyeIcon className="w-5 h-5"/></button>
                    <button onClick={() => openModal('edit', mapaItem.id)} title="Editar" className="text-yellow-600 hover:text-yellow-800 p-1"><PencilSquareIcon className="w-5 h-5"/></button>
                    <button onClick={() => handleRemover(mapaItem.id, mapaItem.title)} title="Remover" className="text-red-600 hover:text-red-800 p-1"><TrashIcon className="w-5 h-5"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-[var(--brand-text-secondary)] py-8">Nenhuma zona de risco cadastrada ou falha ao carregar.</p>
        )}
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="bg-[var(--brand-card-background)] p-6 rounded-lg shadow-xl w-full max-w-xl"> {/* Ajustado para max-w-xl */}
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-[var(--brand-text-primary)]">
                {modalAction === 'add' && 'Adicionar Nova Zona de Risco'}
                {modalAction === 'edit' && 'Editar Zona de Risco'}
                {modalAction === 'view' && 'Detalhes da Zona de Risco'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="pt-4">
              {renderModalContent()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}