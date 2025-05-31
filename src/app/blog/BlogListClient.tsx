"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AnimatedSection from '../components/AnimatedSection'; // Ajustado para usar @/components
import { TagIcon, CalendarDaysIcon, ChevronRightIcon, NewspaperIcon } from '@heroicons/react/24/outline';

export interface BlogArticle {
  slug: string;
  title: string;
  summary: string;
  imageUrl: string;
  category: string;
  publicationDate: string;
}

interface BlogListClientProps {
  articles: BlogArticle[];
}

const BlogListClient: React.FC<BlogListClientProps> = ({ articles }) => {
  return (
    <>
      <AnimatedSection animationType="fadeInUp" delay="duration-300">
        <header className="text-center mb-12 md:mb-16">
          <NewspaperIcon className="w-16 h-16 mx-auto text-[var(--brand-header-bg)] mb-4" />
          <h1 className="text-4xl sm:text-5xl font-bold text-[var(--brand-text-primary)] mb-4">
            Nosso Blog
          </h1>
          <p className="text-lg md:text-xl text-[var(--brand-text-secondary)] max-w-2xl mx-auto">
            Mantenha-se informado com nossos últimos artigos, guias e notícias sobre segurança urbana e resiliência climática.
          </p>
        </header>
      </AnimatedSection>

      {articles.length > 0 ? (
        <AnimatedSection
          animationType="fadeInUp"
          threshold={0.05}
          staggerChildren
          childDelayIncrement={100}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
        >
          {articles.map((article) => (
            <div
              key={article.slug}
              className="bg-[var(--brand-card-background)] rounded-xl shadow-[var(--shadow-subtle)] overflow-hidden flex flex-col group h-full hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1.5"
            >
              <Link href={`/blog/${article.slug}`} className="block">
                <div className="relative w-full h-56">
                  <Image
                    src={article.imageUrl}
                    alt={`Imagem de capa para o artigo: ${article.title}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </Link>
              <div className="p-6 flex-grow flex flex-col">
                {/* SEÇÃO DA CATEGORIA MODIFICADA AQUI */}
                <div className="mb-3">
                  <span className="inline-flex items-center text-xs font-semibold text-[var(--brand-header-bg)] uppercase">
                    <TagIcon className="w-4 h-4 mr-1.5" />
                    {article.category}
                  </span>
                </div>
                {/* FIM DA SEÇÃO DA CATEGORIA MODIFICADA */}
                <h2 className="text-xl lg:text-2xl font-semibold text-[var(--brand-text-primary)] mb-3">
                  <Link href={`/blog/${article.slug}`} className="hover:text-[var(--brand-header-bg)] transition-colors">
                    {article.title}
                  </Link>
                </h2>
                <p className="text-sm text-[var(--brand-text-secondary)] mb-4 flex-grow">
                  {article.summary}
                </p>
                <div className="mt-auto">
                  <div className="flex items-center text-xs text-[var(--brand-text-secondary)] mb-4">
                    <CalendarDaysIcon className="w-4 h-4 mr-1.5" />
                    <span>{article.publicationDate}</span>
                  </div>
                  <Link
                    href={`/blog/${article.slug}`}
                    className="inline-flex items-center text-sm font-semibold text-[var(--brand-header-bg)] hover:underline group/readmore"
                  >
                    Leia mais
                    <ChevronRightIcon className="w-4 h-4 ml-1 transition-transform duration-200 group-hover/readmore:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </AnimatedSection>
      ) : (
        <AnimatedSection animationType="fadeInUp">
          <p className="text-center text-lg text-[var(--brand-text-secondary)] py-12">
            Nenhum artigo encontrado no momento. Volte em breve!
          </p>
        </AnimatedSection>
      )}
    </>
  );
};

export default BlogListClient;