"use client";

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { GoogleMap, Circle, DirectionsService, DirectionsRenderer, InfoWindow } from '@react-google-maps/api';

interface RiskArea {
  id: string;
  center: google.maps.LatLngLiteral;
  radius: number;
  riskLevel: 'alto' | 'medio' | 'baixo';
  title: string;
  description: string;
  reason?: string;
  lastUpdated?: string;
  type?: 'predefined' | 'report';
  originalReport?: {
    severity?: 'baixa' | 'media' | 'alta' | 'nao_definida';
  }; 
}

const containerStyle = {
  width: '100%',
  height: '500px',
};

const defaultCenter = {
  lat: -23.55052,
  lng: -46.633308
};

const riskColors = {
  alto: { fillColor: '#FF0000', strokeColor: '#B30000', textColor: 'text-red-700' },
  medio: { fillColor: '#FFA500', strokeColor: '#CC8400', textColor: 'text-orange-700' },
  baixo: { fillColor: '#FFFF00', strokeColor: '#B3B300', textColor: 'text-yellow-700' } 
};

const AlertIcon = ({ riskLevel }: { riskLevel: RiskArea['riskLevel'] }) => {
  let color = riskColors.baixo.fillColor; 
  if (riskLevel === 'alto') color = riskColors.alto.fillColor;
  else if (riskLevel === 'medio') color = riskColors.medio.fillColor;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill={color} className="w-5 h-5 mr-2 inline-block">
      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
  );
};

interface MapDisplayProps {
  isLoaded: boolean; 
  loadError?: Error;  
  initialCenter?: google.maps.LatLngLiteral;
  riskAreasData?: RiskArea[];
}

const MapDisplay: React.FC<MapDisplayProps> = ({ 
  isLoaded, 
  loadError, 
  initialCenter = defaultCenter, 
  riskAreasData = [] 
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number>(0);
  const [selectedRiskArea, setSelectedRiskArea] = useState<RiskArea | null>(null);
  const [routeRiskInfo, setRouteRiskInfo] = useState<string | null>(null);

  useEffect(() => {
    setSelectedRouteIndex(0);
    setRouteRiskInfo(null);
  }, [directionsResponse]);

  const onLoad = useCallback((mapInstance: google.maps.Map) => setMap(mapInstance), []);
  const onUnmount = useCallback(() => setMap(null), []);

  const circleOptions = useMemo(() => (riskLevel: RiskArea['riskLevel']) => {
    const currentRiskColors = riskColors[riskLevel] || riskColors.baixo; 
    return {
      strokeColor: currentRiskColors.strokeColor,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: currentRiskColors.fillColor,
      fillOpacity: 0.35, 
      clickable: true,
      zIndex: riskLevel === 'alto' ? 3 : riskLevel === 'medio' ? 2 : 1
    };
  }, []);

  const handleCircleClick = (area: RiskArea) => {
    setSelectedRiskArea(area);
  };

  const handleInfoWindowClose = () => {
    setSelectedRiskArea(null);
  };

  const isLocationInCircle = useCallback((point: google.maps.LatLng, circleCenter: google.maps.LatLngLiteral, circleRadius: number): boolean => {
    if (!window.google || !window.google.maps || !window.google.maps.geometry || !window.google.maps.geometry.spherical) return false;
    const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
        point,
        new window.google.maps.LatLng(circleCenter.lat, circleCenter.lng)
    );
    return distance <= circleRadius;
  }, []);

  useEffect(() => {
    if (!directionsResponse || !riskAreasData || riskAreasData.length === 0 || !isLoaded || !window.google || !window.google.maps.geometry) {
        setRouteRiskInfo(null);
        return;
    }

    let routeIntersects = false;
    const currentRoute = directionsResponse.routes[selectedRouteIndex];

    if (currentRoute && currentRoute.overview_path && currentRoute.overview_path.length > 0) {
        for (const riskArea of riskAreasData) {
            for (const point of currentRoute.overview_path) {
                if (isLocationInCircle(point, riskArea.center, riskArea.radius)) {
                    routeIntersects = true;
                    break; 
                }
            }
            if (routeIntersects) break;
        }
    }

    if (routeIntersects) {
        let message = "Atenção: A rota selecionada passa por uma ou mais zonas de risco.";
        if (directionsResponse.routes.length > 1) {
            let alternativeIsSafer = false;
            for (let i = 0; i < directionsResponse.routes.length; i++) {
                if (i === selectedRouteIndex) continue;
                const altRoute = directionsResponse.routes[i];
                let altRouteIntersectsCurrent = false;
                if (altRoute.overview_path && altRoute.overview_path.length > 0) {
                    for (const riskArea of riskAreasData) {
                         for (const point of altRoute.overview_path) {
                            if (isLocationInCircle(point, riskArea.center, riskArea.radius)) {
                                altRouteIntersectsCurrent = true;
                                break;
                            }
                        }
                        if (altRouteIntersectsCurrent) break;
                    }
                }
                if (!altRouteIntersectsCurrent) {
                    alternativeIsSafer = true;
                    break;
                }
            }
            if (alternativeIsSafer) {
                message += " Considere verificar rotas alternativas.";
            }
        }
        setRouteRiskInfo(message);
    } else {
        setRouteRiskInfo(null); 
    }
  }, [directionsResponse, riskAreasData, selectedRouteIndex, isLoaded, isLocationInCircle]);


  const calculateRoute = () => {
    if (!isLoaded || !window.google || !window.google.maps || !window.google.maps.DirectionsService) {
      alert('Serviço de mapas não está pronto. Tente novamente em instantes.');
      return;
    }
    if (origin === '' || destination === '') {
      alert('Por favor, defina uma origem e um destino.');
      return;
    }
    setDirectionsResponse(null);
    setSelectedRouteIndex(0);
    setRouteRiskInfo(null);

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK && result) {
          setDirectionsResponse(result);
        } else {
          console.error(`Erro ao buscar direções. Status: ${status}`, result);
          alert(`Não foi possível calcular a rota: ${status}`);
        }
      }
    );
  };

  if (loadError) {
    return <div className="text-center p-4 text-red-600">Erro ao carregar o mapa. Detalhes: {loadError.message}</div>;
  }

  return isLoaded ? (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-100 rounded-md shadow">
        <input
          type="text"
          placeholder="Origem (Ex: Rua Augusta, 1500, São Paulo)"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          className="col-span-1 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[var(--brand-header-bg)] focus:border-transparent outline-none bg-white text-[var(--brand-text-primary)]"
        />
        <input
          type="text"
          placeholder="Destino (Ex: Av. Paulista, 900, São Paulo)"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="col-span-1 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[var(--brand-header-bg)] focus:border-transparent outline-none bg-white text-[var(--brand-text-primary)]"
        />
        <button
          onClick={calculateRoute}
          className="col-span-1 bg-[var(--brand-header-bg)] text-[var(--brand-text-header)] p-2 rounded-md hover:opacity-90 transition-opacity"
        >
          Buscar Rotas
        </button>
      </div>

      {directionsResponse && directionsResponse.routes.length > 1 && (
        <div className="p-4 bg-slate-50 rounded-md shadow">
          <label htmlFor="route-select" className="block text-sm font-medium text-[var(--brand-text-secondary)] mb-1">
            Escolha uma rota:
          </label>
          <select
            id="route-select"
            value={selectedRouteIndex}
            onChange={(e) => setSelectedRouteIndex(parseInt(e.target.value, 10))}
            className="block w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[var(--brand-header-bg)] focus:border-transparent outline-none bg-white text-[var(--brand-text-primary)]"
          >
            {directionsResponse.routes.map((route, index) => (
              <option key={index} value={index}>
                Rota {index + 1} ({route.summary} - {route.legs[0].duration?.text}, {route.legs[0].distance?.text})
              </option>
            ))}
          </select>
        </div>
      )}

      {routeRiskInfo && (
        <div className="p-3 my-2 bg-orange-100 border-l-4 border-orange-500 text-orange-700 rounded-md shadow" role="alert">
            <p className="font-semibold">Aviso de Rota:</p>
            <p>{routeRiskInfo}</p>
        </div>
      )}

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={initialCenter}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{ mapTypeControl: false, streetViewControl: false, fullscreenControl: false }}
        onClick={handleInfoWindowClose}
      >
        {riskAreasData.map(area => (
          <Circle
            key={area.id}
            center={area.center}
            radius={area.radius}
            options={circleOptions(area.riskLevel)}
            onClick={() => handleCircleClick(area)}
          />
        ))}

        {selectedRiskArea && (
          <InfoWindow
            position={selectedRiskArea.center}
            onCloseClick={handleInfoWindowClose}
            options={{ pixelOffset: new window.google.maps.Size(0, -30) }}
          >
            <div className="p-4 bg-white rounded-lg shadow-xl max-w-xs sm:max-w-sm space-y-2">
              <h3 className={`text-lg font-bold ${riskColors[selectedRiskArea.riskLevel]?.textColor || 'text-[var(--brand-header-bg)]'} flex items-center mb-1`}>
                <AlertIcon riskLevel={selectedRiskArea.riskLevel} />
                {selectedRiskArea.title}
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {selectedRiskArea.description}
              </p>
              {selectedRiskArea.reason && (
                <p className="text-xs text-slate-500 mt-1">
                  <strong className="font-medium text-slate-600">Motivo/Reportador:</strong> {selectedRiskArea.reason}
                </p>
              )}
              {selectedRiskArea.type === 'report' && selectedRiskArea.originalReport?.severity && selectedRiskArea.originalReport.severity !== 'nao_definida' && (
                <p className="text-xs text-slate-500">
                  <strong className="font-medium text-slate-600">Severidade do Reporte:</strong> <span className="capitalize font-medium">{selectedRiskArea.originalReport.severity.replace('_', ' ')}</span>
                </p>
              )}
              {selectedRiskArea.type === 'predefined' && (
                 <p className="text-xs text-slate-500">
                   <strong className="font-medium text-slate-600">Nível de Risco Oficial:</strong> <span className="capitalize font-medium">{selectedRiskArea.riskLevel}</span>
                 </p>
              )}
              {selectedRiskArea.lastUpdated && (
                <p className="text-xs text-slate-400 italic mt-2">
                  Data: {selectedRiskArea.lastUpdated}
                </p>
              )}
            </div>
          </InfoWindow>
        )}

        {directionsResponse && (
          <DirectionsRenderer
            directions={directionsResponse}
            routeIndex={selectedRouteIndex}
            options={{
              polylineOptions: {
                strokeColor: '#007AFF',
                strokeWeight: 6,
                strokeOpacity: 0.8,
              },
            }}
          />
        )}
      </GoogleMap>
    </div>
  ) : (
    <div className="min-h-[500px] flex items-center justify-center">
        <p className="text-lg text-[var(--brand-text-secondary)]">Carregando mapa...</p>
    </div>
  );
};

export default MapDisplay;