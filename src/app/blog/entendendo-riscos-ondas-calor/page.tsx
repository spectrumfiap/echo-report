// app/blog/entendendo-riscos-ondas-calor/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import AnimatedSection from './../../components/AnimatedSection';

export default function OndasCalorPage() {
  const article = {
    id: 'entendendo-riscos-ondas-calor',
    title: 'Ondas de Calor: Entenda os Riscos e Saiba Como se Proteger',
    category: 'Saúde e Clima',
    publicationDate: '2025-06-15',
    authorName: 'Arthur Thomas',
    authorImageUrl: '/assets/Arthur.svg',
    heroImageUrl: '/assets/artigo-calor.jpg',
    heroImageAlt: 'Pessoa se refrescando com água em um dia de calor intenso.',
    contentParts: [
      `
      <p class="lead mb-6 text-lg" style="color: var(--brand-text-primary);">As ondas de calor são períodos prolongados de temperaturas excessivamente altas, que podem ter sérias consequências para a saúde humana, especialmente para grupos vulneráveis como idosos, crianças e pessoas com condições médicas preexistentes. Compreender os riscos e adotar medidas preventivas é essencial.</p>
      <h2 class="text-3xl font-bold mt-8 mb-4" style="color: var(--brand-text-primary);">O que é uma Onda de Calor?</h2>
      <p class="mb-4" style="color: var(--brand-text-primary);">Uma onda de calor é caracterizada por temperaturas significativamente acima da média para uma determinada região e época do ano, persistindo por um período de vários dias. A combinação de alta temperatura e umidade elevada pode tornar o calor ainda mais perigoso, dificultando a regulação da temperatura corporal.</p>

      `,
      {
        type: 'image',
        src: '/assets/termometro-sol.jpg',
        alt: 'Pessoa se protegendo do calor',
        caption: 'Proteja-se do calor para evitar problemas de saúde.',
      },
      `
      <h2 class="text-3xl font-bold mt-8 mb-4" style="color: var(--brand-text-primary);">Riscos à Saúde Associados às Ondas de Calor</h2>
      <p class="mb-4" style="color: var(--brand-text-primary);">A exposição prolongada ao calor excessivo pode levar a diversos problemas de saúde, desde condições leves até emergências médicas graves:</p>
      <ul class="list-disc list-inside mb-6 space-y-2" style="color: var(--brand-text-primary);">
        <li><strong>Desidratação:</strong> Perda excessiva de líquidos e sais minerais do corpo, levando a tonturas, fadiga e, em casos graves, colapso.</li>
        <li><strong>Exaustão por Calor:</strong> Caracterizada por suores intensos, pele fria e úmida, náuseas, cãibras musculares, dor de cabeça e fraqueza. É um estágio anterior à insolação.</li>
        <li><strong>Insolação (Golpe de Calor):</strong> A condição mais grave, ocorre quando o corpo não consegue mais regular sua temperatura. Sintomas incluem pele quente e seca (ou suor excessivo que parou), confusão mental, convulsões, perda de consciência e temperatura corporal acima de 40°C. A insolação é uma emergência médica e requer atenção imediata.</li>
        <li><strong>Agravamento de Condições Crônicas:</strong> Pessoas com doenças cardíacas, respiratórias ou renais são mais vulneráveis, pois o calor pode sobrecarregar seus sistemas.</li>
      </ul>

      <h2 class="text-3xl font-bold mt-8 mb-4" style="color: var(--brand-text-primary);">Quem Está Mais em Risco?</h2>
      <p class="mb-4" style="color: var(--brand-text-primary);">Certas populações são particularmente vulneráveis aos efeitos das ondas de calor:</p>
      <ul class="list-disc list-inside mb-6 space-y-2" style="color: var(--brand-text-primary);">
        <li><strong>Idosos:</strong> Possuem menor capacidade de regular a temperatura corporal e podem ter condições médicas que os tornam mais suscetíveis.</li>
        <li><strong>Crianças Pequenas:</strong> Seus sistemas de regulação térmica ainda não estão totalmente desenvolvidos.</li>
        <li><strong>Pessoas com Doenças Crônicas:</strong> Diabéticos, hipertensos, cardiopatas e pessoas com problemas respiratórios.</li>
        <li><strong>Trabalhadores ao Ar Livre:</strong> Expostos diretamente ao sol e ao calor por longos períodos.</li>
        <li><strong>Atletas e Pessoas Fisicamente Ativas:</strong> O esforço físico intenso em altas temperaturas aumenta o risco de desidratação e exaustão.</li>
        <li><strong>Pessoas em Situação de Rua:</strong> Sem acesso a abrigo, água e locais frescos.</li>
      </ul>

      <h2 class="text-3xl font-bold mt-8 mb-4" style="color: var(--brand-text-primary);">Como se Proteger Durante uma Onda de Calor</h2>
      <p class="mb-4" style="color: var(--brand-text-primary);">Adotar medidas preventivas é essencial para sua segurança e bem-estar:</p>
      <ul class="list-disc list-inside mb-6 space-y-2" style="color: var(--brand-text-primary);">
        <li><strong>Hidrate-se Constantemente:</strong> Beba bastante água, mesmo que não sinta sede. Evite bebidas alcoólicas e com muito açúcar.</li>
        <li><strong>Mantenha-se em Locais Frescos:</strong> Fique em ambientes com ar-condicionado ou ventilador. Se não tiver, procure centros comerciais, bibliotecas ou outros locais públicos frescos.</li>
        <li><strong>Use Roupas Leves:</strong> Prefira roupas leves, folgadas e de cores claras.</li>
        <li><strong>Evite Exposição Direta ao Sol:</strong> Permaneça na sombra, especialmente entre 10h e 16h.</li>
        <li><strong>Tome Banhos Frios:</strong> Banhos ou duchas frias podem ajudar a baixar a temperatura corporal.</li>
        <li><strong>Modere a Atividade Física:</strong> Evite exercícios intensos nos horários mais quentes do dia. Se for se exercitar, faça-o nas primeiras horas da manhã ou à noite.</li>
        <li><strong>Atenção aos Sinais do Corpo:</strong> Ao sentir tonturas, náuseas, dor de cabeça ou cansaço excessivo, procure um local fresco, hidrate-se e, se os sintomas persistirem, procure atendimento médico.</li>
        <li><strong>Ofereça Ajuda:</strong> Verifique idosos, crianças e vizinhos vulneráveis. Certifique-se de que estão se hidratando e se mantendo frescos.</li>
      </ul>
      <p class="mt-8 text-base" style="color: var(--brand-text-primary);">Estar ciente dos riscos e saber como se proteger é crucial para enfrentar as ondas de calor de forma segura. Compartilhe essas dicas para ajudar a proteger a todos!</p>
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