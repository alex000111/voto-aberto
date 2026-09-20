import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {photoIdentity,normalizePhotoName} from '../src/lib/photo-identity';
import {getCandidatePhoto} from '../src/lib/candidate-photos';
import index from '../src/data/candidate-photo-index.json';

test('photo identity uses official candidate ID and rejects paths',()=>{
 assert.deepEqual(photoIdentity('FBR280002554490_div.jpg'),{uf:'BR',candidateId:'280002554490'});
 for(const value of ['../FBR280002554490_div.jpg','portrait.jpg','FBRtse-candidatos-2026_div.jpg','FBR123_div.jpg'])assert.equal(photoIdentity(value),null);
 assert.equal(normalizePhotoName('  João   Campos '),'JOAO CAMPOS');
});
test('all published portraits exist and have JPEG signatures',()=>{
 assert.equal(Object.keys(index.sources).length,28);
 assert.ok(Object.keys(index.byId).length>20000);
 for(const id of Object.keys(index.byId)){
  const photo=getCandidatePhoto(id)!;
  assert.ok(photo&&photo.year===2026);
  assert.ok(photo.sourceUrl.startsWith('https://cdn.tse.jus.br/'));
  const bytes=readFileSync(`public${photo.src}`);
  assert.deepEqual([...bytes.subarray(0,3)],[255,216,255],id);
 }
});
test('dataset ID and unknown candidate IDs never select another portrait',()=>{
 assert.equal(getCandidatePhoto('tse-candidatos-2026'),null);
 assert.equal(getCandidatePhoto('unknown-candidate'),null);
 assert.equal(getCandidatePhoto('__proto__'),null);
 for(const [alias,id] of Object.entries(index.aliases)){
  const portrait=getCandidatePhoto(alias)!;
  assert.equal(portrait.src,getCandidatePhoto(id)?.src);
  assert.ok(existsSync(`public${portrait.src}`));
 }
});
