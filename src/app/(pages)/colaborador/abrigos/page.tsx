"use client";

import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { PlusCircleIcon, PencilSquareIcon, TrashIcon, EyeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../../contexts/AuthContext';

type ShelterOperationalStatus = 'Disponível' | 'Lotado' | 'Fechado' | 'Manutenção';

interface ApiShelter {
  id: number; name: string; imageUrl?: string; address: string; neighborhood: string;
  cityState: string; zipCode?: string; contactPhone?: string; contactEmail?: string;
  capacityStatus: string; servicesOffered?: string[]; targetAudience: string;
  operatingHours: string; observations?: string; mapsUrl?: string; latitude?: number;
  longitude?: number; statusOperacional: ShelterOperationalStatus;
  createdAt?: string; updatedAt?: string; 
}

interface ShelterData {
  id: string; name: string; address: string; neighborhood: string; cityState: string;
  capacityStatus: string; statusOperacional: ShelterOperationalStatus; updatedAt: string;
  zipCode?: string; contactPhone?: string; contactEmail?: string; 
  servicesOffered?: string[]; targetAudience?: string; operatingHours?: string;
  observations?: string; mapsUrl?: string; latitude?: number; longitude?: number;
  createdAt?: string; imageUrl?: string;
}

interface ShelterFormData {
  id?: string; name: string; imageUrl?: string; address: string; neighborhood: string;
  cityState: string; zipCode?: string; contactPhone?: string; contactEmail?: string;
  capacityStatus: string; servicesOffered: string; targetAudience: string;
  operatingHours: string; observations?: string; mapsUrl?: string; latitude?: string; 
  longitude?: string; statusOperacional: ShelterOperationalStatus;
}

interface ShelterPayload {
  id?: number;
  name: string;
  imageUrl?: string;
  address: string;
  neighborhood: string;
  cityState: string;
  zipCode?: string;
  contactPhone?: string;
  contactEmail?: string;
  capacityStatus: string;
  servicesOffered: string[];
  targetAudience: string;
  operatingHours: string;
  observations?: string;
  mapsUrl?: string;
  latitude?: number;
  longitude?: number;
  statusOperacional: ShelterOperationalStatus;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://echoreport-api.onrender.com';
const STATIC_API_KEY = process.env.NEXT_PUBLIC_STATIC_API_KEY || '1234';

const operationalStatusOptions: ShelterOperationalStatus[] = ['Disponível', 'Lotado', 'Fechado', 'Manutenção'];

export default function GerenciarAbrigosPage() {
  const { isAdmin, isAuthenticated } = useAuth();
  const router = useRouter();

  const [shelters, setShelters] = useState<ShelterData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<'add' | 'edit' | 'view' | null>(null);
  const [selectedShelterDetails, setSelectedShelterDetails] = useState<ApiShelter | null>(null);
  const [shelterFormData, setShelterFormData] = useState<ShelterFormData | null>(null);
  const [isSubmittingModal, setIsSubmittingModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<ShelterOperationalStatus | ''>('');
  const [filterCep, setFilterCep] = useState('');

  const mapApiShelterToShelterData = useCallback((apiShelter: ApiShelter): ShelterData => ({
    id: String(apiShelter.id),
    name: apiShelter.name,
    address: apiShelter.address,
    neighborhood: apiShelter.neighborhood,
    cityState: apiShelter.cityState,
    zipCode: apiShelter.zipCode,
    contactPhone: apiShelter.contactPhone,
    contactEmail: apiShelter.contactEmail,
    capacityStatus: apiShelter.capacityStatus,
    servicesOffered: apiShelter.servicesOffered,
    targetAudience: apiShelter.targetAudience,
    operatingHours: apiShelter.operatingHours,
    observations: apiShelter.observations,
    mapsUrl: apiShelter.mapsUrl,
    latitude: apiShelter.latitude,
    longitude: apiShelter.longitude,
    statusOperacional: apiShelter.statusOperacional,
    createdAt: apiShelter.createdAt || new Date().toISOString(),
    updatedAt: apiShelter.updatedAt || apiShelter.createdAt || new Date().toISOString(),
    imageUrl: apiShelter.imageUrl,
  }), []);

  const fetchShelters = useCallback(async () => {
    if (!isAdmin) return;
    setIsLoading(true); setNotification(null);
    try {
      const response = await fetch(`${API_BASE_URL}/abrigos`, {
        method: 'GET', headers: { 'X-API-Key': STATIC_API_KEY, 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Erro ${response.status}` }));
        throw new Error(errorData.message || `Erro ${response.status}`);
      }
      const apiShelters: ApiShelter[] = await response.json();
      setShelters(apiShelters.map(mapApiShelterToShelterData).sort((a,b) => a.name.localeCompare(b.name)));
    } catch (error: unknown) {
      let message = 'Falha ao carregar abrigos.';
      if (error instanceof Error) { message = error.message; } 
      else if (typeof error === 'string') { message = error; }
      setNotification({ type: 'error', message });
      setShelters([]);
    } finally { setIsLoading(false); }
  }, [isAdmin, mapApiShelterToShelterData]);

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
    else if (!isAdmin) router.push('/');
    else fetchShelters();
  }, [isAdmin, isAuthenticated, router, fetchShelters]);

  const fetchShelterById = async (id: string): Promise<ApiShelter | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/abrigos/${id}`, { headers: { 'X-API-Key': STATIC_API_KEY } });
      if (!response.ok) throw new Error('Falha ao buscar dados detalhados do abrigo');
      return await response.json();
    } catch (error: unknown) {
      let message = 'Falha ao buscar dados detalhados do abrigo';
      if (error instanceof Error) { message = error.message; } 
      else if (typeof error === 'string') { message = error; }
      setNotification({ type: 'error', message }); return null;
    }
  };

  const openModal = async (action: 'add' | 'edit' | 'view', shelterId?: string) => {
    setModalAction(action); setNotification(null); setIsModalOpen(true);
    if (action === 'add') {
      setShelterFormData({
        name: '', imageUrl: '', address: '', neighborhood: '', cityState: '', zipCode: '',
        contactPhone: '', contactEmail: '', capacityStatus: '', servicesOffered: '',
        targetAudience: '', operatingHours: '', observations: '', mapsUrl: '',
        latitude: '', longitude: '', statusOperacional: 'Disponível',
      });
      setSelectedShelterDetails(null);
    } else if (shelterId) {
      const shelterDetails = await fetchShelterById(shelterId);
      if (shelterDetails) {
        setSelectedShelterDetails(shelterDetails);
        setShelterFormData({
          id: String(shelterDetails.id), name: shelterDetails.name, imageUrl: shelterDetails.imageUrl || '',
          address: shelterDetails.address, neighborhood: shelterDetails.neighborhood, cityState: shelterDetails.cityState,
          zipCode: shelterDetails.zipCode || '', contactPhone: shelterDetails.contactPhone || '',
          contactEmail: shelterDetails.contactEmail || '', capacityStatus: shelterDetails.capacityStatus,
          servicesOffered: shelterDetails.servicesOffered ? shelterDetails.servicesOffered.join(', ') : '',
          targetAudience: shelterDetails.targetAudience, operatingHours: shelterDetails.operatingHours,
          observations: shelterDetails.observations || '', mapsUrl: shelterDetails.mapsUrl || '',
          latitude: shelterDetails.latitude?.toString() || '', longitude: shelterDetails.longitude?.toString() || '',
          statusOperacional: shelterDetails.statusOperacional,
        });
      } else { setIsModalOpen(false); }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false); setModalAction(null); setSelectedShelterDetails(null);
    setShelterFormData(null); setIsSubmittingModal(false);
  };

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!shelterFormData) return;
    const { name, value } = e.target;
    setShelterFormData({ ...shelterFormData, [name]: value });
  };
  
  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); if (!shelterFormData) return;
    setIsSubmittingModal(true); setNotification(null);
    
    const payload: ShelterPayload = {
      name: shelterFormData.name, 
      imageUrl: shelterFormData.imageUrl || undefined, 
      address: shelterFormData.address,
      neighborhood: shelterFormData.neighborhood, 
      cityState: shelterFormData.cityState, 
      zipCode: shelterFormData.zipCode || undefined,
      contactPhone: shelterFormData.contactPhone || undefined, 
      contactEmail: shelterFormData.contactEmail || undefined,
      capacityStatus: shelterFormData.capacityStatus, 
      servicesOffered: shelterFormData.servicesOffered ? shelterFormData.servicesOffered.split(',').map(s => s.trim()).filter(s => s.length > 0) : [], 
      targetAudience: shelterFormData.targetAudience, 
      operatingHours: shelterFormData.operatingHours,
      observations: shelterFormData.observations || undefined, 
      mapsUrl: shelterFormData.mapsUrl || undefined,
      latitude: shelterFormData.latitude ? parseFloat(shelterFormData.latitude) : undefined,
      longitude: shelterFormData.longitude ? parseFloat(shelterFormData.longitude) : undefined,
      statusOperacional: shelterFormData.statusOperacional,
    };

    if (modalAction === 'edit' && shelterFormData.id) { payload.id = parseInt(shelterFormData.id); }
    
    let response: Response;
    try {
      if (modalAction === 'add') {
        response = await fetch(`${API_BASE_URL}/abrigos`, {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'X-API-Key': STATIC_API_KEY }, body: JSON.stringify(payload),
        });
      } else if (modalAction === 'edit' && shelterFormData.id) {
        response = await fetch(`${API_BASE_URL}/abrigos/${shelterFormData.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-API-Key': STATIC_API_KEY }, body: JSON.stringify(payload),
        });
      } else { throw new Error("Ação de formulário inválida."); }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Erro ${response.status}` }));
        throw new Error(errorData.message || errorData.entity || `Erro ${response.status}`);
      }
      const actionText = modalAction === 'add' ? 'adicionado' : 'atualizado';
      setNotification({ type: 'success', message: `Abrigo ${actionText} com sucesso!` });
      fetchShelters(); closeModal();
    } catch (error: unknown) {
      let message = `Falha ao ${modalAction === 'add' ? 'adicionar' : 'atualizar'} abrigo.`;
      if (error instanceof Error) { message = error.message; }
      else if (typeof error === 'string') { message = error; }
      setNotification({ type: 'error', message });
    } finally { setIsSubmittingModal(false); }
  };
  
  const handleRemover = async (shelterId: string, shelterName: string) => {
    if (window.confirm(`Tem certeza que deseja remover o abrigo "${shelterName}"?`)) {
      setNotification(null);
      try {
        const response = await fetch(`${API_BASE_URL}/abrigos/${shelterId}`, { method: 'DELETE', headers: { 'X-API-Key': STATIC_API_KEY } });
        if (!response.ok) {
          let errorMsg = `Erro ${response.status}`;
          try { const data = await response.json(); errorMsg = data.message || data.entity || errorMsg; } catch(_e){}
          throw new Error(errorMsg);
        }
        setNotification({ type: 'success', message: `Abrigo "${shelterName}" removido.` });
        fetchShelters();
      } catch (error: unknown) { 
        let message = 'Falha ao remover abrigo.';
        if (error instanceof Error) { message = error.message; }
        else if (typeof error === 'string') { message = error; }
        setNotification({ type: 'error', message }); 
      }
    }
  };

  const filteredShelters = shelters.filter(shelter => {
    const searchTermLower = searchTerm.toLowerCase();
    const cepTerm = filterCep.trim();
    const nameMatch = shelter.name.toLowerCase().includes(searchTermLower);
    const neighborhoodMatch = shelter.neighborhood.toLowerCase().includes(searchTermLower);
    const statusMatch = filterStatus ? shelter.statusOperacional === filterStatus : true;
    const cepMatch = cepTerm ? shelter.zipCode?.replace(/\D/g, '').includes(cepTerm.replace(/\D/g, '')) : true;
    return (nameMatch || neighborhoodMatch) && statusMatch && cepMatch;
  });
  
  const inputStyles = "p-2 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-header-bg)] dark:focus:ring-blue-500 focus:border-[var(--brand-header-bg)] dark:focus:border-blue-500 sm:text-sm transition-colors bg-[var(--brand-input-background)] text-[var(--brand-text-primary)] placeholder:text-slate-400 dark:placeholder:text-slate-500";
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
    const dataForView = selectedShelterDetails; const dataForForm = shelterFormData;
    if (modalAction === 'view') {
      if (!dataForView) return null;
      return (
        <div className="space-y-2 text-sm text-[var(--brand-text-secondary)] max-h-[70vh] overflow-y-auto pr-2">
          <h3 className="text-lg font-semibold text-[var(--brand-text-primary)] mb-3">{dataForView.name}</h3>
          {dataForView.imageUrl && (
            <div className="relative w-full max-w-xs h-48 my-2 mx-auto">
              <Image
                src={dataForView.imageUrl}
                alt={dataForView.name}
                layout="fill"
                objectFit="contain"
                className="rounded-md border dark:border-slate-700"
                unoptimized={true}
              />
            </div>
          )}
          <p><strong>ID:</strong> <span className="text-[var(--brand-text-primary)]">{dataForView.id}</span></p>
          <p><strong>Endereço:</strong> <span className="text-[var(--brand-text-primary)]">{`${dataForView.address}, ${dataForView.neighborhood}, ${dataForView.cityState} - CEP: ${dataForView.zipCode || 'N/A'}`}</span></p>
          <p><strong>Telefone:</strong> <span className="text-[var(--brand-text-primary)]">{dataForView.contactPhone || 'N/A'}</span></p>
          <p><strong>Email:</strong> <span className="text-[var(--brand-text-primary)]">{dataForView.contactEmail || 'N/A'}</span></p>
          <p><strong>Status Operacional:</strong> <span className="text-[var(--brand-text-primary)]">{dataForView.statusOperacional}</span></p>
          <p><strong>Situação da Capacidade:</strong> <span className="text-[var(--brand-text-primary)]">{dataForView.capacityStatus}</span></p>
          <p><strong>Horário de Funcionamento:</strong> <span className="text-[var(--brand-text-primary)]">{dataForView.operatingHours}</span></p>
          <p><strong>Público Alvo:</strong> <span className="text-[var(--brand-text-primary)]">{dataForView.targetAudience}</span></p>
          <p><strong>Serviços Oferecidos:</strong> <span className="text-[var(--brand-text-primary)]">{dataForView.servicesOffered && dataForView.servicesOffered.length > 0 ? dataForView.servicesOffered.join(', ') : 'N/A'}</span></p>
          <p><strong>Latitude:</strong> <span className="text-[var(--brand-text-primary)]">{dataForView.latitude ?? 'N/A'}</span></p>
          <p><strong>Longitude:</strong> <span className="text-[var(--brand-text-primary)]">{dataForView.longitude ?? 'N/A'}</span></p>
          {dataForView.mapsUrl && <p><strong>Link do Mapa:</strong> <a href={dataForView.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 dark:text-blue-400 hover:underline">Abrir no mapa</a></p>}
          <p><strong>Observações:</strong> <span className="whitespace-pre-wrap text-[var(--brand-text-primary)]">{dataForView.observations || 'N/A'}</span></p>
          <p><strong>Criado em:</strong> <span className="text-[var(--brand-text-primary)]">{dataForView.createdAt ? new Date(dataForView.createdAt).toLocaleString('pt-BR') : 'N/A'}</span></p>
          <p><strong>Última Atualização:</strong> <span className="text-[var(--brand-text-primary)]">{dataForView.updatedAt ? new Date(dataForView.updatedAt).toLocaleString('pt-BR') : 'N/A'}</span></p>
          <div className="flex justify-end pt-4 mt-4 border-t dark:border-slate-700">
            <button type="button" onClick={closeModal} className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500 focus:ring-slate-400 dark:focus:ring-slate-500 dark:focus:ring-offset-[var(--brand-card-background)]`}>
              Fechar
            </button>
          </div>
        </div>
      );
    } else if (modalAction === 'add' || modalAction === 'edit') {
      if (!dataForForm) return null;
      return (
        <form onSubmit={handleFormSubmit} className="space-y-3 text-sm max-h-[70vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
            <div>
              <label htmlFor="nameModal" className="block text-xs font-medium text-[var(--brand-text-secondary)]">Nome do Abrigo</label>
              <input type="text" name="name" id="nameModal" value={dataForForm.name} onChange={handleFormInputChange} required className={modalInputStyles}/>
            </div>
            <div>
              <label htmlFor="statusOperacionalModal" className="block text-xs font-medium text-[var(--brand-text-secondary)]">Status Operacional</label>
              <select name="statusOperacional" id="statusOperacionalModal" value={dataForForm.statusOperacional} onChange={handleFormInputChange} className={modalSelectStyles}>
                {operationalStatusOptions.map(s => <option key={s} value={s} className="bg-[var(--brand-input-background)] text-[var(--brand-text-primary)]">{s}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="addressModal" className="block text-xs font-medium text-[var(--brand-text-secondary)]">Endereço (Rua, Número)</label>
              <input type="text" name="address" id="addressModal" value={dataForForm.address} onChange={handleFormInputChange} required className={modalInputStyles}/>
            </div>
            <div>
              <label htmlFor="neighborhoodModal" className="block text-xs font-medium text-[var(--brand-text-secondary)]">Bairro</label>
              <input type="text" name="neighborhood" id="neighborhoodModal" value={dataForForm.neighborhood} onChange={handleFormInputChange} required className={modalInputStyles}/>
            </div>
            <div>
              <label htmlFor="cityStateModal" className="block text-xs font-medium text-[var(--brand-text-secondary)]">Cidade - Estado</label>
              <input type="text" name="cityState" id="cityStateModal" value={dataForForm.cityState} onChange={handleFormInputChange} required placeholder="Ex: São Paulo - SP" className={modalInputStyles}/>
            </div>
            <div>
              <label htmlFor="zipCodeModal" className="block text-xs font-medium text-[var(--brand-text-secondary)]">CEP</label>
              <input type="text" name="zipCode" id="zipCodeModal" value={dataForForm.zipCode || ''} onChange={handleFormInputChange} placeholder="00000-000" className={modalInputStyles}/>
            </div>
            <div>
              <label htmlFor="latitudeModal" className="block text-xs font-medium text-[var(--brand-text-secondary)]">Latitude</label>
              <input type="text" name="latitude" id="latitudeModal" value={dataForForm.latitude || ''} onChange={handleFormInputChange} placeholder="-23.55052" className={modalInputStyles}/>
            </div>
            <div>
              <label htmlFor="longitudeModal" className="block text-xs font-medium text-[var(--brand-text-secondary)]">Longitude</label>
              <input type="text" name="longitude" id="longitudeModal" value={dataForForm.longitude || ''} onChange={handleFormInputChange} placeholder="-46.633308" className={modalInputStyles}/>
            </div>
            <div>
              <label htmlFor="contactPhoneModal" className="block text-xs font-medium text-[var(--brand-text-secondary)]">Telefone de Contato</label>
              <input type="text" name="contactPhone" id="contactPhoneModal" value={dataForForm.contactPhone || ''} onChange={handleFormInputChange} className={modalInputStyles}/>
            </div>
            <div>
              <label htmlFor="contactEmailModal" className="block text-xs font-medium text-[var(--brand-text-secondary)]">Email de Contato</label>
              <input type="email" name="contactEmail" id="contactEmailModal" value={dataForForm.contactEmail || ''} onChange={handleFormInputChange} className={modalInputStyles}/>
            </div>
          </div>
          <div>
            <label htmlFor="capacityStatusModal" className="block text-sm font-medium text-[var(--brand-text-secondary)]">Situação da Capacidade</label>
            <input type="text" name="capacityStatus" id="capacityStatusModal" value={dataForForm.capacityStatus} onChange={handleFormInputChange} required placeholder="Ex: 100 vagas, 30 disponíveis" className={modalInputStyles}/>
          </div>
          <div>
            <label htmlFor="operatingHoursModal" className="block text-sm font-medium text-[var(--brand-text-secondary)]">Horário de Funcionamento</label>
            <input type="text" name="operatingHours" id="operatingHoursModal" value={dataForForm.operatingHours} onChange={handleFormInputChange} required placeholder="Ex: 24 horas / 08h - 18h" className={modalInputStyles}/>
          </div>
          <div>
            <label htmlFor="targetAudienceModal" className="block text-sm font-medium text-[var(--brand-text-secondary)]">Público Alvo</label>
            <input type="text" name="targetAudience" id="targetAudienceModal" value={dataForForm.targetAudience} onChange={handleFormInputChange} required placeholder="Ex: Famílias, Idosos, População em geral" className={modalInputStyles}/>
          </div>
          <div>
            <label htmlFor="servicesOfferedModal" className="block text-sm font-medium text-[var(--brand-text-secondary)]">Serviços Oferecidos (separados por vírgula)</label>
            <textarea name="servicesOffered" id="servicesOfferedModal" rows={3} value={dataForForm.servicesOffered} onChange={handleFormInputChange} placeholder="Ex: Alimentação, Pernoite, Banho, Kit Higiene" className={modalTextareaStyles}/>
          </div>
          <div>
            <label htmlFor="observationsModal" className="block text-sm font-medium text-[var(--brand-text-secondary)]">Observações</label>
            <textarea name="observations" id="observationsModal" rows={3} value={dataForForm.observations || ''} onChange={handleFormInputChange} className={modalTextareaStyles}/>
          </div>
          <div>
            <label htmlFor="imageUrlModal" className="block text-sm font-medium text-[var(--brand-text-secondary)]">URL da Imagem do Abrigo</label>
            <input type="text" name="imageUrl" id="imageUrlModal" value={dataForForm.imageUrl || ''} onChange={handleFormInputChange} placeholder="https://exemplo.com/imagem.jpg" className={modalInputStyles}/>
          </div>
          <div>
            <label htmlFor="mapsUrlModal" className="block text-sm font-medium text-[var(--brand-text-secondary)]">URL do Google Maps (ou similar)</label>
            <input type="text" name="mapsUrl" id="mapsUrlModal" value={dataForForm.mapsUrl || ''} onChange={handleFormInputChange} placeholder="https://maps.app.goo.gl/exemplo" className={modalInputStyles}/>
          </div>
          <div className="flex justify-end space-x-3 pt-4 mt-3 border-t dark:border-slate-700">
            <button type="button" onClick={closeModal} className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500 focus:ring-slate-400 dark:focus:ring-slate-500 dark:focus:ring-offset-[var(--brand-card-background)]`}>
              Cancelar
            </button>
            <button type="submit" disabled={isSubmittingModal} className={`px-4 py-2 text-sm font-medium text-white rounded-md hover:bg-opacity-80 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-[var(--brand-header-bg)] dark:bg-blue-600 dark:hover:bg-blue-500 focus:ring-[var(--brand-header-bg)] dark:focus:ring-blue-500 dark:focus:ring-offset-[var(--brand-card-background)]`}>
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
        case 'Disponível': return 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300';
        case 'Lotado': return 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-300';
        case 'Fechado': return 'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-300';
        case 'Manutenção': return 'bg-slate-100 dark:bg-slate-500/20 text-slate-800 dark:text-slate-300';
        default: return 'bg-gray-100 dark:bg-gray-500/20 text-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 md:py-12">
      <section className="mb-10 md:mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--brand-header-bg)] dark:text-blue-400">Gerenciar Abrigos</h1>
          <button onClick={() => openModal('add')}
            className="w-full sm:w-auto bg-[var(--brand-header-bg)] dark:bg-blue-600 text-[var(--brand-text-header)] dark:hover:bg-blue-500 font-semibold px-6 py-2.5 rounded-lg shadow-md hover:bg-opacity-80 transition-colors flex items-center justify-center">
            <PlusCircleIcon className="w-5 h-5 mr-2" /> Adicionar Abrigo
          </button>
        </div>
        <p className="text-lg text-[var(--brand-text-secondary)] mt-4">Adicione, atualize informações e gerencie o status dos abrigos.</p>
      </section>

      {notification && (
        <div className={`p-4 mb-6 text-sm rounded-lg ${notification.type === 'success' ? 'bg-green-100 dark:bg-green-800/30 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-600' : 'bg-red-100 dark:bg-red-800/30 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-600'}`} role="alert">
          {notification.message}
        </div>
      )}
      
      <section className="mb-8 p-4 sm:p-6 bg-[var(--brand-card-background)] rounded-lg shadow-[var(--shadow-subtle)]">
        <h2 className="text-xl font-semibold text-[var(--brand-text-primary)] mb-4">Filtros e Busca</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" placeholder="Buscar por nome ou bairro..." 
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className={`${inputStyles} w-full`}
          />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as ShelterOperationalStatus | '')}
            className={`${inputStyles} w-full appearance-none`}
          >
            <option value="" className="bg-[var(--brand-input-background)] text-[var(--brand-text-primary)]">Todos os Status</option>
            {operationalStatusOptions.map(s => <option key={s} value={s} className="bg-[var(--brand-input-background)] text-[var(--brand-text-primary)]">{s}</option>)}
          </select>
          <input type="text" placeholder="Buscar por CEP..." 
            value={filterCep} onChange={(e) => setFilterCep(e.target.value)}
            className={`${inputStyles} w-full`}
          />
        </div>
      </section>

      <section className="bg-[var(--brand-card-background)] rounded-lg shadow-[var(--shadow-subtle)] overflow-x-auto">
        {isLoading ? (
          <p className="text-center text-[var(--brand-text-secondary)] py-8">Carregando abrigos...</p>
        ) : filteredShelters.length > 0 ? (
          <table className="min-w-full">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Endereço</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Capacidade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Últ. Att.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-[var(--brand-card-background)] divide-y divide-slate-200 dark:divide-slate-700">
              {filteredShelters.map((shelter) => (
                <tr key={shelter.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
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
                    <button onClick={() => openModal('view', shelter.id)} title="Visualizar" className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-300 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50"><EyeIcon className="w-5 h-5"/></button>
                    <button onClick={() => openModal('edit', shelter.id)} title="Editar" className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300 p-1 rounded-md hover:bg-yellow-100 dark:hover:bg-yellow-600/50"><PencilSquareIcon className="w-5 h-5"/></button>
                    <button onClick={() => handleRemover(shelter.id, shelter.name)} title="Remover" className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-700/50"><TrashIcon className="w-5 h-5"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-[var(--brand-text-secondary)] py-8">Nenhum abrigo encontrado.</p>
        )}
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[var(--brand-card-background)] p-6 rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-[var(--brand-text-primary)]">
                {modalAction === 'add' && 'Adicionar Novo Abrigo'}
                {modalAction === 'edit' && 'Editar Abrigo'}
                {modalAction === 'view' && 'Detalhes do Abrigo'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 p-1 rounded-md -mr-2">
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