// src/app/(auth)/login/page.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import AnimatedSection from './../../components/AnimatedSection'; 

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
  
  const inputBaseClasses = "mt-1 block w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-header-bg)] dark:focus:ring-blue-500 focus:border-[var(--brand-header-bg)] dark:focus:border-blue-500 sm:text-sm transition-colors";
  const inputBgTextClasses = "bg-[var(--brand-input-background)] text-[var(--brand-text-primary)] placeholder:text-slate-400 dark:placeholder:text-slate-500";

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 md:py-16 flex justify-center items-center min-h-[calc(100vh-150px)]">
      <AnimatedSection
        className="w-full max-w-md bg-[var(--brand-card-background)] p-8 rounded-xl shadow-[var(--shadow-subtle)]"
        animationType="fadeInUp"
        delay="duration-300"
        staggerChildren
        childDelayIncrement={75}
        threshold={0.1}
      >
        <h1 className="text-3xl font-bold text-center text-[var(--brand-header-bg)] dark:text-blue-400 mb-8">
          Login
        </h1>
        
        {error && (
          <p className="mb-4 text-center text-sm text-red-600 dark:text-red-300 bg-red-100 dark:bg-red-900/30 p-3 rounded-md border border-red-300 dark:border-red-700">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
              className={`${inputBaseClasses} ${inputBgTextClasses}`}
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
              className={`${inputBaseClasses} ${inputBgTextClasses}`}
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[var(--brand-text-header)] bg-[var(--brand-header-bg)] dark:bg-blue-600 hover:bg-opacity-80 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--brand-header-bg)] dark:focus:ring-blue-500 dark:focus:ring-offset-[var(--brand-card-background)]"
            >
              Entrar
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-[var(--brand-text-secondary)]">
          Não tem uma conta?{' '}
          <Link href="/registro" className="font-medium text-[var(--brand-header-bg)] dark:text-blue-400 hover:text-opacity-80 dark:hover:opacity-80">
            Registre-se
          </Link>
        </p>
      </AnimatedSection>
    </div>
  );
}