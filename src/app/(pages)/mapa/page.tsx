// src/app/mapa/page.tsx
"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import MapDisplay from '../../components/MapDisplay'; // Ajuste o caminho conforme necessário
import AnimatedSection from '../../components/AnimatedSection'; // Ajuste o caminho conforme necessário
import { useJsApiLoader } from '@react-google-maps/api';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
const STATIC_API_KEY = process.env.NEXT_PUBLIC_STATIC_API_KEY || '1234';

type RiskLevel = 'alto' | 'medio' | 'baixo';
type ReportStatus = 'novo' | 'verificado' | 'em_atendimento' | 'resolvido' | 'falso_positivo';
type ReportSeverity = 'baixa' | 'media' | 'alta' | 'nao_definida';

interface ApiMapaArea {
  id: number; latitude: number; longitude: number; radius: number;
  riskLevel: RiskLevel; title: string; description: string;
  reason?: string; lastUpdatedTimestamp?: string; isActive?: boolean;
}
interface ApiReport {
  id: number; eventType: string; location: string; description: string;
  reporterName?: string; userId?: number; imageUrl?: string; createdAt: string;
  status: ReportStatus; severity?: ReportSeverity; latitude?: number; longitude?: number;
}
interface DisplayZone {
  id: string; center: google.maps.LatLngLiteral; radius: number; riskLevel: RiskLevel;
  title: string; description: string; reason?: string; lastUpdated?: string;
  type: 'predefined' | 'report'; originalReport?: ApiReport;
}

const saoPauloCenter = { lat: -23.55052, lng: -46.633308 };
const riskLevelColorsAndLabels: { level: RiskLevel; label: string; color: string; emoji: string }[] = [
  { level: 'alto',  label: 'Alto',  color: '#FF0000', emoji: '🔴' },
  { level: 'medio', label: 'Médio', color: '#FFA500', emoji: '🟠' },
  { level: 'baixo', label: 'Baixo', color: '#FFFF00', emoji: '🟡' }
];
const googleMapsLibraries: ("places" | "drawing" | "geometry" | "visualization")[] = ['places', 'drawing', 'geometry', 'visualization'];
const approvedReportStatusesForMap: ReportStatus[] = ['verificado', 'em_atendimento'];
const eventTypeDisplayMap: { [key: string]: string } = {
  "Alagamento": "Alagamento", "QuedaDeArvore": "Queda de Árvore", "FaltaDeEnergia": "Falta de Energia",
  "AglomeracaoAbrigo": "Aglomeração em Abrigo", "VazamentoGas": "Vazamento de Gás",
  "Deslizamento": "Deslizamento de Terra", "Outro": "Outro"
};
const formatEventType = (eventType: string): string => {
  if (!eventType) return "Tipo Desconhecido";
  const mappedName = eventTypeDisplayMap[eventType];
  if (mappedName) { return mappedName; }
  const spaced = eventType.replace(/([A-Z])/g, ' $1').trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase().replace(/\s+/g, ' ');
};
const safeFormatDateTime = (isoString?: string): string => {
  if (!isoString) return 'Data não disponível';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) { return 'Data inválida'; }
    return date.toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  } catch (e) { console.error("Erro ao formatar data:", isoString, e); return 'Erro na data'; }
};

type NoticeStateType = 'hidden' | 'entering' | 'visible' | 'leaving';
const NOTICE_VISIBLE_DURATION = 8000; 
const NOTICE_FADE_DURATION = 500;   

export default function MapaPage() {
  const Maps_API_KEY = process.env.NEXT_PUBLIC_Maps_API_KEY;
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script', googleMapsApiKey: Maps_API_KEY!, libraries: googleMapsLibraries,
  });

  const [filterRiskLevel, setFilterRiskLevel] = useState<RiskLevel | 'all'>('all');
  const [predefinedRiskAreas, setPredefinedRiskAreas] = useState<ApiMapaArea[]>([]);
  const [communityReports, setCommunityReports] = useState<ApiReport[]>([]);
  const [displayZones, setDisplayZones] = useState<DisplayZone[]>([]);
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(true);
  const [isProcessingMapData, setIsProcessingMapData] = useState(false);
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);
  const [noticeState, setNoticeState] = useState<NoticeStateType>('hidden');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    checkDarkMode();
    const observer = new MutationObserver(() => checkDarkMode());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isLoaded && !loadError && !geocoder && window.google?.maps?.Geocoder) {
      setGeocoder(new window.google.maps.Geocoder());
    } else if (isLoaded && !loadError && !window.google?.maps?.Geocoder) {
      console.error("Google Maps API carregada, mas o construtor Geocoder não está disponível.");
    }
  }, [isLoaded, loadError, geocoder]);

  const fetchPredefinedRiskAreas = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/mapas`, { headers: { 'X-API-Key': STATIC_API_KEY } });
      if (!response.ok) throw new Error('Falha ao buscar áreas de risco predefinidas');
      const data: ApiMapaArea[] = await response.json();
      setPredefinedRiskAreas(data.filter(area => area.isActive !== false));
    } catch (error) { console.error("Erro buscando áreas de risco predefinidas:", error); setPredefinedRiskAreas([]); }
  }, []);

  const fetchCommunityReports = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reportes`, { headers: { 'X-API-Key': STATIC_API_KEY } });
      if (!response.ok) throw new Error('Falha ao buscar reportes da comunidade');
      const data: ApiReport[] = await response.json();
      setCommunityReports(data);
    } catch (error) { console.error("Erro buscando reportes da comunidade:", error); setCommunityReports([]); }
  }, []);

  useEffect(() => {
    setIsLoadingInitialData(true);
    const initialDelayTimer = setTimeout(() => setNoticeState('entering'), 300);
    const visibilityTimer = setTimeout(() => setNoticeState('leaving'), 300 + NOTICE_VISIBLE_DURATION); 
    Promise.all([fetchPredefinedRiskAreas(), fetchCommunityReports()]).finally(() => setIsLoadingInitialData(false));
    return () => { clearTimeout(initialDelayTimer); clearTimeout(visibilityTimer); };
  }, [fetchPredefinedRiskAreas, fetchCommunityReports]);

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

  const transformApiMapaToDisplayZone = useCallback((area: ApiMapaArea): DisplayZone => ({
    id: `mapa-${area.id}`, center: { lat: area.latitude, lng: area.longitude }, radius: area.radius,
    riskLevel: area.riskLevel, title: area.title, description: area.description, reason: area.reason,
    lastUpdated: safeFormatDateTime(area.lastUpdatedTimestamp), type: 'predefined',
  }), []);

  const transformApiReportToDisplayZone = useCallback((report: ApiReport, coords: google.maps.LatLngLiteral): DisplayZone => {
    let reportDisplayRiskLevel: RiskLevel;
    switch (report.severity) {
      case 'alta': reportDisplayRiskLevel = 'alto'; break;
      case 'media': reportDisplayRiskLevel = 'medio'; break;
      default: reportDisplayRiskLevel = 'baixo'; break;
    }
    return {
      id: `report-${report.id}`, center: coords, radius: 1000, riskLevel: reportDisplayRiskLevel,
      title: formatEventType(report.eventType), description: report.description,
      reason: `Reportado por: ${report.reporterName || 'Anônimo'}`,
      lastUpdated: safeFormatDateTime(report.createdAt), type: 'report', originalReport: report,
    };
  }, []);

  useEffect(() => {
    if (isLoadingInitialData || !isLoaded || !geocoder) return;
    setIsProcessingMapData(true);
    const processDataForMap = async () => {
      let combinedZones: DisplayZone[] = predefinedRiskAreas.map(transformApiMapaToDisplayZone);
      const reportsToShowOnMap = communityReports.filter(r => r.status && approvedReportStatusesForMap.includes(r.status));
      if (reportsToShowOnMap.length > 0) {
        const geocodedReportPromises = reportsToShowOnMap.map(report => 
          new Promise<DisplayZone | null>((resolve) => {
            if (typeof report.latitude === 'number' && typeof report.longitude === 'number') {
              resolve(transformApiReportToDisplayZone(report, { lat: report.latitude, lng: report.longitude }));
            } else if (report.location && geocoder) { // Adicionado cheque para geocoder
              geocoder.geocode({ address: report.location }, (results, status) => {
                if (status === 'OK' && results && results[0]) {
                  resolve(transformApiReportToDisplayZone(report, results[0].geometry.location.toJSON()));
                } else {
                  console.warn(`Geocode falhou para reporte id ${report.id} ("${report.location}"): ${status}`); resolve(null);
                }
              });
            } else { console.warn(`Reporte id ${report.id} sem localização ou geocoder.`); resolve(null); }
          })
        );
        try {
          const geocodedReports = (await Promise.all(geocodedReportPromises)).filter(Boolean) as DisplayZone[];
          combinedZones = [...combinedZones, ...geocodedReports];
        } catch (error) { console.error("Erro processando geocodificação:", error); }
      }
      setDisplayZones(combinedZones); setIsProcessingMapData(false);
    };
    processDataForMap();
  }, [predefinedRiskAreas, communityReports, geocoder, isLoaded, isLoadingInitialData, transformApiMapaToDisplayZone, transformApiReportToDisplayZone]);

  const filteredDisplayZones = useMemo(() => {
    if (filterRiskLevel === 'all') return displayZones;
    return displayZones.filter(zone => zone.riskLevel === filterRiskLevel);
  }, [displayZones, filterRiskLevel]);

  if (!Maps_API_KEY) {
    return (
      <div className="container mx-auto px-6 py-12">
        <AnimatedSection animationType="fadeInUp" delay="duration-500">
          <section className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--brand-header-bg)] dark:text-blue-400">
              Mapa Interativo de Riscos
            </h1>
          </section>
        </AnimatedSection>
        <AnimatedSection animationType="fadeIn" delay="duration-700">
          <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-400 text-red-700 dark:text-red-300 p-4 rounded-md shadow-md" role="alert">
            <p className="font-bold">CONFIGURAÇÃO NECESSÁRIA</p>
            <p>A chave da API do Google Maps não está configurada corretamente.</p>
          </div>
        </AnimatedSection>
      </div>
    )
  }
  
  if (loadError) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <AnimatedSection animationType="fadeIn" delay="duration-500">
          <p className="text-red-600 dark:text-red-400">Erro ao carregar a API do Google Maps. Verifique sua chave e conexão. Detalhes: {loadError.message}</p>
        </AnimatedSection>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <AnimatedSection animationType="fadeInUp" delay="duration-500">
        <section className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--brand-header-bg)] dark:text-blue-400">
            Mapa Interativo de Riscos
          </h1>
          <p className="text-lg text-[var(--brand-text-secondary)] mt-4 max-w-2xl mx-auto">
            Acompanhe os eventos reportados pela comunidade e alertas oficiais diretamente no mapa.
          </p>
        </section>
      </AnimatedSection>

      {noticeState !== 'hidden' && (
        <div className={`mb-6 p-3 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-[var(--brand-header-bg)] dark:border-blue-500 text-blue-700 dark:text-blue-300 rounded-md shadow-sm text-sm flex items-start transition-opacity ease-in-out duration-${NOTICE_FADE_DURATION} ${noticeState === 'visible' ? 'opacity-100' : 'opacity-0'}`}>
          <InformationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <span>Estamos utilizando serviços de hospedagem gratuitos para nossa API. O carregamento inicial dos dados do mapa pode levar alguns segundos. Agradecemos a sua paciência!</span>
        </div>
      )}

      {(isLoadingInitialData || isProcessingMapData || !isLoaded) && !loadError &&
        <AnimatedSection animationType="fadeIn" delay="duration-300">
          <div className="text-center my-8"><p className="text-lg text-[var(--brand-text-secondary)]">Carregando dados do mapa...</p></div>
        </AnimatedSection>
      }

      {isLoaded && !loadError && (
        <AnimatedSection animationType="fadeIn" delay="duration-700" threshold={0.01}>
          <section>
            <MapDisplay isLoaded={isLoaded} loadError={loadError} initialCenter={saoPauloCenter} riskAreasData={filteredDisplayZones} isDarkMode={isDarkMode} />
          </section>
        </AnimatedSection>
      )}

      <section className="mt-12">
        <AnimatedSection animationType="fadeInUp" delay="duration-500">
          <h2 className="text-2xl font-semibold text-[var(--brand-text-primary)] mb-6 text-center">Legenda e Filtros</h2>
        </AnimatedSection>
        
        <AnimatedSection className="grid md:grid-cols-2 gap-8" staggerChildren childDelayIncrement={100} animationType="fadeInUp" delay={`duration-${NOTICE_FADE_DURATION}`} threshold={0.1}>
          <div className="bg-[var(--brand-card-background)] p-6 rounded-lg shadow-[var(--shadow-subtle)]">
            <h3 className="text-xl font-medium text-[var(--brand-text-primary)] mb-3">Legenda</h3>
            <ul className="space-y-2 text-[var(--brand-text-secondary)]">
              {riskLevelColorsAndLabels.map(item => (
                <li key={item.level} className="flex items-center">
                  <span style={{ backgroundColor: item.color, opacity: 0.7 }} className="inline-block w-4 h-4 rounded-full border border-black/20 dark:border-white/20 mr-2"></span> 
                  <span>Risco {item.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[var(--brand-card-background)] p-6 rounded-lg shadow-[var(--shadow-subtle)]">
            <h3 className="text-xl font-medium text-[var(--brand-text-primary)] mb-4">Filtros</h3>
            <div className="space-y-4">
                <div>
                  <label htmlFor="filter-risk-level" className="block text-sm font-medium text-[var(--brand-text-secondary)] mb-1">Nível de Risco:</label>
                  <select
                    id="filter-risk-level"
                    value={filterRiskLevel}
                    onChange={(e) => setFilterRiskLevel(e.target.value as RiskLevel | 'all')}
                    disabled={isLoadingInitialData || isProcessingMapData || !isLoaded}
                    className="block w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-[var(--brand-header-bg)] dark:focus:ring-blue-500 focus:border-transparent outline-none bg-[var(--brand-input-background)] text-[var(--brand-text-primary)] disabled:bg-slate-100 dark:disabled:bg-slate-700 dark:disabled:text-slate-400"
                  >
                    <option value="all" className="text-black dark:text-gray-200">Todos os Níveis</option>
                    {riskLevelColorsAndLabels.map(item => (
                      <option key={item.level} value={item.level} className="text-black dark:text-gray-200">
                        {item.emoji} Risco {item.label}
                      </option>
                    ))}
                  </select>
                </div>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}