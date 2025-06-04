// pages/artigos/[slug].tsx
import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next'; // For data fetching
import { allArticlesData, Article } from '.../../../lib/articles'; // Adjust path to 

// Define the props that this page component will receive
interface ArticlePageProps {
  article: Article;
}

// The React component for your article page
export default function ArticlePage({ article }: ArticlePageProps) {
  // If for some reason the article is not passed (shouldn't happen with getStaticPaths),
  // you might want to render a loading state or 404
  if (!article) {
    return <p>Artigo não encontrado.</p>;
  }

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
      <img
        src={article.heroImageUrl}
        alt={article.heroImageAlt}
        className="w-full h-80 object-cover rounded-lg shadow-md mb-8"
      />
      <div
        className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: article.htmlContent }}
      />
    </article>
  );
}

// --- Next.js Data Fetching Functions ---

// getStaticPaths tells Next.js which paths (slugs) to pre-render at build time
export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = Object.keys(allArticlesData); // Get all slugs from your data

  // Map slugs to the format Next.js expects for paths
  const paths = slugs.map((slug) => ({
    params: { slug }, // The 'slug' here must match the [slug] in the filename
  }));

  return {
    paths,
    fallback: false, // Set to 'blocking' or true if you expect new slugs not present at build time
                    // 'false' means any path not returned by getStaticPaths will result in a 404
  };
};

// getStaticProps fetches data for each individual page at build time
export const getStaticProps: GetStaticProps<ArticlePageProps> = async ({ params }) => {
  const slug = params?.slug as string; // Get the slug from the URL parameters

  const articleData = allArticlesData[slug];

  if (!articleData) {
    // If article data is not found, return 404
    return {
      notFound: true,
    };
  }

  // Combine the slug with the article data to form the complete Article object
  const article: Article = {
    slug: slug,
    ...articleData,
  };

  return {
    props: {
      article,
    },
  };
};