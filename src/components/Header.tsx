import Link from 'next/link';

export default function Header() {
  return (
    <>
      {/* Faixa superior cívica */}
      <div className="topbar-civic">
        <span>Observatório Eleitoral Independente • Eleições 2026 • Dados Oficiais do TSE</span>
        <div className="live-indicator">
          <div className="live-dot" />
          <span>Base Oficial Ativa</span>
        </div>
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
          <Link href="/comparador">Comparador</Link>
          <Link href="/pesquisas">Pesquisas</Link>
          <Link href="/financiamento">Financiamento</Link>
          <Link href="/recife" className="highlight">E o Recife?</Link>
          <Link href="/assistente" className="highlight">Assistente Cívico</Link>
          <Link href="/checagem">Checagem</Link>
        </nav>
      </header>
    </>
  );
}