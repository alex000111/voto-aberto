'use client';

import { useState, useEffect } from 'react';

export default function AccessibilityToolbar() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Carregar preferências salvas ou do sistema
    const savedTheme = localStorage.getItem('va_theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);

    const savedFont = (localStorage.getItem('va_fontsize') as 'normal' | 'large' | 'xlarge') || 'normal';
    setFontSize(savedFont);
    document.documentElement.setAttribute('data-fontsize', savedFont);

    const savedContrast = localStorage.getItem('va_contrast') === 'high';
    setHighContrast(savedContrast);
    if (savedContrast) {
      document.documentElement.setAttribute('data-contrast', 'high');
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('va_theme', next);
  };

  const cycleFontSize = (direction: 'up' | 'down' | 'reset') => {
    let next: 'normal' | 'large' | 'xlarge' = 'normal';
    if (direction === 'up') {
      next = fontSize === 'normal' ? 'large' : 'xlarge';
    } else if (direction === 'down') {
      next = fontSize === 'xlarge' ? 'large' : 'normal';
    } else {
      next = 'normal';
    }
    setFontSize(next);
    document.documentElement.setAttribute('data-fontsize', next);
    localStorage.setItem('va_fontsize', next);
  };

  const toggleContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    if (next) {
      document.documentElement.setAttribute('data-contrast', 'high');
      localStorage.setItem('va_contrast', 'high');
    } else {
      document.documentElement.removeAttribute('data-contrast');
      localStorage.removeItem('va_contrast');
    }
  };

  if (!mounted) {
    return (
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', opacity: 0.7 }}>Acessibilidade</span>
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-label="Controles de acessibilidade e tema visual"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        flexWrap: 'wrap'
      }}
    >
      {/* Ajuste de Fonte */}
      <div style={{ display: 'inline-flex', border: '1px solid #334155', borderRadius: '6px', overflow: 'hidden' }}>
        <button
          type="button"
          onClick={() => cycleFontSize('down')}
          disabled={fontSize === 'normal'}
          title="Diminuir tamanho do texto"
          aria-label="Diminuir tamanho do texto"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#f8fafc',
            padding: '3px 8px',
            fontSize: '11px',
            fontWeight: 700,
            cursor: fontSize === 'normal' ? 'not-allowed' : 'pointer',
            opacity: fontSize === 'normal' ? 0.4 : 1
          }}
        >
          A-
        </button>
        <button
          type="button"
          onClick={() => cycleFontSize('reset')}
          title="Tamanho padrão de texto"
          aria-label="Redefinir tamanho de texto"
          style={{
            background: 'transparent',
            borderLeft: '1px solid #334155',
            borderRight: '1px solid #334155',
            borderTop: 'none',
            borderBottom: 'none',
            color: '#f8fafc',
            padding: '3px 7px',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          A
        </button>
        <button
          type="button"
          onClick={() => cycleFontSize('up')}
          disabled={fontSize === 'xlarge'}
          title="Aumentar tamanho do texto"
          aria-label="Aumentar tamanho do texto"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#f8fafc',
            padding: '3px 8px',
            fontSize: '11px',
            fontWeight: 700,
            cursor: fontSize === 'xlarge' ? 'not-allowed' : 'pointer',
            opacity: fontSize === 'xlarge' ? 0.4 : 1
          }}
        >
          A+
        </button>
      </div>

      {/* Alto Contraste */}
      <button
        type="button"
        onClick={toggleContrast}
        title={highContrast ? 'Desativar alto contraste' : 'Ativar alto contraste para baixa visão'}
        aria-pressed={highContrast}
        style={{
          background: highContrast ? '#facc15' : 'transparent',
          border: '1px solid #334155',
          color: highContrast ? '#000000' : '#f8fafc',
          borderRadius: '6px',
          padding: '3px 8px',
          fontSize: '11px',
          fontWeight: 750,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px'
        }}
      >
        <span>👁️</span>
        <span>{highContrast ? 'Contraste Alto' : 'Contraste'}</span>
      </button>

      {/* Alternador Dark / Light Mode */}
      <button
        type="button"
        onClick={toggleTheme}
        title={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
        aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
        style={{
          background: 'transparent',
          border: '1px solid #334155',
          color: '#f8fafc',
          borderRadius: '6px',
          padding: '3px 9px',
          fontSize: '11px',
          fontWeight: 750,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          transition: 'all 0.15s ease'
        }}
      >
        <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
        <span>{theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}</span>
      </button>
    </div>
  );
}