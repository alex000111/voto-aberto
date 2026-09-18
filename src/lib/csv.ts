import {parse} from 'csv-parse/sync';
import iconv from 'iconv-lite';
export function decodeTseCsv(buf:ArrayBuffer|Buffer){
 const bytes=Buffer.isBuffer(buf)?buf:Buffer.from(buf);
 const text=bytes.subarray(0,3).equals(Buffer.from([0xef,0xbb,0xbf]))?bytes.toString('utf8'):iconv.decode(bytes,'win1252');
 return parse(text,{columns:(headers:string[])=>{if(new Set(headers).size!==headers.length||headers.some(h=>['__proto__','constructor','prototype'].includes(h)))throw new Error('Cabeçalho CSV inválido.');return headers;},delimiter:';',skip_empty_lines:true,trim:true,bom:true}) as Record<string,string>[];
}
export const norm=(v?:string|null)=>String(v??'').trim();
export const keyOf=(r:Record<string,string>,...keys:string[])=>{for(const k of keys){if(norm(r[k]))return norm(r[k]);}return ''};
