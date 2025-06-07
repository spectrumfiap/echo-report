'use client';

import Link from 'next/link';
import Image from 'next/image';
import AnimatedSection from './../components/AnimatedSection';
import { TagIcon } from '@heroicons/react/24/outline';

type Article = {
  id: string;
  title: string;
  category: string;
  publicationDate: string;
  authorName: string;
  authorImageUrl: string;
  heroImageUrl: string;
  heroImageAlt: string;
  summary: string;
  htmlContent: string;
};

// Dados de exemplo para os artigos do blog
const allArticles: Article[] = [
  {
    id: 'guia-preparacao-enchentes',
    title: 'Guia Completo: Como se Preparar para Enchentes',
    category: 'Prevenção e Segurança',
    publicationDate: '2025-06-07',
    authorName: 'Arthur Thomas',
    authorImageUrl: '/assets/Arthur.svg',
    heroImageUrl: '/assets/artigo-enchente.jpg',
    heroImageAlt: 'Rua residencial parcialmente inundada com carros submersos e água barrenta.',
    summary: 'Um guia detalhado com medidas essenciais para proteger sua família e seu lar antes, durante e depois de inundações e alagamentos.',
    htmlContent: ``,
  },
  {
    id: 'entendendo-riscos-ondas-calor',
    title: 'Ondas de Calor: Entenda os Riscos e Saiba Como se Proteger',
    category: 'Saúde e Clima',
    publicationDate: '2025-06-15',
    authorName: 'Arthur Thomas',
    authorImageUrl: '/assets/Arthur.svg',
    heroImageUrl: '/assets/artigo-calor.jpg',
    heroImageAlt: 'Pessoa se refrescando com água em um dia de calor intenso.',
    summary: 'Ondas de calor podem ser extremamente perigosas. Saiba como identificar os riscos e proteger a si mesmo e aos mais vulneráveis.',
    htmlContent: ``,
  },
  {
    id: 'comunidade-resiliente-echo',
    title: 'Construindo Comunidades Resilientes com o Echo Report',
    category: 'Tecnologia e Comunidade',
    publicationDate: '2025-07-10',
    authorName: 'Arthur Thomas',
    authorImageUrl: '/assets/Arthur.svg',
    heroImageUrl: '/assets/artigo-comunidade.jpg',
    heroImageAlt: 'Mãos unidas sobre um mapa digital com ícones de alerta e colaboração.',
    summary: 'Descubra como a colaboração cidadã e a tecnologia implementada nas funcionalidades do Echo Report fortalecem a resposta a eventos climáticos.',
    htmlContent: ``,
  },
];

export default function BlogHome() {
  return (
    <div className="min-h-screen py-4 sm:py-8 lg:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título Principal do Blog */}
        <AnimatedSection animationType="fadeInDown" delay="duration-500" threshold={0.1}>
          <h1
            className="text-center text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-12 sm:mb-16 tracking-tight"
            style={{ color: 'var(--brand-header-bg)' }}
          >
            Nosso Blog
          </h1>
          <p
            className="text-center text-lg sm:text-xl max-w-3xl mx-auto mb-16"
            style={{ color: 'var(--brand-text-secondary)' }}
          >
            Explore artigos e insights sobre prevenção, segurança e tecnologia para construir comunidades mais resilientes.
          </p>
        </AnimatedSection>

        {/* Grade de Artigos */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {allArticles.map((article: Article) => (
            <AnimatedSection
              key={article.id}
              animationType="fadeInUp"
              delay="duration-700"
              threshold={0.1}
            >
              <div
                className="group relative flex flex-col rounded-2xl transition-all duration-300 overflow-hidden h-full
                                        border border-transparent dark:border-gray-700
                                        transform hover:-translate-y-1"
                style={{
                  backgroundColor: 'var(--brand-card-background)',
                }}
              >
                <Link href={`/blog/${article.id}`} className="block h-full">
                  {/* Imagem de Capa */}
                  <div className="relative w-full h-48 sm:h-56 lg:h-60 overflow-hidden">
                    <Image
                      src={article.heroImageUrl}
                      alt={article.heroImageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-900/20 to-transparent"></div>
                  </div>

                  {/* Conteúdo do Card */}
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      {/* Categoria */}
                      <div className="flex items-center text-sm font-semibold mb-3" style={{ color: 'var(--brand-header-bg)' }}>
                        <TagIcon className="w-4 h-4 mr-1.5" />
                        <span>{article.category}</span>
                      </div>

                      {/* Título do Artigo */}
                      <h2
                        className="text-2xl font-bold leading-tight mb-3 transition-colors duration-200"
                        style={{ color: 'var(--brand-text-primary)' }}
                      >
                        {article.title}
                      </h2>
                      {/* Resumo */}
                      <p
                        className="text-base mb-5 line-clamp-3"
                        style={{ color: 'var(--brand-text-secondary)' }}
                      >
                        {article.summary}
                      </p>
                    </div>

                    {/* Autor e Data de Publicação */}
                    <div
                      className="flex items-center text-sm pt-4 border-t border-gray-100 dark:border-gray-700"
                      style={{ color: 'var(--brand-text-secondary)' }}
                    >
                      {article.authorImageUrl && (
                        <Image
                          src={article.authorImageUrl}
                          alt={article.authorName}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full mr-3 border-2 border-blue-300 dark:border-blue-600"
                        />
                      )}
                      <div>
                        <p
                          className="font-semibold"
                          style={{ color: 'var(--brand-text-primary)' }}
                        >
                          {article.authorName}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  );
}