// src/app/page.tsx
"use client";

import React, { ReactNode, JSXElementConstructor } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';

import {
  WifiIcon,
  BellAlertIcon,
  UserGroupIcon,
  ShieldExclamationIcon,
  SunIcon,
  ShieldCheckIcon,
  FireIcon,
  PlusCircleIcon,
  UserCircleIcon,
  CheckCircleIcon,
  NewspaperIcon,
  ChevronRightIcon,
  TagIcon, // Adicionado
} from '@heroicons/react/24/outline';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animationType?: 'fadeInUp' | 'fadeIn' | 'slideInLeft' | 'slideInRight';
  delay?: string;
  threshold?: number;
  staggerChildren?: boolean;
  childDelayIncrement?: number;
}

interface ChildProps {
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
  animationType = 'fadeInUp',
  delay = 'duration-700',
  threshold = 0.1,
  staggerChildren = false,
  childDelayIncrement = 100,
}) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: threshold,
  });

  const baseAnimationClasses = 'transition-all ease-out ' + delay;
  let initialStyles: React.CSSProperties = {};
  let inViewStyles: React.CSSProperties = {};

  switch (animationType) {
    case 'fadeIn': initialStyles = { opacity: 0 }; inViewStyles = { opacity: 1 }; break;
    case 'slideInLeft': initialStyles = { opacity: 0, transform: 'translateX(-40px)' }; inViewStyles = { opacity: 1, transform: 'translateX(0)' }; break;
    case 'slideInRight': initialStyles = { opacity: 0, transform: 'translateX(40px)' }; inViewStyles = { opacity: 1, transform: 'translateX(0)' }; break;
    case 'fadeInUp': default: initialStyles = { opacity: 0, transform: 'translateY(20px)' }; inViewStyles = { opacity: 1, transform: 'translateY(0)' }; break;
  }

  if (staggerChildren && React.Children.count(children) > 0) {
    return (
      <div ref={ref} className={className}>
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement<ChildProps>(child)) {
            const childProps = child.props;
            const childInitialStyles = { opacity: 0, transform: 'translateY(20px)' };
            const childInViewStyles = { opacity: 1, transform: 'translateY(0)' };
            return React.cloneElement(child, {
              className: `${childProps.className || ''} ${baseAnimationClasses}`,
              style: { ...childProps.style, ...(inView ? childInViewStyles : childInitialStyles), transitionDelay: inView ? `${index * childDelayIncrement}ms` : '0ms' },
            });
          }
          return child;
        })}
      </div>
    );
  }
  return ( <div ref={ref} className={`${baseAnimationClasses} ${className}`} style={inView ? inViewStyles : initialStyles}> {children} </div> );
};

export default function HomePage() {
  const safetyTipsData = {
    alagamento: {
      icon: ShieldExclamationIcon,
      title: "Em Caso de Alagamento",
      tips: ["Evite contato com as águas de enchentes e não as utilize para consumo ou higiene.","Desligue a energia elétrica, a chave geral e o registro de gás para evitar acidentes.","Procure abrigo em locais elevados e seguros, longe de encostas ou áreas de risco.","Não tente atravessar áreas alagadas a pé, de carro ou qualquer outro veículo."],
    },
    ventania: {
      icon: ShieldExclamationIcon,
      title: "Durante Ventanias Fortes",
      tips: ["Abrigue-se em local seguro e resistente, como construções de alvenaria.","Afaste-se de janelas de vidro, árvores, postes e outdoors.","Não se abrigue debaixo de estruturas frágeis, como telhados instáveis ou tapumes.","Feche bem portas, janelas e quaisquer outras aberturas para o exterior."],
    },
    calor: {
      icon: SunIcon,
      title: "Ondas de Calor Intensas",
      tips: ["Beba bastante água ao longo do dia, mesmo sem sentir sede.","Evite exposição direta ao sol, especialmente entre 10h e 16h.","Use roupas leves, de cores claras, e procure locais frescos, ventilados ou com ar condicionado.","Dê atenção especial a crianças, idosos e pessoas com condições médicas preexistentes."],
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

  const blogPostsData = [
    {
      slug: 'guia-preparacao-enchentes',
      title: 'Guia Completo: Como se Preparar para Enchentes',
      summary: 'Medidas essenciais para proteger sua família e seu lar antes, durante e depois de inundações.',
      imageUrl: '/assets/artigo-enchente.jpg',
      category: 'Prevenção',
    },
    {
      slug: 'entendendo-riscos-ondas-calor',
      title: 'Ondas de Calor: Entenda os Riscos e Saiba Como se Proteger',
      summary: 'O calor extremo pode ser perigoso. Aprenda a identificar os sinais e a tomar precauções vitais.',
      imageUrl: '/assets/artigo-calor.jpg',
      category: 'Saúde e Segurança',
    },
    {
      slug: 'comunidade-resiliente-echo',
      title: 'Construindo Comunidades Resilientes com o Echo Report',
      summary: 'Descubra como a colaboração e a informação em tempo real fortalecem a resposta a eventos climáticos.',
      imageUrl: '/assets/artigo-comunidade.jpg',
      category: 'Tecnologia e Comunidade',
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 md:py-16">

      <AnimatedSection animationType="fadeInUp" delay="duration-500">
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
      </AnimatedSection>

      <AnimatedSection animationType="slideInLeft" threshold={0.2}>
        <section className="py-16 md:py-20 my-12 md:my-16 bg-slate-80 rounded-xl">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row lg:items-stretch lg:gap-12">
              <div className="w-full lg:w-2/5 mb-10 lg:mb-0 flex flex-col">
                <div className="relative w-full min-h-[300px] sm:min-h-[400px] lg:h-full rounded-xl shadow-xl overflow-hidden">
                  <Image
                    src="/assets/dn3.jpg"
                    alt="Plataforma Echo Report em ação com mapa interativo e alertas em um dispositivo móvel."
                    fill
                    className="object-cover"
                    sizes="(max-width: 1023px) 100vw, 40vw"
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
                      const Icon = feature.icon;
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
      </AnimatedSection>

      <AnimatedSection animationType="slideInRight" threshold={0.2}>
        <section className="py-16 md:py-20 my-12 md:my-16 bg-slate-80 rounded-xl">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row-reverse lg:items-stretch lg:gap-12">
              <div className="w-full lg:w-2/5 mb-10 lg:mb-0 flex flex-col">
                <div className="relative w-full min-h-[300px] sm:min-h-[400px] lg:h-full rounded-xl shadow-xl overflow-hidden">
                  <Image
                    src="/assets/dn1.jpg"
                    alt="Checklist de segurança para eventos climáticos com ícones representando cada dica."
                    fill
                    className="object-cover"
                    sizes="(max-width: 1023px) 100vw, 40vw"
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
                      const Icon = category.icon;
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
                                <CheckCircleIcon className="w-5 h-5 text-[var(--brand-header-bg)] mr-2 mt-1 flex-shrink-0" />
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
      </AnimatedSection>

      <AnimatedSection animationType="slideInLeft" threshold={0.2}>
        <section className="py-16 md:py-20 my-12 md:my-16 bg-slate-80 rounded-xl">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row lg:items-stretch lg:gap-12">
              <div className="w-full lg:w-2/5 mb-10 lg:mb-0 flex flex-col">
                <div className="relative w-full min-h-[300px] sm:min-h-[400px] lg:h-full rounded-xl shadow-xl overflow-hidden">
                  <Image
                    src="/assets/dn4.jpg"
                    alt="Interface de um aplicativo exibindo contatos de emergência com ícones e números de telefone."
                    fill
                    className="object-cover"
                    sizes="(max-width: 1023px) 100vw, 40vw"
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
                      const Icon = contact.icon;
                      return (
                        <div key={contact.name}>
                          <a
                            href={`tel:${contact.phone.replace(/\s/g, '')}`}
                            className="block p-4 rounded-lg transition-all duration-300 hover:bg-slate-50/50 dark:hover:bg-slate-700/50 group"
                          >
                            <div className="flex items-center mb-1">
                              <div className={`flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-[var(--brand-header-bg)]/10 text-[var(--brand-header-bg)] mr-4 mt-1 md:mt-0`}>
                                <Icon className="w-7 h-7" />
                              </div>
                              <div>
                                <h3 className="text-xl md:text-2xl font-semibold text-[var(--brand-header-bg)] group-hover:text-opacity-80 transition-colors">
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
                          {index < arr.length - 1 && <hr className="my-4 md:my-6 border-slate-200 dark:border-slate-700" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* SEÇÃO BLOG/ARTIGOS EM DESTAQUE - MODIFICADA ABAIXO */}
      <section className="py-16 md:py-20 my-12 md:my-16">
        <div className="container mx-auto px-6">
          <AnimatedSection animationType="fadeInUp" threshold={0.1} className="text-center mb-12 md:mb-16">
            <NewspaperIcon className="w-12 h-12 mx-auto text-[var(--brand-header-bg)] mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--brand-text-primary)] mb-3">
              Fique Informado com Nossos Artigos
            </h2>
            <p className="text-lg md:text-xl text-[var(--brand-text-secondary)] max-w-2xl mx-auto">
              Conhecimento é a primeira linha de defesa. Explore nossos guias e dicas de especialistas.
            </p>
          </AnimatedSection>

          <AnimatedSection
            animationType="fadeInUp"
            threshold={0.05}
            staggerChildren
            childDelayIncrement={150}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
          >
            {blogPostsData.map((post) => (
              <div 
                key={post.slug} 
                className="bg-[var(--brand-card-background)] rounded-xl shadow-[var(--shadow-subtle)] overflow-hidden flex flex-col group h-full hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1.5"
              >
                <Link href={`/blog/${post.slug}`} className="block group/card focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-header-bg)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--brand-card-background)] rounded-t-xl">
                  <div className="relative w-full h-56 overflow-hidden rounded-t-xl">
                    <Image
                      src={post.imageUrl}
                      alt={`Artigo sobre ${post.title}`}
                      fill
                      className="object-cover group-hover/card:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </Link>
                <div className="p-6 flex-grow flex flex-col">
                  <span className="inline-flex items-center text-xs font-semibold text-[var(--brand-header-bg)] uppercase mb-2">
                    <TagIcon className="w-4 h-4 mr-1.5" />
                    {post.category}
                  </span>
                  
                  <h3 className="text-xl font-semibold text-[var(--brand-text-primary)] mb-3">
                    <Link href={`/blog/${post.slug}`} className="hover:text-[var(--brand-header-bg)] transition-colors focus:outline-none focus-visible:text-[var(--brand-header-bg)] focus-visible:underline">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-[var(--brand-text-secondary)] mb-4 flex-grow">
                    {post.summary}
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-sm font-semibold text-[var(--brand-header-bg)] hover:underline group/readmore mt-auto focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--brand-header-bg)] focus-visible:ring-offset-1 focus-visible:rounded"
                  >
                    Leia mais
                    <ChevronRightIcon className="w-4 h-4 ml-1 transition-transform duration-200 group-hover/readmore:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </AnimatedSection>

          <AnimatedSection animationType="fadeInUp" threshold={0.1} className="text-center mt-12 md:mt-16">
            <Link
              href="/blog"
              className="bg-[var(--brand-header-bg)] text-[var(--brand-text-header)] font-semibold px-8 py-3.5 rounded-lg shadow-md hover:bg-opacity-80 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--brand-header-bg)] focus:ring-opacity-50 text-lg"
            >
              Ver Todos os Artigos
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}