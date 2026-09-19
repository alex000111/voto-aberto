import yauzl from 'yauzl';
import {decodeTseCsv} from './csv';

export const MAX_DOWNLOAD=128*1024*1024;
const MAX_EXPANDED=512*1024*1024;
export function officialUrl(value:string){
 const url=new URL(value);
 if(url.protocol!=='https:'||!(url.hostname==='tse.jus.br'||url.hostname.endsWith('.tse.jus.br'))||url.username||url.password||url.port)throw new Error('URL fora da fonte oficial do TSE.');
 return url;
}
export async function downloadOfficial(value:string){
 let url=officialUrl(value);
 for(let hop=0;hop<5;hop++){
  const response=await fetch(url,{cache:'no-store',redirect:'manual',signal:AbortSignal.timeout(120000),headers:{'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 (VotoAberto Civic Platform)'}});
  if([301,302,303,307,308].includes(response.status)){const next=response.headers.get('location');await response.body?.cancel();if(!next)throw new Error('Redirecionamento inválido.');url=officialUrl(new URL(next,url).href);continue;}
  if(!response.ok||!response.body)throw new Error(`Download do TSE falhou: HTTP ${response.status}.`);
  if(Number(response.headers.get('content-length'))>MAX_DOWNLOAD){await response.body.cancel();throw new Error('Arquivo excede o limite de download.');}
  const chunks:Buffer[]=[];let size=0;
  const reader=response.body.getReader();
  try{for(;;){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>MAX_DOWNLOAD)throw new Error('Arquivo excede o limite de download.');chunks.push(Buffer.from(value));}}finally{await reader.cancel().catch(()=>{});reader.releaseLock();}
  return Buffer.concat(chunks);
 }
 throw new Error('Redirecionamentos demais na fonte oficial.');
}
export async function candidateCsvFiles(buffer:Buffer, pattern=/(?:^|\/)consulta_cand_2026_[a-z]{2,6}\.csv$/i):Promise<Buffer[]>{
 if(buffer.subarray(0,2).toString()!=='PK')return [buffer];
 const entries:Buffer[]=[];
 return new Promise((resolve,reject)=>{
  yauzl.fromBuffer(buffer,{lazyEntries:true,autoClose:false,validateEntrySizes:true},(error,zip)=>{
   if(error||!zip){reject(error||new Error('ZIP inválido.'));return;}
   let expanded=0,count=0,settled=false;
   const fail=(err:unknown)=>{if(!settled){settled=true;zip.close();reject(err);}};
   zip.on('error',fail);
   const candidates:yauzl.Entry[]=[];
   zip.on('entry',(entry:yauzl.Entry)=>{
    if(++count>1000){fail(new Error('ZIP contém arquivos demais.'));return;}
    if(pattern.test(entry.fileName))candidates.push(entry);
    zip.readEntry();
   });
   // autoClose:false lets us select the national CSV before opening streams.
   zip.on('end',async()=>{
    try{
     const national=candidates.find(e=>/_BRASIL\.csv$/i.test(e.fileName));
     const selected=national?[national]:candidates;
     if(!selected.length)throw new Error('CSV de candidaturas de 2026 não encontrado no ZIP.');
     for(const entry of selected){
      if(expanded+entry.uncompressedSize>MAX_EXPANDED)throw new Error('ZIP expandido excede o limite.');
      const stream=await new Promise<import('node:stream').Readable>((res,rej)=>zip.openReadStream(entry,(e,s)=>e||!s?rej(e):res(s)));
      const chunks:Buffer[]=[];
      for await(const chunk of stream){expanded+=chunk.length;if(expanded>MAX_EXPANDED){stream.destroy();throw new Error('ZIP expandido excede o limite.');}chunks.push(Buffer.from(chunk));}
      entries.push(Buffer.concat(chunks));
     }
     settled=true;zip.close();resolve(entries);
    }catch(e){fail(e);}
   });
   zip.readEntry();
  });
 });
}
export async function readCandidateRows(buffer:Buffer){
 const files=await candidateCsvFiles(buffer);
 const rows=files.flatMap(file=>decodeTseCsv(file));
 if(!rows.length)throw new Error('Fonte vazia; importação cancelada.');
 for(const row of rows)if(!/^\d+$/.test(row.SQ_CANDIDATO||'')||row.ANO_ELEICAO!=='2026'||!row.NM_URNA_CANDIDATO||!row.DS_CARGO||!row.SG_UF)throw new Error('Formato de candidaturas inesperado; importação cancelada.');
 return rows;
}
