"use client";

import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircleIcon, PencilSquareIcon, TrashIcon, EyeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth, availableAlertTypes, AlertType } from '../../../contexts/AuthContext'; // Importa availableAlertTypes e AlertType

interface ApiUser {
  userId: number;
  nomeCompleto: string;
  email: string;
  role: 'user' | 'admin';
  status?: 'ativo' | 'inativo';
  dataCriacao?: string;
  locationPreference?: string;
  subscribedAlerts?: string[]; // API envia como array de strings
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'ativo' | 'inativo';
  createdAt: string;
  locationPreference?: string;
  subscribedAlerts?: AlertType[]; // Frontend usa o tipo AlertType
}

interface UserFormData {
  id?: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'ativo' | 'inativo';
  password?: string;
  locationPreference?: string;
  subscribedAlerts: AlertType[]; // Usar AlertType para consistência no formulário
}

const API_BASE_URL = 'http://localhost:8080';
const STATIC_API_KEY = '1234';

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

  const mapApiUserToUserData = useCallback((apiUser: ApiUser): UserData => {
    return {
      id: String(apiUser.userId),
      name: apiUser.nomeCompleto,
      email: apiUser.email,
      role: apiUser.role || 'user', // Verifique se a API envia 'admin' corretamente para admins
      status: apiUser.status || 'ativo',
      createdAt: apiUser.dataCriacao || new Date().toISOString(),
      locationPreference: apiUser.locationPreference || '',
      // Garante que subscribedAlerts seja mapeado para AlertType[] se os valores forem compatíveis
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
    } catch (error: any) {
      setNotification({ type: 'error', message: error.message || 'Falha ao carregar usuários.' });
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
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        password: '',
        locationPreference: user.locationPreference || '',
        subscribedAlerts: user.subscribedAlerts || [],
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalAction(null);
    setSelectedUser(null);
    setUserFormData(null);
    setIsSubmittingModal(false);
  };

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!userFormData) return;
    const { name, value } = e.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleSubscribedAlertsChange = (alertType: AlertType) => {
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

    const payloadForAdd = {
        nomeCompleto: userFormData.name,
        email: userFormData.email,
        password: userFormData.password, // Senha é required no DTO de registro
        role: userFormData.role,
        status: userFormData.status, // Assumindo que o backend pode receber isso
        locationPreference: userFormData.locationPreference,
        subscribedAlerts: userFormData.subscribedAlerts,
    };

    const payloadForEdit = {
        nomeCompleto: userFormData.name,
        email: userFormData.email,
        role: userFormData.role,
        status: userFormData.status,
        locationPreference: userFormData.locationPreference,
        subscribedAlerts: userFormData.subscribedAlerts,
        ...(userFormData.password && userFormData.password.length > 0 && { senha: userFormData.password }),
    };

    let response: Response;
    try {
      if (modalAction === 'add') {
        if (!payloadForAdd.password) { // Validação simples para senha no 'add'
            throw new Error("Senha é obrigatória para adicionar novo usuário.");
        }
        response = await fetch(`${API_BASE_URL}/usuarios/registrar`, { // Usando endpoint de registrar
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-API-Key': STATIC_API_KEY },
          body: JSON.stringify(payloadForAdd),
        });
      } else if (modalAction === 'edit' && userFormData.id) {
        response = await fetch(`${API_BASE_URL}/usuarios/${userFormData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'X-API-Key': STATIC_API_KEY },
          body: JSON.stringify(payloadForEdit),
        });
      } else {
        throw new Error("Ação de formulário inválida.");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Erro ${response.status}` }));
        throw new Error(errorData.message || errorData.entity || `Erro ${response.status}`);
      }
      
      const actionText = modalAction === 'add' ? 'adicionado' : 'atualizado';
      setNotification({ type: 'success', message: `Usuário ${actionText} com sucesso!` });
      fetchUsers();
      closeModal();

    } catch (error: any) {
      setNotification({ type: 'error', message: error.message || `Falha ao ${modalAction === 'add' ? 'adicionar' : 'atualizar'} usuário.` });
    } finally {
      setIsSubmittingModal(false);
    }
  };

  const handleRemover = async (userId: string, userName: string) => {
    if (window.confirm(`Tem certeza que deseja remover o usuário "${userName}"?`)) {
      setNotification(null);
      setIsLoading(true); 
      try {
        const response = await fetch(`${API_BASE_URL}/usuarios/${userId}`, {
          method: 'DELETE',
          headers: { 'X-API-Key': STATIC_API_KEY },
        });
        if (!response.ok) {
          let errorMsg = `Erro ${response.status}`;
          try { const data = await response.json(); errorMsg = data.message || data.entity || errorMsg; } catch(e){}
          throw new Error(errorMsg);
        }
        setNotification({ type: 'success', message: `Usuário "${userName}" removido.` });
        fetchUsers();
      } catch (error: any) {
        setNotification({ type: 'error', message: error.message || 'Falha ao remover.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!isAuthenticated || !isAdmin && typeof window !== 'undefined') {
    return <div className="container mx-auto p-6 text-center">Verificando permissões...</div>;
  }
  if (!isAdmin && !isLoading) return null;

  const renderModalContent = () => {
    if (modalAction === 'view') {
      if (!selectedUser) return null;
      return (
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-[var(--brand-text-primary)] mb-4">Detalhes do Usuário</h3>
          <p><strong>ID:</strong> {selectedUser.id}</p>
          <p><strong>Nome:</strong> {selectedUser.name}</p>
          <p><strong>Email:</strong> {selectedUser.email}</p>
          <p><strong>Papel:</strong> {selectedUser.role}</p>
          <p><strong>Status:</strong> {selectedUser.status}</p>
          <p><strong>Criado em:</strong> {new Date(selectedUser.createdAt).toLocaleString('pt-BR')}</p>
          <p><strong>Pref. Localização:</strong> {selectedUser.locationPreference || 'N/A'}</p>
          <p><strong>Alertas Inscritos:</strong> {selectedUser.subscribedAlerts?.join(', ') || 'Nenhum'}</p>
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
            <input type="text" name="name" id="name" value={userFormData.name} onChange={handleFormInputChange} required className="mt-1 p-2 w-full border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-header-bg)] focus:border-[var(--brand-header-bg)] sm:text-sm"/>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--brand-text-secondary)]">Email</label>
            <input type="email" name="email" id="email" value={userFormData.email} onChange={handleFormInputChange} required className="mt-1 p-2 w-full border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-header-bg)] focus:border-[var(--brand-header-bg)] sm:text-sm"/>
          </div>
          {(modalAction === 'add') && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--brand-text-secondary)]">Senha</label>
              <input type="password" name="password" id="password" value={userFormData.password || ''} onChange={handleFormInputChange} required={modalAction === 'add'} className="mt-1 p-2 w-full border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-header-bg)] focus:border-[var(--brand-header-bg)] sm:text-sm"/>
            </div>
          )}
          {modalAction === 'edit' && (
             <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--brand-text-secondary)]">Nova Senha (deixe em branco para não alterar)</label>
              <input type="password" name="password" id="password" value={userFormData.password || ''} onChange={handleFormInputChange} className="mt-1 p-2 w-full border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-header-bg)] focus:border-[var(--brand-header-bg)] sm:text-sm"/>
            </div>
          )}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-[var(--brand-text-secondary)]">Papel</label>
            <select name="role" id="role" value={userFormData.role} onChange={handleFormInputChange} className="mt-1 p-2 w-full border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-header-bg)] focus:border-[var(--brand-header-bg)] sm:text-sm">
              <option value="user">Usuário</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-[var(--brand-text-secondary)]">Status</label>
            <select name="status" id="status" value={userFormData.status} onChange={handleFormInputChange} className="mt-1 p-2 w-full border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-header-bg)] focus:border-[var(--brand-header-bg)] sm:text-sm">
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>
           <div>
              <label htmlFor="locationPreference" className="block text-sm font-medium text-[var(--brand-text-secondary)]">Preferência de Localização</label>
              <input type="text" name="locationPreference" id="locationPreference" value={userFormData.locationPreference || ''} onChange={handleFormInputChange} className="mt-1 p-2 w-full border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-header-bg)] focus:border-[var(--brand-header-bg)] sm:text-sm"/>
          </div>
          <div>
            <span className="block text-sm font-medium text-[var(--brand-text-secondary)] mb-1">Inscrever em Alertas (opcional)</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 max-h-32 overflow-y-auto p-1 border border-slate-300 rounded-md">
              {availableAlertTypes.map((alertType) => (
                <label key={alertType} className="flex items-center space-x-2 cursor-pointer p-1 hover:bg-slate-100 rounded">
                  <input
                    type="checkbox"
                    value={alertType}
                    checked={userFormData.subscribedAlerts.includes(alertType)}
                    onChange={() => handleSubscribedAlertsChange(alertType)}
                    className="h-4 w-4 text-[var(--brand-header-bg)] border-gray-300 rounded focus:ring-[var(--brand-header-bg)]"
                  />
                  <span className="text-sm text-[var(--brand-text-secondary)]">{alertType}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmittingModal} className="px-4 py-2 text-sm font-medium text-white bg-[var(--brand-header-bg)] rounded-md hover:bg-opacity-80 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[var(--brand-header-bg)] focus:ring-offset-2">
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
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--brand-header-bg)]">Gerenciar Usuários</h1>
          <button onClick={() => openModal('add')}
            className="w-full sm:w-auto bg-[var(--brand-header-bg)] text-[var(--brand-text-header)] font-semibold px-6 py-2.5 rounded-lg shadow-md hover:bg-opacity-80 transition-colors flex items-center justify-center">
            <PlusCircleIcon className="w-5 h-5 mr-2" /> Adicionar Novo
          </button>
        </div>
        <p className="text-lg text-[var(--brand-text-secondary)] mt-4">Visualize, adicione, edite ou remova usuários da plataforma.</p>
      </section>

      {notification && (
        <div className={`p-4 mb-6 text-sm rounded-lg ${notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`} role="alert">
          {notification.message}
        </div>
      )}
      
      <section className="mb-8 p-4 bg-[var(--brand-card-background)] rounded-lg shadow-[var(--shadow-subtle)]">
        <h2 className="text-xl font-semibold text-[var(--brand-text-primary)] mb-3">Filtros e Busca</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" placeholder="Buscar por nome ou email..." className="p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[var(--brand-header-bg)]"/>
          <select className="p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[var(--brand-header-bg)]">
            <option value="">Todos os Papéis</option> <option value="user">Usuário</option> <option value="admin">Administrador</option>
          </select>
          <select className="p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[var(--brand-header-bg)]">
            <option value="">Todos os Status</option> <option value="ativo">Ativo</option> <option value="inativo">Inativo</option>
          </select>
        </div>
      </section>

      <section className="bg-[var(--brand-card-background)] p-4 sm:p-6 rounded-lg shadow-[var(--shadow-subtle)] overflow-x-auto">
        {isLoading ? (
          <p className="text-center text-[var(--brand-text-secondary)] py-8">Carregando usuários...</p>
        ) : users.length > 0 ? (
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Papel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Criado em</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--brand-text-primary)]">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--brand-text-secondary)]">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--brand-text-secondary)]">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{user.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--brand-text-secondary)]">{user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1 flex">
                    <button onClick={() => openModal('view', user)} title="Visualizar" className="text-blue-600 hover:text-blue-800 p-1"><EyeIcon className="w-5 h-5"/></button>
                    <button onClick={() => openModal('edit', user)} title="Editar" className="text-yellow-600 hover:text-yellow-800 p-1"><PencilSquareIcon className="w-5 h-5"/></button>
                    {user.role !== 'admin' && (<button onClick={() => handleRemover(user.id, user.name)} title="Remover" className="text-red-600 hover:text-red-800 p-1"><TrashIcon className="w-5 h-5"/></button>)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-[var(--brand-text-secondary)] py-8">Nenhum usuário encontrado ou falha ao carregar.</p>
        )}
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="bg-[var(--brand-card-background)] p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-[var(--brand-text-primary)]">
                {modalAction === 'add' && 'Adicionar Usuário'}
                {modalAction === 'edit' && 'Editar Usuário'}
                {modalAction === 'view' && 'Detalhes do Usuário'}
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