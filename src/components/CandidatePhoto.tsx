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
const KNOWN_PHOTOS: Record<string, string> = {
  'Luiz Inácio Lula da Silva': 'https://divulgacandcontas.tse.jus.br/divulga/rest/arquivo/img/2040602022/280001607829/BR',
  'Tarcísio de Freitas': 'https://divulgacandcontas.tse.jus.br/divulga/rest/arquivo/img/2040602022/250001612497/SP',
  'Guilherme Boulos': 'https://divulgacandcontas.tse.jus.br/divulga/rest/arquivo/img/2040602022/250001613761/SP',
  'Tabata Amaral': 'https://divulgacandcontas.tse.jus.br/divulga/rest/arquivo/img/2040602022/250001613271/SP',
  'Nikolas Ferreira': 'https://divulgacandcontas.tse.jus.br/divulga/rest/arquivo/img/2040602022/130001616492/MG',
  'Gleisi Hoffmann': 'https://divulgacandcontas.tse.jus.br/divulga/rest/arquivo/img/2040602022/160001606555/PR',
  'Pedro Campos': 'https://divulgacandcontas.tse.jus.br/divulga/rest/arquivo/img/2040602022/170001619899/PE',
  'Jones Manoel': 'https://divulgacandcontas.tse.jus.br/divulga/rest/arquivo/img/2040602022/170001607787/PE',
  'André Ferreira': 'https://divulgacandcontas.tse.jus.br/divulga/rest/arquivo/img/2040602022/170001605333/PE',
  'Raquel Lyra': 'https://divulgacandcontas.tse.jus.br/divulga/rest/arquivo/img/2040602022/170001607831/PE',
  'Marília Arraes': 'https://divulgacandcontas.tse.jus.br/divulga/rest/arquivo/img/2040602022/170001610442/PE',
  'Eduardo Bolsonaro': 'https://divulgacandcontas.tse.jus.br/divulga/rest/arquivo/img/2040602022/250001611374/SP',
  'General Pazuello': 'https://divulgacandcontas.tse.jus.br/divulga/rest/arquivo/img/2040602022/190001596794/RJ',
  'João Campos': 'https://divulgacandcontas.tse.jus.br/divulga/rest/arquivo/img/2030402020/170000780283/PE',
  'Anderson Ferreira': 'https://divulgacandcontas.tse.jus.br/divulga/rest/arquivo/img/2040602022/170001607759/PE',
  'Felicio Ramuth': 'https://divulgacandcontas.tse.jus.br/divulga/rest/arquivo/img/2040602022/250001612498/SP',
  'Alexandre Silveira': 'https://divulgacandcontas.tse.jus.br/divulga/rest/arquivo/img/2040602022/130001614264/MG',
  'Eduardo Paes': 'https://divulgacandcontas.tse.jus.br/divulga/rest/arquivo/img/2030402020/190000688286/RJ',
  'Rodrigo Pacheco': 'https://divulgacandcontas.tse.jus.br/divulga/rest/arquivo/img/2022802018/130000604556/MG',
};


export default function CandidatePhoto({ sourceId, uf, name, size = 64 }: Props) {
  const [failed, setFailed] = useState(false);

  // Fallback: se estivermos no mock de 2026, usa as fotos reais da Wikipédia
  let photoUrl = null;
  if (KNOWN_PHOTOS[name]) {
    photoUrl = KNOWN_PHOTOS[name];
  } else if (sourceId && uf && sourceId !== 'tse-candidatos-2026') {
    photoUrl = `https://divulgacandcontas.tse.jus.br/candidatos/2026/${uf.toUpperCase()}/candidato_${sourceId}.jpg`;
  }

  if (failed) photoUrl = null;

  const initial = (name || '?').charAt(0).toUpperCase();

  // Fallback com a inicial
  const fallback = (
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

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      {(!photoUrl || failed) && fallback}
      {photoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photoUrl}
          alt={`Foto oficial de ${name}`}
          width={size}
          height={size}
          onError={() => setFailed(true)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: size,
            height: size,
            borderRadius: '50%',
            objectFit: 'cover',
            objectPosition: 'top',
            border: '2px solid var(--line)',
            background: 'var(--surface-subtle)',
            opacity: failed ? 0 : 1, // Esconde a imagem se falhar
          }}
        />
      )}
    </div>
  );
}
