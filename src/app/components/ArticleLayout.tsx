"use client";

import React, { ReactNode, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarDaysIcon, TagIcon, UserCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { FaTwitter, FaFacebook, FaWhatsapp, FaLinkedin } from 'react-icons/fa';

interface ArticleLayoutProps {
  title: string;
  heroImageUrl?: string;
  heroImageAlt?: string;
  category?: string;
  publicationDate?: string;
  authorName?: string;
  authorImageUrl?: string;
  children: ReactNode;
  slug?: string;
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
  slug,
}) => {
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(slug ? `${window.location.origin}/blog/${slug}` : window.location.href);
    }
  }, [slug, title]); // Adicionado title para que a URL do Twitter atualize se o título mudar

  const shareOnTwitter = () => {
    const text = encodeURIComponent(`Confira este artigo: ${title}`);
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank', 'noopener,noreferrer');
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(`${title} - ${currentUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(title)}`, '_blank', 'noopener,noreferrer');
  };

  const AnimationWrapper = ({ children: wrapperChildren }: { children: ReactNode }) => (
    <div>{wrapperChildren}</div>
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 md:py-12">
      <AnimationWrapper>
        <div className="mb-8">
          <Link href="/blog" className="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-[var(--brand-header-bg)] dark:hover:text-blue-400 transition-colors group">
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
                <TagIcon className="w-5 h-5 inline-block mr-1.5 text-[var(--brand-header-bg)] dark:text-blue-400" />
                <span className="text-sm font-semibold uppercase text-[var(--brand-header-bg)] dark:text-blue-400 tracking-wider">
                  {category}
                </span>
              </div>
            )}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--brand-text-primary)] dark:text-slate-100 mb-6 text-center leading-tight">
              {title}
            </h1>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-6 text-sm text-slate-600 dark:text-slate-400">
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
                priority 
                sizes="(max-width: 768px) 100vw, 768px" 
              />
            </div>
          </AnimationWrapper>
        )}

        <AnimationWrapper>
          <div className="prose prose-slate dark:prose-invert lg:prose-lg xl:prose-xl max-w-none mx-auto 
                          prose-headings:text-[var(--brand-text-primary)] dark:prose-headings:text-slate-200
                          prose-p:text-slate-700 dark:prose-p:text-slate-300
                          prose-a:text-[var(--brand-header-bg)] dark:prose-a:text-blue-400 hover:prose-a:text-opacity-80
                          prose-strong:text-slate-800 dark:prose-strong:text-slate-200
                          prose-blockquote:border-[var(--brand-header-bg)] dark:prose-blockquote:border-blue-500 
                          prose-blockquote:text-slate-600 dark:prose-blockquote:text-slate-400
                          prose-code:bg-slate-200 prose-code:dark:bg-slate-700 prose-code:p-1 prose-code:rounded prose-code:text-sm
                          prose-img:rounded-md prose-img:shadow-md 
                          prose-ul:text-slate-700 dark:prose-ul:text-slate-300 
                          prose-li:marker:text-[var(--brand-header-bg)] dark:prose-li:marker:text-blue-400">
            {children}
          </div>
        </AnimationWrapper>
      </article>

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
                <h3 className="text-xs uppercase text-slate-500 dark:text-slate-400 mb-1">Escrito por</h3>
                <h2 className="text-xl md:text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-2">{authorName}</h2>
              </div>
            </div>
          </section>
        </AnimationWrapper>
      )}

      <AnimationWrapper>
        <section className="max-w-3xl mx-auto mt-8 md:mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 text-center sm:text-left">Compartilhe este artigo:</h3>
          <div className="flex flex-wrap justify-center sm:justify-start gap-3">
            <button 
              onClick={shareOnTwitter} 
              aria-label="Compartilhar no Twitter" 
              className="flex items-center justify-center p-3 rounded-full bg-sky-500 hover:bg-sky-600 text-white transition-colors"
            >
              <FaTwitter size={18} />
            </button>
            <button 
              onClick={shareOnFacebook} 
              aria-label="Compartilhar no Facebook" 
              className="flex items-center justify-center p-3 rounded-full bg-blue-700 hover:bg-blue-800 text-white transition-colors"
            >
              <FaFacebook size={18} />
            </button>
            <button 
              onClick={shareOnWhatsApp} 
              aria-label="Compartilhar no WhatsApp" 
              className="flex items-center justify-center p-3 rounded-full bg-green-500 hover:bg-green-600 text-white transition-colors"
            >
              <FaWhatsapp size={18} />
            </button>
            <button 
              onClick={shareOnLinkedIn} 
              aria-label="Compartilhar no LinkedIn" 
              className="flex items-center justify-center p-3 rounded-full bg-sky-700 hover:bg-sky-800 text-white transition-colors"
            >
              <FaLinkedin size={18} />
            </button>
          </div>
        </section>
      </AnimationWrapper>
    </div>
  );
};

export default ArticleLayout;