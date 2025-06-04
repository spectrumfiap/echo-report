// src/app/blog/[slug]/page.tsx
import React from 'react';
// Use Next.js Image component for optimization
import Image from 'next/image';
// Import your article data and type
import { allArticlesData, Article } from '.../../../lib/articles'; // Adjust path based on your project structure

// This function will generate the static paths for your dynamic routes.
// It replaces getStaticPaths from the Pages Router.
export async function generateStaticParams() {
  const slugs = Object.keys(allArticlesData);

  return slugs.map((slug) => ({
    slug: slug, // The key here must match the folder name: [slug]
  }));
}

// The Page Component (a React Server Component by default in App Router)
// It directly receives the params from the URL.
export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const articleData = allArticlesData[slug];

  // Handle case where article is not found (e.g., direct access to a non-existent slug)
  // In Next.js App Router, you can use notFound() or render a custom 404 UI.
  // For static generation, generateStaticParams already handles existing slugs.
  if (!articleData) {
    // You could also `import { notFound } from 'next/navigation'; notFound();`
    // to trigger the Next.js not-found page.
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl text-center text-red-500">
        <h1 className="text-3xl font-bold">Artigo não encontrado.</h1>
        <p>A página que você está procurando não existe.</p>
      </div>
    );
  }

  // Combine the slug with the article data to form the complete Article object
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
      {/* Use Next.js Image component for optimized images */}
      <Image
        src={article.heroImageUrl}
        alt={article.heroImageAlt}
        width={1200} // Provide intrinsic width
        height={500} // Provide intrinsic height
        className="w-full h-auto object-cover rounded-lg shadow-md mb-8"
        priority // Load this image with high priority (usually for hero images)
      />
      <div
        className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: article.htmlContent }}
      />
    </article>
  );
}

// Optional: Revalidate data at a specific interval (Incremental Static Regeneration)
// If you want to fetch new data from the server after a certain time, you can set revalidate.
// export const revalidate = 60; // Revalidate every 60 seconds