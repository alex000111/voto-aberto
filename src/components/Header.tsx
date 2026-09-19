'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AccessibilityToolbar from './AccessibilityToolbar';

const navItems = [
  { href: '/candidaturas', label: 'Candidaturas' },
  { href: '/propostas', label: 'Propostas & Resumos' },
  { href: '/comparador', label: 'Comparador' },
  { href: '/pesquisas', label: 'Pesquisas' },
  { href: '/financiamento', label: 'Financiamento' },
  { href: '/recife', label: 'E o Recife?' },
  { href: '/assistente', label: 'Assistente Cívico' },
  { href: '/checagem', label: '🛡️ Anti-Fake News' },
];

export default function Header() {
  const pathname = usePathname() || '';

  return (
    <>
      {/* Faixa Tricolor da República Federativa do Brasil */}
      <div className="civic-ribbon" aria-hidden="true" />

      {/* Faixa superior cívica com Controles de Acessibilidade */}
      <div className="topbar-civic">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <span>🇧🇷 República Federativa do Brasil • Eleições Gerais 2026</span>
          <div className="live-indicator">
            <div className="live-dot" />
            <span>TSE Oficial Conectado (20.984 registros)</span>
          </div>
        </div>
        <AccessibilityToolbar />
      </div>

      {/* Cabeçalho principal */}
      <header>
        <div className="brand-wrapper">
          <div className="brand-logo-icon" title="Observatório Cívico Brasileiro">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Losango Amarelo Ouro Cívico */}
              <polygon points="12,2 22,12 12,22 2,12" fill="#fbbf24" opacity="0.95" />
              {/* Círculo Azul Celestial */}
              <circle cx="12" cy="12" r="6" fill="#1d4ed8" />
              {/* Voto Branco / Check da Urna */}
              <path d="M9 12l2 2 4-4" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <Link className="brand" href="/">
            VOTO <span>ABERTO</span>
            <small>🇧🇷 BRASIL 2026</small>
          </Link>
        </div>

        <nav aria-label="Navegação principal">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {isActive && <span className="active-marker" aria-hidden="true" />}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
    </>
  );
}