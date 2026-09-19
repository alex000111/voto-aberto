'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { debunkedHoaxes } from '@/lib/anti-fake-data';
import { VerificationReport } from '@/lib/verification-engine';
import ImageDropzoneOcr from '@/components/ImageDropzoneOcr';

export default function Page() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [auditReport, setAuditReport] = useState<VerificationReport | null>(null);
  const [isLoadingAudit, setIsLoadingAudit] = useState(false);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);
  const [auditError, setAuditError] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Todos os Casos' },
    { id: 'urnas', label: '🗳️ Urnas & Apuração' },
    { id: 'regras', label: '📜 Regras de Votação' },
    { id: 'ia_deepfake', label: '🤖 IA & Deepfakes' },
    { id: 'biometria', label: '👤 Biometria & Título' },
    { id: 'pesquisas', label: '📊 Pesquisas' },
    { id: 'propostas', label: '📑 Planos de Governo' },
  ];

  const filteredHoaxes = useMemo(() => {
    return debunkedHoaxes.filter(h => {
      const matchCategory = selectedCategory === 'all' || h.category === selectedCategory;
      const term = searchTerm.toLowerCase().trim();
      const matchSearch =
        !term ||
        h.hoax_claim.toLowerCase().includes(term) ||
        h.official_fact.toLowerCase().includes(term) ||
        h.legal_basis.toLowerCase().includes(term) ||
        h.keywords.some(k => k.toLowerCase().includes(term));
      return matchCategory && matchSearch;
    });
  }, [searchTerm, selectedCategory]);

  const handleRunAudit = async (textToAudit: string) => {
    if (!textToAudit.trim()) return;
    setIsLoadingAudit(true);
    setAuditError(null);
    setCopiedWhatsApp(false);

    try {
      const res = await fetch('/api/checagem/verificar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToAudit })
      });

      if (!res.ok) {
        throw new Error(`Erro na checagem (HTTP ${res.status})`);
      }

      const data = await res.json();
      if (data.report) {
        setAuditReport(data.report);
      } else {
        throw new Error('Formato de resposta inválido');
      }
    } catch (err: any) {
      console.error('Falha ao auditar texto:', err);
      setAuditError('Não foi possível concluir a auditoria no momento. Tente novamente ou consulte os dossiês abaixo.');
    } finally {
      setIsLoadingAudit(false);
    }
  };

  const handleCopyWhatsApp = () => {
    if (!auditReport?.whatsappDebunkMessage) return;
    navigator.clipboard.writeText(auditReport.whatsappDebunkMessage);
    setCopiedWhatsApp(true);
    setTimeout(() => setCopiedWhatsApp(false), 4000);
  };

  const getVerdictStyle = (verdict: VerificationReport['verdict']) => {
    switch (verdict) {
      case 'FALSO':
      case 'CRIME_ELEITORAL':
        return {
          bg: 'linear-gradient(135deg, rgba(220, 38, 38, 0.12) 0%, rgba(185, 28, 28, 0.22) 100%)',
          border: '1px solid #dc2626',
          badgeBg: '#dc2626',
          badgeText: '#ffffff',
          icon: '🚨'
        };
      case 'MANIPULAÇÃO':
      case 'DESCONTEXTUALIZADO':
        return {
          bg: 'linear-gradient(135deg, rgba(217, 119, 6, 0.12) 0%, rgba(180, 83, 9, 0.22) 100%)',
          border: '1px solid #d97706',
          badgeBg: '#d97706',
          badgeText: '#ffffff',
          icon: '⚠️'
        };
      case 'CONFIRMADO_TSE':
        return {
          bg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.22) 100%)',
          border: '1px solid #10b981',
          badgeBg: '#10b981',
          badgeText: '#ffffff',
          icon: '✅'
        };
      default:
        return {
          bg: 'linear-gradient(135deg, rgba(71, 85, 105, 0.1) 0%, rgba(51, 65, 85, 0.18) 100%)',
          border: '1px solid var(--line-strong)',
          badgeBg: '#475569',
          badgeText: '#ffffff',
          icon: '🔍'
        };
    }
  };

  return (
    <main className="page">
      <div className="eyebrow">INTEGRIDADE ELEITORAL 2026 • FONTE ANTES DE OPINIÃO</div>
      <h1>Laboratório & Radar Anti-Fake News</h1>
      <p className="lead">
        Cole imagens de prints do WhatsApp, postagens em redes sociais ou textos para fazer uma auditoria massiva na base oficial de <strong>20.984 candidatos do TSE</strong>, jurisprudência e agências de checagem.
      </p>

      {/* SOS VOTO - Canal Oficial de Emergência do TSE */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.08) 0%, rgba(185, 28, 28, 0.16) 100%)',
          border: '1px solid rgba(220, 38, 38, 0.3)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ maxWidth: '720px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626', fontWeight: 800, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
            <span>🚨</span> Canal Oficial de Denúncia contra Fake News (TSE)
          </div>
          <h3 style={{ margin: '8px 0 6px', fontSize: '20px', fontWeight: 850 }}>
            Recebeu um boato criminoso ou deepfake? Ligue gratuitamente para o SOS Voto: <strong>1491</strong>
          </h3>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink-light)', lineHeight: 1.6 }}>
            O Disque <strong>1491</strong> é o canal telefônico oficial gratuito do Tribunal Superior Eleitoral para receber denúncias de desinformação, perfis falsos e disparo em massa. Você também pode utilizar o aplicativo <strong>Pardal</strong> da Justiça Eleitoral.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <a
            href="https://www.tse.jus.br/comunicacao/noticias/2024/Marco/sos-voto-tse-lanca-canal-para-denuncias-de-desinformacao"
            target="_blank"
            rel="noreferrer"
            className="btn"
            style={{ background: '#dc2626', borderColor: '#dc2626', color: '#fff', fontSize: '13px', padding: '10px 18px' }}
          >
            Conhecer o SOS Voto ↗
          </a>
          <a
            href="https://www.tse.jus.br/servicos-eleitorais/aplicativos-da-justica-eleitoral/pardal"
            target="_blank"
            rel="noreferrer"
            className="btn secondary"
            style={{ fontSize: '13px', padding: '10px 18px' }}
          >
            Baixar App Pardal ↗
          </a>
        </div>
      </div>

      {/* Laboratório Multimodal: OCR de Imagens, Paste & Busca Massiva */}
      <ImageDropzoneOcr onAudit={handleRunAudit} isLoading={isLoadingAudit} />

      {/* Mensagem de Erro se houver */}
      {auditError && (
        <div className="card" style={{ padding: '16px 20px', borderColor: '#dc2626', background: 'rgba(220,38,38,0.08)', marginBottom: '24px' }}>
          <span style={{ color: '#dc2626', fontWeight: 700 }}>⚠️ {auditError}</span>
        </div>
      )}

      {/* RELATÓRIO DE AUDITORIA DE VERACIDADE */}
      {auditReport && (
        <section
          className="card"
          style={{
            padding: '32px',
            marginBottom: '40px',
            borderRadius: '16px',
            ...getVerdictStyle(auditReport.verdict)
          }}
          aria-live="polite"
        >
          {/* Topo do Relatório */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <span
                  style={{
                    background: getVerdictStyle(auditReport.verdict).badgeBg,
                    color: getVerdictStyle(auditReport.verdict).badgeText,
                    fontSize: '12px',
                    fontWeight: 900,
                    padding: '4px 12px',
                    borderRadius: '20px',
                    letterSpacing: '0.6px',
                    textTransform: 'uppercase'
                  }}
                >
                  {getVerdictStyle(auditReport.verdict).icon} {auditReport.verdictLabel}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                  Auditado em {new Date(auditReport.timestamp).toLocaleTimeString('pt-BR')} • Nível de Confiança: <strong>{auditReport.confidenceLevel}</strong>
                </span>
              </div>
              <h2 style={{ margin: '4px 0 8px', fontSize: '24px', fontWeight: 900, color: 'var(--ink)' }}>
                Relatório de Auditoria de Veracidade
              </h2>
              <p style={{ margin: 0, fontSize: '15px', color: 'var(--ink-light)', lineHeight: 1.6, maxWidth: '800px' }}>
                {auditReport.verdictDescription}
              </p>
            </div>

            {/* Medidor de Risco de Desinformação */}
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: '12px',
                padding: '16px 20px',
                textAlign: 'center',
                minWidth: '160px'
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase' }}>
                Índice de Risco
              </div>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 900,
                  color: auditReport.riskScore > 70 ? '#dc2626' : auditReport.riskScore > 40 ? '#d97706' : '#10b981'
                }}
              >
                {auditReport.riskScore}%
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--muted)', marginTop: '2px' }}>
                {auditReport.riskScore > 70 ? 'Desinformação Severa' : auditReport.riskScore > 40 ? 'Risco Moderado' : 'Dados Oficiais'}
              </div>
            </div>
          </div>

          {/* Alertas Forenses Encontrados */}
          {auditReport.forensicAlerts.length > 0 && (
            <div style={{ marginTop: '20px', marginBottom: '24px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                🚩 Sinais Forenses Detectados na Mensagem:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {auditReport.forensicAlerts.map((alert, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--line)',
                      borderLeft: `4px solid ${alert.severity === 'CRITICA' ? '#dc2626' : alert.severity === 'ALTA' ? '#ea580c' : '#eab308'}`,
                      borderRadius: '8px',
                      padding: '12px 16px',
                      fontSize: '13.5px'
                    }}
                  >
                    <strong style={{ color: 'var(--ink)' }}>{alert.label}: </strong>
                    <span style={{ color: 'var(--ink-light)' }}>{alert.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cruzamento com Candidatos do TSE */}
          {auditReport.matchedCandidates.length > 0 && (
            <div style={{ marginTop: '20px', marginBottom: '24px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                🗳️ Auditoria na Base Oficial de 20.984 Candidatos do TSE:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                {auditReport.matchedCandidates.map((cand, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'var(--surface)',
                      border: cand.numberMatches ? '1px solid var(--line)' : '2px solid #dc2626',
                      borderRadius: '10px',
                      padding: '16px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 800, fontSize: '15px' }}>{cand.name}</span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '12px',
                          background: cand.numberMatches ? 'rgba(16, 185, 129, 0.15)' : 'rgba(220, 38, 38, 0.15)',
                          color: cand.numberMatches ? '#10b981' : '#dc2626'
                        }}
                      >
                        {cand.numberMatches ? 'Número Válido ✓' : 'NÚMERO ADULTERADO ✕'}
                      </span>
                    </div>

                    <div style={{ fontSize: '13px', color: 'var(--ink-light)', lineHeight: 1.5 }}>
                      <div>Cargo: <strong>{cand.office} ({cand.uf})</strong></div>
                      <div>Partido: <strong>{cand.party}</strong></div>
                      <div>Número Oficial no TSE: <strong style={{ color: 'var(--blue)', fontSize: '15px' }}>{cand.officialNumber}</strong></div>
                      {cand.allegedNumber && !cand.numberMatches && (
                        <div style={{ color: '#dc2626', marginTop: '6px', fontWeight: 700 }}>
                          ❌ Número alegado no boato: {cand.allegedNumber} (Divergência fraudulenta!)
                        </div>
                      )}
                    </div>

                    <div style={{ marginTop: '12px' }}>
                      <a
                        href={cand.tseLink}
                        target="_blank"
                        rel="noreferrer"
                        className="btn secondary"
                        style={{ fontSize: '11.5px', padding: '4px 10px' }}
                      >
                        Consultar Registro Oficial no TSE ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dossiês de Boatos e Checagens Oficiais Cruzadas */}
          {(auditReport.matchedHoaxes.length > 0 || auditReport.matchedFactChecks.length > 0) && (
            <div style={{ marginTop: '20px', marginBottom: '24px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                ⚖️ Fatos Oficiais Comprovados & Jurisprudência Eleitoral:
              </div>

              {auditReport.matchedHoaxes.map((hoax) => (
                <div
                  key={hoax.id}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--line)',
                    borderRadius: '10px',
                    padding: '18px',
                    marginBottom: '12px'
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '14px' }}>
                    <div style={{ background: 'rgba(220, 38, 38, 0.06)', padding: '12px 14px', borderRadius: '8px', borderLeft: '4px solid #dc2626' }}>
                      <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#dc2626', textTransform: 'uppercase', marginBottom: '4px' }}>
                        ❌ O Boato Falso / Enganoso
                      </div>
                      <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--ink)' }}>{hoax.hoax_claim}</p>
                    </div>

                    <div style={{ background: 'rgba(16, 185, 129, 0.06)', padding: '12px 14px', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
                      <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', marginBottom: '4px' }}>
                        ✅ O Fato Oficial Comprovado
                      </div>
                      <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--ink)' }}>{hoax.official_fact}</p>
                    </div>
                  </div>

                  <div style={{ fontSize: '12.5px', color: 'var(--ink-light)', lineHeight: 1.6 }}>
                    <div>⚖️ <strong>Base Jurídica:</strong> {hoax.legal_basis}</div>
                    <div>🏛️ <strong>Autoridade Oficial:</strong> {hoax.authority}</div>
                  </div>

                  <div style={{ marginTop: '12px' }}>
                    <a
                      href={hoax.source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn secondary"
                      style={{ fontSize: '12px', padding: '6px 14px' }}
                    >
                      Ler Desmentido Oficial no TSE Fato ou Boato ↗
                    </a>
                  </div>
                </div>
              ))}

              {auditReport.matchedFactChecks.map((fc) => (
                <div
                  key={fc.id}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--line)',
                    borderRadius: '10px',
                    padding: '16px',
                    marginBottom: '10px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 800, fontSize: '13.5px' }}>{fc.agency}</span>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '10px',
                        background: fc.verdict === 'FALSO' ? 'rgba(220, 38, 38, 0.15)' : 'rgba(217, 119, 6, 0.15)',
                        color: fc.verdict === 'FALSO' ? '#dc2626' : '#d97706'
                      }}
                    >
                      {fc.verdict}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 10px', fontSize: '13px', color: 'var(--ink-light)' }}>{fc.summary}</p>
                  <a
                    href={fc.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '12px', color: 'var(--blue)', textDecoration: 'underline' }}
                  >
                    Ver checagem na agência ({fc.agency}) ↗
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* FERRAMENTA CÍVICA: COPIAR RESPOSTA PARA WHATSAPP */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: '12px',
              padding: '20px',
              marginTop: '24px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>
                  💬 Resposta Educada Pronta para Grupos do WhatsApp
                </h4>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--muted)' }}>
                  Desminta o boato de forma neutra, respeitosa e com fontes primárias do TSE no grupo da família ou amigos com 1 clique.
                </p>
              </div>

              <button
                type="button"
                className="btn"
                onClick={handleCopyWhatsApp}
                style={{
                  background: copiedWhatsApp ? '#059669' : '#25D366',
                  borderColor: copiedWhatsApp ? '#059669' : '#25D366',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '13.5px',
                  padding: '10px 20px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {copiedWhatsApp ? (
                  <>✓ Copiado com Sucesso!</>
                ) : (
                  <>📋 Copiar Resposta para WhatsApp</>
                )}
              </button>
            </div>

            <pre
              style={{
                background: 'var(--surface-subtle)',
                padding: '14px',
                borderRadius: '8px',
                fontSize: '12.5px',
                color: 'var(--ink-light)',
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace',
                margin: 0,
                border: '1px solid var(--line)'
              }}
            >
              {auditReport.whatsappDebunkMessage}
            </pre>
          </div>
        </section>
      )}

      {/* Catálogo Geral de Boatos e Dossiês Oficiais */}
      <section style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label htmlFor="search-hoaxes" style={{ fontSize: '16px', fontWeight: 800, color: 'var(--ink)' }}>
            📚 Catálogo de Boatos Desmentidos pela Justiça Eleitoral
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              id="search-hoaxes"
              type="search"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Filtrar por palavras-chave (ex.: urna, anula eleição, 50%, biometria, deepfake, inss)..."
              style={{
                flex: 1,
                padding: '14px 18px',
                borderRadius: '12px',
                border: '1px solid var(--line)',
                fontSize: '15px',
                background: 'var(--surface)',
                color: 'var(--ink)',
              }}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="btn secondary"
                style={{ padding: '0 18px' }}
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Categorias */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
          {categories.map(c => {
            const isSelected = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCategory(c.id)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '20px',
                  border: isSelected ? '1px solid var(--blue)' : '1px solid var(--line)',
                  background: isSelected ? 'var(--blue)' : 'var(--surface)',
                  color: isSelected ? '#ffffff' : 'var(--ink)',
                  fontSize: '13px',
                  fontWeight: isSelected ? 750 : 550,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Grid de Dossiês Oficiais */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', margin: 0 }}>
            Dossiês de Checagem Disponíveis ({filteredHoaxes.length})
          </h2>
          <span style={{ fontSize: '13px', color: 'var(--muted)' }}>
            Atualizado conforme as resoluções vigentes do TSE
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredHoaxes.map(h => (
            <article
              key={h.id}
              className="card"
              style={{
                padding: '28px',
                borderLeft: `5px solid ${h.verdict === 'FALSO' ? '#dc2626' : h.verdict === 'CRIME ELEITORAL' ? '#991b1b' : '#d97706'}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--muted)', background: 'var(--surface-subtle)', padding: '4px 10px', borderRadius: '6px' }}>
                    {h.category_label}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                    Publicado em: {h.published_at}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 900,
                    padding: '4px 12px',
                    borderRadius: '16px',
                    letterSpacing: '0.6px',
                    background: h.verdict === 'FALSO' ? 'rgba(220, 38, 38, 0.12)' : h.verdict === 'CRIME ELEITORAL' ? 'rgba(153, 27, 27, 0.15)' : 'rgba(217, 119, 6, 0.12)',
                    color: h.verdict === 'FALSO' ? '#dc2626' : h.verdict === 'CRIME ELEITORAL' ? '#991b1b' : '#d97706',
                  }}
                >
                  {h.verdict}
                </span>
              </div>

              {/* Contraste Boato vs Fato */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '18px' }}>
                <div style={{ background: 'rgba(220, 38, 38, 0.05)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(220, 38, 38, 0.15)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#dc2626', fontWeight: 800, fontSize: '12.5px', textTransform: 'uppercase', marginBottom: '6px' }}>
                    <span>❌</span> O Boato Falso / Enganoso
                  </div>
                  <p style={{ margin: 0, fontSize: '14.5px', color: 'var(--ink)', fontWeight: 550, lineHeight: 1.6 }}>
                    &ldquo;{h.hoax_claim}&rdquo;
                  </p>
                </div>

                <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 800, fontSize: '12.5px', textTransform: 'uppercase', marginBottom: '6px' }}>
                    <span>✅</span> O Fato Comprovado
                  </div>
                  <p style={{ margin: 0, fontSize: '14.5px', color: 'var(--ink)', fontWeight: 550, lineHeight: 1.6 }}>
                    {h.official_fact}
                  </p>
                </div>
              </div>

              {/* Evidências e Base Jurídica */}
              <div style={{ fontSize: '13.5px', color: 'var(--ink-light)', lineHeight: 1.7, marginBottom: '18px' }}>
                <p style={{ margin: '0 0 10px' }}>
                  <strong>Evidência Documental:</strong> {h.evidence_summary}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '13px' }}>
                  <span>⚖️ <strong>Base Legal:</strong> {h.legal_basis}</span>
                  <span>🏛️ <strong>Autoridade:</strong> {h.authority}</span>
                </div>
              </div>

              {/* Ações */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {h.keywords.map(k => (
                    <span key={k} style={{ fontSize: '11px', color: 'var(--muted)', background: 'var(--surface-subtle)', padding: '2px 8px', borderRadius: '4px' }}>
                      #{k}
                    </span>
                  ))}
                </div>

                <a
                  href={h.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn secondary"
                  style={{ fontSize: '13px', padding: '8px 16px' }}
                >
                  Consultar Nota Oficial no TSE Fato ou Boato ↗
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
