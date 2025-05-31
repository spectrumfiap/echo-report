import ArticleLayout from '../../components/ArticleLayout';
import AnimatedSection from '../../components/AnimatedSection'; // Assumindo que AnimatedSection está aqui ou ajuste o caminho
import { notFound } from 'next/navigation';

const allArticlesData: { [key: string]: any } = {
  'guia-preparacao-enchentes': {
    slug: 'guia-preparacao-enchentes',
    title: 'Guia Completo: Como se Preparar para Enchentes',
    category: 'Prevenção e Segurança',
    publicationDate: '31 de Maio, 2025',
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
      <figure class="my-6">
        <img src="/assets/kit-emergencia.jpg" alt="Exemplo de um kit de emergência com água, alimentos, lanterna e rádio." class="rounded-lg shadow-md mx-auto" />
        <figcaption class="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">Um kit de emergência bem montado é vital.</figcaption>
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
      <blockquote class="border-l-4 border-blue-500 pl-4 py-2 my-6 italic text-gray-700 dark:text-gray-300">
        <strong>Importante:</strong> A água de enchente é frequentemente contaminada por esgoto, produtos químicos e detritos, podendo transmitir doenças graves como leptospirose, hepatite A e tétano. Evite qualquer contato direto.
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
      <ul class="list-disc list-inside space-y-2 mb-6 pl-4 text-red-700 dark:text-red-400 font-medium">
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
    publicationDate: '15 de Junho, 2025',
    authorName: 'Arthur Thomas',
    authorImageUrl: '/assets/Arthur.svg',
    heroImageUrl: '/assets/artigo-calor.jpg',
    heroImageAlt: 'Pessoa se refrescando com água em um dia de calor intenso.',
    summary: 'Ondas de calor podem ser extremamente perigosas. Saiba como identificar os riscos e proteger a si mesmo e aos mais vulneráveis.',
    htmlContent: `
      <p class="lead mb-6">As ondas de calor são períodos prolongados de temperaturas excessivamente altas, que podem ter sérias consequências para a saúde humana, especialmente para grupos vulneráveis como idosos, crianças e pessoas com condições médicas preexistentes. Compreender os riscos e adotar medidas preventivas é essencial.</p>
      <h2 class="text-2xl font-semibold mb-4 mt-8">O Que São Ondas de Calor e Seus Perigos?</h2>
      <p class="mb-4">Uma onda de calor é definida por temperaturas que permanecem significativamente acima da média para uma determinada região por vários dias consecutivos. Os principais riscos à saúde incluem:</p>
      <ul class="list-disc list-inside space-y-2 mb-6 pl-4">
        <li><strong>Desidratação:</strong> Perda excessiva de líquidos e sais minerais.</li>
        <li><strong>Cãibras pelo Calor:</strong> Dores musculares devido à perda de sal.</li>
        <li><strong>Exaustão pelo Calor:</strong> Tontura, fraqueza, náuseas, dor de cabeça, sudorese intensa. Pode evoluir para insolação se não tratada.</li>
        <li><strong>Insolação (Golpe de Calor):</strong> Condição grave e potencialmente fatal. A temperatura corporal sobe rapidamente, a pele fica quente e seca (sem suor), confusão mental, perda de consciência. Requer atendimento médico imediato.</li>
        <li><strong>Agravamento de Doenças Crônicas:</strong> Condições cardíacas, respiratórias e renais podem piorar.</li>
      </ul>
      <figure class="my-6">
        <img src="/assets/termometro-sol.jpg" alt="Termômetro marcando alta temperatura sob sol forte." class="rounded-lg shadow-md mx-auto" />
        <figcaption class="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">Monitore a temperatura e siga as recomendações.</figcaption>
      </figure>
      <h2 class="text-2xl font-semibold mb-4 mt-8">Como se Proteger Durante Ondas de Calor</h2>
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
      <h2 class="text-2xl font-semibold mb-4 mt-8">Sinais de Alerta e O Que Fazer</h2>
      <p class="mb-4"><strong>Exaustão pelo calor:</strong> Pele fria, pálida e úmida, sudorese intensa, fraqueza, tontura, náusea, dor de cabeça, cãibras. Leve a pessoa para um local fresco, afrouxe as roupas, ofereça água e aplique compressas frias.</p>
      <p class="mb-4"><strong>Insolação:</strong> Pele quente, vermelha e seca (ou úmida), pulso rápido e forte, confusão mental, tontura, possível perda de consciência. Chame uma ambulância (SAMU 192) imediatamente. Enquanto espera, mova a pessoa para um local fresco e tente baixar sua temperatura com compressas frias ou um banho frio.</p>
      <p class="mt-8">Ondas de calor são um desafio crescente. Cuidar de si e da sua comunidade é fundamental para atravessar esses períodos com segurança.</p>
    `,
  },
  'comunidade-resiliente-echo': {
    slug: 'comunidade-resiliente-echo',
    title: 'Construindo Comunidades Resilientes com o Echo Report',
    category: 'Tecnologia e Comunidade',
    publicationDate: '10 de Julho, 2025',
    authorName: 'Arthur Thomas',
    authorImageUrl: '/assets/Arthur.svg',
    heroImageUrl: '/assets/artigo-comunidade.jpg',
    heroImageAlt: 'Mãos unidas sobre um mapa digital com ícones de alerta e colaboração, simbolizando a união da comunidade.',
    summary: 'Descubra como a colaboração cidadã e a tecnologia do Echo Report fortalecem a resposta a eventos climáticos, tornando nossas cidades mais seguras e preparadas.',
    htmlContent: `
      <p class="lead mb-6">A resiliência comunitária é a capacidade de uma comunidade se antecipar, se preparar, responder e se recuperar efetivamente de adversidades, como os cada vez mais frequentes eventos climáticos extremos. Neste cenário, a tecnologia e a colaboração emergem como pilares fundamentais. O Echo Report nasceu com a missão de ser uma ferramenta catalisadora dessa transformação, capacitando cidadãos e fortalecendo laços sociais.</p>
      <h2 class="text-2xl font-semibold mb-4 mt-8">O Desafio dos Eventos Climáticos Urbanos</h2>
      <p class="mb-4">Nossas cidades enfrentam uma gama crescente de desafios impostos pelas mudanças climáticas: alagamentos repentinos, deslizamentos de terra, ondas de calor sufocantes e ventanias destruidoras. A velocidade e a precisão da informação tornam-se vitais para salvar vidas e minimizar danos. Sistemas tradicionais de alerta, embora importantes, muitas vezes carecem da granularidade e da agilidade necessárias para atender às demandas localizadas de uma crise.</p>
      <figure class="my-6">
        <img src="/assets/cidade-evento-climatico.jpg" alt="Vista aérea de uma cidade com áreas de alerta destacadas, mostrando a complexidade do monitoramento urbano." class="rounded-lg shadow-md mx-auto" />
        <figcaption class="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">Eventos climáticos exigem respostas rápidas e localizadas.</figcaption>
      </figure>
      <h2 class="text-2xl font-semibold mb-4 mt-8">Echo Report: Uma Plataforma de Inteligência Coletiva</h2>
      <p class="mb-4">O Echo Report foi concebido para preencher essa lacuna, transformando cada cidadão em um sensor ativo e informado. Nossa plataforma se baseia em três pilares:</p>
      <ul class="list-disc list-inside space-y-3 mb-6 pl-4">
        <li><strong>Monitoramento Colaborativo em Tempo Real:</strong> Integramos dados de fontes oficiais (sensores meteorológicos, alertas da Defesa Civil) com o poder do crowdsourcing. Os usuários podem reportar alagamentos, quedas de árvores, falta de energia e outros incidentes em tempo real, com geolocalização e fotos. Isso cria um panorama vivo e instantâneo dos riscos.</li>
        <li><strong>Alertas Inteligentes e Hiperlocais:</strong> Com base nos dados coletados e processados por algoritmos inteligentes, o Echo Report envia alertas personalizados para os usuários em áreas de risco ou em suas rotas planejadas. Esses alertas são específicos, relevantes e acionáveis, permitindo que as pessoas tomem decisões informadas para sua segurança.</li>
        <li><strong>A Força da Comunidade Ativa:</strong> Acreditamos que a informação validada pela comunidade é mais poderosa. Usuários podem confirmar ou contestar reportes, ajudando a filtrar ruídos e aumentar a confiabilidade dos dados. Essa interação não só melhora a precisão do sistema, mas também fomenta o engajamento cívico e a solidariedade entre vizinhos.</li>
      </ul>
      <h2 class="text-2xl font-semibold mb-4 mt-8">Como o Echo Report Fortalece a Resiliência Comunitária</h2>
      <p class="mb-4">Uma comunidade resiliente é uma comunidade informada, preparada e conectada. O Echo Report contribui para isso de diversas formas:</p>
      <ul class="list-disc list-inside space-y-2 mb-6 pl-4">
        <li><strong>Prevenção e Preparação Aprimoradas:</strong> O acesso a um histórico de ocorrências e a mapas de risco dinâmicos permite que cidadãos e o poder público identifiquem áreas vulneráveis e planejem medidas preventivas mais eficazes.</li>
        <li><strong>Resposta Rápida e Coordenada:</strong> Durante uma crise, o Echo Report serve como um canal vital de comunicação, agilizando o fluxo de informações entre os cidadãos e as equipes de emergência (Defesa Civil, Bombeiros, SAMU), permitindo uma alocação mais eficiente de recursos.</li>
        <li><strong>Recuperação Consciente e Solidária:</strong> Após um evento, a plataforma pode auxiliar na identificação das áreas mais afetadas, na organização de campanhas de doação, na mobilização de voluntários e na disseminação de informações sobre abrigos e serviços de apoio.</li>
      </ul>
      <blockquote class="border-l-4 border-green-500 pl-4 py-2 my-6 italic text-gray-700 dark:text-gray-300">
        <strong>Exemplo Prático:</strong> Um simples reporte de via alagada no Echo Report pode alertar centenas de motoristas, evitando congestionamentos e situações de risco. Um alerta de árvores caídas pode direcionar equipes de manutenção mais rapidamente, restabelecendo a normalidade.
      </blockquote>
      <h2 class="text-2xl font-semibold mb-4 mt-8">Faça Parte da Mudança: Sua Participação é Essencial</h2>
      <p class="mb-4">Construir cidades mais resilientes é uma tarefa coletiva. O Echo Report é uma ferramenta poderosa, mas seu verdadeiro potencial se realiza com a sua participação ativa.</p>
      <ul class="list-disc list-inside space-y-2 mb-6 pl-4">
        <li><strong>Use o Echo Report:</strong> Baixe o aplicativo ou acesse nossa plataforma web. Mantenha-se informado sobre sua região.</li>
        <li><strong>Reporte Ocorrências:</strong> Viu algo que representa um risco? Um alagamento começando? Uma árvore em perigo? Reporte! Sua informação pode ajudar muitas pessoas.</li>
        <li><strong>Compartilhe com Responsabilidade:</strong> Divulgue informações verificadas e incentive outros a usar a plataforma de forma consciente.</li>
        <li><strong>Engaje sua Comunidade:</strong> Apresente o Echo Report para seus vizinhos, associações de bairro e grupos locais. Quanto mais pessoas utilizando, mais forte e eficaz se torna a rede.</li>
      </ul>
      <p class="mt-8">Junte-se a nós nesta jornada para transformar nossas cidades em lugares mais seguros, preparados e solidários. Com o Echo Report, cada cidadão tem o poder de fazer a diferença. Sua voz ecoa, sua ação transforma.</p>
    `,
  },
};

async function getArticleData(slug: string) {
  return allArticlesData[slug] || null;
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = await getArticleData(params.slug);
  if (!article) {
    return {
      title: 'Artigo Não Encontrado',
    };
  }
  return {
    title: `${article.title} | Blog Echo Report`,
    description: article.summary || article.htmlContent.substring(0, 160).replace(/<[^>]*>?/gm, '') + '...',
    openGraph: {
      title: article.title,
      description: article.summary || article.htmlContent.substring(0, 160).replace(/<[^>]*>?/gm, '') + '...',
      images: article.heroImageUrl ? [{ url: new URL(article.heroImageUrl, process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000').toString() }] : [],
      type: 'article',
      publishedTime: article.publicationDate,
      authors: article.authorName ? [article.authorName] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary || article.htmlContent.substring(0, 160).replace(/<[^>]*>?/gm, '') + '...',
      images: article.heroImageUrl ? [new URL(article.heroImageUrl, process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000').toString()] : [],
    },
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleData(params.slug);

  if (!article) {
    notFound();
  }

  const articleBody = (
    <div dangerouslySetInnerHTML={{ __html: article.htmlContent }} />
  );

  return (
    <AnimatedSection animationType="fadeInUp" delay="duration-300" threshold={0.1}>
      <ArticleLayout
        title={article.title}
        category={article.category}
        publicationDate={article.publicationDate}
        authorName={article.authorName}
        authorImageUrl={article.authorImageUrl}
        heroImageUrl={article.heroImageUrl}
        heroImageAlt={article.heroImageAlt}
      >
        {articleBody}
      </ArticleLayout>
    </AnimatedSection>
  );
}

export async function generateStaticParams() {
  const slugs = Object.keys(allArticlesData);
  return slugs.map((slug) => ({
    slug,
  }));
}