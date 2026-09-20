import rawIndex from '@/data/candidate-photo-index.json';
import rawHistory from '@/data/candidate-photo-history.json';

export type CandidatePortrait = { src: string; sourceUrl: string; year: number };
type PhotoIndex = { year: number; sources: Record<string, string>; byId: Record<string, string[]>; aliases: Record<string, string> };
const index: PhotoIndex = rawIndex;
const history: Record<string, CandidatePortrait> = rawHistory;

/** Dataset IDs are not identities: portraits use the official SQ_CANDIDATO. */
export function getCandidatePhoto(candidateId: string): CandidatePortrait | null {
  const officialId = Object.hasOwn(index.aliases, candidateId) ? index.aliases[candidateId] : candidateId;
  if (Object.hasOwn(index.byId, officialId)) {
    const [uf, hash] = index.byId[officialId];
    return { src: `/candidate-photos/${index.year}/${officialId}-${hash}.jpg`, sourceUrl: index.sources[uf], year: index.year };
  }
  return Object.hasOwn(history, candidateId) ? history[candidateId] : null;
}
