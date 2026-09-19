'use client';

import { useState } from 'react';

interface Props {
  sourceId: string | null;
  uf: string | null;
  name: string;
  size?: number;
}

/**
 * Tenta exibir a foto oficial do TSE.
 * URL pública: https://divulgacandcontas.tse.jus.br/candidatos/{ano}/{uf}/candidato_{source_id}.jpg
 * Se não carregar, exibe um avatar com a inicial do nome.
 */
export default function CandidatePhoto({ sourceId, uf, name, size = 64 }: Props) {
  const [failed, setFailed] = useState(false);

  const photoUrl = sourceId && uf && !failed
    ? `https://divulgacandcontas.tse.jus.br/candidatos/2026/${uf.toUpperCase()}/candidato_${sourceId}.jpg`
    : null;

  const initial = (name || '?').charAt(0).toUpperCase();

  if (photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoUrl}
        alt={`Foto oficial de ${name}`}
        width={size}
        height={size}
        onError={() => setFailed(true)}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          objectPosition: 'top',
          border: '2px solid var(--line)',
          background: 'var(--surface-subtle)',
          flexShrink: 0,
        }}
      />
    );
  }

  // Avatar fallback com inicial
  return (
    <div
      aria-label={`Foto não disponível para ${name}`}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--br-green) 0%, var(--br-blue) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 900,
        fontSize: Math.round(size * 0.4),
        flexShrink: 0,
        border: '2px solid var(--line)',
        userSelect: 'none',
      }}
    >
      {initial}
    </div>
  );
}
