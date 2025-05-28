// src/app/(auth)/login/page.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email e senha são obrigatórios.');
      return;
    }

    const loginSuccess = await login(email, password);

    if (loginSuccess) {
    alert('Login realizado com sucesso!');
      router.push('/');
    } else {
      setError('Email ou senha inválidos. Verifique os dados ou registre-se.');
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 md:py-16 flex justify-center items-center min-h-[calc(100vh-150px)]">
      <div className="w-full max-w-md bg-[var(--brand-card-background)] p-8 rounded-xl shadow-[var(--shadow-subtle)]">
        <h1 className="text-3xl font-bold text-center text-[var(--brand-header-bg)] mb-8">
          Login
        </h1>
        {error && <p className="mb-4 text-center text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ... campos de email e senha permanecem os mesmos */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--brand-text-secondary)]">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              className="mt-1 block w-full p-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-header-bg)] focus:border-[var(--brand-header-bg)] sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[var(--brand-text-secondary)]">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="mt-1 block w-full p-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-header-bg)] focus:border-[var(--brand-header-bg)] sm:text-sm"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[var(--brand-text-header)] bg-[var(--brand-header-bg)] hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--brand-header-bg)]"
            >
              Entrar
            </button>
          </div>
        </form>
        <p className="mt-8 text-center text-sm text-[var(--brand-text-secondary)]">
          Não tem uma conta?{' '}
          <Link href="/registro" className="font-medium text-[var(--brand-header-bg)] hover:text-opacity-80">
            Registre-se
          </Link>
        </p>
      </div>
    </div>
  );
}