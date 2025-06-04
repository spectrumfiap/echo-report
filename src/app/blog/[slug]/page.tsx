import ArticleLayout from '../../components/ArticleLayout';
import AnimatedSection from '../../components/AnimatedSection';
import { notFound } from 'next/navigation';
import React from 'react';
import type { Metadata } from 'next';

interface Article {
  slug: string;
  title: string;
  category: string;
  publicationDate: string;
  authorName: string;
  authorImageUrl: string;
  heroImageUrl: string;
  heroImageAlt: string;
  summary: string;
  htmlContent: string;
}

const allArticlesData: { [key: string]: Article } = {
  'guia-preparacao-enchentes': {
    slug: 'guia-preparacao-enchentes',
    title: 'Guia Completo: Como se Preparar para Enchentes',
    category: 'Prevenção e Segurança',
    publicationDate: '2025-05-31',
    authorName: 'Arthur Thomas',
    authorImageUrl: '/assets/Arthur.svg',
    heroImageUrl: '/assets/artigo-enchente.jpg',
    heroImageAlt: 'Rua residencial parcialmente inundada com carros submersos e água barrenta.',
    summary: 'Um guia detalhado com medidas essenciais para proteger sua família e seu lar antes, durante e depois de inundações e alagamentos.',
    htmlContent: `<!-- seu HTML aqui -->`,
  },
};

async function getArticleData(slug: string): Promise<Article | null> {
  return allArticlesData[slug] || null;
}

// CORREÇÃO: Tipagem correta para App Router
type Props = {
  params: {
    slug: string;
  };
};

// generateMetadata com tipagem correta
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;

  const article = await getArticleData(slug);
  if (!article) {
    return {
      title: 'Artigo Não Encontrado',
      description: 'O artigo não foi encontrado.',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const imageUrl = article.heroImageUrl ? new URL(article.heroImageUrl, baseUrl).toString() : undefined;
  const pageDescription = article.summary || article.htmlContent.substring(0, 160).replace(/<[^>]*>?/gm, '').trim() + '...';

  return {
    title: `${article.title} | Blog Echo Report`,
    description: pageDescription,
    openGraph: {
      title: article.title,
      description: pageDescription,
      images: imageUrl ? [{ url: imageUrl }] : [],
      type: 'article',
      publishedTime: article.publicationDate,
      authors: article.authorName ? [article.authorName] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: pageDescription,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

// Página do artigo
export default async function ArticlePage({ params }: Props) {
  const article = await getArticleData(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <AnimatedSection animationType="fadeInUp" delay="duration-300" threshold={0.1}>
      <ArticleLayout
        title={article.title}
        category={article.category}
        publicationDate={new Date(article.publicationDate + 'T00:00:00').toLocaleDateString('pt-BR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
        authorName={article.authorName}
        authorImageUrl={article.authorImageUrl}
        heroImageUrl={article.heroImageUrl}
        heroImageAlt={article.heroImageAlt}
        slug={params.slug}
      >
        <div
          className="prose lg:prose-lg max-w-none
                   prose-p:text-slate-800 dark:prose-p:text-slate-300
                   prose-headings:text-[var(--brand-header-bg)] dark:prose-headings:text-blue-400
                   prose-strong:text-slate-900 dark:prose-strong:text-slate-100
                   prose-ul:text-slate-700 dark:prose-ul:text-slate-300
                   prose-li:marker:text-[var(--brand-header-bg)] dark:prose-li:marker:text-blue-400
                   prose-blockquote:border-[var(--brand-header-bg)] dark:prose-blockquote:border-blue-500
                   prose-blockquote:text-slate-700 dark:prose-blockquote:text-slate-300
                   prose-a:text-[var(--brand-header-bg)] dark:prose-a:text-blue-400 hover:prose-a:text-opacity-80"
          dangerouslySetInnerHTML={{ __html: article.htmlContent }}
        />
      </ArticleLayout>
    </AnimatedSection>
  );
}

// Static params para build
export async function generateStaticParams() {
  const slugs = Object.keys(allArticlesData);
  return slugs.map((slug) => ({
    slug,
  }));
}
