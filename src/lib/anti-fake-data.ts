export interface DebunkedHoax {
  id: string;
  category: 'urnas' | 'regras' | 'biometria' | 'ia_deepfake' | 'pesquisas' | 'propostas';
  category_label: string;
  hoax_claim: string;
  official_fact: string;
  verdict: 'FALSO' | 'MANIPULAÇÃO' | 'CRIME ELEITORAL' | 'DESCONTEXTUALIZADO';
  legal_basis: string;
  authority: string;
  evidence_summary: string;
  source_url: string;
  published_at: string;
  keywords: string[];
}

export const debunkedHoaxes: DebunkedHoax[] = [
  {
    id: 'fake-01',
    category: 'urnas',
    category_label: '🗳️ Urnas & Apuração',
    hoax_claim: 'As urnas eletrônicas são conectadas à internet ou possuem redes sem fio ocultas para alterar votos remotamente.',
    official_fact: 'A urna eletrônica brasileira é um equipamento 100% offline e isolado. Não possui componentes de Wi-Fi, Bluetooth, modem ou placas de rede.',
    verdict: 'FALSO',
    legal_basis: 'Resolução TSE nº 23.673/2021 e Teste Público de Segurança (TPS)',
    authority: 'Tribunal Superior Eleitoral / Perícia da Polícia Federal',
    evidence_summary: 'Em mais de 25 anos de uso e após dezenas de auditorias da Polícia Federal, Forças Armadas, OAB e Universidades (USP, Unicamp), nenhuma conexão de rede externa foi encontrada. A totalização é transmitida exclusivamente por rede privativa fechada e criptografada.',
    source_url: 'https://www.tse.jus.br/comunicacao/noticias/2024/Marco/fato-ou-boato-urna-eletronica-nao-e-conectada-a-internet',
    published_at: '2026-09-10',
    keywords: ['urna', 'internet', 'rede', 'wi-fi', 'bluetooth', 'hackeamento', 'fraude', 'remoto', 'invasao']
  },
  {
    id: 'fake-02',
    category: 'regras',
    category_label: '📜 Regras de Votação',
    hoax_claim: 'Se mais de 50% dos eleitores votarem nulo ou em branco, a eleição é anulada e nova votação deve ser feita sem os mesmos candidatos.',
    official_fact: 'Votos nulos e em branco NÃO anulam a eleição, independentemente do percentual. Apenas votos válidos (nominais e de legenda) são computados.',
    verdict: 'FALSO',
    legal_basis: 'Constituição Federal de 1988, Art. 77, § 2º; Código Eleitoral (Lei 4.737/65, Art. 211)',
    authority: 'Supremo Tribunal Federal e Justiça Eleitoral',
    evidence_summary: 'O artigo 77, § 2º da Carta Magna determina expressamente que é eleito o candidato que obtiver a maioria dos votos válidos, excluídos expressamente os votos em branco e os nulos. Votar nulo funciona apenas como manifestação de descontentamento.',
    source_url: 'https://www.tse.jus.br/comunicacao/noticias/2024/Julho/fato-ou-boato-votos-nulos-nao-anulam-eleicao',
    published_at: '2026-09-12',
    keywords: ['nulo', 'branco', 'anula eleicao', 'anulacao', '50%', 'cinquenta por cento', 'segundo turno', 'protesto']
  },
  {
    id: 'fake-03',
    category: 'ia_deepfake',
    category_label: '🤖 IA & Deepfakes',
    hoax_claim: 'Candidatos e cabos eleitorais podem usar inteligência artificial para clonar a voz ou criar vídeos artificiais de rivais sem aviso prévio.',
    official_fact: 'O uso de deepfakes na propaganda eleitoral é expressamente proibido e pode gerar cassação imediata do registro ou do mandato do candidato.',
    verdict: 'CRIME ELEITORAL',
    legal_basis: 'Resolução TSE nº 23.732/2024, Art. 9º-B',
    authority: 'Plenário do Tribunal Superior Eleitoral',
    evidence_summary: 'A regulamentação do TSE de 2024 veda totalmente o uso de conteúdo fabricado que altere o teor ou contexto de falas de pessoas vivas ou falecidas para prejudicar candidaturas. Todo conteúdo criado por IA deve trazer selo de aviso obrigatório e transparente.',
    source_url: 'https://www.tse.jus.br/comunicacao/noticias/2024/Fevereiro/tse-aprova-resolucoes-historicas-sobre-ia-nas-eleicoes',
    published_at: '2026-09-14',
    keywords: ['deepfake', 'inteligencia artificial', 'ia', 'clone', 'voz falsa', 'video falso', 'audio vazado', 'manipulacao']
  },
  {
    id: 'fake-04',
    category: 'biometria',
    category_label: '👤 Biometria & Título',
    hoax_claim: 'Eleitor sem biometria cadastrada terá o CPF cancelado, perderá a aposentadoria do INSS e será impedido de votar.',
    official_fact: 'A falta de biometria NÃO cancela o CPF nem benefícios do INSS ou Bolsa Família. O eleitor pode votar normalmente apresentando documento oficial com foto.',
    verdict: 'FALSO',
    legal_basis: 'Resolução TSE nº 23.736/2024, Art. 115',
    authority: 'Justiça Eleitoral / Receita Federal do Brasil',
    evidence_summary: 'Eleitores cujo título esteja em situação regular, mesmo sem a coleta biométrica cadastrada, votam mediante exibição de documento com foto (RG, CNH, carteira de trabalho, passaporte ou e-Título com foto já habilitada).',
    source_url: 'https://www.tse.jus.br/servicos-eleitorais/biometria',
    published_at: '2026-09-15',
    keywords: ['biometria', 'cpf', 'inss', 'aposentadoria', 'cancelado', 'bolsa familia', 'bloqueio', 'documento']
  },
  {
    id: 'fake-05',
    category: 'pesquisas',
    category_label: '📊 Pesquisas Eleitorais',
    hoax_claim: 'Qualquer grupo ou canal de mensagem pode publicar enquetes e pesquisas de intenção de voto sem registro prévio.',
    official_fact: 'Divulgar pesquisas eleitorais sem prévio registro no sistema PesqEle da Justiça Eleitoral é crime punível com multa pesada de até R$ 106 mil.',
    verdict: 'CRIME ELEITORAL',
    legal_basis: 'Lei das Eleições (Lei 9.504/1997, Art. 33, § 3º) e Resolução TSE nº 23.600/2019',
    authority: 'Ministério Público Eleitoral e Tribunais Regionais Eleitorais',
    evidence_summary: 'Desde 1º de janeiro do ano eleitoral, toda entidade ou empresa que realizar pesquisas de opinião pública relativas às eleições para divulgação é obrigada a registrá-la no TSE com antecedência mínima de 5 dias.',
    source_url: 'https://www.tse.jus.br/eleicoes/pesquisa-eleitorais/pesqele-divulgacao-publica',
    published_at: '2026-09-16',
    keywords: ['pesquisa', 'pesqele', 'enquete', 'multa', 'falsa', 'registro', 'whatsapp', 'telegram', 'datafolha', 'quaest']
  },
  {
    id: 'fake-06',
    category: 'propostas',
    category_label: '📑 Planos de Governo',
    hoax_claim: 'Imagens que circulam em redes sociais afirmando que candidato vai fechar igrejas ou tributar poupança são oficiais.',
    official_fact: 'Trata-se de montagem fraudulenta recorrente. Apenas o Plano de Governo protocolado oficialmente na Justiça Eleitoral possui validade jurídica.',
    verdict: 'MANIPULAÇÃO',
    legal_basis: 'Lei nº 9.504/1997, Art. 11, § 1º, inciso IX',
    authority: 'Tribunal Superior Eleitoral (DivulgaCandContas)',
    evidence_summary: 'O portal Voto Aberto transcreve literalmente as diretrizes protocoladas na Justiça Eleitoral com indicação da página exata do PDF arquivado. Propostas não encontradas nos documentos oficiais representam boatos apócrifos.',
    source_url: 'https://divulgacandcontas.tse.jus.br',
    published_at: '2026-09-16',
    keywords: ['plano de governo', 'igrejas', 'poupanca', 'fechar', 'imposto', 'proposta falsa', 'panfleto', 'montagem']
  }
]
