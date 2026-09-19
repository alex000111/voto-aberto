export interface ProposalItem {
  id: string;
  candidate_id: string;
  candidate_name: string;
  office: string;
  party: string;
  uf: string;
  topic: string;
  summary_bullets: string[];
  excerpt: string;
  document_url: string;
  page_number: number;
  reviewed_at: string;
}

export const detailedProposals: ProposalItem[] = [
  {
    id: 'prop-raquel-edu',
    candidate_id: 'cand-pe-gov-01',
    candidate_name: 'Raquel Lyra',
    office: 'GOVERNADOR',
    party: 'PSDB',
    uf: 'PE',
    topic: 'Educação',
    summary_bullets: [
      'Expansão do modelo de Escolas em Tempo Integral para municípios do Agreste e Sertão.',
      'Reestruturação do plano de cargos e valorização remuneratória da carreira docente.',
      'Conectividade e laboratórios de tecnologia nas escolas da rede estadual.'
    ],
    excerpt: 'Ampliação do programa de escolas em tempo integral no interior, reestruturação da carreira docente e modernização da infraestrutura digital e laboratórios pedagógicos nas unidades de ensino.',
    document_url: 'https://divulgacandcontas.tse.jus.br',
    page_number: 12,
    reviewed_at: '2026-09-10T12:00:00Z'
  },
  {
    id: 'prop-joao-edu',
    candidate_id: 'cand-pe-gov-02',
    candidate_name: 'João Campos',
    office: 'GOVERNADOR',
    party: 'PSB',
    uf: 'PE',
    topic: 'Educação',
    summary_bullets: [
      'Pacto Estadual pela alfabetização de 100% das crianças na idade certa.',
      'Apoio técnico e financeiro aos municípios na abertura de vagas de creches.',
      'Integração do ensino médio com formação profissional orientada ao mercado de trabalho.'
    ],
    excerpt: 'Fortalecimento do pacto pela alfabetização na idade certa em parceria com todas as redes municipais, cofinanciamento para abertura de creches e expansão das Escolas Técnicas Estaduais.',
    document_url: 'https://divulgacandcontas.tse.jus.br',
    page_number: 16,
    reviewed_at: '2026-09-10T14:00:00Z'
  },
  {
    id: 'prop-raquel-sau',
    candidate_id: 'cand-pe-gov-01',
    candidate_name: 'Raquel Lyra',
    office: 'GOVERNADOR',
    party: 'PSDB',
    uf: 'PE',
    topic: 'Saúde',
    summary_bullets: [
      'Reforma estrutural dos grandes hospitais estaduais (HR, Agamenon Magalhães, Otávio de Freitas).',
      'Descentralização de exames e consultas de média complexidade para o interior.',
      'Ampliação de leitos de retaguarda para desafogar emergências.'
    ],
    excerpt: 'Reforma e modernização dos grandes hospitais estaduais da RMR, expansão das unidades de diagnóstico descentralizadas e ampliação de leitos de retaguarda para desafogar as emergências superlotadas.',
    document_url: 'https://divulgacandcontas.tse.jus.br',
    page_number: 19,
    reviewed_at: '2026-09-11T10:00:00Z'
  },
  {
    id: 'prop-joao-sau',
    candidate_id: 'cand-pe-gov-02',
    candidate_name: 'João Campos',
    office: 'GOVERNADOR',
    party: 'PSB',
    uf: 'PE',
    topic: 'Saúde',
    summary_bullets: [
      'Prontuário eletrônico unificado e aplicativo estadual para marcação de consultas.',
      'Cofinanciamento estadual da Atenção Básica nos municípios mais vulneráveis.',
      'Centros de especialidades médicas com telemedicina interligada ao SUS.'
    ],
    excerpt: 'Integração digital do prontuário do paciente em toda a rede SUS, criação de centros regionais de especialidades com telemedicina e reforço no repasse financeiro para postos de saúde municipais.',
    document_url: 'https://divulgacandcontas.tse.jus.br',
    page_number: 24,
    reviewed_at: '2026-09-11T15:00:00Z'
  },
  {
    id: 'prop-raquel-mob',
    candidate_id: 'cand-pe-gov-01',
    candidate_name: 'Raquel Lyra',
    office: 'GOVERNADOR',
    party: 'PSDB',
    uf: 'PE',
    topic: 'Mobilidade Urbana',
    summary_bullets: [
      'Pavimentação e recuperação de rodovias estaduais de escoamento e transporte.',
      'Requalificação de eixos viários estruturadores na Região Metropolitana.',
      'Estudos para modelagem de parcerias na melhoria da infraestrutura viária.'
    ],
    excerpt: 'Retomada das obras viárias estruturadoras nas rodovias estaduais (PE-015, PE-060 e arcos metropolitanos) e requalificação dos eixos de integração entre a capital e o interior.',
    document_url: 'https://divulgacandcontas.tse.jus.br',
    page_number: 28,
    reviewed_at: '2026-09-12T11:00:00Z'
  },
  {
    id: 'prop-joao-mob',
    candidate_id: 'cand-pe-gov-02',
    candidate_name: 'João Campos',
    office: 'GOVERNADOR',
    party: 'PSB',
    uf: 'PE',
    topic: 'Mobilidade Urbana',
    summary_bullets: [
      'Unificação tarifária com bilhete único metropolitano.',
      'Eletrificação gradual da frota de ônibus e incentivo a corredores BRT.',
      'Articulação junto ao Governo Federal pela renovação e investimentos no Metrô do Recife.'
    ],
    excerpt: 'Implantação de tarifa integrada metropolitana, eletrificação progressiva da frota de transporte coletivo e articulação federativa prioritária para revitalização do sistema metroviário do Recife.',
    document_url: 'https://divulgacandcontas.tse.jus.br',
    page_number: 31,
    reviewed_at: '2026-09-12T16:00:00Z'
  },
  {
    id: 'prop-lula-edu',
    candidate_id: 'cand-br-pres-01',
    candidate_name: 'Luiz Inácio Lula da Silva',
    office: 'PRESIDENTE',
    party: 'PT',
    uf: 'BR',
    topic: 'Educação',
    summary_bullets: [
      'Consolidação do Programa Pé-de-Meia para permanência de estudantes no ensino médio.',
      'Abertura de 100 novos campi de Institutos Federais (IFs) em todo o país.',
      'Reajuste e expansão das bolsas de pós-graduação e assistência estudantil universitária.'
    ],
    excerpt: 'Consolidação e expansão das bolsas permanência nas universidades federais, ampliação dos institutos federais de educação e fortalecimento do programa nacional de incentivo financeiro ao ensino médio.',
    document_url: 'https://divulgacandcontas.tse.jus.br',
    page_number: 14,
    reviewed_at: '2026-09-13T10:00:00Z'
  },
  {
    id: 'prop-tarcisio-edu',
    candidate_id: 'cand-br-pres-02',
    candidate_name: 'Tarcísio de Freitas',
    office: 'PRESIDENTE',
    party: 'Republicanos',
    uf: 'BR',
    topic: 'Educação',
    summary_bullets: [
      'Foco prioritário em alfabetização e formação técnica profissionalizante ligada à indústria.',
      'Incentivo a parcerias público-privadas para gestão de infraestrutura escolar.',
      'Mecanismos de bonificação por metas de desempenho escolar e eficiência pedagógica.'
    ],
    excerpt: 'Foco no ensino fundamental e técnico profissionalizante articulado às cadeias de alta tecnologia, incentivo ao modelo de parcerias para infraestrutura escolar e meritocracia com metas de aprendizagem.',
    document_url: 'https://divulgacandcontas.tse.jus.br',
    page_number: 21,
    reviewed_at: '2026-09-13T14:00:00Z'
  },
  {
    id: 'prop-raquel-seg',
    candidate_id: 'cand-pe-gov-01',
    candidate_name: 'Raquel Lyra',
    office: 'GOVERNADOR',
    party: 'PSDB',
    uf: 'PE',
    topic: 'Segurança Cidadã',
    summary_bullets: [
      'Recomposição dos quadros das polícias Militar, Civil e Científica por concursos regulares.',
      'Integração de câmeras e inteligência analítica de monitoramento nas regiões com maior criminalidade.',
      'Apoio e acolhimento especializado às mulheres vítimas de violência.'
    ],
    excerpt: 'Fortalecimento do programa estadual de segurança com novos concursos públicos periódicos, centros integrados de inteligência policial e implantação de delegacias especializadas com atendimento ininterrupto.',
    document_url: 'https://divulgacandcontas.tse.jus.br',
    page_number: 35,
    reviewed_at: '2026-09-14T09:00:00Z'
  },
  {
    id: 'prop-joao-seg',
    candidate_id: 'cand-pe-gov-02',
    candidate_name: 'João Campos',
    office: 'GOVERNADOR',
    party: 'PSB',
    uf: 'PE',
    topic: 'Segurança Cidadã',
    summary_bullets: [
      'Políticas urbanas de prevenção focadas na juventude em bairros vulneráveis.',
      'Cofinanciamento estadual para estruturação e armamento regulado de guardas municipais.',
      'Iluminação pública em LED e urbanismo social para ocupação de espaços públicos à noite.'
    ],
    excerpt: 'Articulação entre prevenção social nos territórios periféricos, fomento ao programa de iluminação e apoio técnico às guardas municipais para atuação comunitária integrada às forças de segurança estaduais.',
    document_url: 'https://divulgacandcontas.tse.jus.br',
    page_number: 38,
    reviewed_at: '2026-09-14T11:30:00Z'
  },
  {
    id: 'prop-jones-edu',
    candidate_id: '170002550641',
    candidate_name: 'Jones Manoel',
    office: 'DEPUTADO FEDERAL',
    party: 'PSOL',
    uf: 'PE',
    topic: 'Educação',
    summary_bullets: [
      'Revogação integral da reforma do Novo Ensino Médio em nível federal.',
      'Elevação dos investimentos públicos em educação para o patamar de 10% do PIB nacional.',
      'Fortalecimento e expansão da rede federal (IFPE e UFRPE) com garantia de assistência estudantil e moradia universitária.'
    ],
    excerpt: 'Revogação integral do Novo Ensino Médio, destinação de 10% do PIB para a educação pública e valorização do piso salarial dos professores com dedicação exclusiva e expansão da assistência estudantil.',
    document_url: 'https://divulgacandcontas.tse.jus.br',
    page_number: 8,
    reviewed_at: '2026-09-14T14:00:00Z'
  },
  {
    id: 'prop-jones-tra',
    candidate_id: '170002550641',
    candidate_name: 'Jones Manoel',
    office: 'DEPUTADO FEDERAL',
    party: 'PSOL',
    uf: 'PE',
    topic: 'Trabalho e Direitos',
    summary_bullets: [
      'Redução da jornada máxima para 30 horas semanais sem corte de salários (pelo fim da escala 6x1).',
      'Revogação das contrarreformas trabalhista (Lei 13.467/17) e previdenciária (EC 103/19).',
      'Regulamentação e direitos plenos aos trabalhadores de plataformas digitais e aplicativos.'
    ],
    excerpt: 'Redução da jornada máxima de trabalho sem redução de salários pelo fim da escala 6x1, revogação das reformas trabalhista e previdenciária e fortalecimento sindical de base.',
    document_url: 'https://divulgacandcontas.tse.jus.br',
    page_number: 14,
    reviewed_at: '2026-09-14T15:00:00Z'
  }
];