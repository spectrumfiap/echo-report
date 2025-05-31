"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import MapDisplay from '../../components/MapDisplay';
import { useJsApiLoader } from '@react-google-maps/api';

const API_BASE_URL = 'http://localhost:8080';
const STATIC_API_KEY = '1234'; 

type RiskLevel = 'alto' | 'medio' | 'baixo';
type ReportStatus = 'novo' | 'verificado' | 'em_atendimento' | 'resolvido' | 'falso_positivo';
type ReportSeverity = 'baixa' | 'media' | 'alta' | 'nao_definida';

interface ApiMapaArea {
  id: number;
  latitude: number;
  longitude: number;
  radius: number;
  riskLevel: RiskLevel;
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
  createdAt: string; 
  status: ReportStatus; 
  severity?: ReportSeverity;
  latitude?: number;
  longitude?: number;
}

interface DisplayZone {
  id: string;
  center: google.maps.LatLngLiteral;
  radius: number;
  riskLevel: RiskLevel;
  title: string;
  description: string;
  reason?: string;
  lastUpdated?: string; 
  type: 'predefined' | 'report';
  originalReport?: ApiReport; 
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
  "Alagamento": "Alagamento",
  "QuedaDeArvore": "Queda de Árvore",
  "FaltaDeEnergia": "Falta de Energia",
  "AglomeracaoAbrigo": "Aglomeração em Abrigo",
  "VazamentoGas": "Vazamento de Gás",
  "Deslizamento": "Deslizamento de Terra",
  "Outro": "Outro"
};

const formatEventType = (eventType: string): string => {
  if (!eventType) return "Tipo Desconhecido";
  const mappedName = eventTypeDisplayMap[eventType];
  if (mappedName) {
    return mappedName;
  }
  const spaced = eventType.replace(/([A-Z])/g, ' $1').trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase().replace(/\s+/g, ' ');
};

const safeFormatDateTime = (isoString?: string): string => {
  if (!isoString) return 'Data não disponível';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }
    return date.toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  } catch (e) {
    console.error("Erro ao formatar data:", isoString, e);
    return 'Erro na data';
  }
};

export default function MapaPage() {
  const Maps_API_KEY = process.env.NEXT_PUBLIC_Maps_API_KEY;

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script', 
    googleMapsApiKey: Maps_API_KEY!, 
    libraries: googleMapsLibraries, 
  });

  const [filterRiskLevel, setFilterRiskLevel] = useState<RiskLevel | 'all'>('all');
  const [predefinedRiskAreas, setPredefinedRiskAreas] = useState<ApiMapaArea[]>([]);
  const [communityReports, setCommunityReports] = useState<ApiReport[]>([]);
  const [displayZones, setDisplayZones] = useState<DisplayZone[]>([]);
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(true);
  const [isProcessingMapData, setIsProcessingMapData] = useState(false);
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);

  useEffect(() => {
    if (isLoaded && !loadError && !geocoder) {
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
      setCommunityReports(data); 
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

  const transformApiMapaToDisplayZone = useCallback((area: ApiMapaArea): DisplayZone => {
    return {
      id: `mapa-${area.id}`,
      center: { lat: area.latitude, lng: area.longitude },
      radius: area.radius,
      riskLevel: area.riskLevel,
      title: area.title,
      description: area.description,
      reason: area.reason,
      lastUpdated: safeFormatDateTime(area.lastUpdatedTimestamp),
      type: 'predefined',
    };
  }, []);

  const transformApiReportToDisplayZone = useCallback((report: ApiReport, coords: google.maps.LatLngLiteral): DisplayZone => {
    let reportDisplayRiskLevel: RiskLevel;
    switch (report.severity) {
      case 'alta':
        reportDisplayRiskLevel = 'alto';
        break;
      case 'media':
        reportDisplayRiskLevel = 'medio';
        break;
      case 'baixa':
        reportDisplayRiskLevel = 'baixo';
        break;
      case 'nao_definida':
      default:
        reportDisplayRiskLevel = 'baixo'; 
        break;
    }
    
    return {
      id: `report-${report.id}`,
      center: coords,
      radius: 1000, 
      riskLevel: reportDisplayRiskLevel,
      title: formatEventType(report.eventType), // Usa a função formatEventType
      description: report.description,
      reason: `Reportado por: ${report.reporterName || 'Anônimo'}`,
      lastUpdated: safeFormatDateTime(report.createdAt),
      type: 'report',
      originalReport: report,
    };
  }, []);

  useEffect(() => {
    if (isLoadingInitialData || !isLoaded || !geocoder) return; 

    setIsProcessingMapData(true);
    const processDataForMap = async () => {
      let combinedZones: DisplayZone[] = predefinedRiskAreas.map(transformApiMapaToDisplayZone);
      
      const reportsToShowOnMap = communityReports.filter(report =>
        report.status && approvedReportStatusesForMap.includes(report.status)
      );

      if (reportsToShowOnMap.length > 0) {
        const geocodedReportPromises = reportsToShowOnMap.map(report => {
          return new Promise<DisplayZone | null>((resolve) => {
            if (typeof report.latitude === 'number' && typeof report.longitude === 'number') {
              resolve(transformApiReportToDisplayZone(report, { lat: report.latitude, lng: report.longitude }));
            } else if (report.location) {
              geocoder.geocode({ address: report.location }, (results, status) => {
                if (status === 'OK' && results && results[0]) {
                  resolve(transformApiReportToDisplayZone(report, results[0].geometry.location.toJSON()));
                } else {
                  console.warn(`Geocode falhou para reporte id ${report.id} ("${report.location}"): ${status}`);
                  resolve(null);
                }
              });
            } else {
              console.warn(`Reporte id ${report.id} sem localização ou coordenadas válidas.`);
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

  }, [predefinedRiskAreas, communityReports, geocoder, isLoaded, isLoadingInitialData, transformApiMapaToDisplayZone, transformApiReportToDisplayZone]);


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
  
  if (loadError) {
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

      {(isLoadingInitialData || isProcessingMapData || !isLoaded) && 
        <div className="text-center my-8">
            <p className="text-lg text-[var(--brand-text-secondary)]">Carregando dados do mapa...</p>
        </div>
      }

      {isLoaded && !loadError && (
        <section>
            <MapDisplay
              isLoaded={isLoaded} 
              loadError={loadError} 
              initialCenter={saoPauloCenter}
              riskAreasData={filteredDisplayZones} 
            />
        </section>
      )}

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-[var(--brand-text-primary)] mb-6 text-center">Legenda e Filtros</h2>
        <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[var(--brand-card-background)] p-6 rounded-lg shadow-[var(--shadow-subtle)]">
              <h3 className="text-xl font-medium text-[var(--brand-text-primary)] mb-3">Legenda</h3>
              <ul className="space-y-2 text-[var(--brand-text-secondary)]">
                {riskLevelColorsAndLabels.map(item => (
                   <li key={item.level} className="flex items-center">
                     <span style={{ backgroundColor: item.color, opacity: 0.7 }} className="inline-block w-4 h-4 rounded-full border border-black/20 mr-2"></span> 
                     <span>Risco {item.label}</span>
                   </li>
                ))}
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
                          onChange={(e) => setFilterRiskLevel(e.target.value as RiskLevel | 'all')}
                          disabled={isLoadingInitialData || isProcessingMapData || !isLoaded}
                          className="block w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[var(--brand-header-bg)] focus:border-transparent outline-none bg-white text-[var(--brand-text-primary)] disabled:bg-slate-100"
                      >
                          <option value="all">Todos os Níveis</option>
                          {riskLevelColorsAndLabels.map(item => (
                            <option key={item.level} value={item.level}>
                              {item.emoji} Risco {item.label}
                            </option>
                          ))}
                      </select>
                  </div>
              </div>
            </div>
        </div>
      </section>
    </div>
  );
}