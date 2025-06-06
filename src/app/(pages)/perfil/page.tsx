"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, availableAlertTypes, AlertType } from '../../contexts/AuthContext';
import AnimatedSection from './../../components/AnimatedSection';

export default function PerfilPage() {
  const { user, isAuthenticated, logout, updateUserPreferences } = useAuth();
  const router = useRouter();

  const [locationPreference, setLocationPreference] = useState(user?.locationPreference || '');
  const [subscribedAlerts, setSubscribedAlerts] = useState<AlertType[]>(user?.subscribedAlerts || []);
  
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!isAuthenticated && !user) {
      router.push('/login');
    } else if (user) {
        setLocationPreference(user.locationPreference || '');
        setSubscribedAlerts(user.subscribedAlerts || []);
    }
  }, [isAuthenticated, user, router]);

  const handleAlertSubscriptionChange = (alertType: AlertType) => {
    setSubscribedAlerts(prev => 
      prev.includes(alertType) 
        ? prev.filter(item => item !== alertType) 
        : [...prev, alertType]
    );
  };

  const handleSaveChanges = async () => {
    if (!user) return;
    setSuccessMessage('');
    setErrorMessage('');

    const success = await updateUserPreferences(user.id, {
        locationPreference,
        subscribedAlerts,
    });

    if (success) {
        setSuccessMessage('Preferências atualizadas com sucesso!');
        setIsEditing(false);
    } else {
        setErrorMessage('Erro ao atualizar preferências. Tente novamente.');
    }
  };
  
  if (!user) {
    return (
      <AnimatedSection animationType="fadeIn" className="container mx-auto px-6 py-12 text-center">
        Carregando perfil...
      </AnimatedSection>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 md:py-12">
      <AnimatedSection animationType="fadeInUp" delay="duration-500">
        <section className="text-center mb-10 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--brand-header-bg)]">
            Meu Perfil
          </h1>
          <p className="text-lg text-[var(--brand-text-secondary)] mt-4 max-w-xl mx-auto">
            Gerencie suas informações e preferências da plataforma EchoReport.
          </p>
        </section>
      </AnimatedSection>

      <AnimatedSection
        animationType="fadeInUp"
        delay="duration-300"
        staggerChildren
        childDelayIncrement={75}
        threshold={0.1}
        className="w-full max-w-2xl mx-auto bg-[var(--brand-card-background)] p-6 md:p-8 rounded-xl shadow-[var(--shadow-subtle)] space-y-6"
      >
        {successMessage && <p className="text-center text-sm text-green-600 bg-green-100 p-3 rounded-md">{successMessage}</p>}
        {errorMessage && <p className="text-center text-sm text-red-600 bg-red-100 p-3 rounded-md">{errorMessage}</p>}

        <div>
          <h2 className="text-xl font-semibold text-[var(--brand-text-primary)] mb-2">Informações Pessoais</h2>
          <div className="space-y-2">
            <p><span className="font-medium text-[var(--brand-text-secondary)]">Nome:</span> <span className="text-[var(--brand-text-primary)]">{user.name}</span></p>
            <p><span className="font-medium text-[var(--brand-text-secondary)]">Email:</span> <span className="text-[var(--brand-text-primary)]">{user.email}</span></p>
          </div>
        </div>

        <hr className="border-slate-200 dark:border-slate-700" />

        <div>
          <h2 className="text-xl font-semibold text-[var(--brand-text-primary)] mb-2">Preferências de Localização</h2>
          {isEditing ? (
            <input
              type="text"
              value={locationPreference}
              onChange={(e) => setLocationPreference(e.target.value)}
              placeholder="Ex: Vila Madalena, São Paulo"
              className="mt-1 block w-full p-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-header-bg)] focus:border-[var(--brand-header-bg)] sm:text-sm bg-white dark:bg-slate-800 text-[var(--brand-text-primary)]"
            />
          ) : (
            <p className="text-[var(--brand-text-secondary)]">{user.locationPreference || 'Nenhuma localização principal definida.'}</p>
          )}
        </div>

        <hr className="border-slate-200 dark:border-slate-700" />
        
        <div>
          <h2 className="text-xl font-semibold text-[var(--brand-text-primary)] mb-2">Tipos de Alerta Ativados</h2>
          {isEditing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 mt-2">
              {availableAlertTypes.map((alertType) => (
                <label key={alertType} className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-md">
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
          ) : (
            subscribedAlerts.length > 0 ? (
              <ul className="list-disc list-inside text-[var(--brand-text-secondary)] pl-5 space-y-1">
                {subscribedAlerts.map(type => <li key={type}>{type}</li>)}
              </ul>
            ) : (
              <p className="text-[var(--brand-text-secondary)]">Nenhum tipo de alerta específico selecionado.</p>
            )
          )}
        </div>
        
        <div className="pt-6 border-t border-gray-200 dark:border-slate-700 mt-6 space-y-3">
            {isEditing ? (
                <div className="flex gap-4 flex-col sm:flex-row">
                    <button 
                        onClick={handleSaveChanges}
                        className="w-full bg-[var(--success-green)] text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:bg-opacity-80 transition-colors"
                    >
                        Salvar Alterações
                    </button>
                    <button 
                        onClick={() => {
                            setIsEditing(false);
                            setLocationPreference(user.locationPreference || '');
                            setSubscribedAlerts(user.subscribedAlerts || []);
                        }}
                        className="w-full bg-slate-500 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:bg-opacity-80 transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
            ) : (
                <button 
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-slate-200 dark:bg-slate-600 text-[var(--brand-text-primary)] font-semibold py-2.5 px-4 rounded-lg shadow-md hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
                >
                    Editar Preferências
                </button>
            )}

             <button 
                onClick={logout}
                type="button" 
                className="w-full bg-[var(--alert-red)] text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:bg-opacity-80 transition-colors"
            >
                Sair (Logout)
            </button>
        </div>
      </AnimatedSection>
    </div>
  );
}