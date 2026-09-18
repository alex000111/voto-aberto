import {loadEnvConfig} from '@next/env';
loadEnvConfig(process.cwd());
const {ingestPolls}=await import('../src/lib/ingest-polls.ts');
try{console.log(JSON.stringify(await ingestPolls()));}catch(e){console.error(e.message);process.exitCode=1;}
