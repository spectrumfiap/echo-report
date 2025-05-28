// src/components/MapDisplay.tsx
"use client"; // Necessário para hooks do React (useState, useEffect, etc.) e interações do usuário.

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Circle, DirectionsService, DirectionsRenderer, InfoWindow } from '@react-google-maps/api';

interface RiskArea {
  id: string;
  center: google.maps.LatLngLiteral; // Coordenadas do centro do círculo.
  radius: number; // Raio do círculo em metros.
  riskLevel: 'alto' | 'medio' | 'baixo'; // Nível de risco para estilização.
  title: string; // Título para a InfoWindow.
  description: string; // Descrição para a InfoWindow.
  reason?: string; // Motivo opcional do risco.
  lastUpdated?: string; // Data/hora opcional da última atualização.
}

interface MapDisplayProps {
  apiKey: string; // Chave da API do Google Maps.
  initialCenter?: google.maps.LatLngLiteral; // Centro inicial do mapa.
  riskAreasData?: RiskArea[]; // Array de áreas de risco a serem exibidas.
}

const containerStyle = {
  width: '100%',
  height: '500px',
};

const defaultCenter = {
  lat: -23.55052, // Coordenadas de São Paulo.
  lng: -46.633308
};

const riskColors = {
  alto: { fillColor: '#FF0000', strokeColor: '#CC0000'},
  medio: { fillColor: '#FFFF00', strokeColor: '#CCCC00'},
  baixo: { fillColor: '#00FF00', strokeColor: '#00CC00'}
};

const AlertIcon = ({ riskLevel }: { riskLevel: RiskArea['riskLevel'] }) => {
    let color = "currentColor";
    if (riskLevel === 'alto') color = "var(--alert-red)";
    else if (riskLevel === 'medio') color = "var(--alert-orange)";
    else if (riskLevel === 'baixo') color = "var(--success-green)";
  
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill={color} className="w-5 h-5 mr-2 inline-block">
        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
    );
};

const MapDisplay: React.FC<MapDisplayProps> = ({ apiKey, initialCenter = defaultCenter, riskAreasData = [] }) => {
  // Hook para carregar o script da API do Google Maps.
  // 'libraries' especifica quais serviços adicionais da API serão carregados.
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries: ['places', 'drawing', 'geometry', 'visualization'],
  });

  const [map, setMap] = useState<google.maps.Map | null>(null); // Referência à instância do mapa.
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null); // Armazena a resposta do serviço de direções.
  const [origin, setOrigin] = useState(''); // Input de origem para cálculo de rota.
  const [destination, setDestination] = useState(''); // Input de destino.
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number>(0); // Índice da rota selecionada (se houver alternativas).
  const [selectedRiskArea, setSelectedRiskArea] = useState<RiskArea | null>(null); // Armazena a área de risco clicada para exibir InfoWindow.

  // Efeito para resetar o índice da rota selecionada quando uma nova busca de direções é feita.
  useEffect(() => {
    setSelectedRouteIndex(0);
  }, [directionsResponse]);

  // Callbacks para quando o mapa é carregado e desmontado.
  const onLoad = useCallback((mapInstance: google.maps.Map) => setMap(mapInstance), []);
  const onUnmount = useCallback(() => setMap(null), []);

  // Memoiza as opções dos círculos para otimizar a performance, evitando recriações desnecessárias.
  const circleOptions = useMemo(() => (riskLevel: RiskArea['riskLevel']) => ({
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillOpacity: 0.35,
    clickable: true, // Permite que os círculos sejam clicáveis.
    // ... outras opções padrão ...
    ...riskColors[riskLevel] // Aplica as cores específicas do nível de risco.
  }), []);

  // Handler para quando um círculo de risco é clicado.
  const handleCircleClick = (area: RiskArea) => {
    console.log("Área de Risco Clicada para InfoWindow:", area); // Log para depuração.
    setSelectedRiskArea(area); // Define a área selecionada para abrir a InfoWindow.
  };

  // Handler para fechar a InfoWindow (seja pelo 'x' ou clicando no mapa).
  const handleInfoWindowClose = () => {
    setSelectedRiskArea(null);
  };

  // Função para calcular e solicitar rotas à API de Direções.
  const calculateRoute = () => {
    if (!isLoaded || !google.maps || !google.maps.DirectionsService) { // Verifica se a API e o serviço estão carregados.
      alert('Serviço de mapas não está pronto. Tente novamente em instantes.');
      return;
    }
    if (origin === '' || destination === '') {
      alert('Por favor, defina uma origem e um destino.');
      return;
    }
    setDirectionsResponse(null); // Limpa rotas anteriores.
    setSelectedRouteIndex(0);   // Reseta o índice.

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING, // Modo de viagem.
        provideRouteAlternatives: true, // Solicita rotas alternativas.
      },
      (result, status) => { // Callback com o resultado da solicitação.
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirectionsResponse(result);
        } else {
          console.error(`Erro ao buscar direções. Status: ${status}`, result);
          alert(`Não foi possível calcular a rota: ${status}`);
        }
      }
    );
  };

  // Renderiza mensagem de erro se a API do Google Maps falhar ao carregar.
  if (loadError) {
    return <div className="text-center p-4 text-red-600">Erro ao carregar o mapa. Verifique sua chave de API e conexão.</div>;
  }

  // Renderiza o mapa e seus componentes apenas se a API estiver carregada.
  return isLoaded ? (
    <div className="space-y-4"> {/* Espaçamento vertical entre as seções do mapa. */}
      
      {/* Seção de Inputs para Origem, Destino e Botão de Buscar Rotas. */}
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

      {/* Seção para selecionar entre rotas alternativas, se disponíveis. */}
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

      {/* Componente principal do Google Maps. */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={initialCenter}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{ /* Opções para customizar a aparência e controles do mapa. */
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        }}
        onClick={handleInfoWindowClose} // Fecha InfoWindows ativas ao clicar no mapa.
      >
        {/* Mapeia e renderiza os círculos de áreas de risco. */}
        {riskAreasData.map(area => (
          <Circle
            key={area.id}
            center={area.center}
            radius={area.radius}
            options={circleOptions(area.riskLevel)}
            onClick={() => handleCircleClick(area)} // Abre InfoWindow ao clicar no círculo.
          />
        ))}

        {/* Renderiza a InfoWindow para a área de risco selecionada. */}
        {selectedRiskArea && (
          <InfoWindow
            position={selectedRiskArea.center}
            onCloseClick={handleInfoWindowClose} // Permite fechar pelo 'x' da InfoWindow.
            options={{ pixelOffset: new google.maps.Size(0, -30) }} // Ajusta posição da InfoWindow.
          >
            <div className="p-3 bg-white rounded-lg shadow-lg max-w-sm space-y-1.5"> {/* Conteúdo estilizado da InfoWindow. */}
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

        {/* Renderiza a rota selecionada no mapa. */}
        {directionsResponse && (
          <DirectionsRenderer
            directions={directionsResponse}
            routeIndex={selectedRouteIndex}
            options={{
              polylineOptions: { /* Opções para estilizar a linha da rota. */
                strokeColor: '#007AFF', // Cor da rota.
                strokeWeight: 6,
                strokeOpacity: 0.8,
              },
            }}
          />
        )}
      </GoogleMap>
    </div>
  ) : (
    // Mensagem de carregamento enquanto a API do Google Maps é inicializada.
    <div className="min-h-[500px] flex items-center justify-center">
        <p className="text-lg text-[var(--brand-text-secondary)]">Carregando mapa...</p>
    </div>
  );
};

export default MapDisplay;