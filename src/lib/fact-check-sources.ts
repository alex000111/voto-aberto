export interface PublicFactCheck {
  id: string;
  agency: string;
  claim: string;
  verdict: 'FALSO' | 'ENGANOSO' | 'EXAGERADO' | 'VERDADEIRO' | 'INSUSTENTÁVEL';
  summary: string;
  url: string;
  published_at: string;
  keywords: string[];
}

export const publicFactChecks: PublicFactCheck[] = [
  {
    id: 'fc-01',
    agency: 'TSE Fato ou Boato',
    claim: 'Urnas eletrônicas têm placa de internet secreta para envio clandestino de votos.',
    verdict: 'FALSO',
    summary: 'A urna eletrônica brasileira é um dispositivo estritamente isolado (air-gapped), sem conexão à internet, bluetooth, rádio ou qualquer dispositivo de rede.',
    url: 'https://www.tse.jus.br/comunicacao/noticias/2024/Marco/fato-ou-boato-urna-eletronica-nao-e-conectada-a-internet',
    published_at: '2026-08-20',
    keywords: ['urna', 'internet', 'wi-fi', 'placa', 'chip', 'secreto', 'hackeamento', '5g']
  },
  {
    id: 'fc-02',
    agency: 'Projeto Comprova',
    claim: 'Se mais de 50% dos votos forem nulos, a eleição é cancelada e haverá nova eleição sem os mesmos candidatos.',
    verdict: 'FALSO',
    summary: 'A Constituição Federal de 1988 (Art. 77) estipula que apenas votos válidos elegem candidatos. Votos brancos e nulos são desconsiderados do cálculo.',
    url: 'https://projetocomprova.com.br/publicacoes/votos-nulos-nao-anulam-eleicao/',
    published_at: '2026-07-15',
    keywords: ['voto nulo', 'anula eleicao', '50%', 'cinquenta por cento', 'cancelar eleicao', 'branco']
  },
  {
    id: 'fc-03',
    agency: 'Agência Lupa',
    claim: 'Eleitor sem biometria tem o CPF cancelado e benefício previdenciário do INSS suspenso.',
    verdict: 'FALSO',
    summary: 'A Justiça Eleitoral e o INSS esclarecem que a ausência de cadastro biométrico não afeta CPF, benefícios sociais ou previdenciários.',
    url: 'https://lupa.uol.com.br/jornalismo/2024/05/10/biometria-cpf-inss-eleicoes',
    published_at: '2026-06-25',
    keywords: ['biometria', 'cpf cancelado', 'inss', 'aposentadoria', 'bloqueio', 'beneficio', 'bolsa familia']
  },
  {
    id: 'fc-04',
    agency: 'Aos Fatos',
    claim: 'Áudio vazado em aplicativo de mensagens mostra candidato admitindo plano secreto para extinguir direitos.',
    verdict: 'ENGANOSO',
    summary: 'Perícia concluiu que o áudio foi manipulado por inteligência artificial (clonagem de voz / deepfake), sem qualquer respaldo documental.',
    url: 'https://www.aosfatos.org/noticias/audio-falso-ia-clonagem-voz-candidato/',
    published_at: '2026-09-02',
    keywords: ['audio vazado', 'ia', 'inteligencia artificial', 'deepfake', 'clonagem', 'extinguir direitos', 'whatsapp']
  },
  {
    id: 'fc-05',
    agency: 'G1 Fato ou Fake',
    claim: 'Pesquisa de intenção de voto viralizada em rede social mostra candidato liderando com 80% dos votos.',
    verdict: 'FALSO',
    summary: 'O levantamento não possui registro no sistema PesqEle do TSE, violando a Lei 9.504/97, configurando enquete fraudulenta sem rigor metodológico.',
    url: 'https://g1.globo.com/fato-ou-fake/noticia/2024/09/pesquisa-eleitoral-sem-registro-tse.ghtml',
    published_at: '2026-08-30',
    keywords: ['pesquisa', 'pesqele', 'enquete', 'sem registro', '80%', 'lideranca falsa', 'datafolha fake']
  },
  {
    id: 'fc-06',
    agency: 'UOL Confere',
    claim: 'Santinho digital compartilhado altera o número de urna do candidato para anular o voto do eleitor.',
    verdict: 'ENGANOSO',
    summary: 'Circulam nas redes cards e santinhos adulterados com números trocados ou inexistentes, prática tipificada como crime de desinformação eleitoral (Art. 323 do Código Eleitoral).',
    url: 'https://noticias.uol.com.br/eleicoes/ultimas-noticias/2024/10/santinho-falso-numero-trocado-tse.htm',
    published_at: '2026-09-05',
    keywords: ['santinho', 'numero trocado', 'numero falso', 'anular voto', 'propaganda falsa', 'card']
  },
  {
    id: 'fc-07',
    agency: 'Estadão Verifica',
    claim: 'Cédula ou comprovante de votação deve ser impresso para o eleitor levar para casa.',
    verdict: 'FALSO',
    summary: 'O voto no Brasil é secreto por determinação constitucional (Art. 14 da CF/88). Qualquer comprovante individual violaria o sigilo e facilitaria compra de votos.',
    url: 'https://www.estadao.com.br/politica/estadao-verifica/comprovante-impresso-voto-sigilo/',
    published_at: '2026-08-11',
    keywords: ['voto impresso', 'recibo', 'levar para casa', 'comprovante', 'sigilo do voto']
  }
];
