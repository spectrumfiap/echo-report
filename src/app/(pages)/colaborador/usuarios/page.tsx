// src/app/colaborador/usuarios/page.tsx
"use client"; // Para interatividade futura com formulários e listas dinâmicas

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusCircleIcon, PencilSquareIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../../contexts/AuthContext'; 
import { useRouter } from 'next/navigation';

// Interface de exemplo para um usuário (você pode expandir)
interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'ativo' | 'inativo';
  createdAt: string;
}

// Dados mock para simular a lista de usuários (viriam da API)
const mockUsers: UserData[] = [
  { id: 'usr_1', name: 'Ana Silva', email: 'ana.silva@example.com', role: 'user', status: 'ativo', createdAt: '2024-05-01' },
  { id: 'usr_2', name: 'Bruno Costa', email: 'bruno.costa@example.com', role: 'user', status: 'inativo', createdAt: '2024-04-15' },
  { id: 'usr_3', name: 'Carlos Dias', email: 'carlos.dias@example.com', role: 'user', status: 'ativo', createdAt: '2024-05-10' },
  { id: 'admin_id_special', name: 'Administrador', email: 'admin@echoreport.com', role: 'admin', status: 'ativo', createdAt: '2024-01-01' },
];

export default function GerenciarUsuariosPage() {
  const { isAdmin, isAuthenticated } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]); // Estado para armazenar usuários da API
  const [isLoading, setIsLoading] = useState(true); // Estado de carregamento

  // Proteção de rota e busca de dados inicial
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (!isAdmin) {
      router.push('/');
    } else {
      // Simular busca de dados da API
      setTimeout(() => {
        setUsers(mockUsers);
        setIsLoading(false);
      }, 1000);
    }
  }, [isAdmin, isAuthenticated, router]);

  const handleAdicionar = () => {
    // Lógica para redirecionar para uma página de formulário de adição
    // ou abrir um modal de adição.
    alert('Funcionalidade "Adicionar Novo Usuário" a ser implementada.');
    // router.push('/colaborador/usuarios/novo'); // Exemplo
  };

  const handleEditar = (userId: string) => {
    alert(`Funcionalidade "Editar Usuário ${userId}" a ser implementada.`);
    // router.push(`/colaborador/usuarios/editar/${userId}`); // Exemplo
  };

  const handleRemover = (userId: string, userName: string) => {
    if (window.confirm(`Tem certeza que deseja remover o usuário "${userName}"? Esta ação não pode ser desfeita.`)) {
      // Lógica para chamar a API de remoção
      alert(`Usuário ${userId} ("${userName}") removido (simulação).`);
      // Atualizar a lista de usuários após a remoção
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    }
  };
  
  const handleVisualizar = (userId: string) => {
    alert(`Funcionalidade "Visualizar Detalhes do Usuário ${userId}" a ser implementada.`);
    // router.push(`/colaborador/usuarios/detalhes/${userId}`); // Exemplo
  };


  if (!isAuthenticated || !isAdmin) {
    return <div className="container mx-auto p-6 text-center">Verificando permissões ou redirecionando...</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 md:py-12">
      <section className="mb-10 md:mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--brand-header-bg)]">
            Gerenciar Usuários
          </h1>
          <button
            onClick={handleAdicionar}
            className="w-full sm:w-auto bg-[var(--brand-header-bg)] text-[var(--brand-text-header)] font-semibold px-6 py-2.5 rounded-lg shadow-md hover:bg-opacity-80 transition-colors flex items-center justify-center"
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            Adicionar Novo
          </button>
        </div>
        <p className="text-lg text-[var(--brand-text-secondary)] mt-4">
          Visualize, adicione, edite ou remova usuários da plataforma.
        </p>
      </section>

      {/* Área para Filtros e Busca (Placeholder) */}
      <section className="mb-8 p-4 bg-[var(--brand-card-background)] rounded-lg shadow-[var(--shadow-subtle)]">
        <h2 className="text-xl font-semibold text-[var(--brand-text-primary)] mb-3">Filtros e Busca</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" placeholder="Buscar por nome ou email..." className="p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[var(--brand-header-bg)]"/>
          <select className="p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[var(--brand-header-bg)]">
            <option value="">Todos os Papéis</option>
            <option value="user">Usuário</option>
            <option value="admin">Administrador</option>
          </select>
          <select className="p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[var(--brand-header-bg)]">
            <option value="">Todos os Status</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>
      </section>

      {/* Área de Listagem (Tabela) */}
      <section className="bg-[var(--brand-card-background)] p-4 sm:p-6 rounded-lg shadow-[var(--shadow-subtle)] overflow-x-auto">
        {isLoading ? (
          <p className="text-center text-[var(--brand-text-secondary)] py-8">Carregando usuários...</p>
        ) : users.length > 0 ? (
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Nome</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Papel</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Criado em</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-text-secondary)] uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--brand-text-primary)]">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--brand-text-secondary)]">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--brand-text-secondary)]">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--brand-text-secondary)]">{new Date(user.createdAt).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 flex">
                    <button onClick={() => handleVisualizar(user.id)} title="Visualizar" className="text-blue-600 hover:text-blue-800 transition-colors p-1"><EyeIcon className="w-5 h-5"/></button>
                    <button onClick={() => handleEditar(user.id)} title="Editar" className="text-yellow-600 hover:text-yellow-800 transition-colors p-1"><PencilSquareIcon className="w-5 h-5"/></button>
                    {user.role !== 'admin' && // Não permitir remover o próprio admin (exemplo de lógica)
                        <button onClick={() => handleRemover(user.id, user.name)} title="Remover" className="text-red-600 hover:text-red-800 transition-colors p-1"><TrashIcon className="w-5 h-5"/></button>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-[var(--brand-text-secondary)] py-8">Nenhum usuário encontrado.</p>
        )}
      </section>
      {/* Adicionar paginação aqui se necessário no futuro */}
    </div>
  );
}