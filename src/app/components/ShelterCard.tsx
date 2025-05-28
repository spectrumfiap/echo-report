// src/components/ShelterCard.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Reutilize a interface ShelterInfo aqui ou importe-a de um arquivo de tipos compartilhado
interface ShelterInfo {
  id: string;
  name: string;
  imageUrl: string;
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

interface ShelterCardProps {
  shelter: ShelterInfo;
}

const ShelterCard: React.FC<ShelterCardProps> = ({ shelter }) => {
  return (
    <div className="bg-[var(--brand-card-background)] rounded-xl shadow-[var(--shadow-subtle)] overflow-hidden flex flex-col h-full">
      <div className="relative w-full h-48 sm:h-56"> {/* Espaço para a foto */}
        <Image
          src={shelter.imageUrl || "/assets/placeholder_shelter.png"} // Use um placeholder se a imagem não estiver disponível
          alt={`Foto do abrigo ${shelter.name}`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      <div className="p-5 md:p-6 flex-grow flex flex-col">
        <h3 className="text-xl lg:text-2xl font-bold text-[var(--brand-header-bg)] mb-2">
          {shelter.name}
        </h3>
        
        <div className="text-sm text-[var(--brand-text-secondary)] space-y-2 mb-4 flex-grow">
          <p>
            <span className="font-semibold text-[var(--brand-text-primary)]">Endereço:</span> {shelter.address}, {shelter.neighborhood}, {shelter.cityState} {shelter.zipCode && `- CEP: ${shelter.zipCode}`}
          </p>
          {shelter.contactPhone && (
            <p>
              <span className="font-semibold text-[var(--brand-text-primary)]">Telefone:</span> <a href={`tel:${shelter.contactPhone}`} className="text-[var(--brand-header-bg)] hover:underline">{shelter.contactPhone}</a>
            </p>
          )}
          {shelter.contactEmail && (
            <p>
              <span className="font-semibold text-[var(--brand-text-primary)]">Email:</span> <a href={`mailto:${shelter.contactEmail}`} className="text-[var(--brand-header-bg)] hover:underline">{shelter.contactEmail}</a>
            </p>
          )}
          <p>
            <span className="font-semibold text-[var(--brand-text-primary)]">Capacidade:</span> {shelter.capacityStatus}
          </p>
          <p>
            <span className="font-semibold text-[var(--brand-text-primary)]">Público Alvo:</span> {shelter.targetAudience}
          </p>
          <p>
            <span className="font-semibold text-[var(--brand-text-primary)]">Horário:</span> {shelter.operatingHours}
          </p>
          <div>
            <span className="font-semibold text-[var(--brand-text-primary)]">Serviços Oferecidos:</span>
            <ul className="list-disc list-inside ml-4 mt-1">
              {shelter.servicesOffered.map((service, index) => (
                <li key={index}>{service}</li>
              ))}
            </ul>
          </div>
          {shelter.observations && (
            <p className="mt-2 pt-2 border-t border-slate-200">
              <span className="font-semibold text-[var(--brand-text-primary)]">Observações:</span> {shelter.observations}
            </p>
          )}
        </div>

        {shelter.googleMapsUrl && (
          <Link href={shelter.googleMapsUrl} target="_blank" rel="noopener noreferrer"
            className="mt-auto block w-full text-center bg-[var(--brand-header-bg)] text-[var(--brand-text-header)] font-semibold py-2.5 px-4 rounded-md hover:bg-opacity-80 transition-colors"
          >
            Ver no Mapa
          </Link>
        )}
      </div>
    </div>
  );
};

export default ShelterCard;