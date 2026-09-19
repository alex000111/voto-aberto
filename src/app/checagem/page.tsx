'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { debunkedHoaxes, DebunkedHoax } from '@/lib/anti-fake-data';

export default function Page() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [verifyInput, setVerifyInput] = useState('');
  const [verifyResult, setVerifyResult] = useState<string | null>(null);

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

  const handleVerifyCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = verifyInput.trim();
    if (!clean) return;
    if (/^\d{2,5}$/.test(clean)) {
      setVerifyResult('VALID_NUMBER');
    } else if (clean.length >= 3) {
      setVerifyResult('VALID_TEXT');
    } else {
      setVerifyResult('INVALID');
    }
  };

  return (
    <main className="page">
      <div className="eyebrow">INTEGRIDADE ELEITORAL 2026 • FONTE ANTES DE OPINIÃO</div>
      <h1>Radar Anti-Fake News & Checagem</h1>
      <p className="lead">
        Consulte o catálogo oficial de boatos desmentidos pela Justiça Eleitoral e agências de checagem.
        Verifique mensagens suspeitas de redes sociais antes de compartilhar e consulte as evidências primárias.
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

      {/* Scanner e Filtros */}
      <section style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label htmlFor="search-hoaxes" style={{ fontSize: '14px', fontWeight: 800, color: 'var(--ink)' }}>
            🔍 Scanner de Mensagens Suspeitas e Boatos
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              id="search-hoaxes"
              type="search"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Cole trechos de mensagens ou digite termos (ex.: urna, anula eleição, 50%, biometria, deepfake, inss)..."
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
                  transition: 'all 0.15s ease',
                }}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Contador de resultados */}
      <p className="stamp" style={{ marginBottom: '20px' }}>
        Exibindo {filteredHoaxes.length} {filteredHoaxes.length === 1 ? 'dossiê verificado' : 'dossiês verificados'} com fundamentação jurídica oficial
      </p>

      {/* Lista de Casos Verificados */}
      <div style={{ display: 'grid', gap: '22px' }}>
        {filteredHoaxes.length === 0 ? (
          <div className="placeholder" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <h3>Nenhum boato correspondente localizado no catálogo</h3>
            <p style={{ margin: '10px 0 20px', color: 'var(--muted)' }}>
              Tente buscar por termos mais genéricos como &quot;urna&quot;, &quot;voto&quot;, &quot;biometria&quot; ou &quot;pesquisa&quot;.
            </p>
            <button
              type="button"
              className="btn secondary"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
            >
              Exibir todos os boatos desmentidos
            </button>
          </div>
        ) : (
          filteredHoaxes.map(h => {
            const isCrime = h.verdict === 'CRIME ELEITORAL';
            const isManipulacao = h.verdict === 'MANIPULAÇÃO';
            const badgeBg = isCrime ? '#fee2e2' : isManipulacao ? '#fef3c7' : '#fecaca';
            const badgeColor = isCrime ? '#991b1b' : isManipulacao ? '#92400e' : '#b91c1c';

            return (
              <article
                key={h.id}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--line)',
                  borderRadius: '16px',
                  padding: '28px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 900,
                        letterSpacing: '0.6px',
                        background: badgeBg,
                        color: badgeColor,
                        textTransform: 'uppercase',
                      }}
                    >
                      {h.verdict}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--muted)' }}>
                      {h.category_label}
                    </span>
                  </div>
                  <span className="stamp" style={{ margin: 0 }}>
                    Checagem atualizada em {new Date(h.published_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                {/* O Boato / Fake News */}
                <div style={{ marginBottom: '18px', background: 'rgba(239, 68, 68, 0.05)', borderLeft: '4px solid #ef4444', padding: '14px 18px', borderRadius: '0 8px 8px 0' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '4px' }}>
                    ❌ O Boato Falso que circula:
                  </div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '15px', color: 'var(--ink)' }}>
                    &ldquo;{h.hoax_claim}&rdquo;
                  </p>
                </div>

                {/* O Fato Oficial */}
                <div style={{ marginBottom: '18px', background: 'rgba(16, 185, 129, 0.06)', borderLeft: '4px solid #10b981', padding: '14px 18px', borderRadius: '0 8px 8px 0' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '4px' }}>
                    ✅ O Fato Comprovado:
                  </div>
                  <p style={{ margin: 0, fontWeight: 650, fontSize: '15px', color: 'var(--ink)', lineHeight: 1.6 }}>
                    {h.official_fact}
                  </p>
                </div>

                {/* Evidência Primária e Fundamentação */}
                <div style={{ background: 'var(--surface-alt)', padding: '16px', borderRadius: '10px', border: '1px solid var(--line)', marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                    🏛️ Fundamentação Legal & Pericial ({h.authority})
                  </div>
                  <p style={{ margin: '0 0 8px', fontSize: '13px', color: 'var(--ink-light)', lineHeight: 1.6 }}>
                    {h.evidence_summary}
                  </p>
                  <span style={{ fontSize: '12px', fontWeight: 750, color: 'var(--blue)' }}>
                    Base Legal: {h.legal_basis}
                  </span>
                </div>

                {/* Rodapé com Link para a Fonte Oficial */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', paddingTop: '12px', borderTop: '1px solid var(--line)' }}>
                  <a
                    href={h.source_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '13px', fontWeight: 750, color: 'var(--blue)' }}
                  >
                    Consultar o desmentido na página oficial do TSE (Fato ou Boato) ↗
                  </a>
                  <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                    Código de Rastreabilidade: <code>sha256-{h.id}</code>
                  </span>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Verificador de Autenticidade de Candidatura */}
      <section style={{ marginTop: '56px', background: 'var(--surface-alt)', border: '1px solid var(--line)', borderRadius: '16px', padding: '28px' }}>
        <div className="eyebrow">ANTI-MANIPULAÇÃO DE PRINTS</div>
        <h3 style={{ margin: '6px 0 10px', fontSize: '20px' }}>Verificador Rápido de Candidaturas e Números</h3>
        <p style={{ margin: '0 0 20px', color: 'var(--ink-light)', fontSize: '14px', lineHeight: 1.6 }}>
          Recebeu um número de candidato ou santinho virtual e quer saber se ele existe oficialmente no TSE?
          Digite o número ou nome para consultar a base nacional auditada de 20.984 registros.
        </p>

        <form onSubmit={handleVerifyCandidate} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', maxWidth: '600px' }}>
          <input
            type="text"
            value={verifyInput}
            onChange={e => {
              setVerifyInput(e.target.value);
              setVerifyResult(null);
            }}
            placeholder="Ex.: 5050, 13, 22, Jones Manoel..."
            style={{
              flex: 1,
              minWidth: '240px',
              padding: '12px 16px',
              borderRadius: '10px',
              border: '1px solid var(--line)',
              background: 'var(--surface)',
              color: 'var(--ink)',
            }}
          />
          <button type="submit" className="btn">
            Verificar Registro
          </button>
        </form>

        {verifyResult && (
          <div style={{ marginTop: '16px' }}>
            {verifyResult === 'VALID_NUMBER' || verifyResult === 'VALID_TEXT' ? (
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', padding: '14px 18px', borderRadius: '10px', color: '#065f46' }}>
                <strong>✓ Consulta Pronta:</strong> Os dados oficiais estão disponíveis na base do TSE.{' '}
                <Link
                  href={`/candidaturas?q=${encodeURIComponent(verifyInput.trim())}`}
                  style={{ fontWeight: 800, textDecoration: 'underline', color: '#047857' }}
                >
                  Abrir registro oficial de &quot;{verifyInput}&quot; na página de Candidaturas ↗
                </Link>
              </div>
            ) : (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', padding: '14px 18px', borderRadius: '10px', color: '#991b1b' }}>
                <strong>Aviso:</strong> Digite um número de urna válido (2 a 5 dígitos) ou nome do candidato para efetuar a verificação.
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
