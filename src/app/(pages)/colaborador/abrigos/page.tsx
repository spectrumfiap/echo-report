"use client";

import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircleIcon, PencilSquareIcon, TrashIcon, EyeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../../contexts/AuthContext';

type ShelterOperationalStatus = 'Disponível' | 'Lotado' | 'Fechado' | 'Manutenção';

interface ApiShelter {
  id: number;
  name: string;
  imageUrl?: string;
  address: string;
  neighborhood: string;
  cityState: string;
  zipCode?: string;
  contactPhone?: string;
  contactEmail?: string;
  capacityStatus: string;
  servicesOffered?: string[];
  targetAudience: string;
  operatingHours: string;
  observations?: string;
  mapsUrl?: string;
  latitude?: number;
  longitude?: number;
  statusOperacional: ShelterOperationalStatus;
  createdAt?: string; 
  updatedAt?: string; 
}

interface ShelterData {
  id: string;
  name: string;
  address: string;
  neighborhood: string;
  cityState: string;
  capacityStatus: string;
  statusOperacional: ShelterOperationalStatus;
  updatedAt: string;
}

interface ShelterFormData {
  id?: string;
  name: string;
  imageUrl?: string;
  address: string;
  neighborhood: string;
  cityState: string;
  zipCode?: string;
  contactPhone?: string;
  contactEmail?: string;
  capacityStatus: string;
  servicesOffered: string; 
  targetAudience: string;
  operatingHours: string;
  observations?: string;
  mapsUrl?: string;
  latitude?: string; 
  longitude?: string; 
  statusOperacional: ShelterOperationalStatus;
}

const API_BASE_URL = 'http://localhost:8080';
const STATIC_API_KEY = '1234';

const operationalStatusOptions: ShelterOperationalStatus[] = ['Disponível', 'Lotado', 'Fechado', 'Manutenção'];

export default function GerenciarAbrigosPage() {
  const { isAdmin, isAuthenticated } = useAuth();
  const router = useRouter();

  const [shelters, setShelters] = useState<ShelterData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<'add' | 'edit' | 'view' | null>(null);
  const [selectedShelter, setSelectedShelter] = useState<ApiShelter | null>(null);
  const [shelterFormData, setShelterFormData] = useState<ShelterFormData | null>(null);
  const [isSubmittingModal, setIsSubmittingModal] = useState(false);

  const mapApiShelterToShelterData = useCallback((apiShelter: ApiShelter): ShelterData => {
    return {
      id: String(apiShelter.id),
      name: apiShelter.name,
      address: apiShelter.address,
      neighborhood: apiShelter.neighborhood,
      cityState: apiShelter.cityState,
      capacityStatus: apiShelter.capacityStatus,
      statusOperacional: apiShelter.statusOperacional,
      updatedAt: apiShelter.updatedAt || apiShelter.createdAt || new Date().toISOString(),
    };
  }, []);

  const fetchShelters = useCallback(async () => {
    if (!isAdmin) return;
    setIsLoading(true);
    setNotification(null);
    try {
      const response = await fetch(`${API_BASE_URL}/abrigos`, {
        method: 'GET',
        headers: { 'X-API-Key': STATIC_API_KEY, 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Erro ${response.status}` }));
        throw new Error(errorData.message || `Erro ${response.status}`);
      }
      const apiShelters: ApiShelter[] = await response.json();
      setShelters(apiShelters.map(mapApiShelterToShelterData));
    } catch (error: any) {
      setNotification({ type: 'error', message: error.message || 'Falha ao carregar abrigos.' });
      setShelters([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin, mapApiShelterToShelterData]);

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
    else if (!isAdmin) router.push('/');
    else fetchShelters();
  }, [isAdmin, isAuthenticated, router, fetchShelters]);

  const fetchShelterById = async (id: string): Promise<ApiShelter | null> => {
    setIsLoading(true); 
    try {
      const response = await fetch(`${API_BASE_URL}/abrigos/${id}`, {
        headers: { 'X-API-Key': STATIC_API_KEY },
      });
      if (!response.ok) throw new Error('Falha ao buscar dados do abrigo');
      return await response.json();
    } catch (error: any) {
      setNotification({ type: 'error', message: error.message });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = async (action: 'add' | 'edit' | 'view', shelterId?: string) => {
    setModalAction(action);
    setNotification(null);
    if (action === 'add') {
      setShelterFormData({
        name: '', imageUrl: '', address: '', neighborhood: '', cityState: '', zipCode: '',
        contactPhone: '', contactEmail: '', capacityStatus: '', servicesOffered: '',
        targetAudience: '', operatingHours: '', observations: '', mapsUrl: '',
        latitude: '', longitude: '', statusOperacional: 'Disponível',
      });
      setSelectedShelter(null);
      setIsModalOpen(true);
    } else if (shelterId) {
      const shelterDetails = await fetchShelterById(shelterId);
      if (shelterDetails) {
        setSelectedShelter(shelterDetails);
        setShelterFormData({
          id: String(shelterDetails.id),
          name: shelterDetails.name,
          imageUrl: shelterDetails.imageUrl || '',
          address: shelterDetails.address,
          neighborhood: shelterDetails.neighborhood,
          cityState: shelterDetails.cityState,
          zipCode: shelterDetails.zipCode || '',
          contactPhone: shelterDetails.contactPhone || '',
          contactEmail: shelterDetails.contactEmail || '',
          capacityStatus: shelterDetails.capacityStatus,
          servicesOffered: shelterDetails.servicesOffered ? shelterDetails.servicesOffered.join(', ') : '',
          targetAudience: shelterDetails.targetAudience,
          operatingHours: shelterDetails.operatingHours,
          observations: shelterDetails.observations || '',
          mapsUrl: shelterDetails.mapsUrl || '',
          latitude: shelterDetails.latitude?.toString() || '',
          longitude: shelterDetails.longitude?.toString() || '',
          statusOperacional: shelterDetails.statusOperacional,
        });
        setIsModalOpen(true);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalAction(null);
    setSelectedShelter(null);
    setShelterFormData(null);
    setIsSubmittingModal(false);
  };

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!shelterFormData) return;
    const { name, value } = e.target;
    setShelterFormData({ ...shelterFormData, [name]: value });
  };
  
  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!shelterFormData) return;
    setIsSubmittingModal(true);
    setNotification(null);

    let payload: any = {
      name: shelterFormData.name,
      imageUrl: shelterFormData.imageUrl || undefined,
      address: shelterFormData.address,
      neighborhood: shelterFormData.neighborhood,
      cityState: shelterFormData.cityState,
      zipCode: shelterFormData.zipCode || undefined,
      contactPhone: shelterFormData.contactPhone || undefined,
      contactEmail: shelterFormData.contactEmail || undefined,
      capacityStatus: shelterFormData.capacityStatus,
      servicesOffered: shelterFormData.servicesOffered 
                       ? shelterFormData.servicesOffered.split(',').map(s => s.trim()).filter(s => s.length > 0) 
                       : [], 
      targetAudience: shelterFormData.targetAudience,
      operatingHours: shelterFormData.operatingHours,
      observations: shelterFormData.observations || undefined,
      mapsUrl: shelterFormData.mapsUrl || undefined,
      latitude: shelterFormData.latitude ? parseFloat(shelterFormData.latitude) : undefined,
      longitude: shelterFormData.longitude ? parseFloat(shelterFormData.longitude) : undefined,
      statusOperacional: shelterFormData.statusOperacional,
    };
    
    if (modalAction === 'edit' && shelterFormData.id) {
      payload.id = parseInt(shelterFormData.id);
    }

    let response: Response;
    try {
      if (modalAction === 'add') {
        response = await fetch(`${API_BASE_URL}/abrigos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-API-Key': STATIC_API_KEY },
          body: JSON.stringify(payload),
        });
      } else if (modalAction === 'edit' && shelterFormData.id) {
        response = await fetch(`${API_BASE_URL}/abrigos/${shelterFormData.id}`, {
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
      
      const actionText = modalAction === 'add' ? 'adicionado' : 'atualizado';
      setNotification({ type: 'success', message: `Abrigo ${actionText} com sucesso!` });
      fetchShelters();
      closeModal();

    } catch (error: any) {
      setNotification({ type: 'error', message: error.message || `Falha ao ${modalAction === 'add' ? 'adicionar' : 'atualizar'} abrigo.` });
    } finally {
      setIsSubmittingModal(false);
    }
  };
  
  const handleRemover = async (shelterId: string, shelterName: string) => {
    if (window.confirm(`Tem certeza que deseja remover o abrigo "${shelterName}"?`)) {
      setNotification(null);
      try {
        const response = await fetch(`${API_BASE_URL}/abrigos/${shelterId}`, {
          method: 'DELETE',
          headers: { 'X-API-Key': STATIC_API_KEY },
        });
        if (!response.ok) {
          let errorMsg = `Erro ${response.status}`;
          try { const data = await response.json(); errorMsg = data.message || data.entity || errorMsg; } catch(e){}
          throw new Error(errorMsg);
        }
        setNotification({ type: 'success', message: `Abrigo "${shelterName}" removido.` });
        fetchShelters();
      } catch (error: any) {
        setNotification({ type: 'error', message: error.message || 'Falha ao remover abrigo.' });
      }
    }
  };

  if (!isAuthenticated || !isAdmin && typeof window !== 'undefined') {
    return <div className="container mx-auto p-6 text-center">Verificando permissões...</div>;
  }
  if (!isAdmin && !isLoading) return null;

  const renderModalContent = () => {
    const dataForView = selectedShelter; 
    const dataForForm = shelterFormData;

    if (modalAction === 'view') {
      if (!dataForView) return null;
      return (
        <div className="space-y-2 text-sm max-h-[70vh] overflow-y-auto pr-2">
          <p><strong>ID:</strong> {dataForView.id}</p>
          <p><strong>Nome:</strong> {dataForView.name}</p>
          {dataForView.imageUrl && <p><img src={dataForView.imageUrl} alt={dataForView.name} className="max-w-xs max-h-48 my-2 rounded" /></p>}
          <p><strong>Endereço:</strong> {`${dataForView.address}, ${dataForView.neighborhood}, ${dataForView.cityState} - CEP: ${dataForView.zipCode || 'N/A'}`}</p>
          <p><strong>Telefone:</strong> {dataForView.contactPhone || 'N/A'}</p>
          <p><strong>Email:</strong> {dataForView.contactEmail || 'N/A'}</p>
          <p><strong>Situação da Capacidade:</strong> {dataForView.capacityStatus}</p>
          <p><strong>Serviços Oferecidos:</strong> {dataForView.servicesOffered && dataForView.servicesOffered.length > 0 ? dataForView.servicesOffered.join(', ') : 'N/A'}</p>
          <p><strong>Público Alvo:</strong> {dataForView.targetAudience}</p>
          <p><strong>Horário de Funcionamento:</strong> {dataForView.operatingHours}</p>
          <p><strong>Status Operacional:</strong> {dataForView.statusOperacional}</p>
          <p><strong>Latitude:</strong> {dataForView.latitude ?? 'N/A'}</p>
          <p><strong>Longitude:</strong> {dataForView.longitude ?? 'N/A'}</p>
          {dataForView.mapsUrl && <p><strong>Link do Mapa:</strong> <a href={dataForView.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Abrir no mapa</a></p>}
          <p><strong>Observações:</strong> {dataForView.observations || 'N/A'}</p>
          <p><strong>Criado em:</strong> {dataForView.createdAt ? new Date(dataForView.createdAt).toLocaleString('pt-BR') : 'N/A'}</p>
          <p><strong>Última Atualização:</strong> {dataForView.updatedAt ? new Date(dataForView.updatedAt).toLocaleString('pt-BR') : 'N/A'}</p>
        </div>
      );
    } else if (modalAction === 'add' || modalAction === 'edit') {
      if (!dataForForm) return null;
      return (
        <form onSubmit={handleFormSubmit} className="space-y-3 text-sm max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-[var(--brand-text-secondary)]">Nome do Abrigo</label>
              <input type="text" name="name" id="name" value={dataForForm.name} onChange={handleFormInputChange} required className="mt-1 p-2 w-full border border-slate-300 rounded-md"/>
            </div>
            <div>
              <label htmlFor="statusOperacional" className="block text-xs font-medium text-[var(--brand-text-secondary)]">Status Operacional</label>
              <select name="statusOperacional" id="statusOperacional" value={dataForForm.statusOperacional} onChange={handleFormInputChange} className="mt-1 p-2 w-full border border-slate-300 rounded-md">
                {operationalStatusOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="address" className="block text-xs font-medium text-[var(--brand-text-secondary)]">Endereço (Rua, Número)</label>
              <input type="text" name="address" id="address" value={dataForForm.address} onChange={handleFormInputChange} required className="mt-1 p-2 w-full border border-slate-300 rounded-md"/>
            </div>
            <div>
              <label htmlFor="neighborhood" className="block text-xs font-medium text-[var(--brand-text-secondary)]">Bairro</label>
              <input type="text" name="neighborhood" id="neighborhood" value={dataForForm.neighborhood} onChange={handleFormInputChange} required className="mt-1 p-2 w-full border border-slate-300 rounded-md"/>
            </div>
             <div>
              <label htmlFor="cityState" className="block text-xs font-medium text-[var(--brand-text-secondary)]">Cidade - Estado</label>
              <input type="text" name="cityState" id="cityState" value={dataForForm.cityState} onChange={handleFormInputChange} required placeholder="Ex: São Paulo - SP" className="mt-1 p-2 w-full border border-slate-300 rounded-md"/>
            </div>
            <div>
              <label htmlFor="zipCode" className="block text-xs font-medium text-[var(--brand-text-secondary)]">CEP</label>
              <input type="text" name="zipCode" id="zipCode" value={dataForForm.zipCode || ''} onChange={handleFormInputChange} placeholder="00000-000" className="mt-1 p-2 w-full border border-slate-300 rounded-md"/>
            </div>
             <div>
              <label htmlFor="latitude" className="block text-xs font-medium text-[var(--brand-text-secondary)]">Latitude</label>
              <input type="text" name="latitude" id="latitude" value={dataForForm.latitude || ''} onChange={handleFormInputChange} placeholder="-23.55052" className="mt-1 p-2 w-full border border-slate-300 rounded-md"/>
            </div>
            <div>
              <label htmlFor="longitude" className="block text-xs font-medium text-[var(--brand-text-secondary)]">Longitude</label>
              <input type="text" name="longitude" id="longitude" value={dataForForm.longitude || ''} onChange={handleFormInputChange} placeholder="-46.633308" className="mt-1 p-2 w-full border border-slate-300 rounded-md"/>
            </div>
            <div>
              <label htmlFor="contactPhone" className="block text-xs font-medium text-[var(--brand-text-secondary)]">Telefone de Contato</label>
              <input type="text" name="contactPhone" id="contactPhone" value={dataForForm.contactPhone || ''} onChange={handleFormInputChange} className="mt-1 p-2 w-full border border-slate-300 rounded-md"/>
            </div>
            <div>
              <label htmlFor="contactEmail" className="block text-xs font-medium text-[var(--brand-text-secondary)]">Email de Contato</label>
              <input type="email" name="contactEmail" id="contactEmail" value={dataForForm.contactEmail || ''} onChange={handleFormInputChange} className="mt-1 p-2 w-full border border-slate-300 rounded-md"/>
            </div>
          </div>

          <div>
            <label htmlFor="capacityStatus" className="block text-sm font-medium text-[var(--brand-text-secondary)]">Situação da Capacidade</label>
            <input type="text" name="capacityStatus" id="capacityStatus" value={dataForForm.capacityStatus} onChange={handleFormInputChange} required placeholder="Ex: 100 vagas, 30 disponíveis" className="mt-1 p-2 w-full border border-slate-300 rounded-md"/>
          </div>
          <div>
            <label htmlFor="operatingHours" className="block text-sm font-medium text-[var(--brand-text-secondary)]">Horário de Funcionamento</label>
            <input type="text" name="operatingHours" id="operatingHours" value={dataForForm.operatingHours} onChange={handleFormInputChange} required placeholder="Ex: 24 horas / 08h - 18h" className="mt-1 p-2 w-full border border-slate-300 rounded-md"/>
          </div>
           <div>
            <label htmlFor="targetAudience" className="block text-sm font-medium text-[var(--brand-text-secondary)]">Público Alvo</label>
            <input type="text" name="targetAudience" id="targetAudience" value={dataForForm.targetAudience} onChange={handleFormInputChange} required placeholder="Ex: Famílias, Idosos, População em geral" className="mt-1 p-2 w-full border border-slate-300 rounded-md"/>
          </div>
          <div>
            <label htmlFor="servicesOffered" className="block text-sm font-medium text-[var(--brand-text-secondary)]">Serviços Oferecidos (separados por vírgula)</label>
            <textarea name="servicesOffered" id="servicesOffered" rows={3} value={dataForForm.servicesOffered} onChange={handleFormInputChange} placeholder="Ex: Alimentação, Pernoite, Banho, Kit Higiene" className="mt-1 p-2 w-full border border-slate-300 rounded-md"/>
          </div>
          <div>
            <label htmlFor="observations" className="block text-sm font-medium text-[var(--brand-text-secondary)]">Observações</label>
            <textarea name="observations" id="observations" rows={3} value={dataForForm.observations || ''} onChange={handleFormInputChange} className="mt-1 p-2 w-full border border-slate-300 rounded-md"/>
          </div>
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-[var(--brand-text-secondary)]">URL da Imagem do Abrigo</label>
            <input type="text" name="imageUrl" id="imageUrl" value={dataForForm.imageUrl || ''} onChange={handleFormInputChange} placeholder="https://exemplo.com/imagem.jpg" className="mt-1 p-2 w-full border border-slate-300 rounded-md"/>
          </div>
          <div>
            <label htmlFor="mapsUrl" className="block text-sm font-medium text-[var(--brand-text-secondary)]">URL do Google Maps (ou similar)</label>
            <input type="text" name="mapsUrl" id="mapsUrl" value={dataForForm.mapsUrl || ''} onChange={handleFormInputChange} placeholder="https://maps.app.goo.gl/exemplo" className="mt-1 p-2 w-full border border-slate-300 rounded-md"/>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">Cancelar</button>
            <button type="submit" disabled={isSubmittingModal} className="px-4 py-2 text-sm font-medium text-white bg-[var(--brand-header-bg)] rounded-md hover:bg-opacity-80 disabled:opacity-50">
              {isSubmittingModal ? 'Salvando...' : (modalAction === 'add' ? 'Adicionar Abrigo' : 'Salvar Alterações')}
            </button>
          </div>
        </form>
      );
    }
    return null;
  };
  
  const getStatusClass = (status: ShelterOperationalStatus) => {
    switch (status) {
        case 'Disponível': return 'bg-green-100 text-green-800';
        case 'Lotado': return 'bg-yellow-100 text-yellow-800';
        case 'Fechado': return 'bg-red-100 text-red-800';
        case 'Manutenção': return 'bg-slate-100 text-slate-800';
        default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 md:py-12">
      <section className="mb-10 md:mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--brand-header-bg)]">Gerenciar Abrigos</h1>
          <button onClick={() => openModal('add')}
            className="w-full sm:w-auto bg-[var(--brand-header-bg)] text-[var(--brand-text-header)] font-semibold px-6 py-2.5 rounded-lg shadow-md hover:bg-opacity-80 transition-colors flex items-center justify-center">
            <PlusCircleIcon className="w-5 h-5 mr-2" /> Adicionar Abrigo
          </button>
        </div>
        <p className="text-lg text-[var(--brand-text-secondary)] mt-4">Adicione, atualize informações e gerencie o status dos abrigos.</p>
      </section>

      {notification && (
        <div className={`p-4 mb-6 text-sm rounded-lg ${notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`} role="alert">
          {notification.message}
        </div>
      )}
      
      <section className="mb-8 p-4 bg-[var(--brand-card-background)] rounded-lg shadow-[var(--shadow-subtle)]">
        <h2 className="text-xl font-semibold text-[var(--brand-text-primary)] mb-3">Filtros e Busca</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" placeholder="Buscar por nome ou bairro..." className="p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[var(--brand-header-bg)]"/>
          <select className="p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[var(--brand-header-bg)]">
            <option value="">Todos os Status</option>
            {operationalStatusOptions.map(s => <option key={s} value={s}>{s}</option>)}
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--brand-text-primary)] max-w-xs truncate" title={shelter.name}>{shelter.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--brand-text-secondary)] max-w-xs truncate" title={`${shelter.address}, ${shelter.neighborhood}`}>{shelter.address}, {shelter.neighborhood}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--brand-text-secondary)] max-w-[150px] truncate" title={shelter.capacityStatus}>{shelter.capacityStatus}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(shelter.statusOperacional)}`}>
                      {shelter.statusOperacional}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--brand-text-secondary)]">
                    {shelter.updatedAt ? new Date(shelter.updatedAt).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'}) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1 flex">
                    <button onClick={() => openModal('view', shelter.id)} title="Visualizar" className="text-slate-600 hover:text-slate-800 p-1"><EyeIcon className="w-5 h-5"/></button>
                    <button onClick={() => openModal('edit', shelter.id)} title="Editar" className="text-yellow-600 hover:text-yellow-800 p-1"><PencilSquareIcon className="w-5 h-5"/></button>
                    <button onClick={() => handleRemover(shelter.id, shelter.name)} title="Remover" className="text-red-600 hover:text-red-800 p-1"><TrashIcon className="w-5 h-5"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-[var(--brand-text-secondary)] py-8">Nenhum abrigo cadastrado ou falha ao carregar.</p>
        )}
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="bg-[var(--brand-card-background)] p-6 rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-[var(--brand-text-primary)]">
                {modalAction === 'add' && 'Adicionar Novo Abrigo'}
                {modalAction === 'edit' && 'Editar Abrigo'}
                {modalAction === 'view' && 'Detalhes do Abrigo'}
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