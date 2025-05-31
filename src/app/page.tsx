// src/app/page.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Importando os ícones do Heroicons
import {
  WifiIcon, // Para Monitoramento
  BellAlertIcon, // Para Alertas
  UserGroupIcon, // Para Comunidade
  ShieldExclamationIcon, // Para Dicas de Alagamento/Ventania (genérico de alerta/segurança)
  SunIcon, // Para Ondas de Calor
  ShieldCheckIcon, // Para Defesa Civil
  FireIcon, // Para Bombeiros
  PlusCircleIcon, // Para SAMU (simulando cruz médica)
  UserCircleIcon, // Para Polícia (genérico de autoridade/pessoa) ou Perfil
  CheckCircleIcon, // Para os checkmarks das dicas
} from '@heroicons/react/24/outline'; // Você pode usar /24/solid para ícones preenchidos

export default function HomePage() {
  const safetyTipsData = {
    alagamento: {
      icon: ShieldExclamationIcon,
      title: "Em Caso de Alagamento",
      tips: [
        "Evite contato com as águas de enchentes e não as utilize para consumo ou higiene.",
        "Desligue a energia elétrica, a chave geral e o registro de gás para evitar acidentes.",
        "Procure abrigo em locais elevados e seguros, longe de encostas ou áreas de risco.",
        "Não tente atravessar áreas alagadas a pé, de carro ou qualquer outro veículo."
      ],
    },
    ventania: {
      icon: ShieldExclamationIcon,
      title: "Durante Ventanias Fortes",
      tips: [
        "Abrigue-se em local seguro e resistente, como construções de alvenaria.",
        "Afaste-se de janelas de vidro, árvores, postes e outdoors.",
        "Não se abrigue debaixo de estruturas frágeis, como telhados instáveis ou tapumes.",
        "Feche bem portas, janelas e quaisquer outras aberturas para o exterior."
      ],
    },
    calor: {
      icon: SunIcon,
      title: "Ondas de Calor Intensas",
      tips: [
        "Beba bastante água ao longo do dia, mesmo sem sentir sede.",
        "Evite exposição direta ao sol, especialmente entre 10h e 16h.",
        "Use roupas leves, de cores claras, e procure locais frescos, ventilados ou com ar condicionado.",
        "Dê atenção especial a crianças, idosos e pessoas com condições médicas preexistentes."
      ],
    },
  };

  const emergencyContactsData = [
    { name: "Defesa Civil", phone: "199", description: "Alertas e emergências de desastres.", icon: ShieldCheckIcon },
    { name: "Bombeiros", phone: "193", description: "Resgates e incêndios.", icon: FireIcon },
    { name: "SAMU", phone: "192", description: "Emergências médicas.", icon: PlusCircleIcon },
    { name: "Polícia Militar", phone: "190", description: "Segurança e ordem pública.", icon: UserCircleIcon },
  ];

  const platformFeaturesData = {
    monitoramento: {
      icon: WifiIcon, 
      title: "Monitoramento em Tempo Real",
      description: "Acompanhe os reportes da comunidade, dados de sensores e informações meteorológicas atualizadas instantaneamente. Nossa plataforma integra diversas fontes para oferecer uma visão completa e dinâmica dos riscos em desenvolvimento na sua região, permitindo uma resposta mais ágil.",
    },
    alertas: {
      icon: BellAlertIcon,
      title: "Alertas Inteligentes e Localizados",
      description: "Receba notificações e avisos personalizados sobre riscos potenciais ou confirmados diretamente em sua área de interesse ou ao longo de suas rotas frequentes. Configure suas preferências para ser informado sobre o que realmente importa para você e sua família.",
    },
    comunidade: {
      icon: UserGroupIcon,
      title: "Comunidade Ativa e Colaborativa",
      description: "Sua participação é fundamental. Contribua com seus reportes, valide informações de outros usuários e ajude a construir um mapa de riscos mais preciso e confiável. Juntos, fortalecemos a resiliência da nossa vizinhança e cidade.",
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 md:py-16">

      {/* SEÇÃO HERO */}
      <section className="text-center py-8 md:py-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[var(--brand-header-bg)] mb-6 leading-tight">
          Bem-vindo ao Echo Report!
        </h1>
        <p className="text-lg md:text-xl text-[var(--brand-text-secondary)] mb-10 max-w-3xl mx-auto">
          Sua plataforma colaborativa para monitoramento e alerta de riscos urbanos causados por eventos climáticos extremos. Juntos, construímos um país mais seguro e resiliente.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
          <Link href="/reportar"
            className="w-full sm:w-auto bg-[var(--brand-header-bg)] text-[var(--brand-text-header)] font-semibold px-8 py-3.5 rounded-lg shadow-md hover:bg-opacity-80 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--brand-header-bg)] focus:ring-opacity-50 text-lg transform hover:scale-105"
          >
            Reportar Ocorrência
          </Link>
          <Link href="/alertas"
            className="w-full sm:w-auto bg-red-600 text-white font-semibold px-8 py-3.5 rounded-lg shadow-md hover:bg-red-700 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 text-lg transform hover:scale-105"
          >
            Ver Alertas Atuais
          </Link>
        </div>
      </section>

      {/* SEÇÃO "NOSSA PLATAFORMA EM AÇÃO" */}
      <section className="py-16 md:py-20 my-12 md:my-16 bg-slate-80 rounded-xl">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-stretch lg:gap-12">
            <div className="w-full lg:w-2/5 mb-10 lg:mb-0 flex flex-col">
              <div className="relative w-full min-h-[300px] sm:min-h-[400px] lg:h-full rounded-xl shadow-xl overflow-hidden">
                <Image
                  src="/assets/dn3.jpg" 
                  alt="Plataforma em Ação"
                  fill 
                  className="object-cover" 
                />
              </div>
            </div>
            <div className="w-full lg:w-3/5 flex flex-col">
              <h2 className="text-3xl md:text-4xl font-bold text-center lg:text-left text-[var(--brand-text-primary)] mb-8 md:mb-10">
                Nossa Plataforma em Ação
              </h2>
              <div className="bg-[var(--brand-card-background)] p-6 md:p-8 rounded-xl shadow-[var(--shadow-subtle)] transition-all duration-300 hover:shadow-lg w-full flex-grow flex flex-col">
                <div className="space-y-6 md:space-y-8 flex-grow flex flex-col justify-between">
                  {Object.entries(platformFeaturesData).map(([key, feature], index, arr) => {
                    const Icon = feature.icon; // Pega o componente de ícone dos dados
                    return (
                      <div key={key}>
                        <div className="flex items-start md:items-center mb-2">
                          <div className={`flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-[var(--brand-header-bg)]/10 text-[var(--brand-header-bg)] mr-4 mt-1 md:mt-0`}>
                            <Icon className="w-7 h-7" />
                          </div>
                          <h3 className="text-xl md:text-2xl font-semibold text-blue-500">
                            {feature.title}
                          </h3>
                        </div>
                        <p className="text-[var(--brand-text-secondary)] text-sm md:text-base leading-relaxed lg:pl-[calc(3rem+1rem)]">
                          {feature.description}
                        </p>
                        {index < arr.length - 1 && <hr className="my-6 md:my-8 border-slate-200 dark:border-slate-700" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO DICAS DE SEGURANÇA */}
      <section className="py-16 md:py-20 my-12 md:my-16 bg-slate-80 rounded-xl">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row-reverse lg:items-stretch lg:gap-12">
            <div className="w-full lg:w-2/5 mb-10 lg:mb-0 flex flex-col">
              <div className="relative w-full min-h-[300px] sm:min-h-[400px] lg:h-full rounded-xl shadow-xl overflow-hidden">
                <Image
                  src="/assets/dn1.jpg" 
                  alt="Dicas de Segurança"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="w-full lg:w-3/5 flex flex-col">
              <h2 className="text-3xl md:text-4xl font-bold text-center lg:text-left text-[var(--brand-text-primary)] mb-8 md:mb-10">
                Prepare-se e Mantenha-se Seguro
              </h2>
              <div className="bg-[var(--brand-card-background)] p-6 md:p-8 rounded-xl shadow-[var(--shadow-subtle)] transition-all duration-300 hover:shadow-lg w-full flex-grow flex flex-col">
                <div className="space-y-6 md:space-y-8 flex-grow flex flex-col justify-between">
                  {Object.entries(safetyTipsData).map(([categoryKey, category], index, arr) => {
                    const Icon = category.icon; // Pega o componente de ícone dos dados
                    return (
                      <div key={categoryKey}>
                        <div className="flex items-start md:items-center mb-2">
                          <div className={`flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-[var(--brand-header-bg)]/10 text-[var(--brand-header-bg)] mr-4 mt-1 md:mt-0`}>
                            <Icon className="w-7 h-7" /> 
                          </div>
                          <h3 className="text-xl md:text-2xl font-semibold text-[var(--brand-header-bg)]">{category.title}</h3>
                        </div>
                        <ul className="space-y-2 text-[var(--brand-text-secondary)] text-sm md:text-base leading-relaxed lg:pl-[calc(3rem+1rem)]"> 
                          {category.tips.map((tip, tipIndex) => (
                            <li key={tipIndex} className="flex items-start">
                              <CheckCircleIcon className="w-5 h-5 text-[var(--brand-header-bg)] mr-2 mt-1 flex-shrink-0" /> {/* Ícone de Checkmark */}
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                        {index < arr.length - 1 && <hr className="my-6 md:my-8 border-slate-200 dark:border-slate-700" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* SEÇÃO CONTATOS DE EMERGÊNCIA */}
      <section className="py-16 md:py-20 my-12 md:my-16 bg-slate-80 rounded-xl">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-stretch lg:gap-12">
            <div className="w-full lg:w-2/5 mb-10 lg:mb-0 flex flex-col">
               <div className="relative w-full min-h-[300px] sm:min-h-[400px] lg:h-full rounded-xl shadow-xl overflow-hidden">
                <Image
                  src="/assets/dn4.jpg" 
                  alt="Contatos de Emergência"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="w-full lg:w-3/5 flex flex-col">
              <h2 className="text-3xl md:text-4xl font-bold text-center lg:text-left text-[var(--brand-text-primary)] mb-8 md:mb-10">
                Contatos de Emergência Essenciais
              </h2>
              <div className="bg-[var(--brand-card-background)] p-6 md:p-8 rounded-xl shadow-[var(--shadow-subtle)] transition-all duration-300 hover:shadow-lg w-full flex-grow flex flex-col">
                <div className="space-y-6 md:space-y-8 flex-grow flex flex-col justify-around">
                  {emergencyContactsData.map((contact, index, arr) => {
                    const Icon = contact.icon; // Pega o componente de ícone dos dados
                    return (
                      <div key={contact.name}>
                        <a 
                          href={`tel:${contact.phone.replace(/\s/g, '')}`}
                          className="block p-4 rounded-lg transition-all duration-300 hover:bg-slate-50"
                        >
                          <div className="flex items-center mb-1">
                            <div className={`flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-[var(--brand-header-bg)]/10 text-[var(--brand-header-bg)] mr-4 mt-1 md:mt-0`}>
                              <Icon className="w-7 h-7" /> 
                            </div>
                            <div>
                              <h3 className="text-xl md:text-2xl font-semibold text-[var(--brand-header-bg)] group-hover:text-opacity-80">
                                {contact.name}
                              </h3>
                              <p className="text-2xl md:text-3xl font-bold text-[var(--brand-text-primary)] group-hover:text-[var(--brand-header-bg)] transition-colors">
                                {contact.phone}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-[var(--brand-text-secondary)] lg:pl-[calc(3rem+1rem)]">
                            {contact.description}
                          </p>
                        </a>
                        {index < arr.length - 1 && <hr className="my-4 md:my-6 border-slate-200" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}