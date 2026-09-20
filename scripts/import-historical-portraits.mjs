import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import yauzl from 'yauzl';
import {getDataset} from '../src/lib/datasets.ts';
import {downloadOfficial,candidateCsvFiles} from '../src/lib/tse-download.ts';
import {decodeTseCsv} from '../src/lib/csv.ts';
import {photoIdentity,normalizePhotoName as norm} from '../src/lib/photo-identity.ts';
import {localCandidates} from '../src/lib/local-dataset.ts';
const current=JSON.parse(await fs.readFile('src/data/candidate-photo-index.json','utf8'));
const history={};
for(const year of [2022,2018]){
 const remaining=localCandidates.filter(c=>!current.aliases[c.id]&&!history[c.id]);if(!remaining.length)break;
 const dataset=await getDataset(`candidatos-${year}`),candidateResource=dataset.resources.find(r=>r.name==='Candidatos');
 if(!candidateResource)continue;
 const rows=(await candidateCsvFiles(await downloadOfficial(candidateResource.url),new RegExp(`(?:^|/)consulta_cand_${year}_[a-z]{2,6}\\.csv$`,'i'))).flatMap(decodeTseCsv);
 const wanted=new Map();
 for(const c of remaining){
  let matches=rows.filter(r=>norm(r.NM_CANDIDATO)===norm(c.full_name));
  if(!matches.length)matches=rows.filter(r=>r.SG_UF===c.uf&&norm(r.NM_URNA_CANDIDATO)===norm(c.ballot_name)&&norm(c.full_name).split(' ').every(word=>norm(r.NM_CANDIDATO).split(' ').includes(word)));
  const unique=new Map(matches.map(r=>[r.SQ_CANDIDATO,r]));
  if(unique.size===1){const record=[...unique.values()][0];wanted.set(record.SQ_CANDIDATO,{profile:c.id,uf:record.SG_UF,fullName:record.NM_CANDIDATO});}
 }
 for(const uf of new Set([...wanted.values()].map(x=>x.uf))){
  const resource=dataset.resources.find(r=>r.name.startsWith(`${uf} -`)&&/foto/i.test(r.name));if(!resource)continue;
    const folder=`public/candidate-photos/${year}`;
  const existing=await fs.readdir(folder).catch(()=>[]);
  for(const [id,match] of wanted){
   if(match.uf!==uf)continue;
   const file=existing.find(name=>name.startsWith(`${id}-`)&&name.endsWith('.jpg'));
   if(file)history[match.profile]={src:`/candidate-photos/${year}/${file}`,sourceUrl:resource.url,year,officialCandidateId:id,officialFullName:match.fullName};
  }
  await fs.writeFile('src/data/candidate-photo-history.json',JSON.stringify(history,null,2));
  if([...wanted.values()].filter(x=>x.uf===uf).every(x=>history[x.profile]))continue;
  let buffer;
  for(let attempt=0;attempt<3;attempt++){
   try{buffer=await downloadOfficial(resource.url);break;}catch(error){if(attempt===2)throw error;console.warn(`Repetindo download de ${uf} (${year})`);}
  }
  await new Promise((resolve,reject)=>yauzl.fromBuffer(buffer,{lazyEntries:true},(error,zip)=>{
   if(error||!zip){reject(error);return;}const fail=e=>{zip.close();reject(e);};zip.on('error',fail);zip.on('end',resolve);
   zip.on('entry',entry=>void(async()=>{
    const identity=photoIdentity(entry.fileName),match=identity&&wanted.get(identity.candidateId);
    if(!identity||!match||match.uf!==uf||identity.uf!==uf){zip.readEntry();return;}
    if(entry.uncompressedSize>2*1024*1024)throw new Error('Foto histórica excede o limite.');
    const stream=await new Promise((res,rej)=>zip.openReadStream(entry,(e,s)=>e?rej(e):res(s)));
    const chunks=[];for await(const part of stream)chunks.push(part);const bytes=Buffer.concat(chunks);
    if(bytes[0]!==0xff||bytes[1]!==0xd8||bytes[2]!==0xff)throw new Error('Foto histórica inválida.');
    const hash=createHash('sha256').update(bytes).digest('hex').slice(0,12);
    const src=`/candidate-photos/${year}/${identity.candidateId}-${hash}.jpg`;
    await fs.mkdir(path.dirname(`public${src}`),{recursive:true});await fs.writeFile(`public${src}`,bytes);
    history[match.profile]={src,sourceUrl:resource.url,year,officialCandidateId:identity.candidateId,officialFullName:match.fullName};
    await fs.writeFile('src/data/candidate-photo-history.json',JSON.stringify(history,null,2));console.log(`${match.profile}: retrato TSE ${year}`);zip.readEntry();
   })().catch(fail));zip.readEntry();
  }));
 }
}
await fs.writeFile('src/data/candidate-photo-history.json',JSON.stringify(history,null,2));
console.log(JSON.stringify({historical:Object.keys(history).length,missing:localCandidates.filter(c=>!current.aliases[c.id]&&!history[c.id]).map(c=>c.ballot_name)}));

