'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Props {
  q: string;
  uf: string;
  cargo: string;
  ufs: string[];
  ufNames: Record<string, string>;
  offices: string[];
}

export default function CandidateFilters({ q, uf, cargo, ufs, ufNames, offices }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page'); // Reset to page 1 on new filter
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <form className="filters" onSubmit={(e) => e.preventDefault()}>
      <label>
        Nome na urna
        <input
          name="q"
          defaultValue={q}
          maxLength={80}
          placeholder="Buscar por nome..."
          onChange={(e) => {
            const val = e.target.value;
            clearTimeout((window as any)._filterTimeout);
            (window as any)._filterTimeout = setTimeout(() => {
              updateFilters('q', val);
            }, 400);
          }}
        />
      </label>

      <label>
        Colégio Eleitoral / UF
        <select name="uf" value={uf} onChange={(e) => updateFilters('uf', e.target.value)}>
          <option value="">Todas as UFs cadastradas</option>
          {ufs.map(x => (
            <option key={x} value={x}>
              {ufNames[x] || x}
            </option>
          ))}
        </select>
      </label>

      <label>
        Cargo em disputa
        <select name="cargo" value={cargo} onChange={(e) => updateFilters('cargo', e.target.value)}>
          <option value="">Todos os cargos</option>
          {offices.map(x => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
      </label>

      <Link className="btn secondary" href="/candidaturas">
        Limpar Filtros
      </Link>
    </form>
  );
}