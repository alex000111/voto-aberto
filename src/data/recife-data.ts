export interface Indicator {
  id: string;
  topic: string;
  metric: string;
  value: string;
  context: string;
  source: string;
  sourceUrl: string;
  year: number;
}

export interface CompetencyRule {
  topic: string;
  municipalRole: string;
  stateRole: string;
  federalRole: string;
  legalBasis: string;
}

export interface RecifeTopicDetail {
  slug: string;
  title: string;
  description: string;
  indicators: Indicator[];
  competency: CompetencyRule;
  keyQuestions: string[];
}

export const recifeTopics: RecifeTopicDetail[] = [
  {
    slug: 'mobilidade',
    title: 'Mobilidade Urbana',
    description: 'Deslocamentos metropolitanos, gestão do trânsito, calçadas e integração com transporte público coletivo.',
    indicators: [
      {
        id: 'rec-mob-1',
        topic: 'Mobilidade Urbana',
        metric: 'Tempo médio de deslocamento diário',
        value: '96 min',
        context: 'Tempo médio diário gasto no trânsito na Região Metropolitana do Recife.',
        source: 'Ipea / Relatório de Mobilidade Urbana',
        sourceUrl: 'https://www.ipea.gov.br',
        year: 2024
      },
      {
        id: 'rec-mob-2',
        topic: 'Mobilidade Urbana',
        metric: 'Frota total de veículos registrados',
        value: '~730 mil',
        context: 'Veículos automotores licenciados no município do Recife.',
        source: 'Senatran / Detran-PE',
        sourceUrl: 'https://www.gov.br/transportes/pt-br/assuntos/transito/senatran',
        year: 2025
      },
      {
        id: 'rec-mob-3',
        topic: 'Mobilidade Urbana',
        metric: 'Malha cicloviária implantada',
        value: '185 km',
        context: 'Rotas cicláveis e ciclofaixas permanentes ou operacionais.',
        source: 'CTTU / Prefeitura do Recife',
        sourceUrl: 'https://cttu.recife.pe.gov.br',
        year: 2025
      }
    ],
    competency: {
      topic: 'Mobilidade Urbana',
      municipalRole: 'Gestão do trânsito viário, fiscalização, engenharia de tráfego (CTTU), ciclovias, calçadas e vias municipais.',
      stateRole: 'Gestão das linhas intermunicipais de ônibus e BRT (Consórcio Grande Recife) e rodovias estaduais.',
      federalRole: 'Metrô do Recife (CBTU), rodovias federais (BR-101, BR-232, BR-408) e financiamento de grandes obras de infraestrutura.',
      legalBasis: 'CF/88, Art. 30, incisos I e V; Lei Federal 12.587/2012 (Política Nacional de Mobilidade Urbana).'
    },
    keyQuestions: [
      'A proposta aborda vias locais (Prefeitura) ou o transporte metropolitano e metrô (Estado/União)?',
      'Há metas de priorização do transporte coletivo e segurança do pedestre com previsão orçamentária clara?'
    ]
  },
  {
    slug: 'saude',
    title: 'Saúde Pública',
    description: 'Atenção primária (postos de saúde e equipes de saúde da família), policlínicas e regulação com a rede hospitalar estadual.',
    indicators: [
      {
        id: 'rec-sau-1',
        topic: 'Saúde Pública',
        metric: 'Cobertura da Atenção Primária à Saúde',
        value: '67,4%',
        context: 'Percentual da população coberta por equipes de Saúde da Família e Atenção Primária cadastradas.',
        source: 'Ministério da Saúde / e-Gestor AB',
        sourceUrl: 'https://egestorab.saude.gov.br',
        year: 2025
      },
      {
        id: 'rec-sau-2',
        topic: 'Saúde Pública',
        metric: 'Unidades Básicas e Policlínicas municipais',
        value: '148 unidades',
        context: 'Rede pública municipal de atenção básica e especializada ambulatorial.',
        source: 'Secretaria de Saúde do Recife / CNES',
        sourceUrl: 'http://cnes.datasus.gov.br',
        year: 2025
      }
    ],
    competency: {
      topic: 'Saúde Pública',
      municipalRole: 'Atenção Básica (UBS/USF), vacinação, agentes comunitários de saúde e atendimento ambulatorial inicial.',
      stateRole: 'Hospitais de média e alta complexidade (HR, Getúlio Vargas, Agamenon Magalhães, Otávio de Freitas) e regulação de leitos.',
      federalRole: 'Repasses do SUS (Fundo Nacional de Saúde), vigilância sanitária nacional e programas estratégicos federais.',
      legalBasis: 'CF/88, Art. 30, inciso VII e Art. 198; Lei Federal 8.080/1990 (Lei Orgânica da Saúde).'
    },
    keyQuestions: [
      'A candidatura propõe abrir leitos de UTI (competência estadual) ou fortalecer postos de saúde (competência municipal)?',
      'Existe detalhamento de como será feita a integração da fila de consultas com o sistema de regulação estadual?'
    ]
  },
  {
    slug: 'educacao',
    title: 'Educação Básica',
    description: 'Creches, pré-escola e anos iniciais e finais do ensino fundamental.',
    indicators: [
      {
        id: 'rec-edu-1',
        topic: 'Educação Básica',
        metric: 'IDEB — Ensino Fundamental (Anos Iniciais)',
        value: '5,8',
        context: 'Índice de Desenvolvimento da Educação Básica na rede pública municipal (meta 6,0).',
        source: 'INEP / MEC',
        sourceUrl: 'https://www.gov.br/inep/pt-br',
        year: 2023
      },
      {
        id: 'rec-edu-2',
        topic: 'Educação Básica',
        metric: 'IDEB — Ensino Fundamental (Anos Finais)',
        value: '4,9',
        context: 'Índice de Desenvolvimento da Educação Básica na rede pública municipal (meta 5,4).',
        source: 'INEP / MEC',
        sourceUrl: 'https://www.gov.br/inep/pt-br',
        year: 2023
      }
    ],
    competency: {
      topic: 'Educação Básica',
      municipalRole: 'Educação Infantil (creches e pré-escola) e Ensino Fundamental (1º ao 9º ano).',
      stateRole: 'Ensino Médio e escolas técnicas estaduais (ETEs).',
      federalRole: 'Ensino Superior (universidades federais como UFPE, UFRPE) e Institutos Federais (IFPE).',
      legalBasis: 'CF/88, Art. 30, inciso VI e Art. 211; Lei Federal 9.394/1996 (LDB).'
    },
    keyQuestions: [
      'A proposta para creches e escolas foca no público infantil (Prefeitura) ou em ensino médio/superior (outras esferas)?',
      'Como a proposta pretende garantir vagas de tempo integral mantendo o custeio pelo Fundeb?'
    ]
  },
  {
    slug: 'saneamento',
    title: 'Saneamento e Habitação',
    description: 'Abastecimento de água, esgotamento sanitário, drenagem em morros e regularização fundiária.',
    indicators: [
      {
        id: 'rec-san-1',
        topic: 'Saneamento e Habitação',
        metric: 'Atendimento com esgotamento sanitário',
        value: '46,8%',
        context: 'Percentual da população urbana atendida com rede de coleta e tratamento de esgoto.',
        source: 'SNIS — Sistema Nacional de Informações sobre Saneamento',
        sourceUrl: 'https://www.gov.br/cidades/pt-br/acesso-a-informacao/acoes-e-programas/saneamento/snis',
        year: 2024
      },
      {
        id: 'rec-san-2',
        topic: 'Saneamento e Habitação',
        metric: 'População residente em áreas de encosta/risco',
        value: '> 400 mil hab',
        context: 'Estimativa de moradores em relevo acidentado (morros das Zonas Norte e Sul).',
        source: 'Defesa Civil do Recife / IBGE Censo',
        sourceUrl: 'https://www.ibge.gov.br',
        year: 2023
      }
    ],
    competency: {
      topic: 'Saneamento e Habitação',
      municipalRole: 'Drenagem urbana, contenção de encostas (geomantas e muros de arrimo), Defesa Civil local e plano diretor/ZEIS.',
      stateRole: 'Concessão de serviços de água e esgoto (atualmente operados pela Compesa / parceria público-privada).',
      federalRole: 'Recursos do Fundo Nacional de Habitação de Interesse Social (FNHIS), PAC e programas habitacionais federais.',
      legalBasis: 'CF/88, Art. 30, inciso VIII; Lei Federal 11.445/2007 e Marco Legal do Saneamento (Lei 14.026/2020).'
    },
    keyQuestions: [
      'A proposta para água e esgoto reconhece a atuação da Compesa/concessão estadual ou trata como se fosse autarquia municipal?',
      'Quais medidas práticas de contenção de barreiras e obras de drenagem contam com fonte orçamentária própria?'
    ]
  },
  {
    slug: 'seguranca',
    title: 'Segurança Cidadã',
    description: 'Prevenção à violência, iluminação pública, ocupação de espaços públicos e Guarda Municipal.',
    indicators: [
      {
        id: 'rec-seg-1',
        topic: 'Segurança Cidadã',
        metric: 'Taxa de CVLI no município',
        value: '31,8 por 100 mil hab',
        context: 'Crimes Violentos Letais Intencionais registrados na capital pernambucana.',
        source: 'Secretaria de Defesa Social de Pernambuco (SDS-PE)',
        sourceUrl: 'https://www.sds.pe.gov.br',
        year: 2024
      }
    ],
    competency: {
      topic: 'Segurança Cidadã',
      municipalRole: 'Guarda Municipal (patrimonial e comunitária), iluminação pública, urbanismo e prevenção primária à violência.',
      stateRole: 'Policiamento ostensivo (Polícia Militar), investigação de crimes (Polícia Civil) e sistema prisional.',
      federalRole: 'Polícia Federal, Polícia Rodoviária Federal e Força Nacional.',
      legalBasis: 'CF/88, Art. 144, § 8º; Lei Federal 13.022/2014 (Estatuto Geral das Guardas Municipais).'
    },
    keyQuestions: [
      'A proposta respeita os limites legais de atuação da Guarda Municipal e foca na prevenção urbana?',
      'Existe articulação comprovada com o planejamento de segurança pública do Estado de Pernambuco?'
    ]
  },
  {
    slug: 'economia',
    title: 'Emprego, Renda e Inovação',
    description: 'Polo de tecnologia (Porto Digital), setor de serviços, comércio e qualificação profissional.',
    indicators: [
      {
        id: 'rec-eco-1',
        topic: 'Emprego, Renda e Inovação',
        metric: 'PIB Municipal',
        value: 'R$ 54,9 bilhões',
        context: 'Maior PIB da Região Metropolitana do Recife, fortemente baseado em serviços, tecnologia e saúde.',
        source: 'IBGE — Contas Regionais',
        sourceUrl: 'https://www.ibge.gov.br',
        year: 2023
      },
      {
        id: 'rec-eco-2',
        topic: 'Emprego, Renda e Inovação',
        metric: 'Empresas no ecossistema de tecnologia',
        value: '> 360 empresas',
        context: 'Empresas de tecnologia e economia criativa no Porto Digital.',
        source: 'Porto Digital / Relatório de Gestão',
        sourceUrl: 'https://www.portodigital.org',
        year: 2024
      }
    ],
    competency: {
      topic: 'Emprego, Renda e Inovação',
      municipalRole: 'Tributação municipal (ISS, IPTU, ITBI), desburocratização de alvarás e incentivos fiscais locais.',
      stateRole: 'Tributação estadual (ICMS, IPVA), fomento regional (Adepe, Facepe) e ensino técnico profissionalizante.',
      federalRole: 'Regulação do trabalho, impostos federais (IR, IPI, PIS/Cofins) e crédito produtivo (BNB, BNDES, Caixa).',
      legalBasis: 'CF/88, Art. 156 (competência tributária municipal).'
    },
    keyQuestions: [
      'As propostas tributárias prometem mexer em impostos municipais (ISS/IPTU) ou em tributos de competência alheia (ICMS/IR)?',
      'Como a candidatura planeja apoiar a retenção de talentos de tecnologia e formação de jovens da periferia?'
    ]
  }
];