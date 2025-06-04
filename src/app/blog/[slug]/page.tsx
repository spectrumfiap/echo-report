import React from 'react';

const article = {
  slug: 'guia-preparacao-enchentes',
  title: 'Guia Completo: Como se Preparar para Enchentes',
  category: 'Prevenção e Segurança',
  publicationDate: '2025-05-31',
  authorName: 'Arthur Thomas',
  authorImageUrl: '/assets/Arthur.svg',
  heroImageUrl: '/assets/artigo-enchente.jpg',
  heroImageAlt: 'Rua residencial parcialmente inundada com carros submersos e água barrenta.',
  summary:
    'Um guia detalhado com medidas essenciais para proteger sua família e seu lar antes, durante e depois de inundações e alagamentos.',
  htmlContent: `<p>Este é o conteúdo do artigo. Fique seguro durante enchentes!</p>`,
};

export default function ArticlePage() {
  return (
    <article>
      <h1>{article.title}</h1>
      <p>
        <strong>Categoria:</strong> {article.category}
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
        <strong>Autor:</strong> {article.authorName}
      </p>
      <img src={article.heroImageUrl} alt={article.heroImageAlt} />
      <div dangerouslySetInnerHTML={{ __html: article.htmlContent }} />
    </article>
  );
}
