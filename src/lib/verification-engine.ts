import { debunkedHoaxes, DebunkedHoax } from './anti-fake-data';
import { publicFactChecks, PublicFactCheck } from './fact-check-sources';
import { dbSelect, isLiveDatabase } from './supabase-rest';
import { localCandidates } from './local-dataset';

export interface ForensicAlert {
  type: 'PANIC_TRIGGER' | 'ANONYMOUS_SOURCE' | 'NUMBER_FRAUD' | 'DEEPFAKE_SUSPECT' | 'UNREGISTERED_POLL' | 'CAPS_LOCK_URGENCY';
  label: string;
  detail: string;
  severity: 'CRITICA' | 'ALTA' | 'MODERADA';
}

export interface CandidateAuditResult {
  name: string;
  office: string;
  party: string | null;
  officialNumber: string | null;
  allegedNumber?: string;
  numberMatches: boolean;
  status: string | null;
  uf: string | null;
  tseLink: string;
}

export interface VerificationReport {
  query: string;
  timestamp: string;
  verdict: 'FALSO' | 'MANIPULAÇÃO' | 'CRIME_ELEITORAL' | 'DESCONTEXTUALIZADO' | 'CONFIRMADO_TSE' | 'SEM_EVIDENCIAS';
  verdictLabel: string;
  verdictDescription: string;
  riskScore: number; // 0 (100% autêntico) a 100 (desinformação extrema)
  confidenceLevel: 'ALTA' | 'MÉDIA' | 'EM_ANÁLISE';
  summary: string;
  matchedCandidates: CandidateAuditResult[];
  matchedHoaxes: DebunkedHoax[];
  matchedFactChecks: PublicFactCheck[];
  forensicAlerts: ForensicAlert[];
  whatsappDebunkMessage: string;
}

// Extrai números que podem ser de urna (2, 3, 4 ou 5 dígitos), excluindo anos e números comuns
export function extractElectoralNumbers(text: string): string[] {
  const matches = text.match(/\b\d{2,5}\b/g) || [];
  const ignoredNumbers = new Set(['2024', '2025', '2026', '2022', '1988', '1997', '1491', '100', '50', '24', '12', '10', '15', '30']);
  return Array.from(new Set(matches.filter(n => !ignoredNumbers.has(n))));
}

// Analisa padrões forenses de mensagens virais e desinformação
export function detectForensicPatterns(text: string): ForensicAlert[] {
  const alerts: ForensicAlert[] = [];
  const upper = text.toUpperCase();

  // Gatilhos de Pânico e Sensacionalismo
  const panicTriggers = [
    'URGENTE', 'COMPARTILHE ANTES QUE APAGUEM', 'A MÍDIA NÃO MOSTRA',
    'A GLOBO NÃO VAI PASSAR', 'BOMBA', 'REPASSEM PARA TODOS',
    'ATENÇÃO TOTAL', 'CUIDADO ELEITOR', 'ACORDA BRASIL', 'URNA ADULTERADA'
  ];
  const foundPanic = panicTriggers.filter(t => upper.includes(t));
  if (foundPanic.length > 0) {
    alerts.push({
      type: 'PANIC_TRIGGER',
      label: 'Gatilho de Urgência / Pânico Viral',
      detail: `Contém expressões típicas de correntes para induzir compartilhamento sem checagem: "${foundPanic.join('", "')}".`,
      severity: 'ALTA'
    });
  }

  // Fontes anônimas / apócrifas
  const anonTriggers = [
    'AMIGO DO TRIBUNAL', 'FUNCIONÁRIO DO CARTÓRIO', 'MEU PRIMO QUE TRABALHA',
    'FONTE ANÔNIMA', 'DESCOBRIRAM UM ESQUEMA', 'ÁUDIO QUE VAZOU', 'DOCUMENTO SECRETO'
  ];
  const foundAnon = anonTriggers.filter(t => upper.includes(t));
  if (foundAnon.length > 0) {
    alerts.push({
      type: 'ANONYMOUS_SOURCE',
      label: 'Ausência de Fonte Verificável (Alegação Apócrifa)',
      detail: `Afirmações baseadas em supostos informantes ocultos sem protocolo, processo ou identificação oficial: "${foundAnon.join('", "')}".`,
      severity: 'ALTA'
    });
  }

  // Suspeita de Deepfake / IA não rotulada
  const deepfakeTriggers = ['ÁUDIO VAZADO', 'CLONAGEM DE VOZ', 'VÍDEO REVELADOR', 'VOZ DO CANDIDATO', 'CONFISSÃO GRAVADA'];
  if (deepfakeTriggers.some(t => upper.includes(t))) {
    alerts.push({
      type: 'DEEPFAKE_SUSPECT',
      label: 'Sinal de Mídia Sintética / Deepfake Potencial',
      detail: 'Alegações de áudios ou vídeos comprometedores sem contexto institucional. A Resolução TSE nº 23.732/2024 proíbe expressamente deepfakes de candidatos.',
      severity: 'CRITICA'
    });
  }

  // Pesquisas ilegais / sem registro
  if ((upper.includes('PESQUISA') || upper.includes('ENQUETE')) && (upper.includes('80%') || upper.includes('70%') || upper.includes('SECRET') || upper.includes('VIRAL'))) {
    alerts.push({
      type: 'UNREGISTERED_POLL',
      label: 'Pesquisa Sem Registro no PesqEle',
      detail: 'Divulgação de percentuais de intenção de voto sem o número obrigatório de registro no TSE (infração do Art. 33 da Lei 9.504/97 com multa de até R$ 106 mil).',
      severity: 'CRITICA'
    });
  }

  // Caixa alta excessiva
  const alphaChars = text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚãõÃÕâêîôûÂÊÎÔÛçÇ]/g, '');
  if (alphaChars.length >= 40) {
    const uppercaseCount = (alphaChars.match(/[A-ZÁÉÍÓÚÃÕÂÊÎÔÛÇ]/g) || []).length;
    const ratio = uppercaseCount / alphaChars.length;
    if (ratio > 0.45) {
      alerts.push({
        type: 'CAPS_LOCK_URGENCY',
        label: 'Tom Agressivo em Caixa Alta',
        detail: `${Math.round(ratio * 100)}% do texto foi escrito em letras maiúsculas, formatação amplamente utilizada em mensagens fraudulentas para simular gravidade.`,
        severity: 'MODERADA'
      });
    }
  }

  return alerts;
}

// Cruzamento com a base de 20.984 candidatos do TSE
export async function auditCandidatesInText(text: string, allegedNumbers: string[]): Promise<CandidateAuditResult[]> {
  const results: CandidateAuditResult[] = [];
  const normalized = text.toLowerCase();

  // Nomes ou palavras-chave conhecidas para buscar
  const candidateKeyList = [
    'jones manoel', 'lula', 'tarcisio', 'raquel lyra', 'joao campos',
    'pedro campos', 'andre ferreira', 'boulos', 'tabata amaral', 'claudio castro',
    'eduardo leite', 'romeu zema', 'marçal', 'silvio costa'
  ];

  const matchedKeys = candidateKeyList.filter(name => normalized.includes(name));

  // Buscar no banco (ou fallback local)
  for (const name of matchedKeys) {
    let foundCandidates: any[] = [];

    try {
      if (isLiveDatabase) {
        // Busca na tabela candidates do Supabase
        const dbRes = await dbSelect(
          'candidates',
          `ballot_name=ilike.*${encodeURIComponent(name)}*&active=eq.true&limit=5`
        );
        if (Array.isArray(dbRes) && dbRes.length > 0) {
          foundCandidates = dbRes;
        }
      }
    } catch {
      // Silently fall back to local
    }

    if (foundCandidates.length === 0) {
      foundCandidates = localCandidates.filter(c =>
        c.ballot_name.toLowerCase().includes(name) ||
        (c.full_name && c.full_name.toLowerCase().includes(name))
      );
    }

    for (const cand of foundCandidates) {
      // Confere se algum dos números mencionados coincide com o número oficial
      const officialNum = cand.number || '';
      const hasMentionedNumber = allegedNumbers.length > 0;
      const numberMatches = hasMentionedNumber ? allegedNumbers.includes(officialNum) : true;
      const alleged = hasMentionedNumber ? allegedNumbers.find(n => n !== officialNum) : undefined;

      results.push({
        name: cand.ballot_name,
        office: cand.office,
        party: cand.party,
        officialNumber: cand.number,
        allegedNumber: alleged || (numberMatches ? officialNum : allegedNumbers[0]),
        numberMatches: hasMentionedNumber ? numberMatches : true,
        status: cand.registration_status || 'DEFERIDO',
        uf: cand.uf || 'BR',
        tseLink: `https://divulgacandcontas.tse.jus.br/divulga/#/candidato/2026/${cand.uf || 'BR'}/${cand.source_id || cand.id}`
      });
    }
  }

  // Também checa se algum número eleitoral isolado foi citado sem nome
  for (const num of allegedNumbers) {
    if (!results.some(r => r.officialNumber === num)) {
      let candByNumber: any = null;
      if (isLiveDatabase) {
        try {
          const res = await dbSelect('candidates', `number=eq.${encodeURIComponent(num)}&active=eq.true&limit=1`);
          if (Array.isArray(res) && res.length > 0) candByNumber = res[0];
        } catch {
          // fallback
        }
      }
      if (!candByNumber) {
        candByNumber = localCandidates.find(c => c.number === num);
      }
      if (candByNumber) {
        results.push({
          name: candByNumber.ballot_name,
          office: candByNumber.office,
          party: candByNumber.party,
          officialNumber: candByNumber.number,
          allegedNumber: num,
          numberMatches: true,
          status: candByNumber.registration_status || 'DEFERIDO',
          uf: candByNumber.uf || 'BR',
          tseLink: `https://divulgacandcontas.tse.jus.br/divulga/#/candidato/2026/${candByNumber.uf || 'BR'}/${candByNumber.source_id || candByNumber.id}`
        });
      }
    }
  }

  return results;
}

// Gera a resposta empática e fundamentada pronta para colar no WhatsApp
export function generateWhatsAppDebunk(
  text: string,
  verdict: string,
  summary: string,
  hoax?: DebunkedHoax,
  factCheck?: PublicFactCheck,
  candidateAudit?: CandidateAuditResult[]
): string {
  const intro = `*Atenção, pessoal:* Pesquisei sobre essa informação no *Observatório Voto Aberto* e nos dados oficiais da Justiça Eleitoral.\n`;

  let body = '';
  if (verdict === 'FALSO' || verdict === 'CRIME_ELEITORAL') {
    body += `❌ *Essa mensagem NÃO é verdadeira.*\n\n`;
  } else if (verdict === 'MANIPULAÇÃO' || verdict === 'DESCONTEXTUALIZADO') {
    body += `⚠️ *Essa mensagem é ENGANOSA ou está FORA DE CONTEXTO.*\n\n`;
  } else {
    body += `ℹ️ *Resultado da verificação oficial:*\n\n`;
  }

  body += `📌 *O que a checagem aponta:*\n${summary}\n\n`;

  if (candidateAudit && candidateAudit.length > 0) {
    const mismatch = candidateAudit.find(c => !c.numberMatches && c.allegedNumber);
    if (mismatch) {
      body += `🗳️ *Atenção ao número de urna:* O número oficial registrado no TSE para ${mismatch.name} (${mismatch.party}) é *${mismatch.officialNumber}*, e NÃO ${mismatch.allegedNumber}. Cuidado com montagens que induzem ao erro!\n\n`;
    }
  }

  if (hoax) {
    body += `⚖️ *Base Legal:* ${hoax.legal_basis}\n`;
    body += `🏛️ *Autoridade:* ${hoax.authority}\n`;
    body += `🔗 *Fonte Oficial do TSE:* ${hoax.source_url}\n\n`;
  } else if (factCheck) {
    body += `📰 *Checagem (${factCheck.agency}):* ${factCheck.url}\n\n`;
  } else {
    body += `🔗 *Consulte o portal oficial do TSE:* https://divulgacandcontas.tse.jus.br\n\n`;
  }

  body += `🚨 _Em caso de denúncias de desinformação eleitoral, ligue gratuitamente para o SOS Voto do TSE no número 1491._`;

  return `${intro}\n${body}`;
}

// Função principal de verificação massiva
export async function verifyInformation(queryText: string): Promise<VerificationReport> {
  const clean = queryText.trim();
  const lower = clean.toLowerCase();

  // 1. Extração de Números e Sinais Forenses
  const electoralNumbers = extractElectoralNumbers(clean);
  const forensicAlerts = detectForensicPatterns(clean);

  // 2. Auditoria na Base Oficial de Candidatos do TSE
  const candidateAudits = await auditCandidatesInText(clean, electoralNumbers);

  const stopWords = new Set([
    'número', 'numero', 'candidato', 'candidatos', 'eleicao', 'eleição', 'eleições',
    'governo', 'federal', 'estadual', 'brasil', 'redes', 'sociais', 'oficial', 'oficiais',
    'partido', 'votar', 'voto', 'votos', 'para', 'com', 'sobre', 'pelo', 'pela'
  ]);

  // 3. Cruzamento com Dossiês de Boatos Oficiais (TSE Fato ou Boato)
  const matchedHoaxes = debunkedHoaxes.filter(h => {
    // Match por palavras-chave com proteção de limites de palavra para termos curtos
    const hitKeyword = h.keywords.some(k => {
      const cleanK = k.toLowerCase().trim();
      if (cleanK.length <= 4) {
        return new RegExp(`\\b${cleanK}\\b`, 'i').test(clean);
      }
      return lower.includes(cleanK);
    });

    // Match por alegação exige ao menos 2 termos substantivos que não sejam stopwords
    const claimWords = h.hoax_claim
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, '')
      .split(/\s+/)
      .filter(w => w.length >= 5 && !stopWords.has(w));
    const matchedClaimWords = claimWords.filter(w => lower.includes(w));
    const hitClaim = matchedClaimWords.length >= 2;

    return hitKeyword || hitClaim;
  });

  // 4. Cruzamento com Checagens da Internet e Fact-Checking
  const matchedFactChecks = publicFactChecks.filter(fc => {
    const hitKeyword = fc.keywords.some(k => {
      const cleanK = k.toLowerCase().trim();
      if (cleanK.length <= 4) {
        return new RegExp(`\\b${cleanK}\\b`, 'i').test(clean);
      }
      return lower.includes(cleanK);
    });

    const claimWords = fc.claim
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, '')
      .split(/\s+/)
      .filter(w => w.length >= 5 && !stopWords.has(w));
    const matchedClaimWords = claimWords.filter(w => lower.includes(w));
    const hitClaim = matchedClaimWords.length >= 2;

    return hitKeyword || hitClaim;
  });

  // 5. Determinação do Veredito e Score de Risco
  let verdict: VerificationReport['verdict'] = 'SEM_EVIDENCIAS';
  let verdictLabel = 'Não Consta nos Registros Oficiais';
  let verdictDescription = 'A alegação não possui respaldo em fontes públicas oficiais do TSE ou na legislação eleitoral.';
  let riskScore = 30;
  let confidenceLevel: VerificationReport['confidenceLevel'] = 'MÉDIA';
  let summary = '';

  // Checa se houve fraude de número de candidato
  const numberMismatch = candidateAudits.some(c => !c.numberMatches);

  if (numberMismatch) {
    verdict = 'CRIME_ELEITORAL';
    verdictLabel = 'Fraude em Número de Urna (Montagem Ilícita)';
    verdictDescription = 'O número exibido na mensagem ou imagem NÃO corresponde ao número registrado oficialmente no TSE pelo candidato.';
    riskScore = 98;
    confidenceLevel = 'ALTA';
    forensicAlerts.unshift({
      type: 'NUMBER_FRAUD',
      label: 'Número de Candidato Adulterado',
      detail: 'O número citado diverge do cadastro oficial no DivulgaCandContas do TSE. Isso visa anular o voto do eleitor.',
      severity: 'CRITICA'
    });
    const cMismatch = candidateAudits.find(c => !c.numberMatches)!;
    summary = `O candidato ${cMismatch.name} (${cMismatch.party}) está oficialmente registrado com o número ${cMismatch.officialNumber}, e não ${cMismatch.allegedNumber}.`;
  } else if (matchedHoaxes.length > 0) {
    const topHoax = matchedHoaxes[0];
    verdict = topHoax.verdict === 'CRIME ELEITORAL' ? 'CRIME_ELEITORAL' : (topHoax.verdict as any);
    verdictLabel = `Boato Eleitoral Desmentido: ${topHoax.verdict}`;
    verdictDescription = topHoax.official_fact;
    riskScore = topHoax.verdict === 'CRIME ELEITORAL' ? 95 : 90;
    confidenceLevel = 'ALTA';
    summary = `${topHoax.official_fact} Fundamentado em: ${topHoax.legal_basis}.`;
  } else if (matchedFactChecks.length > 0) {
    const topFc = matchedFactChecks[0];
    verdict = topFc.verdict === 'FALSO' ? 'FALSO' : 'MANIPULAÇÃO';
    verdictLabel = `Desmentido por Agência (${topFc.agency}): ${topFc.verdict}`;
    verdictDescription = topFc.summary;
    riskScore = 85;
    confidenceLevel = 'ALTA';
    summary = topFc.summary;
  } else if (candidateAudits.length > 0 && candidateAudits.every(c => c.numberMatches)) {
    verdict = 'CONFIRMADO_TSE';
    verdictLabel = 'Informação Conforme Dados Oficiais do TSE';
    verdictDescription = 'Os nomes, cargos, partidos e números coincidem com a base oficial de 20.984 candidaturas do TSE.';
    riskScore = 5;
    confidenceLevel = 'ALTA';
    summary = candidateAudits.map(c => `${c.name} (${c.party} - ${c.officialNumber}) está regular como candidato a ${c.office} (${c.uf}).`).join('; ');
  } else if (forensicAlerts.length >= 2) {
    verdict = 'MANIPULAÇÃO';
    verdictLabel = 'Alto Risco de Manipulação / Padrão Desinformativo';
    verdictDescription = 'O texto apresenta múltiplos gatilhos forenses típicos de notícias falsas (urgência artificial, ausência de fonte, etc.).';
    riskScore = 75;
    confidenceLevel = 'MÉDIA';
    summary = 'Mensagem com forte apelo emocional e ausência de comprovação documental.';
  } else {
    verdict = 'SEM_EVIDENCIAS';
    verdictLabel = 'Sem Comprovação Oficial no TSE';
    verdictDescription = 'Não foram localizadas confirmações nos sistemas oficiais do TSE nem desmentidos públicos prévios.';
    riskScore = 40;
    confidenceLevel = 'EM_ANÁLISE';
    summary = 'Recomenda-se não compartilhar antes de verificar a fonte primária no portal tse.jus.br.';
  }

  // 6. Montagem da Mensagem para WhatsApp
  const whatsappDebunkMessage = generateWhatsAppDebunk(
    clean,
    verdict,
    summary,
    matchedHoaxes[0],
    matchedFactChecks[0],
    candidateAudits
  );

  return {
    query: clean,
    timestamp: new Date().toISOString(),
    verdict,
    verdictLabel,
    verdictDescription,
    riskScore,
    confidenceLevel,
    summary,
    matchedCandidates: candidateAudits,
    matchedHoaxes,
    matchedFactChecks,
    forensicAlerts,
    whatsappDebunkMessage
  };
}
