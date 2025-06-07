'use client';

import Link from 'next/link';
import Image from 'next/image';
import AnimatedSection from './../../components/AnimatedSection';

export default function GuiaEnchentesPage() {
  const article = {
    id: 'guia-preparacao-enchentes',
    title: 'Guia Completo: Como se Preparar para Enchentes',
    category: 'Prevenção e Segurança',
    publicationDate: '2025-05-31',
    authorName: 'Arthur Thomas',
    authorImageUrl: '/assets/Arthur.svg',
    heroImageUrl: '/assets/artigo-enchente.jpg',
    heroImageAlt: 'Rua residencial parcialmente inundada com carros submersos e água barrenta.',
    summary: 'Um guia detalhado com medidas essenciais para proteger sua família e seu lar antes, durante e depois de inundações e alagamentos.',
    contentParts: [
      `
      <p class="lead mb-6 text-lg" style="color: var(--brand-text-primary);">Enchentes e alagamentos são desastres naturais cada vez mais frequentes em áreas urbanas e rurais, podendo causar danos significativos à propriedade, à saúde e, em casos extremos, perdas de vidas. Estar bem preparado e saber como agir é crucial para minimizar os impactos e garantir a segurança de todos. Este guia oferece um passo a passo completo.</p>
      <h2 class="text-3xl font-bold mt-8 mb-4" style="color: var(--brand-text-primary);">Antes da Enchente: Preparação Essencial</h2>
      <p class="mb-4" style="color: var(--brand-text-primary);">A preparação prévia é a chave para mitigar os impactos de uma enchente. Considere as seguintes ações:</p>
      <ul class="list-disc list-inside mb-6 space-y-2" style="color: var(--brand-text-primary);">
        <li><strong>Plano de Emergência Familiar:</strong> Crie um plano que inclua rotas de fuga, pontos de encontro seguros e como se comunicar se estiverem separados. Inclua contato de emergência e informações médicas importantes.</li>
        <li><strong>Kit de Emergência:</strong> Monte um kit com água potável (pelo menos 4 litros por pessoa por dia), alimentos não perecíveis (para 3-7 dias), rádio à pilha, lanterna, pilhas extras, kit de primeiros socorros, medicamentos essenciais, apito, abridor de latas, cópias de documentos importantes em saco impermeável, dinheiro em espécie, cobertor térmico, e itens de higiene pessoal.</li>
        <li><strong>Proteção da Casa:</strong>
          <ul class="list-circle list-inside ml-4 mt-2 space-y-1" style="color: var(--brand-text-primary);">
            <li>Eleve móveis e eletrodomésticos, se possível, para evitar contato com a água.</li>
            <li>Desligue a energia elétrica e o gás em caso de risco iminente.</li>
            <li>Limpe calhas e ralos para facilitar o escoamento da água.</li>
            <li>Guarde documentos importantes e objetos de valor em locais altos e impermeáveis.</li>
          </ul>
        </li>
        <li><strong>Informação e Monitoramento:</strong> Fique atento aos alertas da defesa civil e aos noticiários locais. Conheça as áreas de risco da sua região.</li>
      </ul>
      `,
      {
        type: 'image',
        src: '/assets/kit-emergencia.jpg',
        alt: 'Kit de emergência pronto para enchentes',
        caption: 'Um kit de emergência bem montado é sua primeira linha de defesa.',
      },
      `
      <h2 class="text-3xl font-bold mt-8 mb-4" style="color: var(--brand-text-primary);">Durante a Enchente: Ações Cruciais para a Segurança</h2>
      <p class="mb-4" style="color: var(--brand-text-primary);">Se a enchente for iminente ou já estiver ocorrendo, siga estas orientações:</p>
      <ul class="list-disc list-inside mb-6 space-y-2" style="color: var(--brand-text-primary);">
        <li><strong>Mantenha a Calma:</strong> A calma é fundamental para tomar decisões acertadas.</li>
        <li><strong>Não Enfrente a Água:</strong> Evite caminhar ou dirigir por áreas alagadas. Apenas 15 cm de água em movimento podem derrubar uma pessoa, e 60 cm podem arrastar um carro. A água pode esconder buracos e objetos perigosos.</li>
        <li><strong>Procure Lugares Altos:</strong> Se sua casa começar a ser inundada, suba para andares superiores ou para o telhado, se for seguro. Se precisar sair, vá para abrigos ou casas de amigos/familiares em áreas seguras.</li>
        <li><strong>Desligue a Eletricidade e o Gás:</strong> Se for seguro fazer isso e houver risco de a água atingir as instalações elétricas ou de gás, desligue os disjuntores e o registro de gás para evitar choques elétricos, curtos-circuitos e vazamentos.</li>
        <li><strong>Não use o Telefone Fixo:</strong> Linhas telefônicas podem conduzir eletricidade. Use o celular apenas para emergências.</li>
        <li><strong>Evite Contato com Água Contaminada:</strong> A água da enchente pode conter esgoto, produtos químicos e outros contaminantes. Lave as mãos frequentemente.</li>
      </ul>

      <h2 class="text-3xl font-bold mt-8 mb-4" style="color: var(--brand-text-primary);">Depois da Enchente: Recuperação e Cuidados Pós-Inundação</h2>
      <p class="mb-4" style="color: var(--brand-text-primary);">Após a água baixar, a fase de recuperação exige cautela:</p>
      <ul class="list-disc list-inside mb-6 space-y-2" style="color: var(--brand-text-primary);">
        <li><strong>Só Retorne Quando For Seguro:</strong> Espere as autoridades informarem que é seguro retornar para casa.</li>
        <li><strong>Cuidado com Doenças:</strong> A água da enchente pode causar doenças como leptospirose, hepatite e tétano. Use luvas e botas ao lidar com áreas molhadas e lama. Lave e desinfete tudo que teve contato com a água da enchente.</li>
        <li><strong>Verifique a Estrutura da Casa:</strong> Inspecione sua casa em busca de danos estruturais antes de entrar. Cuidado com desabamentos.</li>
        <li><strong>Descarte Alimentos Contaminados:</strong> Jogue fora alimentos e medicamentos que entraram em contato com o água da enchente.</li>
        <li><strong>Limpeza e Desinfecção:</strong> Limpe e desinfete rigorosamente todas as áreas afetadas para evitar a proliferação de fungos e bactérias. Use água sanitária diluída.</li>
        <li><strong>Atenção aos Animais Peçonhentos:</strong> Enchentes podem deslocar cobras, escorpiões e outros animais peçonhentos. Redobre a atenção.</li>
        <li><strong>Procure Ajuda Profissional:</strong> Se sua casa foi danificada, procure eletricistas e outros profissionais qualificados para verificar as instalações antes de religar a energia.</li>
      </ul>
      <p class="mt-8 text-base" style="color: var(--brand-text-primary);">Estar preparado para enchentes é um ato de responsabilidade e cuidado com sua vida e com a de sua família. Compartilhe este guia e ajude a construir comunidades mais seguras e resilientes.</p>
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
                sizes="100vw"
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

          {/* Renderiza as partes do conteúdo e a imagem */}
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
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw"
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