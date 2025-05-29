"use client";

import React, { useEffect, useState } from 'react';
import ShelterCard from '../../components/ShelterCard';

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

export default function AbrigosPage() {
  const [sheltersToDisplay, setSheltersToDisplay] = useState<ShelterInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShelters = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const apiKey = '1234'; 

        const response = await fetch('http://localhost:8080/abrigos', {
          method: 'GET',
          headers: {
            'X-API-Key': apiKey
          }
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
          } catch (e) {
             // Falha ao parsear corpo do erro, usa a mensagem padrão.
          }
          throw new Error(errorMessage);
        }
        const data: ShelterInfo[] = await response.json();
        setSheltersToDisplay(data);
      } catch (e: any) {
        console.error("Falha ao buscar abrigos:", e);
        setError(e.message || "Ocorreu um erro ao buscar os abrigos.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchShelters();
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 md:py-12">
      <section className="text-center mb-10 md:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--brand-header-bg)]">
          Abrigos e Pontos de Apoio em São Paulo
        </h1>
        <p className="text-lg text-[var(--brand-text-secondary)] mt-4 max-w-2xl mx-auto">
          Quando abrigos temporários para desastres naturais não estiverem disponíveis, preencheremos com centros de acolhimentos convencionais.
        </p>
      </section>

      {isLoading && (
        <div className="text-center py-10">
          <p className="text-xl text-[var(--brand-text-secondary)]">Carregando abrigos...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-10 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erro!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {!isLoading && !error && sheltersToDisplay.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {sheltersToDisplay.map((shelter) => (
            <ShelterCard key={shelter.id} shelter={shelter} />
          ))}
        </div>
      )}

      {!isLoading && !error && sheltersToDisplay.length === 0 && (
        <div className="text-center py-10">
          <p className="text-xl text-[var(--brand-text-secondary)]">
            Nenhum abrigo disponível no momento.
          </p>
        </div>
      )}
    </div>
  );
}