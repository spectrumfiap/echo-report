// src/app/blog/[slug]/page.tsx
import React from 'react';
import Image from 'next/image';
import { allArticlesData, Article } from '@/lib/articles'; // Make sure this path is correct now (@/lib/articles or ../../lib/articles based on final decision)

// REMOVE any custom interface for PageProps if you have one directly for this component.
// The default way to type params directly in the function is more robust here.

// The React component for your article page
export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const articleData = allArticlesData[slug];

  if (!articleData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl text-center text-red-500">
        <h1 className="text-3xl font-bold">Artigo não encontrado.</h1>
        <p>A página que você está procurando não existe.</p>
      </div>
    );
  }

  const article: Article = {
    slug: slug,
    ...articleData,
  };

  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
      <div className="text-gray-600 text-sm mb-6">
        <p>
          <strong>Categoria:</strong> <span className="font-medium text-blue-700">{article.category}</span>
        </p>
        <p>
          <strong>Publicado em:</strong>{' '}
          {new Date(article.publicationDate).toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <p>
          <strong>Autor:</strong> <span className="font-medium text-gray-800">{article.authorName}</span>
        </p>
      </div>
      <Image
        src={article.heroImageUrl}
        alt={article.heroImageAlt}
        width={1200}
        height={500}
        className="w-full h-auto object-cover rounded-lg shadow-md mb-8"
        priority
      />
      <div
        className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: article.htmlContent }}
      />
    </article>
  );
}

// Ensure generateStaticParams is correct as well
export async function generateStaticParams() {
  const slugs = Object.keys(allArticlesData);

  return slugs.map((slug) => ({
    slug: slug,
  }));
}