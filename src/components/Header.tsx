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
      {/* Faixa superior cívica com Controles de Acessibilidade */}
      <div className="topbar-civic">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <span>Observatório Eleitoral • Eleições 2026</span>
          <div className="live-indicator">
            <div className="live-dot" />
            <span>Base Oficial Ativa (20.984 registros)</span>
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