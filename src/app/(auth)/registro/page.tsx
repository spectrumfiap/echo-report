// src/app/(auth)/registro/page.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, availableAlertTypes, AlertType } from '../../contexts/AuthContext';

export default function RegistroPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [locationPreference, setLocationPreference] = useState('');
  const [subscribedAlerts, setSubscribedAlerts] = useState<AlertType[]>([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();
  const { register, login } = useAuth();

  const handleAlertSubscriptionChange = (alertType: AlertType) => {
    setSubscribedAlerts(prev => 
      prev.includes(alertType) 
        ? prev.filter(item => item !== alertType) 
        : [...prev, alertType]
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Nome, email e senha são obrigatórios.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Formato de email inválido.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    const registrationResult = await register({
      name,
      email,
      password, // Passa a senha em texto plano para o register, que simulará o hash
      locationPreference,
      subscribedAlerts
    });

    if (registrationResult.success) {
      setSuccessMessage('Registro realizado com sucesso! Você será logado e redirecionado...');
      const loginSuccess = await login(email, password);
      if (loginSuccess) {
        setTimeout(() => router.push('/'), 2000); // Redireciona para home após 2s
      } else {
        setError('Erro ao fazer login após o registro. Tente fazer login manualmente.');
        setTimeout(() => router.push('/login'), 2000);
      }
    } else {
      setError(registrationResult.message || 'Erro ao registrar. Tente novamente.');
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 md:py-16 flex justify-center items-center min-h-[calc(100vh-150px)]">
      <div className="w-full max-w-lg bg-[var(--brand-card-background)] p-8 rounded-xl shadow-[var(--shadow-subtle)]">
        <h1 className="text-3xl font-bold text-center text-[var(--brand-header-bg)] mb-8">
          Criar Conta no EchoReport
        </h1>
        {error && <p className="mb-4 text-center text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
        {successMessage && <p className="mb-4 text-center text-sm text-green-600 bg-green-100 p-3 rounded-md">{successMessage}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campos de Nome, Email, Senha, Confirmar Senha  */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[var(--brand-text-secondary)]">Nome Completo</label>
            <input id="name" name="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full p-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-header-bg)] focus:border-[var(--brand-header-bg)] sm:text-sm"/>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--brand-text-secondary)]">Email</label>
            <input id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required className="mt-1 block w-full p-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-header-bg)] focus:border-[var(--brand-header-bg)] sm:text-sm"/>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[var(--brand-text-secondary)]">Senha</label>
            <input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required className="mt-1 block w-full p-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-header-bg)] focus:border-[var(--brand-header-bg)] sm:text-sm"/>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--brand-text-secondary)]">Confirmar Senha</label>
            <input id="confirmPassword" name="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" required className="mt-1 block w-full p-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-header-bg)] focus:border-[var(--brand-header-bg)] sm:text-sm"/>
          </div>

          {/* Preferência de Localização */}
          <div>
            <label htmlFor="locationPreference" className="block text-sm font-medium text-[var(--brand-text-secondary)]">
              Localização Principal de Interesse (Bairro, Cidade - opcional)
            </label>
            <input
              id="locationPreference"
              name="locationPreference"
              type="text"
              value={locationPreference}
              onChange={(e) => setLocationPreference(e.target.value)}
              placeholder="Ex: Vila Madalena, São Paulo"
              className="mt-1 block w-full p-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-header-bg)] focus:border-[var(--brand-header-bg)] sm:text-sm"
            />
          </div>

          {/*Tipos de Alerta Ativados */}
          <div>
            <span className="block text-sm font-medium text-[var(--brand-text-secondary)] mb-2">
              Quais tipos de alerta você gostaria de receber? (opcional)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              {availableAlertTypes.map((alertType) => (
                <label key={alertType} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={subscribedAlerts.includes(alertType)}
                    onChange={() => handleAlertSubscriptionChange(alertType)}
                    className="h-4 w-4 text-[var(--brand-header-bg)] border-gray-300 rounded focus:ring-[var(--brand-header-bg)]"
                  />
                  <span className="text-sm text-[var(--brand-text-secondary)]">{alertType}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[var(--brand-text-header)] bg-[var(--brand-header-bg)] hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--brand-header-bg)]"
            >
              Registrar
            </button>
          </div>
        </form>
        <p className="mt-8 text-center text-sm text-[var(--brand-text-secondary)]">
          Já tem uma conta?{' '}
          <Link href="/login" className="font-medium text-[var(--brand-header-bg)] hover:text-opacity-80">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}