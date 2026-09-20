import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import yauzl from 'yauzl';
import {getCandidateDatasetMetadata} from '../src/lib/tse.ts';
import {downloadOfficial,readCandidateRows} from '../src/lib/tse-download.ts';
import {photoIdentity,normalizePhotoName} from '../src/lib/photo-identity.ts';
import {localCandidates} from '../src/lib/local-dataset.ts';

const target=path.resolve('public/candidate-photos/2026');
await fs.mkdir(target,{recursive:true});
const meta=await getCandidateDatasetMetadata();
const candidateResource=meta.resources.find(r=>r.name==='Candidatos');
if(!candidateResource)throw new Error('Recurso de candidaturas não encontrado.');
const candidates=await readCandidateRows(await downloadOfficial(candidateResource.url));
const officialById=new Map(candidates.map(c=>[c.SQ_CANDIDATO,c]));
const resources=meta.resources.filter(r=>/^[A-Z]{2} - Fotos de candidatos$/i.test(r.name));
if(resources.length!==28)throw new Error('Catálogo de fotos incompleto; interrompendo sem substituir o índice.');
const index={year:2026,collectedAt:new Date().toISOString(),sources:{},byId:{},aliases:{}};
const report={officialRecords:officialById.size,photos:0,bytes:0,missing:[],unmatchedProfiles:[],archives:[]};
async function extract(resource){
 const uf=resource.name.slice(0,2),buffer=await downloadOfficial(resource.url);
 index.sources[uf]=resource.url;
 let added=0,expanded=0,entries=0;
 await new Promise((resolve,reject)=>{
  yauzl.fromBuffer(buffer,{lazyEntries:true,validateEntrySizes:true},(error,zip)=>{
   if(error||!zip){reject(error||new Error('ZIP inválido.'));return;}
   const fail=e=>{zip.close();reject(e);};
   zip.on('error',fail);zip.on('end',resolve);
   zip.on('entry',entry=>{void(async()=>{
    if(++entries>20000)throw new Error('Quantidade inesperada de fotos.');
    const identity=photoIdentity(entry.fileName);
    if(!identity||identity.uf!==uf||!officialById.has(identity.candidateId)){zip.readEntry();return;}
    if(officialById.get(identity.candidateId).SG_UF!==uf)throw new Error('UF da foto difere do registro oficial.');
    if(entry.uncompressedSize>2*1024*1024)throw new Error('Foto excede o limite individual.');
    expanded+=entry.uncompressedSize;if(expanded>200*1024*1024)throw new Error('ZIP excede o limite expandido.');
    const stream=await new Promise((res,rej)=>zip.openReadStream(entry,(e,s)=>e?rej(e):res(s)));
    const chunks=[];for await(const chunk of stream)chunks.push(chunk);
    const bytes=Buffer.concat(chunks);
    if(bytes[0]!==0xff||bytes[1]!==0xd8||bytes[2]!==0xff)throw new Error('Arquivo não é JPEG.');
    const hash=createHash('sha256').update(bytes).digest('hex').slice(0,12);
    if(index.byId[identity.candidateId]&&index.byId[identity.candidateId][1]!==hash)throw new Error('Fotos conflitantes para o mesmo identificador.');
    await fs.writeFile(path.join(target,`${identity.candidateId}-${hash}.jpg`),bytes);
    index.byId[identity.candidateId]=[uf,hash];added++;report.bytes+=bytes.length;
    zip.readEntry();
   })().catch(fail);});
   zip.readEntry();
  });
 });
 report.archives.push({uf,photos:added,url:resource.url});console.log(`${uf}: ${added} fotos oficiais`);
}
for(let i=0;i<resources.length;i+=3)await Promise.all(resources.slice(i,i+3).map(extract));
// Compatibility with curated profiles: accept only a unique exact FULL NAME match.
// Never guess identity from a first name, similar spelling, or face.
for(const c of localCandidates){
 let matches=candidates.filter(r=>normalizePhotoName(r.NM_CANDIDATO)===normalizePhotoName(c.full_name));
 const scoped=matches.filter(r=>r.SG_UF===c.uf);if(scoped.length)matches=scoped;
 const ids=[...new Set(matches.map(r=>r.SQ_CANDIDATO))];
 if(ids.length===1&&index.byId[ids[0]])index.aliases[c.id]=ids[0];
 else report.unmatchedProfiles.push({id:c.id,name:c.ballot_name,reason:ids.length!==1?'Sem identidade oficial unívoca em 2026':'Foto ausente no arquivo oficial'});
}
report.photos=Object.keys(index.byId).length;
report.missing=[...officialById.keys()].filter(id=>!index.byId[id]);
await fs.mkdir('src/data',{recursive:true});
await fs.writeFile('src/data/candidate-photo-index.json',JSON.stringify(index));
await fs.writeFile('public/candidate-photos/report.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({photos:report.photos,missing:report.missing.length,bytes:report.bytes,unmatchedProfiles:report.unmatchedProfiles}));
