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
  'Luiz Inácio Lula da Silva': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Luiz_In%C3%A1cio_Lula_da_Silva_em_2022.jpg/400px-Luiz_In%C3%A1cio_Lula_da_Silva_em_2022.jpg',
  'Tarcísio de Freitas': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Tarc%C3%ADsio_de_Freitas_em_2022.jpg/400px-Tarc%C3%ADsio_de_Freitas_em_2022.jpg',
  'Ronaldo Caiado': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Ronaldo_Caiado.jpg/400px-Ronaldo_Caiado.jpg',
  'Ciro Gomes': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Ciro_Gomes_2022_%28cropped%29.jpg/400px-Ciro_Gomes_2022_%28cropped%29.jpg',
  'Guilherme Boulos': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Guilherme_Boulos_na_C%C3%A2mara_dos_Deputados_%28cropped%29.jpg/400px-Guilherme_Boulos_na_C%C3%A2mara_dos_Deputados_%28cropped%29.jpg',
  'Tabata Amaral': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Tabata_Amaral_em_2023.jpg/400px-Tabata_Amaral_em_2023.jpg',
  'Nikolas Ferreira': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Nikolas_Ferreira_em_2023.jpg/400px-Nikolas_Ferreira_em_2023.jpg',
  'Gleisi Hoffmann': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Gleisi_Hoffmann_em_2023_%28cropped%29.jpg/400px-Gleisi_Hoffmann_em_2023_%28cropped%29.jpg',
  'Pedro Campos': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Deputado_Pedro_Campos_em_2023_%28cropped%29.jpg/400px-Deputado_Pedro_Campos_em_2023_%28cropped%29.jpg',
  'Jones Manoel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Jones_Manoel_%28cropped%29.jpg/400px-Jones_Manoel_%28cropped%29.jpg',
  'Eduardo Bolsonaro': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Eduardo_Bolsonaro_em_2019.jpg/400px-Eduardo_Bolsonaro_em_2019.jpg',
  'João Campos': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Jo%C3%A3o_Campos_em_2023_%28cropped%29.jpg/400px-Jo%C3%A3o_Campos_em_2023_%28cropped%29.jpg',
  'Raquel Lyra': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Raquel_Lyra_em_2023_%28cropped%29.jpg/400px-Raquel_Lyra_em_2023_%28cropped%29.jpg',
  'Marília Arraes': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Mar%C3%ADlia_Arraes_2022.jpg/400px-Mar%C3%ADlia_Arraes_2022.jpg',
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
