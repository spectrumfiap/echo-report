"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import MapDisplay from '../../components/MapDisplay';
import { useJsApiLoader } from '@react-google-maps/api'; // Importar o hook aqui também

const API_BASE_URL = 'http://localhost:8080';
const STATIC_API_KEY = '1234'; 

// --- Interfaces (mantenha as definições de ApiMapaArea, ApiReport, DisplayZone aqui) ---
interface ApiMapaArea {
  id: number;
  latitude: number;
  longitude: number;
  radius: number;
  riskLevel: 'alto' | 'medio' | 'baixo';
  title: string;
  description: string;
  reason?: string;
  lastUpdatedTimestamp?: string;
  isActive?: boolean;
}

interface ApiReport {
  id: number;
  eventType: string;
  location: string;
  description: string;
  reporterName?: string;
  userId?: number;
  imageUrl?: string;
  reportTimestamp: string;
  status: string;
  severity?: 'baixa' | 'media' | 'alta' | 'nao_definida';
  latitude?: number;
  longitude?: number;
}

interface DisplayZone {
  id: string;
  center: google.maps.LatLngLiteral;
  radius: number;
  riskLevel: 'alto' | 'medio' | 'baixo';
  title: string;
  description: string;
  reason?: string;
  lastUpdated?: string;
  type: 'predefined' | 'report';
  originalReport?: ApiReport; 
}
// --- FIM DAS DEFINIÇÕES DAS INTERFACES ---


const saoPauloCenter = { lat: -23.55052, lng: -46.633308 };

const riskColorsForLegend = {
  alto: { fillColor: 'var(--alert-red)' },
  medio: { fillColor: 'var(--alert-yellow)' },
  baixo: { fillColor: '#00FF00' } 
};

const googleMapsLibraries: ("places" | "drawing" | "geometry" | "visualization")[] = ['places', 'drawing', 'geometry', 'visualization'];

export default function MapaPage() {
  const Maps_API_KEY = process.env.NEXT_PUBLIC_Maps_API_KEY;

  // useJsApiLoader AGORA VIVE AQUI EM MAPAPAGE
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script', // Pode manter o ID original ou um único ID para toda a app
    googleMapsApiKey: Maps_API_KEY!, 
    libraries: googleMapsLibraries, 
  });

  const [filterRiskLevel, setFilterRiskLevel] = useState<'all' | 'alto' | 'medio' | 'baixo'>('all');
  const [predefinedRiskAreas, setPredefinedRiskAreas] = useState<ApiMapaArea[]>([]);
  const [communityReports, setCommunityReports] = useState<ApiReport[]>([]);
  const [displayZones, setDisplayZones] = useState<DisplayZone[]>([]);
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(true);
  const [isProcessingMapData, setIsProcessingMapData] = useState(false);
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);

  useEffect(() => {
    if (isLoaded && !loadError && !geocoder) { // Verifica se a API está carregada ANTES de criar Geocoder
      if (window.google && window.google.maps && window.google.maps.Geocoder) {
        setGeocoder(new window.google.maps.Geocoder());
      } else {
        console.error("Google Maps API carregada, mas o construtor Geocoder não está disponível.");
      }
    }
  }, [isLoaded, loadError, geocoder]);


  const fetchPredefinedRiskAreas = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/mapas`, {
        headers: { 'X-API-Key': STATIC_API_KEY },
      });
      if (!response.ok) throw new Error('Falha ao buscar áreas de risco predefinidas');
      const data: ApiMapaArea[] = await response.json();
      setPredefinedRiskAreas(data.filter(area => area.isActive !== false));
    } catch (error) {
      console.error("Erro buscando áreas de risco predefinidas:", error);
      setPredefinedRiskAreas([]);
    }
  }, []);

  const fetchCommunityReports = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reportes`, {
        headers: { 'X-API-Key': STATIC_API_KEY },
      });
      if (!response.ok) throw new Error('Falha ao buscar reportes da comunidade');
      const data: ApiReport[] = await response.json();
      setCommunityReports(data.filter(report => report.status !== 'falso_positivo' && report.status !== 'resolvido'));
    } catch (error) {
      console.error("Erro buscando reportes da comunidade:", error);
      setCommunityReports([]);
    }
  }, []);

  useEffect(() => {
    setIsLoadingInitialData(true);
    Promise.all([fetchPredefinedRiskAreas(), fetchCommunityReports()])
      .finally(() => setIsLoadingInitialData(false));
  }, [fetchPredefinedRiskAreas, fetchCommunityReports]);

  const transformApiMapaToDisplayZone = (area: ApiMapaArea): DisplayZone => {
    return {
      id: `mapa-${area.id}`,
      center: { lat: area.latitude, lng: area.longitude },
      radius: area.radius,
      riskLevel: area.riskLevel,
      title: area.title,
      description: area.description,
      reason: area.reason,
      lastUpdated: area.lastUpdatedTimestamp ? new Date(area.lastUpdatedTimestamp).toLocaleString('pt-BR') : 'N/A',
      type: 'predefined',
    };
  };

  const transformApiReportToDisplayZone = (report: ApiReport, coords: google.maps.LatLngLiteral): DisplayZone => {
    let riskLevel: 'alto' | 'medio' | 'baixo' = 'baixo';
    if (report.severity === 'alta') riskLevel = 'alto';
    else if (report.severity === 'media') riskLevel = 'medio';
    
    return {
      id: `report-${report.id}`,
      center: coords,
      radius: 300, 
      riskLevel: riskLevel,
      title: report.eventType,
      description: report.description,
      reason: `Reporte: ${report.reporterName || 'Anônimo'}`,
      lastUpdated: new Date(report.reportTimestamp).toLocaleString('pt-BR'),
      type: 'report',
      originalReport: report,
    };
  };

  useEffect(() => {
    if (isLoadingInitialData || !isLoaded || !geocoder) return; 

    setIsProcessingMapData(true);
    const processDataForMap = async () => {
      let combinedZones: DisplayZone[] = predefinedRiskAreas.map(transformApiMapaToDisplayZone);
      
      if (communityReports.length > 0) {
        const geocodedReportPromises = communityReports.map(report => {
          return new Promise<DisplayZone | null>((resolve) => {
            if (typeof report.latitude === 'number' && typeof report.longitude === 'number') {
              resolve(transformApiReportToDisplayZone(report, { lat: report.latitude, lng: report.longitude }));
            } else if (report.location) {
              geocoder.geocode({ address: report.location }, (results, status) => {
                if (status === 'OK' && results && results[0]) {
                  resolve(transformApiReportToDisplayZone(report, results[0].geometry.location.toJSON()));
                } else {
                  console.warn(`Geocode falhou para reporte "${report.id} - ${report.location}": ${status}`);
                  resolve(null);
                }
              });
            } else {
              resolve(null);
            }
          });
        });

        try {
            const geocodedReports = (await Promise.all(geocodedReportPromises)).filter(zone => zone !== null) as DisplayZone[];
            combinedZones = [...combinedZones, ...geocodedReports];
        } catch (error) {
            console.error("Erro durante o processamento de geocodificação em lote:", error);
        }
      }
      setDisplayZones(combinedZones);
      setIsProcessingMapData(false);
    };

    processDataForMap();

  }, [predefinedRiskAreas, communityReports, geocoder, isLoaded, isLoadingInitialData]);


  const filteredDisplayZones = useMemo(() => {
    if (filterRiskLevel === 'all') {
      return displayZones;
    }
    return displayZones.filter(zone => zone.riskLevel === filterRiskLevel);
  }, [displayZones, filterRiskLevel]);

  if (!Maps_API_KEY) {
    return (
      <div className="container mx-auto px-6 py-12">
        <section className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--brand-header-bg)]">
            Mapa Interativo de Riscos
          </h1>
        </section>
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md" role="alert">
          <p className="font-bold">CONFIGURAÇÃO NECESSÁRIA</p>
          <p>A chave da API do Google Maps não está configurada corretamente.</p>
        </div>
      </div>
    )
  }
  
  if (loadError) { // Verifica se houve erro ao carregar a API do Google Maps
      return (
        <div className="container mx-auto px-6 py-12 text-center">
            <p className="text-red-600">Erro ao carregar a API do Google Maps. Verifique sua chave e conexão. Detalhes: {loadError.message}</p>
        </div>
      );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <section className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--brand-header-bg)]">
          Mapa Interativo de Riscos
        </h1>
        <p className="text-lg text-[var(--brand-text-secondary)] mt-4 max-w-2xl mx-auto">
          Acompanhe os eventos reportados pela comunidade e alertas oficiais diretamente no mapa.
        </p>
      </section>

      {(isLoadingInitialData || isProcessingMapData) && <p className="text-center my-4">Carregando dados do mapa...</p>}

      {/* Passa isLoaded e loadError para MapDisplay */}
      <MapDisplay
        isLoaded={isLoaded}
        loadError={loadError}
        initialCenter={saoPauloCenter}
        riskAreasData={filteredDisplayZones} 
      />

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-[var(--brand-text-primary)] mb-6 text-center">Legenda e Filtros</h2>
        <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[var(--brand-card-background)] p-6 rounded-lg shadow-[var(--shadow-subtle)]">
              <h3 className="text-xl font-medium text-[var(--brand-text-primary)] mb-3">Legenda</h3>
              <ul className="space-y-2 text-[var(--brand-text-secondary)]">
                  <li><span style={{ backgroundColor: 'var(--alert-red)', opacity: 0.7 }} className="inline-block w-4 h-4 rounded-full border border-black/20 mr-2 align-middle"></span> <span className="align-middle">Risco Alto</span></li>
                  <li><span style={{ backgroundColor: 'var(--alert-yellow)', opacity: 0.7 }} className="inline-block w-4 h-4 rounded-full border border-black/20 mr-2 align-middle"></span> <span className="align-middle">Risco Médio</span></li>
                  <li><span style={{ backgroundColor: riskColorsForLegend.baixo.fillColor, opacity: 0.7 }} className="inline-block w-4 h-4 rounded-full border border-black/20 mr-2 align-middle"></span> <span className="align-middle">Risco Baixo</span></li>
              </ul>
            </div>
            <div className="bg-[var(--brand-card-background)] p-6 rounded-lg shadow-[var(--shadow-subtle)]">
              <h3 className="text-xl font-medium text-[var(--brand-text-primary)] mb-4">Filtros</h3>
              <div className="space-y-4">
                  <div>
                      <label htmlFor="filter-risk-level" className="block text-sm font-medium text-[var(--brand-text-secondary)] mb-1">
                          Nível de Risco:
                      </label>
                      <select
                          id="filter-risk-level"
                          value={filterRiskLevel}
                          onChange={(e) => setFilterRiskLevel(e.target.value as typeof filterRiskLevel)}
                          disabled={isLoadingInitialData || isProcessingMapData || !isLoaded}
                          className="block w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[var(--brand-header-bg)] focus:border-transparent outline-none bg-white text-[var(--brand-text-primary)] disabled:bg-slate-100"
                      >
                          <option value="all">Todos</option>
                          <option value="alto">Alto</option>
                          <option value="medio">Médio</option>
                          <option value="baixo">Baixo</option>
                      </select>
                  </div>
              </div>
            </div>
        </div>
      </section>
    </div>
  );
}