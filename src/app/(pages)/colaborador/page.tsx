"use client";

import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircleIcon, PencilSquareIcon, TrashIcon, EyeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth, availableAlertTypes, AlertType } from './../../contexts/AuthContext'; // Corrected path assumption for AuthContext

interface ApiUser {
  userId: number;
  nomeCompleto: string;
  email: string;
  role: 'user' | 'admin';
  status?: 'ativo' | 'inativo';
  dataCriacao?: string;
  locationPreference?: string;
  subscribedAlerts?: string[];
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'ativo' | 'inativo';
  createdAt: string;
  locationPreference?: string;
  subscribedAlerts?: AlertType[];
}

interface UserFormData {
  id?: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'ativo' | 'inativo';
  password?: string;
  locationPreference?: string;
  subscribedAlerts: AlertType[];
}

interface UserPayloadBase {
  nomeCompleto: string;
  email: string;
  role: 'user' | 'admin';
  status: 'ativo' | 'inativo';
  locationPreference?: string;
  subscribedAlerts: AlertType[];
}

interface UserPayloadAdd extends UserPayloadBase {
  password?: string;
}

interface UserPayloadEdit extends UserPayloadBase {
  senha?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
const STATIC_API_KEY = process.env.NEXT_PUBLIC_STATIC_API_KEY || '1234';

export default function GerenciarUsuariosPage() {
  const { isAdmin, isAuthenticated } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<'add' | 'edit' | 'view' | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [userFormData, setUserFormData] = useState<UserFormData | null>(null);
  const [isSubmittingModal, setIsSubmittingModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const mapApiUserToUserData = useCallback((apiUser: ApiUser): UserData => {
    return {
      id: String(apiUser.userId),
      name: apiUser.nomeCompleto,
      email: apiUser.email,
      role: apiUser.role || 'user',
      status: apiUser.status || 'ativo',
      createdAt: apiUser.dataCriacao || new Date().toISOString(),
      locationPreference: apiUser.locationPreference || '',
      subscribedAlerts: (apiUser.subscribedAlerts?.filter(alert => availableAlertTypes.includes(alert as AlertType)) as AlertType[] | undefined) || [],
    };
  }, []);

  const fetchUsers = useCallback(async () => {
    if (!isAdmin) return;
    setIsLoading(true);
    setNotification(null);
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios`, {
        method: 'GET',
        headers: { 'X-API-Key': STATIC_API_KEY, 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Erro ${response.status}` }));
        throw new Error(errorData.message || `Erro ${response.status}`);
      }
      const apiUsers: ApiUser[] = await response.json();
      setUsers(apiUsers.map(mapApiUserToUserData));
    } catch (error: unknown) {
      let message = 'Falha ao carregar usuários.';
      if (error instanceof Error) {
        message = error.message;
      } else if (typeof error === 'string') {
        message = error;
      } else {
        message = 'Um erro inesperado ocorreu ao carregar usuários.';
      }
      setNotification({ type: 'error', message });
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin, mapApiUserToUserData]);

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
    else if (!isAdmin) router.push('/');
    else fetchUsers();
  }, [isAdmin, isAuthenticated, router, fetchUsers]);

  const openModal = (action: 'add' | 'edit' | 'view', user?: UserData) => {
    setModalAction(action);
    setNotification(null);
    if (action === 'add') {
      setUserFormData({ name: '', email: '', role: 'user', status: 'ativo', password: '', locationPreference: '', subscribedAlerts: [] });
      setSelectedUser(null);
    } else if (user) {
      setSelectedUser(user);
      setUserFormData({
        id: user.id, name: user.name, email: user.email, role: user.role, status: user.status,
        password: '', locationPreference: user.locationPreference || '',
        subscribedAlerts: user.subscribedAlerts || [],
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false); setModalAction(null); setSelectedUser(null);
    setUserFormData(null); setIsSubmittingModal(false);
  };

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!userFormData) return;
    const { name, value } = e.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleSubscribedAlertsChange = (alertType: AlertType) => { // FIX: Added type 'AlertType' to 'alertType'
    if (!userFormData) return;
    setUserFormData(prev => {
      if (!prev) return null;
      const newSubscribedAlerts = prev.subscribedAlerts.includes(alertType)
        ? prev.subscribedAlerts.filter(item => item !== alertType)
        : [...prev.subscribedAlerts, alertType];
      return { ...prev, subscribedAlerts: newSubscribedAlerts };
    });
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userFormData) return;
    setIsSubmittingModal(true);
    setNotification(null);

    const baseData: UserPayloadBase = {
        nomeCompleto: userFormData.name,
        email: userFormData.email,
        role: userFormData.role,
        status: userFormData.status,
        locationPreference: userFormData.locationPreference || undefined,
        subscribedAlerts: userFormData.subscribedAlerts,
    };

    let response: Response;
    try {
      if (modalAction === 'add') {
        if (!userFormData.password) { throw new Error("Senha é obrigatória para adicionar novo usuário."); }
        const payload: UserPayloadAdd = {
            ...baseData,
            password: userFormData.password,
        };
        response = await fetch(`${API_BASE_URL}/usuarios/registrar`, {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'X-API-Key': STATIC_API_KEY },
          body: JSON.stringify(payload),
        });
      } else if (modalAction === 'edit' && userFormData.id) {
        const payload: UserPayloadEdit = { ...baseData };
        if (userFormData.password && userFormData.password.length > 0) {
            payload.senha = userFormData.password;
        }
        response = await fetch(`${API_BASE_URL}/usuarios/${userFormData.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-API-Key': STATIC_API_KEY },
          body: JSON.stringify(payload),
        });
      } else { throw new Error("Ação de formulário inválida."); }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Erro ${response.status}` }));
        throw new Error(errorData.message || errorData.entity || `Erro ${response.status}`);
      }
      const actionText = modalAction === 'add' ? 'adicionado' : 'atualizado';
      setNotification({ type: 'success', message: `Usuário ${actionText} com sucesso!` });
      fetchUsers(); closeModal();
    } catch (error: unknown) {
      let message = `Falha ao ${modalAction === 'add' ? 'adicionar' : 'atualizar'} usuário.`;
      if (error instanceof Error) {
        message = error.message;
      } else if (typeof error === 'string') {
        message = error;
      } else {
        message = 'Um erro inesperado ocorreu ao processar o formulário.';
      }
      setNotification({ type: 'error', message });
    } finally { setIsSubmittingModal(false); }
  };

  const handleRemover = async (userId: string, userName: string) => {
    if (window.confirm(`Tem certeza que deseja remover o usuário "${userName}"?`)) {
      setNotification(null); setIsLoading(true); 
      try {
        const response = await fetch(`${API_BASE_URL}/usuarios/${userId}`, {
          method: 'DELETE', headers: { 'X-API-Key': STATIC_API_KEY },
        });
        if (!response.ok) {
          let errorMsg = `Erro ${response.status}`;
          try {
            const data = await response.json();
            errorMsg = data.message || data.entity || errorMsg;
          } catch (_errorParsingJson: unknown) {
            // This '_errorParsingJson' is intentionally unused here
            // as the outer catch block handles the primary error message.
          }
          throw new Error(errorMsg);
        }
        setNotification({ type: 'success', message: `Usuário "${userName}" removido.` });
        fetchUsers();
      } catch (error: unknown) {
        let message = 'Falha ao remover.';
        if (error instanceof Error) {
          message = error.message;
        } else if (typeof error === 'string') {
          message = error;
        } else {
          message = 'Um erro inesperado ocorreu ao remover o usuário.';
        }
        setNotification({ type: 'error', message });
      } finally { setIsLoading(false); }
    }
  };

  const filteredUsers = users.filter(user => {
    const searchTermLower = searchTerm.toLowerCase();
    const nameMatch = user.name.toLowerCase().includes(searchTermLower);
    const emailMatch = user.email.toLowerCase().includes(searchTermLower);
    const roleMatch = filterRole ? user.role === filterRole : true;
    const statusMatch = filterStatus ? user.status === filterStatus : true;
    return (nameMatch || emailMatch) && roleMatch && statusMatch;
  });

  const inputBaseClasses = "p-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-header-bg)] dark:focus:ring-blue-500 focus:border-[var(--brand-header-bg)] dark:focus:border-blue-500 sm:text-sm transition-colors";
  const inputBgTextClasses = "bg-[var(--brand-input-background)] text-[var(--brand-text-primary)] placeholder:text-slate-400 dark:placeholder:text-slate-500";
  const modalInputClasses = `mt-1 ${inputBaseClasses} ${inputBgTextClasses} w-full`;
  const modalSelectClasses = `mt-1 ${inputBaseClasses} ${inputBgTextClasses} w-full appearance-none`;
  const modalCheckboxLabelClasses = "flex items-center space-x-2 cursor-pointer p-1 hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded";
  const modalCheckboxClasses = "h-4 w-4 text-[var(--brand-header-bg)] dark:text-blue-500 border-gray-300 dark:border-slate-600 rounded focus:ring-[var(--brand-header-bg)] dark:focus:ring-blue-500 bg-[var(--brand-input-background)] dark:checked:bg-blue-500 checked:bg-[var(--brand-header-bg)] focus:ring-offset-0";

  if (!isAuthenticated || (!isAdmin && typeof window !== 'undefined')) {
    return <div className="container mx-auto p-6 text-center text-[var(--brand-text-secondary)]">Verificando permissões...</div>;
  }
  if (!isAdmin && !isLoading) {
    router.push('/'); 
    return <div className="container mx-auto p-6 text-center text-[var(--brand-text-secondary)]">Acesso negado. Redirecionando...</div>;
  }

  const renderModalContent = () => {
    if (modalAction === 'view') {
      if (!selectedUser) return null;
      return (
        <div className="space-y-3 text-sm text-[var(--brand-text-secondary)]">
          <h3 className="text-xl font-semibold text-[var(--brand-text-primary)] mb-4">Detalhes do Usuário</h3>
          <p><strong>ID:</strong> <span className="text-[var(--brand-text-primary)]">{selectedUser.id}</span></p>
          <p><strong>Nome:</strong> <span className="text-[var(--brand-text-primary)]">{selectedUser.name}</span></p>
          <p><strong>Email:</strong> <span className="text-[var(--brand-text-primary)]">{selectedUser.email}</span></p>
          <p><strong>Papel:</strong> <span className="text-[var(--brand-text-primary)] capitalize">{selectedUser.role}</span></p>
          <p><strong>Status:</strong> <span className={`capitalize px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${selectedUser.status === 'ativo' ? 'bg-green-100 dark:bg-green-700/30 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-700/30 text-red-800 dark:text-red-300'}`}>{selectedUser.status}</span></p>
          <p><strong>Criado em:</strong> <span className="text-[var(--brand-text-primary)]">{new Date(selectedUser.createdAt).toLocaleString('pt-BR')}</span></p>
          <p><strong>Pref. Localização:</strong> <span className="text-[var(--brand-text-primary)]">{selectedUser.locationPreference || 'N/A'}</span></p>
          <p><strong>Alertas Inscritos:</strong> <span className="text-[var(--brand-text-primary)]">{selectedUser.subscribedAlerts?.join(', ') || 'Nenhum'}</span></p>
            <div className="flex justify-end pt-4">
            <button type="button" onClick={closeModal} className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-[var(--brand-card-background)] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 focus:ring-slate-500 dark:focus:ring-slate-400`}>
              Fechar
            </button>
          </div>
        </div>
      );
    } else if (modalAction === 'add' || modalAction === 'edit') {
      if (!userFormData) return null;
      return (
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <h3 className="text-xl font-semibold text-[var(--brand-text-primary)] mb-4">
            {modalAction === 'add' ? 'Adicionar Novo Usuário' : 'Editar Usuário'}
          </h3>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[var(--brand-text-secondary)]">Nome Completo</label>
            <input type="text" name="name" id="name" value={userFormData.name} onChange={handleFormInputChange} required className={modalInputClasses}/>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--brand-text-secondary)]">Email</label>
            <input type="email" name="email" id="email" value={userFormData.email} onChange={handleFormInputChange} required className={modalInputClasses}/>
          </div>
          {(modalAction === 'add') && (
            <div>
              <label htmlFor="passwordModal" className="block text-sm font-medium text-[var(--brand-text-secondary)]">Senha</label>
              <input type="password" name="password" id="passwordModal" value={userFormData.password || ''} onChange={handleFormInputChange} required={modalAction === 'add'} className={modalInputClasses}/>
            </div>
          )}
          {modalAction === 'edit' && (
            <div>
              <label htmlFor="passwordModal" className="block text-sm font-medium text-[var(--brand-text-secondary)]">Nova Senha (deixe em branco para não alterar)</label>
              <input type="password" name="password" id="passwordModal" value={userFormData.password || ''} onChange={handleFormInputChange} className={modalInputClasses}/>
            </div>
          )}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-[var(--brand-text-secondary)]">Papel</label>
            <select name="role" id="role" value={userFormData.role} onChange={handleFormInputChange} className={modalSelectClasses}>
              <option value="user" className="text-black dark:text-gray-200 bg-[var(--brand-input-background)]">Usuário</option>
              <option value="admin" className="text-black dark:text-gray-200 bg-[var(--brand-input-background)]">Administrador</option>
            </select>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-[var(--brand-text-secondary)]">Status</label>
            <select name="status" id="status" value={userFormData.status} onChange={handleFormInputChange} className={modalSelectClasses}>
              <option value="ativo" className="text-black dark:text-gray-200 bg-[var(--brand-input-background)]">Ativo</option>
              <option value="inativo" className="text-black dark:text-gray-200 bg-[var(--brand-input-background)]">Inativo</option>
            </select>
          </div>
          <div>
              <label htmlFor="locationPreferenceModal" className="block text-sm font-medium text-[var(--brand-text-secondary)]">Preferência de Localização</label>
              <input type="text" name="locationPreference" id="locationPreferenceModal" value={userFormData.locationPreference || ''} onChange={handleFormInputChange} className={modalInputClasses}/>
          </div>
          <div>
            <span className="block text-sm font-medium text-[var(--brand-text-secondary)] mb-1">Inscrever em Alertas (opcional)</span>
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 max-h-32 overflow-y-auto p-2 border rounded-md border-slate-300 dark:border-slate-600 bg-[var(--brand-input-background)]`}>
              {availableAlertTypes.map((alertType) => (
                <label key={alertType} className={modalCheckboxLabelClasses}>
                  <input
                    type="checkbox" value={alertType}
                    checked={userFormData.subscribedAlerts.includes(alertType)}
                    onChange={() => handleSubscribedAlertsChange(alertType)}
                    className={modalCheckboxClasses}
                  />
                  <span className="text-sm text-[var(--brand-text-secondary)]">{alertType}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={closeModal} className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-[var(--brand-card-background)] bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500 focus:ring-slate-400 dark:focus:ring-slate-500`}>
              Cancelar
            </button>
            <button type="submit" disabled={isSubmittingModal} className={`px-4 py-2 text-sm font-medium text-white rounded-md hover:bg-opacity-80 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-[var(--brand-card-background)] bg-[var(--brand-header-bg)] dark:bg-blue-600 dark:hover:bg-blue-500 focus:ring-[var(--brand-header-bg)] dark:focus:ring-blue-500`}>
              {isSubmittingModal ? 'Salvando...' : (modalAction === 'add' ? 'Adicionar Usuário' : 'Salvar Alterações')}
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
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--brand-header-bg)] dark:text-blue-400">Gerenciar Usuários</h1>
          <button onClick={() => openModal('add')}
            className="w-full sm:w-auto bg-[var(--brand-header-bg)] dark:bg-blue-600 text-[var(--brand-text-header)] dark:hover:bg-blue-500 font-semibold px-6 py-2.5 rounded-lg shadow-md hover:bg-opacity-80 transition-colors flex items-center justify-center">
            <PlusCircleIcon className="w-5 h-5 mr-2" /> Adicionar Usuário
          </button>
        </div>
        <p className="text-lg text-[var(--brand-text-secondary)] mt-4">Visualize, adicione, edite ou remova usuários da plataforma.</p>
      </section>

      {notification && (
        <div className={`p-4 mb-6 text-sm rounded-lg ${notification.type === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-600' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-600'}`} role="alert">
          {notification.message}
        </div>
      )}

      <section className="mb-8 p-4 sm:p-6 bg-[var(--brand-card-background)] rounded-lg shadow-[var(--shadow-subtle)]">
        <h2 className="text-xl font-semibold text-[var(--brand-text-primary)] mb-4">Filtros e Busca</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" placeholder="Buscar por nome ou email..." 
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className={`${inputBaseClasses} ${inputBgTextClasses} w-full`}
          />
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} 
            className={`${inputBaseClasses} ${inputBgTextClasses} w-full appearance-none`}
          >
            <option value="" className="text-black dark:text-gray-200 bg-[var(--brand-input-background)]">Todos os Papéis</option> 
            <option value="user" className="text-black dark:text-gray-200 bg-[var(--brand-input-background)]">Usuário</option> 
            <option value="admin" className="text-black dark:text-gray-200 bg-[var(--brand-input-background)]">Administrador</option>
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className={`${inputBaseClasses} ${inputBgTextClasses} w-full appearance-none`}
          >
            <option value="" className="text-black dark:text-gray-200 bg-[var(--brand-input-background)]">Todos os Status</option> 
            <option value="ativo" className="text-black dark:text-gray-200 bg-[var(--brand-input-background)]">Ativo</option> 
            <option value="inativo" className="text-black dark:text-gray-200 bg-[var(--brand-input-background)]">Inativo</option>
          </select>
        </div>
      </section>

      <section className="bg-[var(--brand-card-background)] p-0 sm:p-0 rounded-lg shadow-[var(--shadow-subtle)] overflow-x-auto">
        {isLoading ? (
          <p className="text-center text-[var(--brand-text-secondary)] py-8">Carregando usuários...</p>
        ) : filteredUsers.length > 0 ? (
          <table className="min-w-full">
            <thead className="bg-slate-100 dark:bg-slate-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Papel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Criado em</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-[var(--brand-card-background)] divide-y divide-slate-200 dark:divide-slate-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--brand-text-primary)]">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--brand-text-secondary)]">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--brand-text-secondary)] capitalize">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'ativo' ? 'bg-green-100 dark:bg-green-700/30 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-700/30 text-red-800 dark:text-red-300'}`}>{user.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--brand-text-secondary)]">{user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1 flex">
                    <button onClick={() => openModal('view', user)} title="Visualizar" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-1 rounded-md hover:bg-blue-100 dark:hover:bg-blue-700/30"><EyeIcon className="w-5 h-5"/></button>
                    <button onClick={() => openModal('edit', user)} title="Editar" className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300 p-1 rounded-md hover:bg-yellow-100 dark:hover:bg-yellow-600/30"><PencilSquareIcon className="w-5 h-5"/></button>
                    {user.role !== 'admin' && (<button onClick={() => handleRemover(user.id, user.name)} title="Remover" className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-700/30"><TrashIcon className="w-5 h-5"/></button>)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-[var(--brand-text-secondary)] py-8">Nenhum usuário encontrado.</p>
        )}
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[var(--brand-card-background)] p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-[var(--brand-text-primary)]">
                {modalAction === 'add' && 'Adicionar Usuário'}
                {modalAction === 'edit' && 'Editar Usuário'}
                {modalAction === 'view' && 'Detalhes do Usuário'}
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