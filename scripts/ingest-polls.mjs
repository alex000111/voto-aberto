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
const {ingestPolls}=await import('../src/lib/ingest-polls.ts');
try{console.log(JSON.stringify(await ingestPolls()));}catch(e){console.error(e.message);process.exitCode=1;}
