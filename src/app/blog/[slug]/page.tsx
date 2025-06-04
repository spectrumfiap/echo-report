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
    htmlContent: `
      <p class="lead mb-6">Enchentes e alagamentos são desastres naturais cada vez mais frequentes em áreas urbanas e rurais, podendo causar danos significativos à propriedade, à saúde e, em casos extremos, perdas de vidas. Estar bem preparado e saber como agir é crucial para minimizar os impactos e garantir a segurança de todos. Este guia oferece um passo a passo completo.</p>
      <h2 class="text-2xl font-semibold mb-4 mt-8">Antes da Enchente: A Prevenção é a Melhor Defesa</h2>
      <p class="mb-4">A preparação antecipada pode fazer toda a diferença. Considere as seguintes ações:</p>
      <ul class="list-disc list-inside space-y-2 mb-6 pl-4">
        <li><strong>Conheça sua Área:</strong> Verifique se sua residência ou local de trabalho está em área de risco de inundação. Consulte mapas de risco da Defesa Civil local e identifique rotas de fuga seguras e abrigos públicos próximos.</li>
        <li><strong>Plano Familiar de Emergência:</strong> Desenvolva um plano com todos os membros da família. Definam pontos de encontro, contatos de emergência e responsabilidades de cada um.</li>
        <li><strong>Kit de Emergência:</strong> Monte um kit com itens essenciais para sobreviver por alguns dias: água potável (mínimo 3 litros por pessoa/dia), alimentos não perecíveis, rádio a pilha, lanternas, pilhas extras, kit de primeiros socorros, medicamentos de uso contínuo, apito, documentos importantes (protegidos em saco plástico), dinheiro em espécie, agasalhos e material de higiene pessoal.</li>
        <li><strong>Seguro Residencial:</strong> Verifique se seu seguro cobre danos por inundações. Considere adquirir ou ajustar sua apólice.</li>
        <li><strong>Manutenção Preventiva:</strong> Mantenha calhas e bueiros limpos e desobstruídos. Verifique a vedação de portas e janelas e o estado do telhado.</li>
        <li><strong>Proteja seus Bens:</strong> Se possível, eleve eletrodomésticos (geladeira, fogão, máquina de lavar) e móveis do chão, especialmente em andares térreos ou porões. Mova objetos de valor e produtos químicos para locais mais altos.</li>
        <li><strong>Aprenda a Desligar Utilidades:</strong> Saiba como desligar o fornecimento de gás, água e eletricidade da sua casa. Faça isso apenas se for seguro e antes da água atingir os medidores ou a fiação.</li>
      </ul>
      <figure class="my-8 text-center">
        <img src="/assets/kit-emergencia.jpg" alt="Exemplo de um kit de emergência com água, alimentos, lanterna e rádio." class="rounded-lg shadow-md mx-auto w-full max-w-2xl" />
        <figcaption class="text-center text-sm text-slate-600 dark:text-slate-400 mt-2">Um kit de emergência bem montado é vital.</figcaption>
      </figure>
      <h2 class="text-2xl font-semibold mb-4 mt-8">Durante a Enchente: Ação Imediata e Cautela</h2>
      <p class="mb-4">Ao receber um alerta de enchente ou perceber o aumento rápido do nível da água:</p>
      <ul class="list-disc list-inside space-y-2 mb-6 pl-4">
        <li><strong>Mantenha-se Informado:</strong> Acompanhe os alertas e as instruções das autoridades (Defesa Civil, Bombeiros) por rádio, TV ou canais oficiais na internet.</li>
        <li><strong>Evacue se Necessário:</strong> Se as autoridades ordenarem a evacuação, ou se você se sentir em perigo, saia imediatamente. Siga as rotas de fuga designadas e dirija-se a um abrigo seguro ou à casa de parentes/amigos em áreas não afetadas.</li>
        <li><strong>Procure Locais Elevados:</strong> Se não puder sair, suba para o andar mais alto da casa ou para o telhado (como último recurso). Leve seu kit de emergência.</li>
        <li><strong>Evite Áreas Alagadas:</strong> Não tente atravessar ruas, pontes ou córregos inundados a pé, de bicicleta ou de carro. Apenas 15 cm de água em movimento podem derrubar uma pessoa, e 30 cm podem arrastar um carro pequeno. A água pode esconder buracos, bueiros abertos e outros perigos.</li>
        <li><strong>Cuidado com a Eletricidade:</strong> Evite contato com equipamentos elétricos e fiação se houver água por perto.</li>
        <li><strong>Animais Peçonhentos:</strong> Fique atento à possível presença de cobras, aranhas e escorpiões, que buscam refúgio em locais secos.</li>
      </ul>
      <blockquote class="border-l-4 pl-4 py-2 my-6 italic">
        <strong class="font-semibold text-slate-700 dark:text-slate-300">Importante:</strong> A água de enchente é frequentemente contaminada por esgoto, produtos químicos e detritos, podendo transmitir doenças graves como leptospirose, hepatite A e tétano. Evite qualquer contato direto.
      </blockquote>
      <h2 class="text-2xl font-semibold mb-4 mt-8">Após a Enchente: Recuperação e Cuidados Essenciais</h2>
      <p class="mb-4">O perigo não termina quando a água baixa. Tome as seguintes precauções:</p>
      <ul class="list-disc list-inside space-y-2 mb-6 pl-4">
        <li><strong>Retorno Seguro:</strong> Volte para casa apenas quando as autoridades liberarem e considerarem seguro.</li>
        <li><strong>Inspeção Cautelosa:</strong> Antes de entrar, verifique se há danos estruturais na edificação (rachaduras, inclinações). Use equipamentos de proteção individual (luvas grossas, botas de borracha, máscara).</li>
        <li><strong>Água e Alimentos:</strong> Não consuma água da torneira ou alimentos que tiveram contato com a água da enchente, mesmo que embalados, até que sejam liberados pela vigilância sanitária.</li>
        <li><strong>Limpeza e Desinfecção:</strong> Limpe e desinfete todas as superfícies, móveis e objetos que foram molhados. Use água sanitária (hipoclorito de sódio) na proporção recomendada. Descarte itens muito danificados ou contaminados.</li>
        <li><strong>Documente os Danos:</strong> Fotografe e liste todos os danos e perdas antes de iniciar os reparos, para fins de seguro ou solicitação de ajuda.</li>
        <li><strong>Sistema Elétrico:</strong> Não religue a energia antes que um eletricista qualificado inspecione toda a fiação e os equipamentos.</li>
        <li><strong>Saúde:</strong> Fique atento a sintomas de doenças (febre, diarreia, dores musculares) e procure um posto de saúde se necessário. Mantenha a vacinação em dia.</li>
      </ul>
      <h2 class="text-2xl font-semibold mb-4 mt-8">O Que NÃO Fazer em Caso de Enchente</h2>
      <ul class="list-disc list-inside space-y-2 mb-6 pl-4 text-red-600 dark:text-red-400 font-medium">
        <li>NÃO subestime a força da água ou a velocidade com que o nível pode subir.</li>
        <li>NÃO tente salvar bens materiais se isso colocar sua vida em risco.</li>
        <li>NÃO espalhe boatos ou informações não confirmadas. Busque fontes oficiais.</li>
        <li>NÃO retorne para áreas de risco sem autorização das autoridades.</li>
      </ul>
      <p class="mt-8">A preparação e a informação são suas maiores aliadas contra os perigos das enchentes. Compartilhe este guia com sua família, amigos e vizinhos. Juntos, podemos construir comunidades mais resilientes.</p>
    `,
  },
  'entendendo-riscos-ondas-calor': {
    slug: 'entendendo-riscos-ondas-calor',
    title: 'Ondas de Calor: Entenda os Riscos e Saiba Como se Proteger',
    category: 'Saúde e Clima',
    publicationDate: '2025-06-15',
    authorName: 'Arthur Thomas',
    authorImageUrl: '/assets/Arthur.svg',
    heroImageUrl: '/assets/artigo-calor.jpg',
    heroImageAlt: 'Pessoa se refrescando com água em um dia de calor intenso.',
    summary: 'Ondas de calor podem ser extremamente perigosas. Saiba como identificar os riscos e proteger a si mesmo e aos mais vulneráveis.',
    htmlContent: `
      <p class="lead mb-6">As ondas de calor são períodos prolongados de temperaturas excessivamente altas, que podem ter sérias consequências para a saúde humana, especialmente para grupos vulneráveis como idosos, crianças e pessoas com condições médicas preexistentes. Compreender os riscos e adotar medidas preventivas é essencial.</p>
      <h2 class="text-2xl font-semibold mb-4 mt-6">O Que São Ondas de Calor e Seus Perigos?</h2>
      <p class="mb-4">Uma onda de calor é definida por temperaturas que permanecem significativamente acima da média para uma determinada região por vários dias consecutivos. Os principais riscos à saúde incluem:</p>
      <ul class="list-disc list-inside space-y-2 mb-6 pl-4">
        <li><strong>Desidratação:</strong> Perda excessiva de líquidos e sais minerais.</li>
        <li><strong>Cãibras pelo Calor:</strong> Dores musculares devido à perda de sal.</li>
        <li><strong>Exaustão pelo Calor:</strong> Tontura, fraqueza, náuseas, dor de cabeça, sudorese intensa. Pode evoluir para insolação se não tratada.</li>
        <li><strong>Insolação (Golpe de Calor):</strong> Condição grave e potencialmente fatal. A temperatura corporal sobe rapidamente, a pele fica quente e seca (sem suor), confusão mental, perda de consciência. Requer atendimento médico imediato.</li>
        <li><strong>Agravamento de Doenças Crônicas:</strong> Condições cardíacas, respiratórias e renais podem piorar.</li>
      </ul>
      <figure class="my-8 text-center">
        <img src="/assets/termometro-sol.jpg" alt="Termômetro marcando alta temperatura sob sol forte." class="rounded-lg shadow-md mx-auto w-full max-w-2xl" />
        <figcaption class="text-center text-sm text-slate-600 dark:text-slate-400 mt-2">Monitore a temperatura e siga as recomendações.</figcaption>
      </figure>
      <h2 class="text-2xl font-semibold mb-4 mt-6">Como se Proteger Durante Ondas de Calor</h2>
      <ul class="list-disc list-inside space-y-2 mb-6 pl-4">
        <li><strong>Hidrate-se Constantemente:</strong> Beba muita água ao longo do dia, mesmo sem sentir sede. Evite bebidas açucaradas, alcoólicas ou com cafeína em excesso, pois podem desidratar.</li>
        <li><strong>Evite Exposição Direta ao Sol:</strong> Permaneça em locais frescos e à sombra, especialmente entre 10h e 16h, quando o sol é mais forte.</li>
        <li><strong>Use Roupas Leves e Claras:</strong> Tecidos como algodão e linho ajudam na transpiração e a refletir o calor. Use chapéu ou boné e óculos de sol.</li>
        <li><strong>Procure Ambientes Climatizados:</strong> Se não tiver ar condicionado em casa, passe algumas horas em locais públicos refrigerados, como shoppings, bibliotecas ou centros comunitários.</li>
        <li><strong>Refresque o Corpo:</strong> Tome banhos frios ou use toalhas úmidas no corpo.</li>
        <li><strong>Alimentação Leve:</strong> Faça refeições leves, com frutas e verduras, que são ricas em água.</li>
        <li><strong>Cuidado com Atividades Físicas:</strong> Evite exercícios intensos ao ar livre durante os horários mais quentes. Se for se exercitar, prefira o início da manhã ou o final da tarde.</li>
        <li><strong>Atenção aos Grupos de Risco:</strong> Verifique regularmente crianças pequenas, idosos e pessoas com problemas de saúde. Certifique-se de que estão se hidratando e em locais frescos. Nunca deixe crianças ou animais de estimação sozinhos em veículos estacionados.</li>
      </ul>
      <h2 class="text-2xl font-semibold mb-4 mt-6">Sinais de Alerta e O Que Fazer</h2>
      <p class="mb-4"><strong class="font-semibold text-slate-700 dark:text-slate-300">Exaustão pelo calor:</strong> Pele fria, pálida e úmida, sudorese intensa, fraqueza, tontura, náusea, dor de cabeça, cãibras. Leve a pessoa para um local fresco, afrouxe as roupas, ofereça água e aplique compressas frias.</p>
      <p class="mb-4"><strong class="font-semibold text-slate-700 dark:text-slate-300">Insolação:</strong> Pele quente, vermelha e seca (ou úmida), pulso rápido e forte, confusão mental, tontura, possível perda de consciência. Chame uma ambulância (SAMU 192) imediatamente. Enquanto espera, mova a pessoa para um local fresco e tente baixar sua temperatura com compressas frias ou um banho frio.</p>
      <p class="mt-8">Ondas de calor são um desafio crescente. Cuidar de si e da sua comunidade é fundamental para atravessar esses períodos com segurança.</p>
    `,
  },
  'comunidade-resiliente-echo': {
    slug: 'comunidade-resiliente-echo',
    title: 'Construindo Comunidades Resilientes com o Echo Report',
    category: 'Tecnologia e Comunidade',
    publicationDate: '2025-07-10',
    authorName: 'Arthur Thomas',
    authorImageUrl: '/assets/Arthur.svg',
    heroImageUrl: '/assets/artigo-comunidade.jpg',
    heroImageAlt: 'Mãos unidas sobre um mapa digital com ícones de alerta e colaboração.',
    summary: 'Descubra como a colaboração cidadã e a tecnologia do Echo Report fortalecem a resposta a eventos climáticos.',
    htmlContent: `
      <p class="lead mb-6">A resiliência comunitária é a capacidade de uma comunidade se antecipar, se preparar, responder e se recuperar efetivamente de adversidades, como os cada vez mais frequentes eventos climáticos extremos. Neste cenário, a tecnologia e a colaboração emergem como pilares fundamentais. O Echo Report nasceu com a missão de ser uma ferramenta catalisadora dessa transformação, capacitando cidadãos e fortalecendo laços sociais.</p>
      <h2 class="text-2xl font-semibold mb-4 mt-6">O Desafio dos Eventos Climáticos Urbanos</h2>
      <p class="mb-4">Nossas cidades enfrentam uma gama crescente de desafios impostos pelas mudanças climáticas: alagamentos repentinos, deslizamentos de terra, ondas de calor sufocantes e ventanias destruidoras. A velocidade e a precisão da informação tornam-se vitais para salvar vidas e minimizar danos. Sistemas tradicionais de alerta, embora importantes, muitas vezes carecem da granularidade e da agilidade necessárias para atender às demandas localizadas de uma crise.</p>
      <figure class="my-8 text-center">
        <img src="/assets/cidade-evento-climatico.jpg" alt="Vista aérea de uma cidade com áreas de alerta destacadas." class="rounded-lg shadow-md mx-auto w-full max-w-2xl" />
        <figcaption class="text-center text-sm text-slate-600 dark:text-slate-400 mt-2">Eventos climáticos exigem respostas rápidas e localizadas.</figcaption>
      </figure>
      <h2 class="text-2xl font-semibold mb-4 mt-6">Echo Report: Uma Plataforma de Inteligência Coletiva</h2>
      <p class="mb-4">O Echo Report foi concebido para preencher essa lacuna, transformando cada cidadão em um sensor ativo e informado. Nossa plataforma se baseia em três pilares:</p>
      <ul class="list-disc list-inside space-y-3 mb-6 pl-4">
        <li><strong>Monitoramento Colaborativo em Tempo Real:</strong> Integramos dados de fontes oficiais com o poder do crowdsourcing. Os usuários podem reportar incidentes em tempo real, com geolocalização e fotos.</li>
        <li><strong>Alertas Inteligentes e Hiperlocais:</strong> Com base nos dados coletados, o Echo Report envia alertas personalizados, permitindo decisões informadas.</li>
        <li><strong>A Força da Comunidade Ativa:</strong> Usuários podem confirmar ou contestar reportes, aumentando a confiabilidade dos dados e fomentando o engajamento cívico.</li>
      </ul>
      <h2 class="text-2xl font-semibold mb-4 mt-6">Como o Echo Report Fortalece a Resiliência Comunitária</h2>
      <p class="mb-4">Uma comunidade resiliente é informada, preparada e conectada. O Echo Report contribui para isso de diversas formas:</p>
      <ul class="list-disc list-inside space-y-2 mb-6 pl-4">
        <li><strong>Prevenção e Preparação Aprimoradas:</strong> Mapas de risco dinâmicos permitem identificar áreas vulneráveis e planejar medidas preventivas.</li>
        <li><strong>Resposta Rápida e Coordenada:</strong> Agiliza o fluxo de informações entre cidadãos e equipes de emergência.</li>
        <li><strong>Recuperação Consciente e Solidária:</strong> Auxilia na identificação de áreas afetadas e na mobilização de ajuda.</li>
      </ul>
      <blockquote class="border-l-4 border-green-500 pl-4 py-2 my-6 italic">
        <strong class="font-semibold text-slate-700 dark:text-slate-300">Exemplo Prático:</strong> Um reporte de via alagada pode alertar motoristas, evitando congestionamentos. Um alerta de árvores caídas direciona equipes de manutenção rapidamente.
      </blockquote>
      <h2 class="text-2xl font-semibold mb-4 mt-6">Faça Parte da Mudança: Sua Participação é Essencial</h2>
      <p class="mb-4">Construir cidades mais resilientes é uma tarefa coletiva. O Echo Report é uma ferramenta poderosa, mas seu verdadeiro potencial se realiza com a sua participação ativa.</p>
      <ul class="list-disc list-inside space-y-2 mb-6 pl-4">
        <li><strong>Use o Echo Report:</strong> Mantenha-se informado sobre sua região.</li>
        <li><strong>Reporte Ocorrências:</strong> Viu algo que representa um risco? Reporte!</li>
        <li><strong>Compartilhe com Responsabilidade:</strong> Divulgue informações verificadas.</li>
        <li><strong>Engaje sua Comunidade:</strong> Apresente o Echo Report para seus vizinhos e grupos locais.</li>
      </ul>
      <p class="mt-8">Junte-se a nós nesta jornada para transformar nossas cidades em lugares mais seguros, preparados e solidários. Com o Echo Report, cada cidadão tem o poder de fazer a diferença. Sua voz ecoa, sua ação transforma.</p>
    `,
  },
};

async function getArticleData(slug: string): Promise<Article | null> {
  return allArticlesData[slug] || null;
}

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

export async function generateStaticParams() {
  const slugs = Object.keys(allArticlesData);
  return slugs.map((slug) => ({
    params: { slug }, // <- importante
  }));
}
