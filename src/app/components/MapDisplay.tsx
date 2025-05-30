"use client";

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { GoogleMap, Circle, DirectionsService, DirectionsRenderer, InfoWindow } from '@react-google-maps/api';

// A interface RiskArea e outras constantes como containerStyle, defaultCenter, riskColors podem permanecer as mesmas.
// ... (Interface RiskArea, containerStyle, defaultCenter, riskColors, AlertIcon) ...
interface RiskArea {
  id: string;
  center: google.maps.LatLngLiteral;
  radius: number;
  riskLevel: 'alto' | 'medio' | 'baixo';
  title: string;
  description: string;
  reason?: string;
  lastUpdated?: string;
  type?: 'predefined' | 'report'; // Para diferenciar a origem, se necessário
  originalReport?: any; // Para ter dados completos do reporte se necessário
}

const containerStyle = {
  width: '100%',
  height: '500px', // Ou a altura que você preferir
};

const defaultCenter = {
  lat: -23.55052,
  lng: -46.633308
};

const riskColors = {
  alto: { fillColor: 'var(--alert-red)', strokeColor: '#CC0000' }, // Ajustado para usar var CSS
  medio: { fillColor: 'var(--alert-yellow)', strokeColor: '#CCCC00' }, // Ajustado para usar var CSS
  baixo: { fillColor: '#00FF00', strokeColor: '#00CC00' } // Mantido como estava, pode ajustar para var CSS
};

// Componente AlertIcon (mantido como estava)
const AlertIcon = ({ riskLevel }: { riskLevel: RiskArea['riskLevel'] }) => {
  let color = "currentColor";
  if (riskLevel === 'alto') color = "var(--alert-red)";
  else if (riskLevel === 'medio') color = "var(--alert-orange)"; // Note: seu riskColors usa var(--alert-yellow) para medio
  else if (riskLevel === 'baixo') color = "var(--success-green)";

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill={color} className="w-5 h-5 mr-2 inline-block">
      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
  );
};


interface MapDisplayProps {
  // apiKey: string; // Não mais necessário aqui se isLoaded é passado
  isLoaded: boolean; // Prop para indicar se a API do Google Maps está carregada
  loadError?: Error;   // Prop para erro no carregamento da API
  initialCenter?: google.maps.LatLngLiteral;
  riskAreasData?: RiskArea[];
}

const MapDisplay: React.FC<MapDisplayProps> = ({ 
  isLoaded, 
  loadError, 
  initialCenter = defaultCenter, 
  riskAreasData = [] 
}) => {
  // REMOVIDO: const { isLoaded, loadError } = useJsApiLoader(...)

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number>(0);
  const [selectedRiskArea, setSelectedRiskArea] = useState<RiskArea | null>(null);

  useEffect(() => {
    setSelectedRouteIndex(0);
  }, [directionsResponse]);

  const onLoad = useCallback((mapInstance: google.maps.Map) => setMap(mapInstance), []);
  const onUnmount = useCallback(() => setMap(null), []);

  const circleOptions = useMemo(() => (riskLevel: RiskArea['riskLevel']) => ({
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillOpacity: 0.35,
    clickable: true,
    ...riskColors[riskLevel]
  }), []);

  const handleCircleClick = (area: RiskArea) => {
    setSelectedRiskArea(area);
  };

  const handleInfoWindowClose = () => {
    setSelectedRiskArea(null);
  };

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
    return <div className="text-center p-4 text-red-600">Erro ao carregar o mapa. Verifique sua chave de API e conexão. Detalhes: {loadError.message}</div>;
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
            <div className="p-3 bg-white rounded-lg shadow-lg max-w-sm space-y-1.5">
              <h3 className="text-lg font-semibold text-[var(--brand-header-bg)] flex items-center">
                <AlertIcon riskLevel={selectedRiskArea.riskLevel} />
                {selectedRiskArea.title}
              </h3>
              <p className="text-sm text-[var(--brand-text-primary)]">
                {selectedRiskArea.description}
              </p>
              {selectedRiskArea.reason && (
                <p className="text-xs text-[var(--brand-text-secondary)]">
                  <strong>Motivo:</strong> {selectedRiskArea.reason}
                </p>
              )}
              {selectedRiskArea.lastUpdated && (
                <p className="text-xs text-gray-400 italic">
                  <strong>Atualizado:</strong> {selectedRiskArea.lastUpdated}
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