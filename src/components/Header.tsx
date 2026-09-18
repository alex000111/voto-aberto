import Link from 'next/link';
import AccessibilityToolbar from './AccessibilityToolbar';

export default function Header() {
  return (
    <>
      {/* Faixa superior cívica com Controles de Acessibilidade */}
      <div className="topbar-civic">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <span>Observatório Eleitoral • Eleições 2026</span>
          <div className="live-indicator">
            <div className="live-dot" />
            <span>Base Oficial Ativa</span>
          </div>
        </div>
        <AccessibilityToolbar />
      </div>

      {/* Cabeçalho principal */}
      <header>
        <div className="brand-wrapper">
          <div className="brand-logo-icon">✓</div>
          <Link className="brand" href="/">
            VOTO <span>ABERTO</span>
            <small>2026</small>
          </Link>
        </div>

        <nav>
          <Link href="/candidaturas">Candidaturas</Link>
          <Link href="/propostas" className="highlight">Propostas & Resumos</Link>
          <Link href="/comparador">Comparador</Link>
          <Link href="/pesquisas">Pesquisas</Link>
          <Link href="/financiamento">Financiamento</Link>
          <Link href="/recife">E o Recife?</Link>
          <Link href="/assistente">Assistente Cívico</Link>
        </nav>
      </header>
    </>
  );
}