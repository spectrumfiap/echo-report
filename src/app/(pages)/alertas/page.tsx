"use client";

import React, { useEffect, useState } from 'react';
import AnimatedSection from '../../components/AnimatedSection';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface AlertInfo {
  id: number;
  title: string;
  severity: string;
  source: string;
  publishedAt: string;
  description: string;
  targetArea?: string;
  status?: string;
}

const formatTimeAgo = (isoDateTimeString?: string): string => {
  if (!isoDateTimeString) return 'Data indisponível';
  try {
    const date = new Date(isoDateTimeString);
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);
    const months = Math.round(days / 30.44);
    const years = Math.round(days / 365.25);
    if (isNaN(date.getTime())) return 'Data inválida';
    if (seconds < 5) return 'Agora mesmo';
    if (seconds < 60) return `Há ${seconds} seg`;
    if (minutes < 60) return `Há ${minutes} min`;
    if (hours < 24) return `Há ${hours}h`;
    if (days < 30) return `Há ${days}d`;
    if (months < 12) return `Há ${months} meses`;
    return `Há ${years} anos`;
  } catch (_error) {
    return 'Data inválida';
  }
};

const AlertCard = ({ alert }: { alert: AlertInfo }) => {
  const { title, severity, source, publishedAt, description } = alert;
  const bgColorDefault = 'bg-gray-100 dark:bg-slate-800';
  const textColorDefault = 'text-gray-800 dark:text-gray-300';
  const borderColorDefault = 'border-gray-300 dark:border-slate-600';

  const severityStyles: Record<string, {bgColor: string, textColor: string, borderColor: string}> = {
    'Alto': {
      bgColor: 'bg-[var(--alert-red)]/10 dark:bg-[var(--alert-red)]/20',
      textColor: 'text-[var(--alert-red)] dark:text-[var(--alert-red-light)]',
      borderColor: 'border-[var(--alert-red)]/50 dark:border-[var(--alert-red)]',
    },
    'Medio': {
      bgColor: 'bg-[var(--alert-orange)]/10 dark:bg-[var(--alert-orange)]/20',
      textColor: 'text-[var(--alert-orange)] dark:text-[var(--alert-orange-light)]',
      borderColor: 'border-[var(--alert-orange)]/50 dark:border-[var(--alert-orange)]',
    },
    'Baixo': {
      bgColor: 'bg-[var(--alert-yellow)]/10 dark:bg-[var(--alert-yellow)]/20',
      textColor: 'text-[var(--alert-yellow)] dark:text-[var(--alert-yellow-light)]',
      borderColor: 'border-[var(--alert-yellow)]/50 dark:border-[var(--alert-yellow)]',
    },
    'Informativo': {
      bgColor: 'bg-[var(--alert-blue)]/10 dark:bg-[var(--alert-blue)]/20',
      textColor: 'text-[var(--alert-blue)] dark:text-[var(--alert-blue-light)]',
      borderColor: 'border-[var(--alert-blue)]/50 dark:border-[var(--alert-blue)]',
    }
  };

  const styles = severityStyles[severity] || { 
    bgColor: bgColorDefault, 
    textColor: textColorDefault, 
    borderColor: borderColorDefault 
  };

  return (
    <div className={`p-5 md:p-6 rounded-lg shadow-[var(--shadow-subtle)] border-l-4 ${styles.borderColor} ${styles.bgColor}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className={`text-lg sm:text-xl font-semibold ${styles.textColor}`}>{title}</h3>
        <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${styles.textColor} ${styles.bgColor.replace('/10', '/20').replace('/20', '/30')}`}>{severity}</span>
      </div>
      <p className="text-xs sm:text-sm text-[var(--brand-text-secondary)] mb-1"><strong>Fonte:</strong> {source}</p>
      <p className="text-xs sm:text-sm text-[var(--brand-text-secondary)] mb-3"><strong>Publicado:</strong> {formatTimeAgo(publishedAt)}</p>
      <p className="text-sm text-[var(--brand-text-primary)]">
        {description}
      </p>
    </div>
  );
};

type NoticeStateType = 'hidden' | 'entering' | 'visible' | 'leaving';
const NOTICE_VISIBLE_DURATION = 8000;
const NOTICE_FADE_DURATION = 500; 

export default function AlertasPage() {
  const [alerts, setAlerts] = useState<AlertInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [noticeState, setNoticeState] = useState<NoticeStateType>('hidden');

  useEffect(() => {
    const fetchAlerts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const apiKey = process.env.NEXT_PUBLIC_STATIC_API_KEY || '1234';
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
        const response = await fetch(`${apiBaseUrl}/alertas`, {
          method: 'GET',
          headers: { 'X-API-Key': apiKey }
        });
        if (!response.ok) {
          let errorMessage = `HTTP error! status: ${response.status}`;
          try {
            const errorData = await response.json();
            if (errorData && errorData.entity) { errorMessage = `${errorMessage} - ${errorData.entity}`; }
            else if (typeof errorData === 'string' && errorData.length > 0) { errorMessage = `${errorMessage} - ${errorData}`; }
            else if (response.statusText) { errorMessage = `${errorMessage} - ${response.statusText}`; }
          } catch (_e) { 
            // Falha ao parsear JSON do erro, usa mensagem padrão
          }
          throw new Error(errorMessage);
        }
        const data: AlertInfo[] = await response.json();
        setAlerts(data.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()));
      } catch (e: unknown) {
        console.error("Falha ao buscar alertas:", e);
        let message = "Ocorreu um erro ao buscar os alertas.";
        if (e instanceof Error) {
          message = e.message;
        } else if (typeof e === 'string') {
          message = e;
        }
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAlerts();
    const initialDelayTimer = setTimeout(() => setNoticeState('entering'), 300);
    const visibilityTimer = setTimeout(() => setNoticeState('leaving'), 300 + NOTICE_VISIBLE_DURATION); 
    return () => { clearTimeout(initialDelayTimer); clearTimeout(visibilityTimer); };
  }, []);

  useEffect(() => {
    let transitionEndTimerId: NodeJS.Timeout;
    if (noticeState === 'entering') {
      const rafId = requestAnimationFrame(() => setNoticeState('visible'));
      return () => cancelAnimationFrame(rafId);
    } else if (noticeState === 'leaving') {
      transitionEndTimerId = setTimeout(() => setNoticeState('hidden'), NOTICE_FADE_DURATION);
      return () => clearTimeout(transitionEndTimerId);
    }
  }, [noticeState]);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 md:py-12">
      <AnimatedSection animationType="fadeInUp" delay="duration-500">
        <section className="text-center mb-8 md:mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--brand-header-bg)] dark:text-blue-400">
            Alertas e Avisos Recentes
          </h1>
          <p className="text-lg text-[var(--brand-text-secondary)] mt-4 max-w-xl mx-auto">
            Mantenha-se informado sobre os últimos acontecimentos e recomendações.
          </p>
        </section>
      </AnimatedSection>

      {noticeState !== 'hidden' && (
        <div
          className={`
            mb-6 p-3 
            bg-blue-100 dark:bg-sky-800 
            border-l-4 border-blue-500 dark:border-sky-600 
            text-blue-700 dark:text-sky-200 
            rounded-md shadow-sm text-sm flex items-start
            transition-opacity ease-in-out duration-500
            ${noticeState === 'visible' ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <InformationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <span>
            Estamos utilizando serviços de hospedagem gratuitos para nossa API. O carregamento inicial dos alertas pode levar alguns segundos. Agradecemos a sua paciência!
          </span>
        </div>
      )}

      {isLoading && (
        <AnimatedSection animationType="fadeIn" delay="duration-300">
          <div className="text-center py-10">
            <p className="text-xl text-[var(--brand-text-secondary)]">Carregando alertas...</p>
          </div>
        </AnimatedSection>
      )}

      {error && (
        <AnimatedSection animationType="fadeIn" delay="duration-300">
          <div className="text-center py-10 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 rounded relative" role="alert">
            <strong className="font-bold">Erro!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        </AnimatedSection>
      )}

      {!isLoading && !error && alerts.length > 0 && (
        <AnimatedSection
          className="space-y-6"
          staggerChildren
          childDelayIncrement={75}
          animationType="fadeInUp"
          delay="duration-300"
          threshold={0.05}
        >
          {alerts.map(alert => <AlertCard key={alert.id} alert={alert} />)}
        </AnimatedSection>
      )}

      {!isLoading && !error && alerts.length === 0 && (
        <AnimatedSection animationType="fadeIn" delay="duration-300">
          <div className="text-center py-10">
            <p className="text-xl text-[var(--brand-text-secondary)]">Nenhum alerta no momento.</p>
          </div>
        </AnimatedSection>
      )}
    </div>
  );
}