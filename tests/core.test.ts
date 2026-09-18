import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {adminAuthorized} from '../src/lib/admin-auth';
import {candidateQuery} from '../src/lib/candidate-query';
import {decodeTseCsv} from '../src/lib/csv';
import {normalizeCandidate,candidateFingerprint} from '../src/lib/candidate-normalizer';
import {officialUrl,readCandidateRows} from '../src/lib/tse-download';
import {normalizePoll,tseDate} from '../src/lib/ingest-polls';
import {decimalAmount,normalizeFinance,readFinance} from '../src/lib/ingest-finance';
import {recifeTopics} from '../src/data/recife-data';
import {searchDocumentProposals} from '../src/lib/proposals-search';
const row={SQ_CANDIDATO:'123',ANO_ELEICAO:'2026',SG_UF:'PE',DS_CARGO:'GOVERNADOR',NM_URNA_CANDIDATO:'Pessoa Exemplo',NM_CANDIDATO:'Pessoa Exemplo',NR_CPF_CANDIDATO:'SENSITIVE',DT_GERACAO:'01/01/2026'};
test('administrative authorization fails closed',()=>{
 for(const secret of [undefined,'',' '])assert.equal(adminAuthorized('Bearer undefined',secret),false);
 assert.equal(adminAuthorized(null,'secret'),false);
 assert.equal(adminAuthorized('Bearer wrong','secret'),false);
 assert.equal(adminAuthorized('Bearer secret','secret'),true);
});
test('candidate query is bounded, active-only, exact-office, and escaped',()=>{
 const parsed=candidateQuery({page:-4,limit:500,office:'Presidente',q:'A&active=eq.false',uf:'pe'});
 const q=new URLSearchParams(parsed.query);
 assert.equal(q.get('active'),'eq.true');assert.equal(q.get('office'),'eq.PRESIDENTE');assert.equal(q.get('offset'),'0');assert.equal(q.get('limit'),'101');assert.equal(q.get('uf'),'eq.PE');
 assert.equal(q.get('ballot_name'),'ilike.*A&active=eq.false*');
 assert.throws(()=>candidateQuery({uf:'XX'}));
});
test('fingerprint ignores collection time and raw snapshots exclude personal identifiers',()=>{
 const a=normalizeCandidate(row,'2026-01-01'),b=normalizeCandidate({...row,DT_GERACAO:'02/01/2026'},'2026-01-02');
 assert.equal(candidateFingerprint(a),candidateFingerprint(b));assert.equal(a.raw.NR_CPF_CANDIDATO,undefined);
 assert.notEqual(candidateFingerprint(a),candidateFingerprint(normalizeCandidate({...row,SG_PARTIDO:'XYZ'},'2026-01-01')));
});
test('CSV rejects damaged and duplicate headers',()=>{
 assert.throws(()=>decodeTseCsv(Buffer.from('a;b\n1;2;3')));
 assert.throws(()=>decodeTseCsv(Buffer.from('a;a\n1;2')));
 assert.throws(()=>decodeTseCsv(Buffer.from('__proto__;b\n1;2')));
});
test('official download host validation',()=>{
 assert.equal(officialUrl('https://cdn.tse.jus.br/file.zip').hostname,'cdn.tse.jus.br');
 for(const url of ['http://cdn.tse.jus.br/a','https://tse.jus.br.evil.test/a','https://localhost/a','https://user:pass@cdn.tse.jus.br/a'])assert.throws(()=>officialUrl(url));
});
test('ZIP uses national CSV rather than duplicating UF exports',async()=>{
 const rows=await readCandidateRows(readFileSync(new URL('./fixtures/candidates.zip',import.meta.url)));
 assert.equal(rows.length,1);assert.equal(rows[0].SQ_CANDIDATO,'123');
 await assert.rejects(readCandidateRows(Buffer.from('not;a;candidate\n1;2;3')));
 await assert.rejects(readCandidateRows(Buffer.from('')));
});
test('polls preserve source dates without inventing margin or confidence',()=>{
 assert.equal(tseDate('2026-07-21 00:00:00'),'2026-07-21');
 assert.equal(tseDate('21/07/2026'),'2026-07-21');
 assert.throws(()=>tseDate('31/02/2026'));
 const p=normalizePoll({AA_ELEICAO:'2026',NR_PROTOCOLO_REGISTRO:'PE-12345/2026',NM_EMPRESA:'Instituto Exemplo',DT_INICIO_PESQUISA:'2026-07-21 00:00:00',DT_FIM_PESQUISA:'2026-07-24 00:00:00',QT_ENTREVISTADO:'1000',SG_UF:'PE',NM_UE:'PERNAMBUCO',DS_CARGO:'GOVERNADOR'});
 assert.equal(p.sample_size,1000);assert.equal('margin_error' in p,false);assert.equal('confidence_level' in p,false);
});
test('finance preserves decimals and does not retain taxpayer identifiers',()=>{
 assert.equal(decimalAmount('1.234,56'),'1234.56');assert.equal(decimalAmount('0,01'),'0.01');assert.throws(()=>decimalAmount('não informado'));
 const item=normalizeFinance({AA_ELEICAO:'2026',SQ_CANDIDATO:'123',SQ_RECEITA:'1',SQ_PRESTADOR_CONTAS:'2',VR_RECEITA:'100,25',DT_RECEITA:'18/09/2026',NR_CPF_CNPJ_DOADOR:'SENSITIVE'},'receita');
 assert.equal(item.amount,'100.25');assert.equal('NR_CPF_CNPJ_DOADOR' in item,false);
});
test('financial items sharing a sequence are preserved individually',async()=>{
 const rows=await readFinance('tests/fixtures/finance.zip','PE');
 assert.equal(rows.length,3);assert.equal(new Set(rows.map(r=>r.id)).size,3);
 assert.deepEqual(rows.filter(r=>r.kind==='despesa').map(r=>r.amount),['10.00','20.00']);
 await assert.rejects(readFinance('tests/fixtures/finance.zip','XX'));
});
test('recife topics contain indicators with valid sources and constitutional competencies',()=>{
 assert.ok(recifeTopics.length >= 6);
 for(const topic of recifeTopics){
  assert.ok(topic.slug);
  assert.ok(topic.indicators.length > 0);
  assert.ok(topic.competency.municipalRole);
  assert.ok(topic.competency.legalBasis);
  for(const ind of topic.indicators){
   assert.ok(ind.metric);
   assert.ok(ind.source);
   assert.match(ind.sourceUrl, /^https?:\/\//);
  }
 }
});
test('civic assistant searches proposal documents with transparent citations and topic filters',async()=>{
 const all = await searchDocumentProposals('');
 assert.ok(all.total > 0);
 assert.ok(all.results.every(r => r.excerpt && r.document_url && r.topic));

 const edu = await searchDocumentProposals('educação');
 assert.ok(edu.results.length > 0);
 assert.ok(edu.results.every(r => r.topic.toLowerCase().includes('educa') || r.excerpt.toLowerCase().includes('educa')));

 const filterByTopic = await searchDocumentProposals('', 'Mobilidade');
 assert.ok(filterByTopic.results.length > 0);
 assert.ok(filterByTopic.results.every(r => r.topic.toLowerCase().includes('mobilidade')));
});
