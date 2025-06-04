// app/blog/comunidade-resiliente-echo/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import AnimatedSection from './../../components/AnimatedSection';

export default function ComunidadeResilientePage() {
  const article = {
    id: 'comunidade-resiliente-echo',
    title: 'Construindo Comunidades Resilientes com o Echo Report',
    category: 'Tecnologia e Comunidade',
    publicationDate: '2025-07-10',
    authorName: 'Arthur Thomas',
    authorImageUrl: '/assets/Arthur.svg',
    heroImageUrl: '/assets/artigo-comunidade.jpg',
    heroImageAlt: 'Mãos unidas sobre um mapa digital com ícones de alerta e colaboração.',
    contentParts: [
      `
      <p class="lead mb-6 text-lg" style="color: var(--brand-text-primary);">A resiliência comunitária é a capacidade de uma comunidade se antecipar, se preparar, responder e se recuperar efetivamente de adversidades, como os cada vez mais frequentes eventos climáticos extremos. Neste cenário, a tecnologia e a colaboração emergem como pilares fundamentais. O Echo Report nasceu com a missão de ser uma ferramenta catalisadora dessa transformação, capacitando cidadãos e fortalecendo laços sociais.</p>
      <h2 class="text-3xl font-bold mt-8 mb-4" style="color: var(--brand-text-primary);">O Papel da Tecnologia na Resiliência</h2>
      <p class="mb-4" style="color: var(--brand-text-primary);">A tecnologia moderna oferece ferramentas poderosas para a gestão de desastres e a construção de resiliência. O Echo Report integra diversas funcionalidades que facilitam a comunicação e a coordenação durante crises:</p>
      <ul class="list-disc list-inside mb-6 space-y-2" style="color: var(--brand-text-primary);">
        <li><strong>Mapeamento de Riscos em Tempo Real:</strong> Utiliza dados georreferenciados para identificar áreas de risco e visualizar a progressão de eventos climáticos.</li>
        <li><strong>Alertas Personalizados:</strong> Envia notificações para usuários em zonas afetadas, informando sobre perigos iminentes e medidas de segurança.</li>
        <li><strong>Relatórios de Cidadãos:</strong> Permite que os usuários enviem fotos, vídeos e descrições de incidentes, criando um panorama em tempo real da situação no terreno.</li>
        <li><strong>Recursos e Abrigos:</strong> Apresenta um mapa interativo com a localização de abrigos, pontos de distribuição de ajuda e outros recursos essenciais.</li>
        <li><strong>Comunicação Simplificada:</strong> Facilita a comunicação entre cidadãos, equipes de emergência e órgãos governamentais, garantindo que as informações cheguem às pessoas certas no momento certo.</li>
        <li><strong>Voluntariado Organizado:</strong> Conecta voluntários com necessidades específicas de ajuda, otimizando a resposta a emergências.</li>
      </ul>
      `,
      {
        type: 'image',
        src: '/assets/cidade-evento-climatico.jpg',
        alt: 'Pessoas colaborando em comunidade',
        caption: 'A colaboração fortalece a resiliência da comunidade.',
      },
      `
      <h2 class="text-3xl font-bold mt-8 mb-4" style="color: var(--brand-text-primary);">Colaboração Cidadã: O Coração do Echo Report</h2>
      <p class="mb-4" style="color: var(--brand-text-primary);">Enquanto a tecnologia fornece a estrutura, a colaboração cidadã é o motor da resiliência. O Echo Report empodera os indivíduos para serem agentes ativos na segurança de suas comunidades:</p>
      <ul class="list-disc list-inside mb-6 space-y-2" style="color: var(--brand-text-primary);">
        <li><strong>Voluntariado Organizado:</strong> Conecta voluntários com necessidades específicas de ajuda, otimizando a resposta a emergências.</li>
        <li><strong>Compartilhamento de Conhecimento:</strong> Plataforma para que os cidadãos compartilhem dicas de segurança, melhores práticas e informações locais relevantes.</li>
        <li><strong>Vigilância Comunitária:</strong> Os próprios moradores se tornam os olhos e ouvidos da comunidade, reportando rapidamente anomalias e perigos.</li>
        <li><strong>Redes de Apoio Mútuo:</strong> Facilita a criação de redes de apoio onde vizinhos podem ajudar uns aos outros em momentos de necessidade.</li>
      </ul>

      <h2 class="text-3xl font-bold mt-8 mb-4" style="color: var(--brand-text-primary);">Benefícios de uma Comunidade Resiliente com o Echo Report</h2>
      <p class="mb-4" style="color: var(--brand-text-primary);">A integração de tecnologia e colaboração através do Echo Report traz benefícios tangíveis:</p>
      <ul class="list-disc list-inside mb-6 space-y-2" style="color: var(--brand-text-primary);">
        <li><strong>Redução de Danos:</strong> Ações preventivas e respostas rápidas minimizam perdas materiais e humanas.</li>
        <li><strong>Maior Autonomia:</strong> As comunidades se tornam menos dependentes de ajuda externa imediata, agindo de forma mais autônoma.</li>
        <li><strong>Fortalecimento dos Laços Sociais:</strong> A colaboração em momentos de crise fortalece o senso de comunidade e solidariedade.</li>
        <li><strong>Resposta Mais Eficaz:</strong> Informações em tempo real e coordenação aprimorada levam a uma resposta mais ágil e eficiente dos serviços de emergência.</li>
        <li><strong>Educação e Conscientização:</strong> A plataforma serve como um centro de recursos para educar os cidadãos sobre preparação para desastres.</li>
      </ul>
      <p class="mt-8 text-base" style="color: var(--brand-text-primary);">O Echo Report não é apenas uma ferramenta; é um movimento em direção a comunidades mais seguras, informadas e conectadas. Ao unir tecnologia e o poder da colaboração humana, estamos construindo um futuro mais resiliente para todos.</p>
      `,
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <AnimatedSection animationType="fadeIn" delay="duration-700" threshold={0.1}>
        <div className="max-w-4xl mx-auto">
          <AnimatedSection animationType="fadeIn" delay="duration-1000" threshold={0.1}>
            <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden shadow-lg"
                 style={{ boxShadow: 'var(--shadow-subtle)' }}>
              <Image
                src={article.heroImageUrl}
                alt={article.heroImageAlt}
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
          </AnimatedSection>

          <AnimatedSection animationType="fadeInUp" delay="duration-700" threshold={0.1} staggerChildren={true} childDelayIncrement={50}>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight" style={{ color: 'var(--brand-header-bg)' }}>{article.title}</h1>

            <div className="flex items-center mb-8 text-sm" style={{ color: 'var(--brand-text-secondary)' }}>
              {article.authorImageUrl && (
                <Image
                  src={article.authorImageUrl}
                  alt={article.authorName}
                  width={40}
                  height={40}
                  className="rounded-full mr-3 border-2 border-blue-500"
                />
              )}
              <div>
                <p className="font-semibold" style={{ color: 'var(--brand-text-primary)' }}>{article.authorName}</p>
                <p>{article.category} &bull; {article.publicationDate}</p>
              </div>
            </div>
          </AnimatedSection>

          {article.contentParts.map((part, index) => (
            <AnimatedSection key={index} animationType="fadeInUp" delay="duration-900" threshold={0.1}>
              {typeof part === 'string' ? (
                <div
                  className="prose prose-lg max-w-none leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: part }}
                />
              ) : (
                <div className="my-8 text-center" style={{ maxWidth: '100%'}}>
                  <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-lg mb-4"
                       style={{ boxShadow: 'var(--shadow-subtle)' }}>
                    <Image
                      src={part.src}
                      alt={part.alt}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <p className="text-sm italic" style={{ color: 'var(--brand-text-secondary)' }}>
                    {part.caption}
                  </p>
                </div>
              )}
            </AnimatedSection>
          ))}

          <div className="mt-12 text-center">
            <Link href="/blog" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
              Voltar para o Blog
            </Link>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}