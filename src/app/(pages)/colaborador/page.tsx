"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';
import AnimatedSection from '../../components/AnimatedSection';

import {
  UsersIcon,
  BellAlertIcon,
  HomeModernIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';

export default function ColaboradorPage() {
  const { user, isAdmin, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (!isAdmin) {
      router.push('/');
    }
  }, [user, isAdmin, isAuthenticated, router]);

  if (!isAuthenticated || !isAdmin) {
    return (
      <AnimatedSection animationType="fadeIn" delay="duration-300" className="container mx-auto px-6 py-12 text-center">
        <p className="text-lg text-[var(--brand-text-secondary)]">Verificando permissões...</p>
      </AnimatedSection>
    );
  }

  const managementSections = [
    { name: 'Gerenciar Usuários', href: '/colaborador/usuarios', icon: UsersIcon, description: "Visualizar, editar e gerenciar contas de usuários." },
    { name: 'Gerenciar Alertas', href: '/colaborador/alertas', icon: BellAlertIcon, description: "Criar, aprovar e monitorar alertas da plataforma." },
    { name: 'Gerenciar Abrigos', href: '/colaborador/abrigos', icon: HomeModernIcon, description: "Adicionar, atualizar e remover informações de abrigos." },
    { name: 'Gerenciar Reportes', href: '/colaborador/reportes', icon: ClipboardDocumentListIcon, description: "Moderar e validar reportes enviados pela comunidade." }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 md:py-12">
      <AnimatedSection animationType="fadeInUp" delay="duration-500">
        <section className="text-center mb-10 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--brand-header-bg)]">
            Área do Colaborador
          </h1>
          <p className="text-lg text-[var(--brand-text-secondary)] mt-4 max-w-xl mx-auto">
            Bem-vindo, {user?.name || 'Administrador'}! Gerencie os recursos da plataforma EchoReport.
          </p>
        </section>
      </AnimatedSection>

      <AnimatedSection
        className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8"
        staggerChildren
        childDelayIncrement={100}
        animationType="fadeInUp"
        delay="duration-300"
        threshold={0.1}
      >
        {managementSections.map((section) => {
          const Icon = section.icon;
          return (
            <Link 
              href={section.href} 
              key={section.name}
              className="block bg-[var(--brand-card-background)] p-6 rounded-xl shadow-[var(--shadow-subtle)] hover:shadow-lg transition-all duration-300 hover:transform hover:-translate-y-1 group"
            >
              <div className="flex flex-col items-center text-center h-full">
                <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-[var(--brand-header-bg)]/10 text-[var(--brand-header-bg)] mb-4 group-hover:bg-[var(--brand-header-bg)]/20 transition-colors">
                  <Icon className="w-8 h-8 transition-transform group-hover:scale-110" />
                </div>
                <h2 className="text-xl font-semibold text-[var(--brand-text-primary)] group-hover:text-[var(--brand-header-bg)] transition-colors">
                  {section.name}
                </h2>
                <p className="text-sm text-[var(--brand-text-secondary)] mt-2 px-2 flex-grow">
                  {section.description}
                </p>
              </div>
            </Link>
          );
        })}
      </AnimatedSection>
    </div>
  );
}