import { dbConfigured, dbSelect } from '@/lib/supabase-rest';

export interface DocumentProposal {
  id: string;
  candidate_id?: string;
  candidate_name?: string;
  office?: string;
  topic: string;
  excerpt: string;
  document_url: string;
  page_number: number | null;
  reviewed_at: string;
  source: string;
}

export const sampleProposals: DocumentProposal[] = [
  {
    id: 'prop-edu-01',
    candidate_name: 'Plano de Governo Registrado — Diretriz A',
    office: 'GOVERNADOR (PE)',
    topic: 'Educação Básica e Técnica',
    excerpt: 'Ampliação da jornada escolar nas escolas de referência e interiorização de polos de ensino técnico integrado às vocações econômicas regionais.',
    document_url: 'https://divulgacandcontas.tse.jus.br',
    page_number: 14,
    reviewed_at: '2026-09-10T12:00:00Z',
    source: 'TSE — DivulgaCandContas'
  },
  {
    id: 'prop-sau-01',
    candidate_name: 'Plano de Governo Registrado — Diretriz B',
    office: 'GOVERNADOR (PE)',
    topic: 'Saúde Pública e Atenção Primária',
    excerpt: 'Fortalecimento da Atenção Básica municipal através de cofinanciamento estadual e unificação digital da fila de consultas especializadas com o sistema de regulação.',
    document_url: 'https://divulgacandcontas.tse.jus.br',
    page_number: 22,
    reviewed_at: '2026-09-12T14:30:00Z',
    source: 'TSE — DivulgaCandContas'
  },
  {
    id: 'prop-mob-01',
    candidate_name: 'Plano de Governo Registrado — Diretriz A',
    office: 'GOVERNADOR (PE)',
    topic: 'Mobilidade Urbana',
    excerpt: 'Reestruturação dos terminais de integração metropolitanos e apoio aos municípios na expansão de faixas exclusivas e pavimentação de corredores de transporte coletivo.',
    document_url: 'https://divulgacandcontas.tse.jus.br',
    page_number: 31,
    reviewed_at: '2026-09-11T10:15:00Z',
    source: 'TSE — DivulgaCandContas'
  },
  {
    id: 'prop-san-01',
    candidate_name: 'Plano de Governo Registrado — Diretriz C',
    office: 'GOVERNADOR (PE)',
    topic: 'Saneamento e Habitação',
    excerpt: 'Meta de universalização da água potável e investimentos prioritários em redes de esgotamento sanitário e drenagem de bacias urbanas vulneráveis a inundações.',
    document_url: 'https://divulgacandcontas.tse.jus.br',
    page_number: 18,
    reviewed_at: '2026-09-13T16:00:00Z',
    source: 'TSE — DivulgaCandContas'
  },
  {
    id: 'prop-seg-01',
    candidate_name: 'Plano de Governo Registrado — Diretriz B',
    office: 'GOVERNADOR (PE)',
    topic: 'Segurança Cidadã',
    excerpt: 'Fortalecimento de inteligência policial, recomposição periódica do efetivo de segurança e programas sociais preventivos em territórios com altos índices de vulnerabilidade juvenil.',
    document_url: 'https://divulgacandcontas.tse.jus.br',
    page_number: 9,
    reviewed_at: '2026-09-14T09:00:00Z',
    source: 'TSE — DivulgaCandContas'
  },
  {
    id: 'prop-eco-01',
    candidate_name: 'Plano de Governo Registrado — Diretriz C',
    office: 'GOVERNADOR (PE)',
    topic: 'Emprego, Renda e Tecnologia',
    excerpt: 'Estímulo a polos tecnológicos e distritos industriais no interior, combinados a linhas de microcrédito e capacitação digital para juventude periférica.',
    document_url: 'https://divulgacandcontas.tse.jus.br',
    page_number: 27,
    reviewed_at: '2026-09-15T11:20:00Z',
    source: 'TSE — DivulgaCandContas'
  }
];

export async function searchDocumentProposals(query: string, topicFilter?: string): Promise<{
  results: DocumentProposal[];
  isLiveDb: boolean;
  total: number;
}> {
  const normalizedQuery = (query || '').trim().toLowerCase();
  const normalizedTopic = (topicFilter || '').trim().toLowerCase();

  if (dbConfigured) {
    try {
      let filter = 'reviewed_at=not.is.null&order=reviewed_at.desc&limit=100';
      if (normalizedTopic) {
        filter += `&topic=ilike.*${encodeURIComponent(normalizedTopic)}*`;
      }
      if (normalizedQuery) {
        filter += `&or=(topic.ilike.*${encodeURIComponent(normalizedQuery)}*,excerpt.ilike.*${encodeURIComponent(normalizedQuery)}*)`;
      }

      const rows = await dbSelect('proposals', filter);
      if (rows && rows.length > 0) {
        return {
          results: rows.map(r => ({
            id: r.id,
            candidate_id: r.candidate_id,
            candidate_name: r.candidate_name || 'Candidatura Registrada',
            office: r.office || 'Cargo em disputa',
            topic: r.topic,
            excerpt: r.excerpt || '',
            document_url: r.document_url,
            page_number: r.page_number,
            reviewed_at: r.reviewed_at,
            source: 'Supabase / TSE'
          })),
          isLiveDb: true,
          total: rows.length
        };
      }
    } catch {
      // Falha graciosa para a base de referência local
    }
  }

  // Consulta na base de referência documentada
  const filtered = sampleProposals.filter(p => {
    const matchesTopic = !normalizedTopic || p.topic.toLowerCase().includes(normalizedTopic);
    const matchesQuery = !normalizedQuery ||
      p.topic.toLowerCase().includes(normalizedQuery) ||
      p.excerpt.toLowerCase().includes(normalizedQuery) ||
      (p.candidate_name && p.candidate_name.toLowerCase().includes(normalizedQuery));
    return matchesTopic && matchesQuery;
  });

  return {
    results: filtered,
    isLiveDb: false,
    total: filtered.length
  };
}