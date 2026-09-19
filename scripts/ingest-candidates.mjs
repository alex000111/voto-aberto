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
const {ingestCandidates}=await import('../src/lib/ingest-candidates.ts');
const args=Object.fromEntries(process.argv.slice(2).map(x=>x.replace(/^--/,'').split('=')));
const limit=args.limit?Number(args.limit):undefined;
if(limit!==undefined&&(!Number.isInteger(limit)||limit<1))throw new Error('limit deve ser um inteiro positivo.');
try{console.log(JSON.stringify(await ingestCandidates({uf:args.uf,office:args.office,limit}),null,2));}catch(e){console.error(e.message);process.exitCode=1;}
