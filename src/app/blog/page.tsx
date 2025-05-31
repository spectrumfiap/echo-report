// src/app/blog/page.tsx
// REMOVIDO: "use client";

import React from 'react';
import BlogListClient, { BlogArticle } from './BlogListClient'; // Importando o componente cliente e a interface

// Dados dos artigos para a página do blog
// Esta parte agora está no Server Component e pode ser buscada de um CMS, DB, etc.
const blogArticles: BlogArticle[] = [
  {
    slug: 'guia-preparacao-enchentes',
    title: 'Guia Completo: Como se Preparar para Enchentes',
    summary: 'Medidas essenciais para proteger sua família e seu lar antes, durante e depois de inundações e alagamentos.',
    imageUrl: '/assets/artigo-enchente.jpg',
    category: 'Prevenção e Segurança',
    publicationDate: '31 de Maio, 2025',
  },
  {
    slug: 'entendendo-riscos-ondas-calor',
    title: 'Ondas de Calor: Entenda os Riscos e Saiba Como se Proteger',
    summary: 'O calor extremo pode ser perigoso. Aprenda a identificar os sinais e a tomar precauções vitais para você e sua família.',
    imageUrl: '/assets/artigo-calor.jpg',
    category: 'Saúde e Clima',
    publicationDate: '15 de Junho, 2025',
  },
  {
    slug: 'comunidade-resiliente-echo',
    title: 'Construindo Comunidades Resilientes com o Echo Report',
    summary: 'Descubra como a colaboração e a informação em tempo real fortalecem a resposta a eventos climáticos na sua cidade.',
    imageUrl: '/assets/artigo-comunidade.jpg',
    category: 'Tecnologia e Comunidade',
    publicationDate: '10 de Julho, 2025',
  },
];

// Metadados para a página principal do blog (PODE FICAR AQUI)
export const metadata = {
  title: 'Blog | Echo Report',
  description: 'Artigos, guias e notícias sobre segurança urbana, preparação para eventos climáticos e resiliência comunitária da Echo Report.',
  openGraph: {
    title: 'Blog | Echo Report',
    description: 'Explore nossos conteúdos sobre segurança e resiliência.',
    images: [
      {
        // Certifique-se que NEXT_PUBLIC_BASE_URL está definido no .env.local ou forneça um URL completo
        url: new URL('/assets/og-blog-echoreport.jpg', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000').toString(),
        width: 1200,
        height: 630,
        alt: 'Blog Echo Report',
      },
    ],
  },
};

export default function BlogIndexPage() {
  // A lógica de buscar ou definir `blogArticles` permanece aqui (Server Component)
  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 md:py-16">
      <BlogListClient articles={blogArticles} />
    </div>
  );
}