"use client";

import React, { useEffect, useState } from 'react';
import ShelterCard from '../../components/ShelterCard'; // Verifique se o caminho está correto, o log inicial não indicava erro aqui
import AnimatedSection from '../../components/AnimatedSection'; // Verifique se o caminho está correto
import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface ShelterInfo {
  id: number;
  name: string;
  imageUrl?: string;
  address: string;
  neighborhood: string;
  cityState: string;
  zipCode?: string;
  contactPhone?: string;
  contactEmail?: string;
  capacityStatus: string;
  servicesOffered: string[];
  targetAudience: string;
  operatingHours: string;
  observations?: string;
  googleMapsUrl?: string;
}

type NoticeStateType = 'hidden' | 'entering' | 'visible' | 'leaving';
const NOTICE_VISIBLE_DURATION = 8000;
const NOTICE_FADE_DURATION = 500;

export default function AbrigosPage() {
  const [sheltersToDisplay, setSheltersToDisplay] = useState<ShelterInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [noticeState, setNoticeState] = useState<NoticeStateType>('hidden');

  useEffect(() => {
    const fetchShelters = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const apiKey = process.env.NEXT_PUBLIC_STATIC_API_KEY || '1234';
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
        
        const response = await fetch(`${apiBaseUrl}/abrigos`, {
          method: 'GET',
          headers: { 'X-API-Key': apiKey }
        });

        if (!response.ok) {
          let errorMessage = `HTTP error! status: ${response.status} ${response.statusText}`;
          try {
            const errorData = await response.json();
            if (errorData && errorData.entity) {
              errorMessage += ` - ${errorData.entity}`;
            } else if (typeof errorData === 'string' && errorData.length > 0) {
              errorMessage += ` - ${errorData}`;
            } else if (response.statusText) {
                errorMessage = `HTTP error! status: ${response.status} - ${response.statusText}`;
            } else {
                errorMessage = `HTTP error! status: ${response.status}`;
            }
          } catch (_e) { // Erro 1 corrigido: _e para indicar não uso intencional
            // Falha ao parsear o corpo do erro, mas o errorMessage principal já está definido
            console.warn("Não foi possível parsear o corpo da resposta de erro, usando statusText.");
          }
          throw new Error(errorMessage);
        }
        const data: ShelterInfo[] = await response.json();
        setSheltersToDisplay(data.sort((a,b) => a.name.localeCompare(b.name)));
      } catch (e: unknown) { // Erro 2 corrigido: e: unknown
        console.error("Falha ao buscar abrigos:", e);
        let message = "Ocorreu um erro ao buscar os abrigos.";
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
    
    fetchShelters();

    const initialDelayTimer = setTimeout(() => {
      setNoticeState('entering');
    }, 300);

    const visibilityTimer = setTimeout(() => {
      setNoticeState('leaving');
    }, 300 + NOTICE_VISIBLE_DURATION); 

    return () => {
      clearTimeout(initialDelayTimer);
      clearTimeout(visibilityTimer);
    };
  }, []);

  useEffect(() => {
    let transitionEndTimerId: NodeJS.Timeout;
    if (noticeState === 'entering') {
      const rafId = requestAnimationFrame(() => { // requestAnimationFrame retorna um number
        setNoticeState('visible');
      });
      return () => cancelAnimationFrame(rafId);
    } else if (noticeState === 'leaving') {
      transitionEndTimerId = setTimeout(() => {
        setNoticeState('hidden'); 
      }, NOTICE_FADE_DURATION);
      return () => clearTimeout(transitionEndTimerId);
    }
  }, [noticeState]);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 md:py-12">
      <AnimatedSection animationType="fadeInUp" delay="duration-500">
        <section className="text-center mb-8 md:mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--brand-header-bg)]">
            Abrigos e Pontos de Apoio
          </h1>
          <p className="text-lg text-[var(--brand-text-secondary)] mt-4 max-w-2xl mx-auto">
            Encontre locais seguros e serviços de acolhimento disponíveis na sua região.
          </p>
        </section>
      </AnimatedSection>

      {noticeState !== 'hidden' && (
        <div
          className={`
            mb-6 p-3 bg-blue-50 border-l-4 border-[var(--brand-header-bg)] text-[var(--brand-header-bg)]/80 
            rounded-md shadow-sm text-sm flex items-start
            transition-opacity ease-in-out duration-${NOTICE_FADE_DURATION} 
            ${noticeState === 'visible' ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <InformationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <span>
            Estamos utilizando serviços de hospedagem gratuitos para nossa API. O carregamento inicial dos abrigos pode levar alguns segundos. Agradecemos a sua paciência!
          </span>
        </div>
      )}

      {isLoading && (
        <AnimatedSection animationType="fadeIn" delay="duration-300">
          <div className="text-center py-10">
            <p className="text-xl text-[var(--brand-text-secondary)]">Carregando abrigos...</p>
          </div>
        </AnimatedSection>
      )}

      {error && (
        <AnimatedSection animationType="fadeIn" delay="duration-300">
          <div className="text-center py-10 bg-red-100 border border-red-400 text-red-700 px-4 rounded relative" role="alert">
            <strong className="font-bold">Erro!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        </AnimatedSection>
      )}

      {!isLoading && !error && sheltersToDisplay.length > 0 && (
        <AnimatedSection
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          staggerChildren
          childDelayIncrement={150}
          animationType="fadeInUp"
          delay="duration-500"
          threshold={0.1}
        >
          {sheltersToDisplay.map((shelter) => (
            <ShelterCard key={shelter.id} shelter={shelter} />
          ))}
        </AnimatedSection>
      )}

      {!isLoading && !error && sheltersToDisplay.length === 0 && (
        <AnimatedSection animationType="fadeIn" delay="duration-300">
          <div className="text-center py-10">
            <p className="text-xl text-[var(--brand-text-secondary)]">
              Nenhum abrigo disponível no momento.
            </p>
          </div>
        </AnimatedSection>
      )}
    </div>
  );
}