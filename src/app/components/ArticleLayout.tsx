// src/components/ArticleLayout.tsx
"use client"; // Se for usar hooks como useInView, senão pode remover

import React, { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarDaysIcon, TagIcon, UserCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
// Se você tiver o componente AnimatedSection globalmente ou quiser usá-lo aqui:
// import AnimatedSection from './AnimatedSection'; // Ajuste o caminho se necessário

interface ArticleLayoutProps {
  title: string;
  heroImageUrl?: string;
  heroImageAlt?: string;
  category?: string;
  publicationDate?: string; // Idealmente uma string já formatada
  authorName?: string;
  authorImageUrl?: string; // Opcional, para avatar do autor
  children: ReactNode; // O conteúdo principal do artigo (corpo do texto)
}

const ArticleLayout: React.FC<ArticleLayoutProps> = ({
  title,
  heroImageUrl,
  heroImageAlt = 'Imagem de destaque do artigo',
  category,
  publicationDate,
  authorName,
  authorImageUrl,
  children,
}) => {
  // Componente de animação (opcional, pode ser removido ou adaptado)
  // Se não for usar AnimatedSection, pode envolver as seções com divs normais
  const AnimationWrapper = ({ children: wrapperChildren }: { children: ReactNode }) => (
    // <AnimatedSection animationType="fadeInUp" delay="duration-300" threshold={0.1}>
    //   {wrapperChildren}
    // </AnimatedSection>
    // Por enquanto, sem animação específica aqui para simplificar o componente
    <div>{wrapperChildren}</div>
  );


  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 md:py-12">
      <AnimationWrapper>
        <div className="mb-8">
          <Link href="/blog" className="inline-flex items-center text-[var(--brand-text-secondary)] hover:text-[var(--brand-header-bg)] transition-colors group">
            <ArrowLeftIcon className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
            Voltar para todos os artigos
          </Link>
        </div>
      </AnimationWrapper>

      <article className="max-w-3xl mx-auto">
        <AnimationWrapper>
          <header className="mb-8 md:mb-12">
            {category && (
              <div className="mb-4 text-center">
                <TagIcon className="w-5 h-5 inline-block mr-1.5 text-[var(--brand-header-bg)]" />
                <span className="text-sm font-semibold uppercase text-[var(--brand-header-bg)] tracking-wider">
                  {category}
                </span>
              </div>
            )}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--brand-text-primary)] mb-6 text-center leading-tight">
              {title}
            </h1>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-6 text-sm text-[var(--brand-text-secondary)]">
              {publicationDate && (
                <div className="flex items-center">
                  <CalendarDaysIcon className="w-5 h-5 mr-1.5 text-slate-500" />
                  <span>Publicado em {publicationDate}</span>
                </div>
              )}
              {authorName && (
                <div className="flex items-center">
                  {authorImageUrl ? (
                    <Image
                      src={authorImageUrl}
                      alt={authorName}
                      width={24}
                      height={24}
                      className="w-6 h-6 rounded-full mr-2 object-cover"
                    />
                  ) : (
                    <UserCircleIcon className="w-5 h-5 mr-1.5 text-slate-500" />
                  )}
                  <span>Por {authorName}</span>
                </div>
              )}
            </div>
          </header>
        </AnimationWrapper>

        {heroImageUrl && (
          <AnimationWrapper>
            <div className="relative w-full h-64 sm:h-80 md:h-96 mb-8 md:mb-12 rounded-lg overflow-hidden shadow-lg">
              <Image
                src={heroImageUrl}
                alt={heroImageAlt}
                fill
                className="object-cover"
                priority // Imagem de destaque é importante, então priorize o carregamento
              />
            </div>
          </AnimationWrapper>
        )}

        <AnimationWrapper>
          {/* Conteúdo do Artigo (Prose para estilização de texto) */}
          <div className="prose prose-slate dark:prose-invert lg:prose-lg xl:prose-xl max-w-none mx-auto 
                          prose-headings:text-[var(--brand-text-primary)] prose-headings:font-semibold 
                          prose-a:text-[var(--brand-header-bg)] hover:prose-a:text-opacity-80
                          prose-strong:text-[var(--brand-text-primary)]
                          prose-blockquote:border-[var(--brand-header-bg)] prose-blockquote:text-[var(--brand-text-secondary)]
                          prose-code:bg-slate-200 prose-code:dark:bg-slate-700 prose-code:p-1 prose-code:rounded prose-code:text-sm
                          prose-img:rounded-md prose-img:shadow-md">
            {children}
          </div>
        </AnimationWrapper>
      </article>

      {/* Opcional: Seção "Sobre o Autor" mais detalhada */}
      {authorName && (
        <AnimationWrapper>
          <section className="max-w-3xl mx-auto mt-12 md:mt-16 pt-8 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-start">
              {authorImageUrl && (
                <Image
                  src={authorImageUrl}
                  alt={authorName}
                  width={80}
                  height={80}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full mr-4 md:mr-6 object-cover shadow-md"
                />
              )}
              <div>
                <h3 className="text-xs uppercase text-[var(--brand-text-secondary)] mb-1">Escrito por</h3>
                <h2 className="text-xl md:text-2xl font-semibold text-[var(--brand-text-primary)] mb-2">{authorName}</h2>
                {/* <p className="text-sm text-[var(--brand-text-secondary)]">
                  Uma breve biografia do autor pode vir aqui, se disponível.
                </p> */}
              </div>
            </div>
          </section>
        </AnimationWrapper>
      )}

      {/* Opcional: Botões de Compartilhamento Social */}
      {/* <AnimationWrapper>
        <section className="max-w-3xl mx-auto mt-8 md:mt-12 text-center">
          <h3 className="text-lg font-semibold text-[var(--brand-text-primary)] mb-4">Compartilhe este artigo:</h3>
          <div className="flex justify-center space-x-3">
            // Links de compartilhamento para Twitter, Facebook, LinkedIn, etc.
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-500">TW</a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-700">FB</a>
          </div>
        </section>
      </AnimationWrapper> */}

    </div>
  );
};

export default ArticleLayout;