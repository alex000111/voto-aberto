import { existsSync, readFileSync } from 'node:fs';
for (const envPath of ['.env.local', '.env']) {
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, 'utf8').split('\n')) {
      const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)?\s*$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = (match[2] || '').trim().replace(/^["']|["']$/g, '');
      }
    }
  }
}
const {ingestFinance}=await import('../src/lib/ingest-finance.ts');
const args=Object.fromEntries(process.argv.slice(2).map(x=>{const i=x.indexOf('=');return [x.slice(2,i),x.slice(i+1)];}));
if(!args.file||!args.uf)throw new Error('Use --file=caminho-do-ZIP-oficial --uf=PE');
try{console.log(JSON.stringify(await ingestFinance(args.file,args.uf.toUpperCase())));}catch(e){console.error(e.message);process.exitCode=1;}
