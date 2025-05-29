"use client";

import React, { useEffect, useState } from 'react';

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
  } catch (error) {
    return 'Data inválida';
  }
};

const AlertCard = ({ alert }: { alert: AlertInfo }) => {
  const { title, severity, source, publishedAt, description } = alert;
  let bgColor = 'bg-gray-100 dark:bg-gray-700';
  let textColor = 'text-gray-800 dark:text-gray-200';
  let borderColor = 'border-gray-300 dark:border-gray-500';

  if (severity === 'Alto') {
    bgColor = 'bg-[var(--alert-red)]/10 dark:bg-[var(--alert-red)]/20';
    textColor = 'text-[var(--alert-red)] dark:text-[var(--alert-red-light)]';
    borderColor = 'border-[var(--alert-red)]/50 dark:border-[var(--alert-red)]';
  } else if (severity === 'Medio') {
    bgColor = 'bg-[var(--alert-orange)]/10 dark:bg-[var(--alert-orange)]/20';
    textColor = 'text-[var(--alert-orange)] dark:text-[var(--alert-orange-light)]';
    borderColor = 'border-[var(--alert-orange)]/50 dark:border-[var(--alert-orange)]';
  } else if (severity === 'Baixo') {
    bgColor = 'bg-[var(--alert-yellow)]/10 dark:bg-[var(--alert-yellow)]/20';
    textColor = 'text-[var(--alert-yellow)] dark:text-[var(--alert-yellow-dark)]';
    borderColor = 'border-[var(--alert-yellow)]/50 dark:border-[var(--alert-yellow)]';
  } else if (severity === 'Informativo') {
    bgColor = 'bg-[var(--alert-blue)]/10 dark:bg-[var(--alert-blue)]/20';
    textColor = 'text-[var(--alert-blue)] dark:text-[var(--alert-blue-light)]';
    borderColor = 'border-[var(--alert-blue)]/50 dark:border-[var(--alert-blue)]';
  }


  return (
    <div className={`p-5 md:p-6 rounded-lg shadow-[var(--shadow-subtle)] border-l-4 ${borderColor} ${bgColor}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className={`text-lg sm:text-xl font-semibold ${textColor}`}>{title}</h3>
        <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${textColor} ${bgColor.replace('/10', '/20').replace('/20', '/30')}`}>{severity}</span>
      </div>
      <p className="text-xs sm:text-sm text-[var(--brand-text-secondary)] mb-1"><strong>Fonte:</strong> {source}</p>
      <p className="text-xs sm:text-sm text-[var(--brand-text-secondary)] mb-3"><strong>Publicado:</strong> {formatTimeAgo(publishedAt)}</p>
      <p className="text-sm text-[var(--brand-text-primary)]">
        {description}
      </p>
    </div>
  );
};

export default function AlertasPage() {
  const [alerts, setAlerts] = useState<AlertInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const apiKey = '1234';

        const response = await fetch('http://localhost:8080/alertas', {
          method: 'GET',
          headers: {
            'X-API-Key': apiKey
          }
        });

        if (!response.ok) {
          let errorMessage = `HTTP error! status: ${response.status}`;
          try {
            const errorData = await response.json();
            if (errorData && errorData.entity) {
              errorMessage = `${errorMessage} - ${errorData.entity}`;
            } else if (typeof errorData === 'string' && errorData.length > 0) {
                errorMessage = `${errorMessage} - ${errorData}`;
            } else if (response.statusText) {
                errorMessage = `${errorMessage} - ${response.statusText}`;
            }
          } catch (e) {
            // Falha ao parsear corpo do erro.
          }
          throw new Error(errorMessage);
        }
        const data: AlertInfo[] = await response.json();
        setAlerts(data);
      } catch (e: any) {
        console.error("Falha ao buscar alertas:", e);
        setError(e.message || "Ocorreu um erro ao buscar os alertas.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 md:py-12">
      <section className="text-center mb-10 md:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--brand-header-bg)]">
          Alertas e Avisos Recentes
        </h1>
        <p className="text-lg text-[var(--brand-text-secondary)] mt-4 max-w-xl mx-auto">
          Mantenha-se informado sobre os últimos acontecimentos e recomendações.
        </p>
      </section>

      {isLoading && (
        <div className="text-center py-10">
          <p className="text-xl text-[var(--brand-text-secondary)]">Carregando alertas...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-10 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erro!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {!isLoading && !error && alerts.length > 0 && (
        <div className="space-y-6">
          {alerts.map(alert => <AlertCard key={alert.id} alert={alert} />)}
        </div>
      )}

      {!isLoading && !error && alerts.length === 0 && (
        <div className="text-center py-10">
          <p className="text-xl text-[var(--brand-text-secondary)]">Nenhum alerta no momento.</p>
        </div>
      )}
    </div>
  );
}