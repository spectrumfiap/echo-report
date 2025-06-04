// lib/articles.tsx

export type Article = {
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
  };
  
  // All article data, keyed by slug for easy lookup
  export const allArticlesData: { [key: string]: Omit<Article, 'slug'> } = {
    'guia-preparacao-enchentes': {
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
        <h2>Antes da Enchente: Preparação Essencial</h2>
        <p>A preparação prévia é a chave para mitigar os impactos de uma enchente. Considere as seguintes ações:</p>
        <ul>
          <li><strong>Plano de Emergência Familiar:</strong> Crie um plano que inclua rotas de fuga, pontos de encontro seguros e como se comunicar se estiverem separados. Inclua contato de emergência e informações médicas importantes.</li>
          <li><strong>Kit de Emergência:</strong> Monte um kit com água potável (pelo menos 4 litros por pessoa por dia), alimentos não perecíveis (para 3-7 dias), rádio à pilha, lanterna, pilhas extras, kit de primeiros socos, medicamentos essenciais, apito, abridor de latas, cópias de documentos importantes em saco impermeável, dinheiro em espécie, cobertor térmico, e itens de higiene pessoal.</li>
          <li><strong>Proteção da Casa:</strong>
            <ul>
              <li>Eleve móveis e eletrodomésticos, se possível, para evitar contato com a água.</li>
              <li>Desligue a energia elétrica e o gás em caso de risco iminente.</li>
              <li>Limpe calhas e ralos para facilitar o escoamento da água.</li>
              <li>Guarde documentos importantes e objetos de valor em locais altos e impermeáveis.</li>
            </ul>
          </li>
          <li><strong>Informação e Monitoramento:</strong> Fique atento aos alertas da defesa civil e aos noticiários locais. Conheça as áreas de risco da sua região.</li>
        </ul>
  
        <h2>Durante a Enchente: Ações Cruciais para a Segurança</h2>
        <p>Se a enchente for iminente ou já estiver ocorrendo, siga estas orientações:</p>
        <ul>
          <li><strong>Mantenha a Calma:</strong> A calma é fundamental para tomar decisões acertadas.</li>
          <li><strong>Não Enfrente a Água:</strong> Evite caminhar ou dirigir por áreas alagadas. Apenas 15 cm de água em movimento podem derrubar uma pessoa, e 60 cm podem arrastar um carro. A água pode esconder buracos e objetos perigosos.</li>
          <li><strong>Procure Lugares Altos:</strong> Se sua casa começar a ser inundada, suba para andares superiores ou para o telhado, se for seguro. Se precisar sair, vá para abrigos ou casas de amigos/familiares em áreas seguras.</li>
          <li><strong>Desligue a Eletricidade e o Gás:</strong> Se for seguro fazer isso e houver risco de a água atingir as instalações elétricas ou de gás, desligue os disjuntores e o registro de gás para evitar choques elétricos, curtos-circuitos e vazamentos.</li>
          <li><strong>Não use o Telefone Fixo:</strong> Linhas telefônicas podem conduzir eletricidade. Use o celular apenas para emergências.</li>
          <li><strong>Evite Contato com Água Contaminada:</strong> A água da enchente pode conter esgoto, produtos químicos e outros contaminantes. Lave as mãos frequentemente.</li>
        </ul>
  
        <h2>Depois da Enchente: Recuperação e Cuidados Pós-Inundação</h2>
        <p>Após a água baixar, a fase de recuperação exige cautela:</p>
        <ul>
          <li><strong>Só Retorne Quando For Seguro:</strong> Espere as autoridades informarem que é seguro retornar para casa.</li>
          <li><strong>Cuidado com Doenças:</strong> A água da enchente pode causar doenças como leptospirose, hepatite e tétano. Use luvas e botas ao lidar com áreas molhadas e lama. Lave e desinfete tudo que teve contato com a água da enchente.</li>
          <li><strong>Verifique a Estrutura da Casa:</strong> Inspecione sua casa em busca de danos estruturais antes de entrar. Cuidado com desabamentos.</li>
          <li><strong>Descarte Alimentos Contaminados:</strong> Jogue fora alimentos e medicamentos que entraram em contato com a água da enchente.</li>
          <li><strong>Limpeza e Desinfecção:</strong> Limpe e desinfete rigorosamente todas as áreas afetadas para evitar a proliferação de fungos e bactérias. Use água sanitária diluída.</li>
          <li><strong>Atenção aos Animais Peçonhentos:</strong> Enchentes podem deslocar cobras, escorpiões e outros animais peçonhentos. Redobre a atenção.</li>
          <li><strong>Procure Ajuda Profissional:</strong> Se sua casa foi danificada, procure eletricistas e outros profissionais qualificados para verificar as instalações antes de religar a energia.</li>
        </ul>
        <p class="mt-6">Estar preparado para enchentes é um ato de responsabilidade e cuidado com sua vida e com a de sua família. Compartilhe este guia e ajude a construir comunidades mais seguras e resilientes.</p>
      `,
    },
    'entendendo-riscos-ondas-calor': {
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
        <h2>O que é uma Onda de Calor?</h2>
        <p>Uma onda de calor é caracterizada por temperaturas significativamente acima da média para uma determinada região e época do ano, persistindo por um período de vários dias. A combinação de alta temperatura e umidade elevada pode tornar o calor ainda mais perigoso, dificultando a regulação da temperatura corporal.</p>
  
        <h2>Riscos à Saúde Associados às Ondas de Calor</h2>
        <p>A exposição prolongada ao calor excessivo pode levar a diversos problemas de saúde, desde condições leves até emergências médicas graves:</p>
        <ul>
          <li><strong>Desidratação:</strong> Perda excessiva de líquidos e sais minerais do corpo, levando a tonturas, fadiga e, em casos graves, colapso.</li>
          <li><strong>Exaustão por Calor:</strong> Caracterizada por suores intensos, pele fria e úmida, náuseas, cãibras musculares, dor de cabeça e fraqueza. É um estágio anterior à insolação.</li>
          <li><strong>Insolação (Golpe de Calor):</strong> A condição mais grave, ocorre quando o corpo não consegue mais regular sua temperatura. Sintomas incluem pele quente e seca (ou suor excessivo que parou), confusão mental, convulsões, perda de consciência e temperatura corporal acima de 40°C. A insolação é uma emergência médica e requer atenção imediata.</li>
          <li><strong>Agravamento de Condições Crônicas:</strong> Pessoas com doenças cardíacas, respiratórias ou renais são mais vulneráveis, pois o calor pode sobrecarregar seus sistemas.</li>
        </ul>
  
        <h2>Quem Está Mais em Risco?</h2>
        <p>Certas populações são particularmente vulneráveis aos efeitos das ondas de calor:</p>
        <ul>
          <li><strong>Idosos:</strong> Possuem menor capacidade de regular a temperatura corporal e podem ter condições médicas que os tornam mais suscetíveis.</li>
          <li><strong>Crianças Pequenas:</strong> Seus sistemas de regulação térmica ainda não estão totalmente desenvolvidos.</li>
          <li><strong>Pessoas com Doenças Crônicas:</strong> Diabéticos, hipertensos, cardiopatas e pessoas com problemas respiratórios.</li>
          <li><strong>Trabalhadores ao Ar Livre:
          </strong> Expostos diretamente ao sol e ao calor por longos períodos.</li>
          <li><strong>Atletas e Pessoas Fisicamente Ativas:</strong> O esforço físico intenso em altas temperaturas aumenta o risco de desidratação e exaustão.</li>
          <li><strong>Pessoas em Situação de Rua:</strong> Sem acesso a abrigo, água e locais frescos.</li>
        </ul>
  
        <h2>Como se Proteger Durante uma Onda de Calor</h2>
        <p>Adotar medidas preventivas é essencial para sua segurança e bem-estar:</p>
        <ul>
          <li><strong>Hidrate-se Constantemente:</strong> Beba bastante água, mesmo que não sinta sede. Evite bebidas alcoólicas e com muito açúcar.</li>
          <li><strong>Mantenha-se em Locais Frescos:</strong> Fique em ambientes com ar-condicionado ou ventilador. Se não tiver, procure centros comerciais, bibliotecas ou outros locais públicos frescos.</li>
          <li><strong>Use Roupas Leves:</strong> Prefira roupas leves, folgadas e de cores claras.</li>
          <li><strong>Evite Exposição Direta ao Sol:</strong> Permaneça na sombra, especialmente entre 10h e 16h.</li>
          <li><strong>Tome Banhos Frios:</strong> Banhos ou duchas frias podem ajudar a baixar a temperatura corporal.</li>
          <li><strong>Modere a Atividade Física:</strong> Evite exercícios intensos nos horários mais quentes do dia. Se for se exercitar, faça-o nas primeiras horas da manhã ou à noite.</li>
          <li><strong>Atenção aos Sinais do Corpo:</strong> Ao sentir tonturas, náuseas, dor de cabeça ou cansaço excessivo, procure um local fresco, hidrate-se e, se os sintomas persistirem, procure atendimento médico.</li>
          <li><strong>Ofereça Ajuda:</strong> Verifique idosos, crianças e vizinhos vulneráveis. Certifique-se de que estão se hidratando e se mantendo frescos.</li>
        </ul>
        <p class="mt-6">Estar ciente dos riscos e saber como se proteger é crucial para enfrentar as ondas de calor de forma segura. Compartilhe essas dicas para ajudar a proteger a todos!</p>
      `,
    },
    'comunidade-resiliente-echo': {
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
        <h2>O Papel da Tecnologia na Resiliência</h2>
        <p>A tecnologia moderna oferece ferramentas poderosas para a gestão de desastres e a construção de resiliência. O Echo Report integra diversas funcionalidades que facilitam a comunicação e a coordenação durante crises:</p>
        <ul>
          <li><strong>Mapeamento de Riscos em Tempo Real:</strong> Utiliza dados georreferenciados para identificar áreas de risco e visualizar a progressão de eventos climáticos.</li>
          <li><strong>Alertas Personalizados:</strong> Envia notificações para usuários em zonas afetadas, informando sobre perigos iminentes e medidas de segurança.</li>
          <li><strong>Relatórios de Cidadãos:</strong> Permite que os usuários enviem fotos, vídeos e descrições de incidentes, criando um panorama em tempo real da situação no terreno.</li>
          <li><strong>Recursos e Abrigos:</strong> Apresenta um mapa interativo com a localização de abrigos, pontos de distribuição de ajuda e outros recursos essenciais.</li>
          <li><strong>Comunicação Simplificada:</strong> Facilita a comunicação entre cidadãos, equipes de emergência e órgãos governamentais, garantindo que as informações cheguem às pessoas certas no momento certo.</li>
          <li><strong>Voluntariado Organizado:</strong> Conecta voluntários com necessidades específicas de ajuda, otimizando a resposta a emergências.</li>
        </ul>
  
        <h2>Colaboração Cidadã: O Coração do Echo Report</h2>
        <p>Enquanto a tecnologia fornece a estrutura, a colaboração cidadã é o motor da resiliência. O Echo Report empodera os indivíduos para serem agentes ativos na segurança de suas comunidades:</p>
        <ul>
          <li><strong>Voluntariado Organizado:</strong> Conecta voluntários com necessidades específicas de ajuda, otimizando a resposta a emergências.</li>
          <li><strong>Compartilhamento de Conhecimento:</strong> Plataforma para que os cidadãos compartilhem dicas de segurança, melhores práticas e informações locais relevantes.</li>
          <li><strong>Vigilância Comunitária:</strong> Os próprios moradores se tornam os olhos e ouvidos da comunidade, reportando rapidamente anomalias e perigos.</li>
          <li><strong>Redes de Apoio Mútuo:</strong> Facilita a criação de redes de apoio onde vizinhos podem ajudar uns aos outros em momentos de necessidade.</li>
        </ul>
  
        <h2>Benefícios de uma Comunidade Resiliente com o Echo Report</h2>
        <p>A integração de tecnologia e colaboração através do Echo Report traz benefícios tangíveis:</p>
        <ul>
          <li><strong>Redução de Danos:</strong> Ações preventivas e respostas rápidas minimizam perdas materiais e humanas.</li>
          <li><strong>Maior Autonomia:</strong> As comunidades se tornam menos dependentes de ajuda externa imediata, agindo de forma mais autônoma.</li>
          <li><strong>Fortalecimento dos Laços Sociais:</strong> A colaboração em momentos de crise fortalece o senso de comunidade e solidariedade.</li>
          <li><strong>Resposta Mais Eficaz:</strong> Informações em tempo real e coordenação aprimorada levam a uma resposta mais ágil e eficiente dos serviços de emergência.</li>
          <li><strong>Educação e Conscientização:</strong> A plataforma serve como um centro de recursos para educar os cidadãos sobre preparação para desastres.</li>
        </ul>
        <p class="mt-6">O Echo Report não é apenas uma ferramenta; é um movimento em direção a comunidades mais seguras, informadas e conectadas. Ao unir tecnologia e o poder da colaboração humana, estamos construindo um futuro mais resiliente para todos.</p>
      `,
    },
  };